package com.restaurantsaas.platform.dto.restaurant;

import com.restaurantsaas.platform.domain.enums.SubscriptionPlan;
import com.restaurantsaas.platform.domain.enums.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDto {
    private UUID id;
    private String name;
    private String slug;
    private String email;
    private String phoneNumber;
    private String address;
    private String logoUrl;
    private SubscriptionPlan subscriptionPlan;
    private SubscriptionStatus subscriptionStatus;
    private Instant subscriptionEndsAt;
    private boolean isActive;
    private Instant createdAt;
}
