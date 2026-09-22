package com.restaurantsaas.platform.dto.inventory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItemDto {
    private UUID id;
    private UUID tenantId;
    private UUID branchId;
    private String name;
    private String unit;
    private BigDecimal currentStock;
    private BigDecimal minThreshold;
    private BigDecimal costPerUnit;
    private boolean isLowStock;
    private Instant createdAt;
    private Instant updatedAt;
}
