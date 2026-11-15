package com.restaurantsaas.platform.domain.entity;

import com.restaurantsaas.platform.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "invoices", indexes = {
        @Index(name = "idx_invoice_tenant", columnList = "tenant_id"),
        @Index(name = "idx_invoice_number", columnList = "invoice_number", unique = true)
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class BillingInvoice extends BaseEntity {

    @Column(name = "tenant_id", nullable = false, columnDefinition = "UUID")
    private UUID tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id")
    private Subscription subscription;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 60)
    private String invoiceNumber;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "tax_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "currency", nullable = false, length = 10)
    @Builder.Default
    private String currency = "INR";

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "PAID";

    @Column(name = "due_date")
    private Instant dueDate;

    @Column(name = "paid_at")
    private Instant paidAt;

    @Column(name = "invoice_pdf_url", length = 500)
    private String invoicePdfUrl;
}
