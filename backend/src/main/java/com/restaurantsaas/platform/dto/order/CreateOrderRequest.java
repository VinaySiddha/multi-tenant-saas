package com.restaurantsaas.platform.dto.order;

import com.restaurantsaas.platform.domain.enums.OrderType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class CreateOrderRequest {

    private OrderType orderType = OrderType.DINE_IN;
    private UUID tableId;
    private String customerName;
    private String customerPhone;
    private String notes;
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;
}
