package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.BadRequestException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.Branch;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final DiningTableRepository tableRepository;
    private final BranchRepository branchRepository;
    private final NotificationService notificationService;
    private final List<PaymentGatewayProvider> gatewayProviders;

    @Transactional
    public PaymentDto processPayment(UUID tenantId, UUID branchId, PaymentRequest request) {
        Order order = orderRepository.findByIdAndTenantId(request.getOrderId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Order is already fully paid");
        }

        String currency = branchId != null
                ? branchRepository.findById(branchId).map(Branch::getCurrency).orElse("INR")
                : "INR";

        PaymentStatus status;
        String transactionReference = request.getTransactionReference();
        String gatewayName = request.getPaymentGateway();

        if (isOnlineGatewayMethod(request.getPaymentMethod())) {
            // Online payments must be verified server-side with the provider.
            // A client-supplied "paid" claim is never trusted.
            if (transactionReference == null || transactionReference.isBlank()) {
                throw new BadRequestException(
                        "A gateway payment reference is required for online payment methods");
            }
            PaymentGatewayProvider provider = resolveProvider(gatewayName);
            PaymentGatewayResult result = provider.verifyAndCapture(
                    order.getId().toString(), request.getAmount(), currency, transactionReference);

            if (!result.isSuccess()) {
                // Persist a FAILED record for auditability, but do NOT settle the order.
                Payment failed = Payment.builder()
                        .tenantId(tenantId)
                        .branchId(branchId)
                        .order(order)
                        .orderId(order.getId())
                        .amount(request.getAmount())
                        .paymentMethod(request.getPaymentMethod())
                        .status(PaymentStatus.FAILED)
                        .transactionReference(transactionReference)
                        .paymentGateway(provider.getName())
                        .build();
                paymentRepository.save(failed);
                log.warn("Gateway verification failed for order {}: {}", order.getId(), result.getErrorMessage());
                throw new BadRequestException("Payment could not be verified: " + result.getErrorMessage());
            }
            transactionReference = result.getReferenceId();
            gatewayName = provider.getName();
            status = PaymentStatus.PAID;
        } else {
            // Cash / on-device card payments are settled directly at the POS.
            status = PaymentStatus.PAID;
        }

        Payment payment = Payment.builder()
                .tenantId(tenantId)
                .branchId(branchId)
                .order(order)
                .orderId(order.getId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(status)
                .transactionReference(transactionReference)
                .paymentGateway(gatewayName)
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

    private boolean isOnlineGatewayMethod(PaymentMethod method) {
        // UPI / card / net-banking / wallet are settled through an external gateway and
        // must be verified server-side. CASH and SPLIT are POS-internal settlements.
        return switch (method) {
            case UPI, CARD, NET_BANKING, WALLET -> true;
            default -> false;
        };
    }

    private PaymentGatewayProvider resolveProvider(String requested) {
        if (gatewayProviders.isEmpty()) {
            throw new BadRequestException("No payment gateway provider is configured on this deployment");
        }
        if (requested == null || requested.isBlank()) {
            return gatewayProviders.get(0);
        }
        return gatewayProviders.stream()
                .filter(p -> p.getName().equalsIgnoreCase(requested))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Unknown payment gateway: " + requested));
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
