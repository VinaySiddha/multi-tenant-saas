package com.restaurantsaas.platform.dto.menu;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private UUID id;
    private UUID tenantId;
    private String name;
    private String description;
    private int displayOrder;
    private String imageUrl;
    private boolean isActive;
}
