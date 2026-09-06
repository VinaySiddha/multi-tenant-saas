package com.restaurantsaas.platform.dto.menu;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCategoryRequest {

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;
    private int displayOrder = 0;
    private String imageUrl;
}
