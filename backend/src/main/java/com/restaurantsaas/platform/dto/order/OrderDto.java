package com.restaurantsaas.platform.dto.order;

import com.restaurantsaas.platform.domain.enums.OrderStatus;
import com.restaurantsaas.platform.domain.enums.OrderType;
import com.restaurantsaas.platform.domain.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private UUID id;
    private UUID tenantId;
    private UUID branchId;
    private String orderNumber;
    private OrderType orderType;
    private UUID tableId;
    private String tableNumber;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private BigDecimal grandTotal;
    private String customerName;
    private String customerPhone;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;
    @Builder.Default
    private List<OrderItemDto> items = new ArrayList<>();
}
