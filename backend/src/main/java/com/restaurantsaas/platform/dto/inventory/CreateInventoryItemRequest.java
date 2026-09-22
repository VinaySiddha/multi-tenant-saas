package com.restaurantsaas.platform.dto.inventory;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateInventoryItemRequest {

    private UUID branchId;

    @NotBlank(message = "Item name is required")
    private String name;

    @NotBlank(message = "Unit is required (e.g., kg, gm, ltr, ml, pcs)")
    private String unit = "kg";

    @NotNull(message = "Current stock is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Stock cannot be negative")
    private BigDecimal currentStock = BigDecimal.ZERO;

    @NotNull(message = "Minimum threshold is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Threshold cannot be negative")
    private BigDecimal minThreshold = new BigDecimal("5.000");

    private BigDecimal costPerUnit;
}
