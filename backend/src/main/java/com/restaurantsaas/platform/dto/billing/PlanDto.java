package com.restaurantsaas.platform.dto.billing;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanDto {
    private UUID id;
    private String code;
    private String name;
    private String description;
    private BigDecimal monthlyPrice;
    private BigDecimal annualPrice;
    private String currency;
    private Integer maxOutlets;
    private boolean isPopular;
    private boolean isActive;
    private List<PlanFeatureDto> features;
}
