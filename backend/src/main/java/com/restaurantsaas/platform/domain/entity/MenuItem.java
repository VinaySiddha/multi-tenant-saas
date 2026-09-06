package com.restaurantsaas.platform.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restaurantsaas.platform.common.entity.TenantBaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "menu_items", indexes = {
        @Index(name = "idx_menu_item_tenant", columnList = "tenant_id"),
        @Index(name = "idx_menu_item_category", columnList = "tenant_id, category_id"),
        @Index(name = "idx_menu_item_available", columnList = "tenant_id, is_available")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem extends TenantBaseEntity {

    @Column(name = "category_id", nullable = false, columnDefinition = "UUID")
    private UUID categoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    @JsonIgnore
    private Category category;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "cost_price", precision = 12, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "tax_rate", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal taxRate = new BigDecimal("5.00"); // Standard 5% GST default

    @Column(name = "is_veg", nullable = false)
    @Builder.Default
    private boolean isVeg = true;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private boolean isAvailable = true;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "preparation_time_minutes")
    @Builder.Default
    private int preparationTimeMinutes = 15;
}
