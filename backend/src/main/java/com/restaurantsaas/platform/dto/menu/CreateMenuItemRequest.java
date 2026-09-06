package com.restaurantsaas.platform.dto.menu;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateMenuItemRequest {

    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    @NotBlank(message = "Item name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    private BigDecimal costPrice;

    @NotNull(message = "Tax rate is required")
    private BigDecimal taxRate = new BigDecimal("5.00");

    private boolean isVeg = true;
    private boolean isAvailable = true;
    private String imageUrl;
    private int preparationTimeMinutes = 15;
}
