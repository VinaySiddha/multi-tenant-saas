package com.restaurantsaas.platform.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restaurantsaas.platform.common.entity.TenantBaseEntity;
import com.restaurantsaas.platform.domain.enums.PaymentMethod;
import com.restaurantsaas.platform.domain.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payment_tenant_branch", columnList = "tenant_id, branch_id"),
        @Index(name = "idx_payment_order", columnList = "order_id"),
        @Index(name = "idx_payment_status", columnList = "tenant_id, status")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Payment extends TenantBaseEntity {

    @Column(name = "order_id", nullable = false, columnDefinition = "UUID")
    private UUID orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", insertable = false, updatable = false)
    @JsonIgnore
    private Order order;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PAID;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Column(name = "payment_gateway", length = 50)
    private String paymentGateway;

    @Column(name = "paid_at", nullable = false)
    @Builder.Default
    private Instant paidAt = Instant.now();
}
