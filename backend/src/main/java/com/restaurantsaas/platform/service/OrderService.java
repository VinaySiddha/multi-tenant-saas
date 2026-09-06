package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.BadRequestException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.*;
import com.restaurantsaas.platform.domain.enums.*;
import com.restaurantsaas.platform.dto.order.*;
import com.restaurantsaas.platform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final DiningTableRepository tableRepository;
    private final KitchenTicketRepository kitchenTicketRepository;
    private final NotificationService notificationService;

    @Transactional
    public OrderDto createOrder(UUID tenantId, UUID branchId, CreateOrderRequest request, UUID createdByUserId) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order items list cannot be empty");
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        String orderNumber = "ORD-" + timestamp + "-" + (int) (Math.random() * 900 + 100);

        Order order = Order.builder()
                .tenantId(tenantId)
                .branchId(branchId)
                .orderNumber(orderNumber)
                .orderType(request.getOrderType() != null ? request.getOrderType() : OrderType.DINE_IN)
                .tableId(request.getTableId())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .notes(request.getNotes())
                .createdByUserId(createdByUserId)
                .status(OrderStatus.PLACED)
                .paymentStatus(PaymentStatus.UNPAID)
                .discountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO)
                .items(new ArrayList<>())
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        StringBuilder kotSummary = new StringBuilder();

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findByIdAndTenantId(itemReq.getMenuItemId(), tenantId)
                    .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemReq.getMenuItemId()));

            BigDecimal unitPrice = menuItem.getPrice();
            BigDecimal itemSubtotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            BigDecimal taxRate = menuItem.getTaxRate();
            BigDecimal itemTax = itemSubtotal.multiply(taxRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal itemTotal = itemSubtotal.add(itemTax);

            subtotal = subtotal.add(itemSubtotal);
            totalTax = totalTax.add(itemTax);

            OrderItem orderItem = OrderItem.builder()
                    .tenantId(tenantId)
                    .branchId(branchId)
                    .order(order)
                    .menuItemId(menuItem.getId())
                    .itemName(menuItem.getName())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(unitPrice)
                    .taxRate(taxRate)
                    .taxAmount(itemTax)
                    .totalPrice(itemTotal)
                    .notes(itemReq.getNotes())
                    .status(OrderItemStatus.PENDING)
                    .build();

            order.addItem(orderItem);

            kotSummary.append(itemReq.getQuantity()).append("x ").append(menuItem.getName());
            if (itemReq.getNotes() != null && !itemReq.getNotes().isBlank()) {
                kotSummary.append(" (").append(itemReq.getNotes()).append(")");
            }
            kotSummary.append("; ");
        }

        BigDecimal grandTotal = subtotal.add(totalTax).subtract(order.getDiscountAmount());
        order.setSubtotal(subtotal);
        order.setTaxAmount(totalTax);
        order.setGrandTotal(grandTotal.max(BigDecimal.ZERO));

        order = orderRepository.save(order);

        // Update Table status if Dine-In
        String tableNumberStr = null;
        if (order.getTableId() != null) {
            DiningTable table = tableRepository.findByIdAndTenantId(order.getTableId(), tenantId).orElse(null);
            if (table != null) {
                table.setStatus(TableStatus.OCCUPIED);
                tableRepository.save(table);
                tableNumberStr = table.getTableNumber();
            }
        }

        // Generate Kitchen Ticket (KOT)
        String kotNumber = "KOT-" + timestamp.substring(6) + "-" + (int) (Math.random() * 90 + 10);
        KitchenTicket kot = KitchenTicket.builder()
                .tenantId(tenantId)
                .branchId(branchId)
                .orderId(order.getId())
                .kotNumber(kotNumber)
                .tableNumber(tableNumberStr)
                .orderType(order.getOrderType().name())
                .status(KotStatus.PENDING)
                .itemsSummary(kotSummary.toString())
                .specialInstructions(request.getNotes())
                .build();

        kitchenTicketRepository.save(kot);

        OrderDto orderDto = mapToDto(order);

        // Real-time broadcast
        notificationService.sendOrderCreatedEvent(tenantId, branchId, orderDto);
        notificationService.sendKotUpdatedEvent(tenantId, branchId, kot);

        return orderDto;
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrders(UUID tenantId, UUID branchId) {
        return orderRepository.findAllByTenantIdAndBranchIdOrderByCreatedAtDesc(tenantId, branchId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(UUID tenantId, UUID orderId) {
        Order order = orderRepository.findByIdAndTenantId(orderId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        return mapToDto(order);
    }

    @Transactional
    public OrderDto cancelOrder(UUID tenantId, UUID orderId, String reason) {
        Order order = orderRepository.findByIdAndTenantId(orderId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setStatus(OrderStatus.CANCELLED);
        if (order.getTableId() != null) {
            DiningTable table = tableRepository.findByIdAndTenantId(order.getTableId(), tenantId).orElse(null);
            if (table != null) {
                table.setStatus(TableStatus.AVAILABLE);
                tableRepository.save(table);
            }
        }
        order = orderRepository.save(order);
        return mapToDto(order);
    }

    public OrderDto mapToDto(Order o) {
        String tableNumber = o.getTable() != null ? o.getTable().getTableNumber() : null;

        List<OrderItemDto> itemDtos = o.getItems() != null ? o.getItems().stream()
                .map(i -> OrderItemDto.builder()
                        .id(i.getId())
                        .menuItemId(i.getMenuItemId())
                        .itemName(i.getItemName())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .taxRate(i.getTaxRate())
                        .taxAmount(i.getTaxAmount())
                        .totalPrice(i.getTotalPrice())
                        .notes(i.getNotes())
                        .status(i.getStatus())
                        .build())
                .collect(Collectors.toList()) : new ArrayList<>();

        return OrderDto.builder()
                .id(o.getId())
                .tenantId(o.getTenantId())
                .branchId(o.getBranchId())
                .orderNumber(o.getOrderNumber())
                .orderType(o.getOrderType())
                .tableId(o.getTableId())
                .tableNumber(tableNumber)
                .status(o.getStatus())
                .paymentStatus(o.getPaymentStatus())
                .subtotal(o.getSubtotal())
                .taxAmount(o.getTaxAmount())
                .discountAmount(o.getDiscountAmount())
                .grandTotal(o.getGrandTotal())
                .customerName(o.getCustomerName())
                .customerPhone(o.getCustomerPhone())
                .notes(o.getNotes())
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .items(itemDtos)
                .build();
    }
}
