package com.restaurantsaas.platform.repository;

import com.restaurantsaas.platform.domain.entity.SubscriptionAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubscriptionAuditLogRepository extends JpaRepository<SubscriptionAuditLog, UUID> {
    List<SubscriptionAuditLog> findByTenantIdOrderByCreatedAtDesc(UUID tenantId);
}
