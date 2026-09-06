package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.BadRequestException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.DiningTable;
import com.restaurantsaas.platform.domain.entity.Order;
import com.restaurantsaas.platform.domain.entity.Payment;
import com.restaurantsaas.platform.domain.enums.OrderStatus;
import com.restaurantsaas.platform.domain.enums.PaymentStatus;
import com.restaurantsaas.platform.domain.enums.TableStatus;
import com.restaurantsaas.platform.dto.payment.PaymentDto;
import com.restaurantsaas.platform.dto.payment.PaymentRequest;
import com.restaurantsaas.platform.repository.DiningTableRepository;
import com.restaurantsaas.platform.repository.OrderRepository;
import com.restaurantsaas.platform.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final DiningTableRepository tableRepository;
    private final NotificationService notificationService;

    @Transactional
    public PaymentDto processPayment(UUID tenantId, UUID branchId, PaymentRequest request) {
        Order order = orderRepository.findByIdAndTenantId(request.getOrderId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Order is already fully paid");
        }

        Payment payment = Payment.builder()
                .tenantId(tenantId)
                .branchId(branchId)
                .order(order)
                .orderId(order.getId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PAID)
                .transactionReference(request.getTransactionReference())
                .paymentGateway(request.getPaymentGateway())
                .paidAt(Instant.now())
                .build();

        payment = paymentRepository.save(payment);

        // Update Order
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setStatus(OrderStatus.COMPLETED);
        orderRepository.save(order);

        // Free up Table
        if (order.getTableId() != null) {
            DiningTable table = tableRepository.findByIdAndTenantId(order.getTableId(), tenantId).orElse(null);
            if (table != null) {
                table.setStatus(TableStatus.AVAILABLE);
                tableRepository.save(table);
            }
        }

        PaymentDto dto = mapToDto(payment);

        // Real-time broadcast
        notificationService.sendPaymentCompletedEvent(tenantId, branchId, dto);

        return dto;
    }

    private PaymentDto mapToDto(Payment p) {
        return PaymentDto.builder()
                .id(p.getId())
                .tenantId(p.getTenantId())
                .branchId(p.getBranchId())
                .orderId(p.getOrderId())
                .amount(p.getAmount())
                .paymentMethod(p.getPaymentMethod())
                .status(p.getStatus())
                .transactionReference(p.getTransactionReference())
                .paymentGateway(p.getPaymentGateway())
                .paidAt(p.getPaidAt())
                .build();
    }
}
