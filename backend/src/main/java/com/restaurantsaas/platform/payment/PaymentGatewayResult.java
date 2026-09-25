package com.restaurantsaas.platform.payment;

import lombok.Builder;
import lombok.Data;

/**
 * Normalized result returned by a {@link PaymentGatewayProvider} after an intent
 * has been verified with the provider (server-to-server confirmation).
 */
@Data
@Builder
public class PaymentGatewayResult {

    private boolean success;
    /** Provider-assigned transaction/reference id (e.g. Stripe charge id, Razorpay payment id). */
    private String referenceId;
    /** Raw provider status string for audit purposes. */
    private String providerStatus;
    /** Human-readable failure reason when {@code success} is false. */
    private String errorMessage;

    public static PaymentGatewayResult ok(String referenceId, String providerStatus) {
        return PaymentGatewayResult.builder()
                .success(true)
                .referenceId(referenceId)
                .providerStatus(providerStatus)
                .build();
    }

    public static PaymentGatewayResult failed(String referenceId, String errorMessage) {
        return PaymentGatewayResult.builder()
                .success(false)
                .referenceId(referenceId)
                .errorMessage(errorMessage)
                .build();
    }
}
