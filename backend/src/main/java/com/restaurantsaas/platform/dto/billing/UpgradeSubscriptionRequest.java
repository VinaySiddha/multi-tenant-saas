package com.restaurantsaas.platform.dto.billing;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpgradeSubscriptionRequest {

    @NotBlank(message = "Plan code is required")
    private String planCode;

    @Builder.Default
    private String billingInterval = "MONTHLY"; // MONTHLY or ANNUAL

    private String provider; // RAZORPAY, STRIPE, DEMO

    private String paymentReferenceId;
}
