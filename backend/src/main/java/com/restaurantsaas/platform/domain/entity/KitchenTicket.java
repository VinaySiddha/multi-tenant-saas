package com.restaurantsaas.platform.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restaurantsaas.platform.common.entity.TenantBaseEntity;
import com.restaurantsaas.platform.domain.enums.KotStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "kitchen_tickets", indexes = {
        @Index(name = "idx_kot_tenant_branch", columnList = "tenant_id, branch_id"),
        @Index(name = "idx_kot_status", columnList = "tenant_id, status"),
        @Index(name = "idx_kot_order", columnList = "order_id")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class KitchenTicket extends TenantBaseEntity {

    @Column(name = "kot_number", nullable = false, length = 50)
    private String kotNumber;

    @Column(name = "order_id", nullable = false, columnDefinition = "UUID")
    private UUID orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", insertable = false, updatable = false)
    @JsonIgnore
    private Order order;

    @Column(name = "table_number", length = 30)
    private String tableNumber;

    @Column(name = "order_type", length = 30)
    private String orderType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private KotStatus status = KotStatus.PENDING;

    @Column(name = "items_summary", columnDefinition = "TEXT")
    private String itemsSummary;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;
}
