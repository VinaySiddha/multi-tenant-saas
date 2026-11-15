package com.restaurantsaas.platform.dto.billing;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillingInvoiceDto {
    private UUID id;
    private String invoiceNumber;
    private BigDecimal amount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private String currency;
    private String status;
    private Instant dueDate;
    private Instant paidAt;
    private String invoicePdfUrl;
    private Instant createdAt;
}
