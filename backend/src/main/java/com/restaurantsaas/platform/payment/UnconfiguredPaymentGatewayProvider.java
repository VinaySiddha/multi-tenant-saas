package com.restaurantsaas.platform.payment;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Fail-closed default provider used when no real gateway is configured.
 *
 * <p>It rejects every online-gateway payment so that the platform can never mark an
 * order as paid based on an unverified client claim. Cash / card-on-device (POS)
 * payments are handled separately in {@code PaymentService} and do not go through
 * this provider.</p>
 *
 * <p>Replace by adding a bean such as a Stripe or Razorpay adapter implementing
 * {@link PaymentGatewayProvider}; Spring's {@code @Primary} or bean-ordering will
 * pick it up automatically.</p>
 */
@Component
public class UnconfiguredPaymentGatewayProvider implements PaymentGatewayProvider {

    @Override
    public String getName() {
        return "unconfigured";
    }

    @Override
    public PaymentGatewayResult verifyAndCapture(String orderId,
                                                 BigDecimal amount,
                                                 String currency,
                                                 String paymentIntentRef) {
        return PaymentGatewayResult.failed(paymentIntentRef,
                "No payment gateway is configured for this deployment. Online payments are "
                        + "disabled until a PaymentGatewayProvider (e.g. Stripe/Razorpay) is registered.");
    }
}
