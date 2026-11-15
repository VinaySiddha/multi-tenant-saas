package com.restaurantsaas.platform.controller;

import com.restaurantsaas.platform.common.dto.ApiResponse;
import com.restaurantsaas.platform.common.exception.TenantNotFoundException;
import com.restaurantsaas.platform.dto.billing.*;
import com.restaurantsaas.platform.security.UserPrincipal;
import com.restaurantsaas.platform.service.SubscriptionService;
import com.restaurantsaas.platform.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/billing")
@RequiredArgsConstructor
@Tag(name = "Subscriptions & Billing", description = "14-Day Free Trial, Subscription tiers, Invoicing, and Webhook processing")
public class BillingController {

    private final SubscriptionService subscriptionService;

    @Value("${app.billing.webhook-secret:}")
    private String webhookSecret;

    @GetMapping("/subscription")
    @Operation(summary = "Get Tenant Subscription Details", description = "Returns active subscription status, trial remaining days, and entitlements")
    public ResponseEntity<ApiResponse<SubscriptionDetailsDto>> getSubscription() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        SubscriptionDetailsDto dto = subscriptionService.getTenantSubscription(tenantId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/plans")
    @Operation(summary = "List Active Plans", description = "Returns available pricing tiers (Starter, Growth, Multi-Outlet) and their feature matrix")
    public ResponseEntity<ApiResponse<List<PlanDto>>> getPlans() {
        List<PlanDto> plans = subscriptionService.getAllPlans();
        return ResponseEntity.ok(ApiResponse.success(plans));
    }

    @PostMapping("/upgrade")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'PLATFORM_ADMIN')")
    @Operation(summary = "Upgrade / Activate Subscription", description = "Activates a paid plan after payment completion or manual upgrade")
    public ResponseEntity<ApiResponse<SubscriptionDetailsDto>> upgradeSubscription(
            @Valid @RequestBody UpgradeSubscriptionRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        String actor = principal != null ? principal.getEmail() : "RESTAURANT_OWNER";
        SubscriptionDetailsDto updated = subscriptionService.upgradeSubscription(tenantId, request, actor);
        return ResponseEntity.ok(ApiResponse.success(updated, "Subscription activated successfully"));
    }

    @GetMapping("/invoices")
    @Operation(summary = "Get Billing Invoices", description = "Returns historical billing invoices and tax receipts for current tenant")
    public ResponseEntity<ApiResponse<List<BillingInvoiceDto>>> getInvoices() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        List<BillingInvoiceDto> invoices = subscriptionService.getTenantInvoices(tenantId);
        return ResponseEntity.ok(ApiResponse.success(invoices));
    }

    @PostMapping("/webhook/{provider}")
    @Operation(summary = "Payment Webhook Endpoint", description = "Idempotent payment provider webhook receiver (Razorpay/Stripe) with cryptographic signature validation")
    public ResponseEntity<Map<String, Object>> handleWebhook(
            @PathVariable("provider") String provider,
            @RequestHeader(value = "X-Razorpay-Event-Id", required = false) String razorpayEventId,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String razorpaySignature,
            @RequestHeader(value = "Stripe-Signature", required = false) String stripeSignature,
            @RequestBody String rawPayload) {
        log.info("Received billing webhook from provider: {}", provider);

        // Verify cryptographic webhook signature if a secret is configured in production
        if (webhookSecret != null && !webhookSecret.isBlank()) {
            String signature = "RAZORPAY".equalsIgnoreCase(provider) ? razorpaySignature : stripeSignature;
            if (signature == null || !isValidHmacSha256(rawPayload, signature, webhookSecret)) {
                log.warn("Unauthorized webhook attempt: signature mismatch or missing for provider {}", provider);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("status", "error", "message", "Invalid or missing webhook signature"));
            }
        }

        String eventId = razorpayEventId != null ? razorpayEventId : "evt_" + System.currentTimeMillis();
        boolean processed = subscriptionService.processWebhook(provider.toUpperCase(), eventId, "payment.captured", rawPayload);
        return ResponseEntity.ok(Map.of("status", "ok", "processed", processed));
    }

    private boolean isValidHmacSha256(String data, String signature, String secret) {
        try {
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] hash = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return MessageDigest.isEqual(hexString.toString().getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("Failed to verify HMAC signature", e);
            return false;
        }
    }
}
