package com.restaurantsaas.platform.dto.billing;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanFeatureDto {
    private UUID id;
    private String featureKey;
    private String featureName;
    private boolean isIncluded;
}
