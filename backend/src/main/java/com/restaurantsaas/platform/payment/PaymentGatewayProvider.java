package com.restaurantsaas.platform.payment;

import java.math.BigDecimal;

/**
 * SPI for pluggable payment gateway integrations (Stripe, Razorpay, Cashfree, ...).
 *
 * <p>Implementations MUST verify the payment server-side against the provider API
 * (signature verification / payment-intent retrieval). The application must never
 * trust a client-supplied "paid" claim.</p>
 */
public interface PaymentGatewayProvider {

    /** Unique key of the provider, e.g. "stripe", "razorpay". */
    String getName();

    /**
     * Verify and capture a payment that the client claims was completed out-of-band
     * (checkout session / gateway SDK), returning the authoritative provider result.
     *
     * @param orderId          internal order identifier (used as correlation/metadata)
     * @param amount           expected settled amount (must match provider record)
     * @param currency         ISO-4217 currency code
     * @param paymentIntentRef provider reference supplied by the client
     *                         (e.g. Stripe payment_intent or Razorpay payment id + signature)
     */
    PaymentGatewayResult verifyAndCapture(String orderId,
                                          BigDecimal amount,
                                          String currency,
                                          String paymentIntentRef);
}
