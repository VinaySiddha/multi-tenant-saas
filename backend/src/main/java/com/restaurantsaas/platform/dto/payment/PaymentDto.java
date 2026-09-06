package com.restaurantsaas.platform.dto.payment;

import com.restaurantsaas.platform.domain.enums.PaymentMethod;
import com.restaurantsaas.platform.domain.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {
    private UUID id;
    private UUID tenantId;
    private UUID branchId;
    private UUID orderId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String transactionReference;
    private String paymentGateway;
    private Instant paidAt;
}
