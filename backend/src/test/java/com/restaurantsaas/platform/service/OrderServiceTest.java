package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.BadRequestException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.DiningTable;
import com.restaurantsaas.platform.domain.entity.MenuItem;
import com.restaurantsaas.platform.domain.entity.Order;
import com.restaurantsaas.platform.domain.enums.OrderStatus;
import com.restaurantsaas.platform.domain.enums.OrderType;
import com.restaurantsaas.platform.domain.enums.PaymentStatus;
import com.restaurantsaas.platform.domain.enums.TableStatus;
import com.restaurantsaas.platform.dto.order.CreateOrderRequest;
import com.restaurantsaas.platform.dto.order.OrderDto;
import com.restaurantsaas.platform.dto.order.OrderItemRequest;
import com.restaurantsaas.platform.repository.DiningTableRepository;
import com.restaurantsaas.platform.repository.KitchenTicketRepository;
import com.restaurantsaas.platform.repository.MenuItemRepository;
import com.restaurantsaas.platform.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Mockito unit tests for {@link OrderService}: pricing math, tenant isolation,
 * side effects (table status, KOT generation, websocket events) and error paths.
 */
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private MenuItemRepository menuItemRepository;
    @Mock
    private DiningTableRepository tableRepository;
    @Mock
    private KitchenTicketRepository kitchenTicketRepository;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private OrderService orderService;

    private UUID tenantId;
    private UUID branchId;
    private UUID userId;
    private UUID tableId;
    private UUID menuItemId;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        branchId = UUID.randomUUID();
        userId = UUID.randomUUID();
        tableId = UUID.randomUUID();
        menuItemId = UUID.randomUUID();

        // The service returns the saved entity; make save() identity-like by default.
        lenient().when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    private MenuItem menuItem(String price, String taxRate) {
        MenuItem item = MenuItem.builder()
                .name("Paneer Butter Masala")
                .price(new BigDecimal(price))
                .taxRate(new BigDecimal(taxRate))
                .isAvailable(true)
                .build();
        item.setId(menuItemId);
        item.setTenantId(tenantId);
        return item;
    }

    private CreateOrderRequest requestWithItems(int quantity, BigDecimal discount) {
        OrderItemRequest itemReq = new OrderItemRequest();
        itemReq.setMenuItemId(menuItemId);
        itemReq.setQuantity(quantity);

        CreateOrderRequest req = new CreateOrderRequest();
        req.setOrderType(OrderType.DINE_IN);
        req.setTableId(tableId);
        req.setDiscountAmount(discount);
        req.setItems(List.of(itemReq));
        return req;
    }

    @Test
    void createOrder_shouldComputeSubtotalTaxAndGrandTotal() {
        when(menuItemRepository.findByIdAndTenantId(menuItemId, tenantId))
                .thenReturn(Optional.of(menuItem("100.00", "5.00")));
        when(tableRepository.findByIdAndTenantId(tableId, tenantId)).thenReturn(Optional.empty());

        OrderDto dto = orderService.createOrder(tenantId, branchId, requestWithItems(2, null), userId);

        // 2 x 100 = 200 subtotal; 5% tax = 10.00; grand total = 210.00
        assertEquals(0, dto.getSubtotal().compareTo(new BigDecimal("200")));
        assertEquals(0, dto.getTaxAmount().compareTo(new BigDecimal("10.00")));
        assertEquals(0, dto.getGrandTotal().compareTo(new BigDecimal("210.00")));
        assertEquals(OrderStatus.PLACED, dto.getStatus());
        assertEquals(PaymentStatus.UNPAID, dto.getPaymentStatus());
        assertEquals(1, dto.getItems().size());
        assertEquals("Paneer Butter Masala", dto.getItems().get(0).getItemName());
        assertEquals(0, dto.getItems().get(0).getTotalPrice().compareTo(new BigDecimal("210.00")));
    }

    @Test
    void createOrder_shouldApplyDiscountToGrandTotal() {
        when(menuItemRepository.findByIdAndTenantId(menuItemId, tenantId))
                .thenReturn(Optional.of(menuItem("100.00", "5.00")));
        when(tableRepository.findByIdAndTenantId(tableId, tenantId)).thenReturn(Optional.empty());

        OrderDto dto = orderService.createOrder(
                tenantId, branchId, requestWithItems(1, new BigDecimal("20.00")), userId);

        // 100 + 5 tax - 20 discount = 85
        assertEquals(0, dto.getGrandTotal().compareTo(new BigDecimal("85.00")));
    }

    @Test
    void createOrder_grandTotalShouldNeverGoBelowZero() {
        when(menuItemRepository.findByIdAndTenantId(menuItemId, tenantId))
                .thenReturn(Optional.of(menuItem("10.00", "0.00")));
        when(tableRepository.findByIdAndTenantId(tableId, tenantId)).thenReturn(Optional.empty());

        OrderDto dto = orderService.createOrder(
                tenantId, branchId, requestWithItems(1, new BigDecimal("100.00")), userId);

        assertTrue(dto.getGrandTotal().compareTo(BigDecimal.ZERO) >= 0);
        assertEquals(0, dto.getGrandTotal().compareTo(BigDecimal.ZERO));
    }

    @Test
    void createOrder_shouldRejectEmptyItemList() {
        CreateOrderRequest req = new CreateOrderRequest();
        req.setItems(List.of());

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> orderService.createOrder(tenantId, branchId, req, userId));

        assertEquals("Order items list cannot be empty", ex.getMessage());
        verifyNoInteractions(menuItemRepository, orderRepository);
    }

    @Test
    void createOrder_shouldThrowWhenMenuItemBelongsToAnotherTenant() {
        // Repository lookup is tenant-scoped: another tenant's item returns empty.
        when(menuItemRepository.findByIdAndTenantId(menuItemId, tenantId)).thenReturn(Optional.empty());

        CreateOrderRequest req = requestWithItems(1, BigDecimal.ZERO);

        assertThrows(ResourceNotFoundException.class,
                () -> orderService.createOrder(tenantId, branchId, req, userId));
        verify(orderRepository, never()).save(any());
    }

    @Test
    void createOrder_dineIn_shouldOccupyTableAndCreateKitchenTicketAndBroadcast() {
        DiningTable table = DiningTable.builder()
                .tableNumber("T-12").capacity(4).status(TableStatus.AVAILABLE).isActive(true).build();
        table.setId(tableId);
        table.setTenantId(tenantId);

        when(menuItemRepository.findByIdAndTenantId(menuItemId, tenantId))
                .thenReturn(Optional.of(menuItem("50.00", "10.00")));
        when(tableRepository.findByIdAndTenantId(tableId, tenantId)).thenReturn(Optional.of(table));

        orderService.createOrder(tenantId, branchId, requestWithItems(1, BigDecimal.ZERO), userId);

        assertEquals(TableStatus.OCCUPIED, table.getStatus());
        verify(tableRepository).save(table);
        verify(kitchenTicketRepository).save(any());
        verify(notificationService).sendOrderCreatedEvent(eq(tenantId), eq(branchId), any(OrderDto.class));
        verify(notificationService).sendKotUpdatedEvent(eq(tenantId), eq(branchId), any());
    }

    @Test
    void getOrders_shouldReturnMappedDtosForTenantBranchScope() {
        Order o1 = Order.builder().orderNumber("ORD-1").status(OrderStatus.PLACED).build();
        Order o2 = Order.builder().orderNumber("ORD-2").status(OrderStatus.COMPLETED).build();
        when(orderRepository.findAllByTenantIdAndBranchIdOrderByCreatedAtDesc(tenantId, branchId))
                .thenReturn(List.of(o1, o2));

        List<OrderDto> orders = orderService.getOrders(tenantId, branchId);

        assertEquals(2, orders.size());
        assertEquals("ORD-1", orders.get(0).getOrderNumber());
        assertEquals("ORD-2", orders.get(1).getOrderNumber());
    }

    @Test
    void getOrderById_shouldThrowWhenOrderNotInTenant() {
        UUID orderId = UUID.randomUUID();
        when(orderRepository.findByIdAndTenantId(orderId, tenantId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> orderService.getOrderById(tenantId, orderId));
    }

    @Test
    void cancelOrder_shouldMarkCancelledAndFreeTable() {
        UUID orderId = UUID.randomUUID();
        Order order = Order.builder()
                .orderNumber("ORD-9")
                .tableId(tableId)
                .status(OrderStatus.PLACED)
                .build();
        order.setId(orderId);
        order.setTenantId(tenantId);

        DiningTable table = DiningTable.builder()
                .tableNumber("T-3").status(TableStatus.OCCUPIED).isActive(true).build();
        table.setId(tableId);
        table.setTenantId(tenantId);

        when(orderRepository.findByIdAndTenantId(orderId, tenantId)).thenReturn(Optional.of(order));
        when(tableRepository.findByIdAndTenantId(tableId, tenantId)).thenReturn(Optional.of(table));

        ArgumentCaptor<Order> savedOrder = ArgumentCaptor.forClass(Order.class);

        OrderDto dto = orderService.cancelOrder(tenantId, orderId, "customer left");

        verify(orderRepository, atLeastOnce()).save(savedOrder.capture());
        assertEquals(OrderStatus.CANCELLED, savedOrder.getValue().getStatus());
        assertEquals(OrderStatus.CANCELLED, dto.getStatus());
        assertEquals(TableStatus.AVAILABLE, table.getStatus());
        verify(tableRepository).save(table);
    }

}
