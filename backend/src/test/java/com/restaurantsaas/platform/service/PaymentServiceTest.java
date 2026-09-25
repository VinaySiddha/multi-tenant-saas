package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.BadRequestException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.DiningTable;
import com.restaurantsaas.platform.domain.entity.Order;
import com.restaurantsaas.platform.domain.entity.Payment;
import com.restaurantsaas.platform.domain.enums.OrderStatus;
import com.restaurantsaas.platform.domain.enums.PaymentMethod;
import com.restaurantsaas.platform.domain.enums.PaymentStatus;
import com.restaurantsaas.platform.domain.enums.TableStatus;
import com.restaurantsaas.platform.dto.payment.PaymentDto;
import com.restaurantsaas.platform.dto.payment.PaymentRequest;
import com.restaurantsaas.platform.payment.PaymentGatewayProvider;
import com.restaurantsaas.platform.payment.PaymentGatewayResult;
import com.restaurantsaas.platform.repository.BranchRepository;
import com.restaurantsaas.platform.repository.DiningTableRepository;
import com.restaurantsaas.platform.repository.OrderRepository;
import com.restaurantsaas.platform.repository.PaymentRepository;
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
 * Mockito unit tests for {@link PaymentService}.
 */
@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private DiningTableRepository tableRepository;
    @Mock
    private BranchRepository branchRepository;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private PaymentService paymentService;

    private UUID tenantId;
    private UUID branchId;
    private UUID orderId;
    private UUID tableId;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        branchId = UUID.randomUUID();
        orderId = UUID.randomUUID();
        tableId = UUID.randomUUID();

        lenient().when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));
        lenient().when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        lenient().when(branchRepository.findById(any(UUID.class))).thenReturn(Optional.empty());
    }

    private Order unpaidOrder() {
        Order order = Order.builder()
                .orderNumber("ORD-100")
                .tableId(tableId)
                .status(OrderStatus.COMPLETED)
                .paymentStatus(PaymentStatus.UNPAID)
                .grandTotal(new BigDecimal("250.00"))
                .build();
        order.setId(orderId);
        order.setTenantId(tenantId);
        order.setBranchId(branchId);
        return order;
    }

    private PaymentRequest upiRequest() {
        PaymentRequest req = new PaymentRequest();
        req.setOrderId(orderId);
        req.setAmount(new BigDecimal("250.00"));
        req.setPaymentMethod(PaymentMethod.UPI);
        req.setTransactionReference("TXN-ABC-123");
        req.setPaymentGateway("RAZORPAY");
        return req;
    }

    @Test
    void processPayment_shouldPersistPaymentAndMarkOrderPaidCompleted() {
        Order order = unpaidOrder();
        when(orderRepository.findByIdAndTenantId(orderId, tenantId)).thenReturn(Optional.of(order));
        when(tableRepository.findByIdAndTenantId(tableId, tenantId)).thenReturn(Optional.empty());

        PaymentDto dto = paymentService.processPayment(tenantId, branchId, upiRequest());

        ArgumentCaptor<Payment> saved = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(saved.capture());
        Payment payment = saved.getValue();
        assertEquals(new BigDecimal("250.00"), payment.getAmount());
        assertEquals(PaymentMethod.UPI, payment.getPaymentMethod());
        assertEquals(PaymentStatus.PAID, payment.getStatus());
        assertEquals("TXN-ABC-123", payment.getTransactionReference());
        assertEquals("RAZORPAY", payment.getPaymentGateway());
        assertNotNull(payment.getPaidAt());
        assertEquals(orderId, payment.getOrderId());

        assertEquals(PaymentStatus.PAID, order.getPaymentStatus());
        assertEquals(OrderStatus.COMPLETED, order.getStatus());

        assertEquals(new BigDecimal("250.00"), dto.getAmount());
        assertEquals(orderId, dto.getOrderId());
        verify(notificationService).sendPaymentCompletedEvent(eq(tenantId), eq(branchId), any(PaymentDto.class));
    }

    @Test
    void processPayment_shouldFreeOccupiedTableAfterPayment() {
        Order order = unpaidOrder();
        DiningTable table = DiningTable.builder()
                .tableNumber("T-7").status(TableStatus.OCCUPIED).isActive(true).build();
        table.setId(tableId);
        table.setTenantId(tenantId);

        when(orderRepository.findByIdAndTenantId(orderId, tenantId)).thenReturn(Optional.of(order));
        when(tableRepository.findByIdAndTenantId(tableId, tenantId)).thenReturn(Optional.of(table));

        paymentService.processPayment(tenantId, branchId, upiRequest());

        assertEquals(TableStatus.AVAILABLE, table.getStatus());
        verify(tableRepository).save(table);
    }

    @Test
    void processPayment_shouldRejectWhenOrderAlreadyPaid() {
        Order order = unpaidOrder();
        order.setPaymentStatus(PaymentStatus.PAID);
        when(orderRepository.findByIdAndTenantId(orderId, tenantId)).thenReturn(Optional.of(order));

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> paymentService.processPayment(tenantId, branchId, upiRequest()));

        assertEquals("Order is already fully paid", ex.getMessage());
        verify(paymentRepository, never()).save(any());
        verifyNoInteractions(notificationService);
    }

    @Test
    void processPayment_shouldThrowWhenOrderNotInTenantScope() {
        when(orderRepository.findByIdAndTenantId(orderId, tenantId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> paymentService.processPayment(tenantId, branchId, upiRequest()));
        verify(paymentRepository, never()).save(any());
    }
}
