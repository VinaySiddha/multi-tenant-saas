package com.restaurantsaas.platform.dto.inventory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AdjustStockRequest {

    /**
     * Quantity change (positive to restock, negative to deduct / waste, or new absolute value)
     */
    @NotNull(message = "Quantity is required")
    private BigDecimal quantity;

    /**
     * Type: "RESTOCK", "WASTE", "ADJUST_ABSOLUTE"
     */
    @NotBlank(message = "Adjustment type is required (RESTOCK, WASTE, ADJUST_ABSOLUTE)")
    private String type = "RESTOCK";

    private String reason;
}
