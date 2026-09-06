package com.restaurantsaas.platform.domain.entity;

import com.restaurantsaas.platform.common.entity.TenantBaseEntity;
import com.restaurantsaas.platform.domain.enums.TableStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "tables", indexes = {
        @Index(name = "idx_table_tenant_branch", columnList = "tenant_id, branch_id"),
        @Index(name = "idx_table_number", columnList = "tenant_id, branch_id, table_number", unique = true),
        @Index(name = "idx_table_status", columnList = "tenant_id, branch_id, status")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class DiningTable extends TenantBaseEntity {

    @Column(name = "table_number", nullable = false, length = 30)
    private String tableNumber;

    @Column(name = "section", length = 50)
    private String section; // e.g. "Main Hall", "Rooftop", "AC Dining"

    @Column(name = "capacity", nullable = false)
    @Builder.Default
    private int capacity = 4;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private TableStatus status = TableStatus.AVAILABLE;

    @Column(name = "qr_code_token", length = 100, unique = true)
    private String qrCodeToken;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
