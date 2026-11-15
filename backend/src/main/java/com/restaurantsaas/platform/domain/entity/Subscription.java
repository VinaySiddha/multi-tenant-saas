package com.restaurantsaas.platform.domain.entity;

import com.restaurantsaas.platform.common.entity.BaseEntity;
import com.restaurantsaas.platform.domain.enums.SubscriptionStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "subscriptions", indexes = {
        @Index(name = "idx_subscription_tenant", columnList = "tenant_id", unique = true),
        @Index(name = "idx_subscription_status", columnList = "status")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Subscription extends BaseEntity {

    @Column(name = "tenant_id", nullable = false, unique = true, columnDefinition = "UUID")
    private UUID tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private Plan plan;

    @Column(name = "plan_code", nullable = false, length = 50)
    @Builder.Default
    private String planCode = "growth";

    @Column(name = "billing_interval", nullable = false, length = 20)
    @Builder.Default
    private String billingInterval = "MONTHLY";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.TRIALING;

    @Column(name = "trial_start_at")
    private Instant trialStartAt;

    @Column(name = "trial_end_at")
    private Instant trialEndAt;

    @Column(name = "current_period_start")
    private Instant currentPeriodStart;

    @Column(name = "current_period_end")
    private Instant currentPeriodEnd;

    @Column(name = "cancel_at_period_end", nullable = false)
    @Builder.Default
    private boolean cancelAtPeriodEnd = false;

    @Column(name = "provider", length = 50)
    private String provider;

    @Column(name = "provider_subscription_id", length = 100)
    private String providerSubscriptionId;
}
