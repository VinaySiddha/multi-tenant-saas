package com.restaurantsaas.platform.repository;

import com.restaurantsaas.platform.domain.entity.Subscription;
import com.restaurantsaas.platform.domain.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    Optional<Subscription> findByTenantId(UUID tenantId);
    List<Subscription> findByStatusAndTrialEndAtBefore(SubscriptionStatus status, Instant cutoff);
    boolean existsByTenantId(UUID tenantId);
}
