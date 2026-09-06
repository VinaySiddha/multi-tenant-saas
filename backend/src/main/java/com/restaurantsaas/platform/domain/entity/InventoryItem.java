package com.restaurantsaas.platform.domain.entity;

import com.restaurantsaas.platform.common.entity.TenantBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "inventory_items", indexes = {
        @Index(name = "idx_inventory_tenant_branch", columnList = "tenant_id, branch_id"),
        @Index(name = "idx_inventory_low_stock", columnList = "tenant_id, current_stock, min_threshold")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem extends TenantBaseEntity {

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "unit", nullable = false, length = 20)
    @Builder.Default
    private String unit = "kg"; // kg, gm, ltr, ml, pcs

    @Column(name = "current_stock", nullable = false, precision = 12, scale = 3)
    @Builder.Default
    private BigDecimal currentStock = BigDecimal.ZERO;

    @Column(name = "min_threshold", nullable = false, precision = 12, scale = 3)
    @Builder.Default
    private BigDecimal minThreshold = new BigDecimal("5.000");

    @Column(name = "cost_per_unit", precision = 12, scale = 2)
    private BigDecimal costPerUnit;
}
