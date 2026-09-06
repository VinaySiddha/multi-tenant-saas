package com.restaurantsaas.platform.common.entity;

import com.restaurantsaas.platform.tenant.TenantContext;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@MappedSuperclass
public abstract class TenantBaseEntity extends BaseEntity {

    @Column(name = "tenant_id", nullable = false, updatable = false, columnDefinition = "UUID")
    private UUID tenantId;

    @Column(name = "branch_id", columnDefinition = "UUID")
    private UUID branchId;

    @PrePersist
    protected void onPrePersist() {
        if (this.tenantId == null && TenantContext.hasTenant()) {
            this.tenantId = TenantContext.getTenantId();
        }
        if (this.branchId == null && TenantContext.hasBranch()) {
            this.branchId = TenantContext.getBranchId();
        }
    }
}
