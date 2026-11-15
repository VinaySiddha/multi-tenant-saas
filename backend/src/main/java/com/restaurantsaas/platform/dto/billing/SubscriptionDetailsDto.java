package com.restaurantsaas.platform.dto.billing;

import com.restaurantsaas.platform.domain.enums.SubscriptionStatus;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDetailsDto {
    private UUID id;
    private UUID tenantId;
    private String planCode;
    private String planName;
    private String billingInterval;
    private SubscriptionStatus status;
    private Instant trialStartAt;
    private Instant trialEndAt;
    private long daysRemainingInTrial;
    private String trialMilestone; // DAY_0, DAY_3, DAY_7, DAY_12, DAY_14, EXPIRED
    private Instant currentPeriodStart;
    private Instant currentPeriodEnd;
    private boolean cancelAtPeriodEnd;
    private boolean canPerformOperations;
    private boolean isTrialActive;
    private String provider;
}
