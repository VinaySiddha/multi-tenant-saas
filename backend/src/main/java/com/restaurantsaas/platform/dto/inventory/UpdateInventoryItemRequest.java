package com.restaurantsaas.platform.dto.inventory;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateInventoryItemRequest {

    @NotBlank(message = "Item name is required")
    private String name;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotNull(message = "Minimum threshold is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Threshold cannot be negative")
    private BigDecimal minThreshold;

    private BigDecimal costPerUnit;
}
