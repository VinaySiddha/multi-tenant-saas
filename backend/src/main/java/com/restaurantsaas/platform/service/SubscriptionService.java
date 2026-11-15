package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.ForbiddenException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.*;
import com.restaurantsaas.platform.domain.enums.SubscriptionPlan;
import com.restaurantsaas.platform.domain.enums.SubscriptionStatus;
import com.restaurantsaas.platform.dto.billing.*;
import com.restaurantsaas.platform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PlanRepository planRepository;
    private final BillingInvoiceRepository invoiceRepository;
    private final WebhookEventRepository webhookEventRepository;
    private final SubscriptionAuditLogRepository auditLogRepository;
    private final RestaurantRepository restaurantRepository;

    @Transactional
    public SubscriptionDetailsDto getTenantSubscription(UUID tenantId) {
        Subscription subscription = subscriptionRepository.findByTenantId(tenantId)
                .orElseGet(() -> initDefaultTrial(tenantId));

        // Evaluate trial expiry transition
        Instant now = Instant.now();
        if (subscription.getStatus() == SubscriptionStatus.TRIALING &&
                subscription.getTrialEndAt() != null &&
                now.isAfter(subscription.getTrialEndAt())) {
            log.info("Trial expired for tenant {}. Transitioning to TRIAL_EXPIRED", tenantId);
            subscription.setStatus(SubscriptionStatus.TRIAL_EXPIRED);
            subscription = subscriptionRepository.save(subscription);

            // Sync with restaurant entity
            restaurantRepository.findById(tenantId).ifPresent(restaurant -> {
                restaurant.setSubscriptionStatus(SubscriptionStatus.TRIAL_EXPIRED);
                restaurantRepository.save(restaurant);
            });

            auditLogRepository.save(SubscriptionAuditLog.builder()
                    .tenantId(tenantId)
                    .action("TRIAL_EXPIRED")
                    .fromPlan(subscription.getPlanCode())
                    .toPlan(subscription.getPlanCode())
                    .actor("SYSTEM")
                    .details("14-day free trial elapsed without payment authorization")
                    .build());
        }

        return mapToSubscriptionDetailsDto(subscription);
    }

    @Transactional(readOnly = true)
    public List<PlanDto> getAllPlans() {
        return planRepository.findByIsActiveTrue().stream()
                .map(this::mapToPlanDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Subscription createTrialSubscription(Restaurant restaurant, SubscriptionPlan requestedPlan) {
        Instant now = Instant.now();
        Instant trialEnd = now.plus(14, ChronoUnit.DAYS);

        Plan growthPlan = planRepository.findByCode("growth")
                .orElseGet(() -> planRepository.findAll().stream().findFirst().orElse(null));

        Subscription subscription = Subscription.builder()
                .tenantId(restaurant.getId())
                .plan(growthPlan)
                .planCode(growthPlan != null ? growthPlan.getCode() : "growth")
                .billingInterval("MONTHLY")
                .status(SubscriptionStatus.TRIALING)
                .trialStartAt(now)
                .trialEndAt(trialEnd)
                .currentPeriodStart(now)
                .currentPeriodEnd(trialEnd)
                .cancelAtPeriodEnd(false)
                .build();

        subscription = subscriptionRepository.save(subscription);

        auditLogRepository.save(SubscriptionAuditLog.builder()
                .tenantId(restaurant.getId())
                .action("TRIAL_STARTED")
                .fromPlan("NONE")
                .toPlan(subscription.getPlanCode())
                .actor("SYSTEM")
                .details("14-Day Free Trial activated at ₹0 upfront, no card required")
                .build());

        return subscription;
    }

    @Transactional
    public SubscriptionDetailsDto upgradeSubscription(UUID tenantId, UpgradeSubscriptionRequest request, String actor) {
        Subscription subscription = subscriptionRepository.findByTenantId(tenantId)
                .orElseGet(() -> initDefaultTrial(tenantId));

        Plan targetPlan = planRepository.findByCode(request.getPlanCode().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with code: " + request.getPlanCode()));

        String prevPlan = subscription.getPlanCode();
        boolean isAnnual = "ANNUAL".equalsIgnoreCase(request.getBillingInterval());
        Instant now = Instant.now();
        Instant periodEnd = isAnnual ? now.plus(365, ChronoUnit.DAYS) : now.plus(30, ChronoUnit.DAYS);
        BigDecimal basePrice = isAnnual ? targetPlan.getAnnualPrice() : targetPlan.getMonthlyPrice();
        BigDecimal tax = basePrice.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = basePrice.add(tax);

        subscription.setPlan(targetPlan);
        subscription.setPlanCode(targetPlan.getCode());
        subscription.setBillingInterval(isAnnual ? "ANNUAL" : "MONTHLY");
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setCurrentPeriodStart(now);
        subscription.setCurrentPeriodEnd(periodEnd);
        subscription.setCancelAtPeriodEnd(false);
        subscription.setProvider(request.getProvider() != null ? request.getProvider() : "RAZORPAY");
        subscription = subscriptionRepository.save(subscription);

        // Update restaurant entity
        restaurantRepository.findById(tenantId).ifPresent(restaurant -> {
            restaurant.setSubscriptionPlan(mapPlanCodeToEnum(targetPlan.getCode()));
            restaurant.setSubscriptionStatus(SubscriptionStatus.ACTIVE);
            restaurant.setSubscriptionEndsAt(periodEnd);
            restaurantRepository.save(restaurant);
        });

        // Generate paid invoice
        String invoiceNumber = "INV-" + (now.toEpochMilli() % 100000000);
        BillingInvoice invoice = BillingInvoice.builder()
                .tenantId(tenantId)
                .subscription(subscription)
                .invoiceNumber(invoiceNumber)
                .amount(basePrice)
                .taxAmount(tax)
                .totalAmount(total)
                .currency(targetPlan.getCurrency())
                .status("PAID")
                .dueDate(now)
                .paidAt(now)
                .build();
        invoiceRepository.save(invoice);

        // Log audit
        auditLogRepository.save(SubscriptionAuditLog.builder()
                .tenantId(tenantId)
                .action("UPGRADED")
                .fromPlan(prevPlan)
                .toPlan(targetPlan.getCode())
                .actor(actor != null ? actor : "RESTAURANT_OWNER")
                .details(String.format("Upgraded to %s (%s) for ₹%s via %s",
                        targetPlan.getName(), subscription.getBillingInterval(), total, subscription.getProvider()))
                .build());

        return mapToSubscriptionDetailsDto(subscription);
    }

    @Transactional(readOnly = true)
    public void assertOperationalAccess(UUID tenantId) {
        if (tenantId == null) {
            return;
        }
        SubscriptionDetailsDto subscription = getTenantSubscription(tenantId);
        if (!subscription.isCanPerformOperations()) {
            throw new ForbiddenException(
                    "Your 14-day free trial has expired. Live operations (POS, KDS, Orders) are restricted. Your restaurant data, menus, and reports are safely preserved. Please choose a plan in Billing to reactivate live operations."
            );
        }
    }

    @Transactional
    public boolean processWebhook(String provider, String eventId, String eventType, String rawPayload) {
        if (webhookEventRepository.existsByProviderAndEventId(provider, eventId)) {
            log.info("Webhook event {} from {} already processed (idempotency key matched)", eventId, provider);
            return true;
        }

        WebhookEvent event = WebhookEvent.builder()
                .provider(provider)
                .eventId(eventId)
                .eventType(eventType)
                .payload(rawPayload)
                .status("PROCESSED")
                .processedAt(Instant.now())
                .build();
        webhookEventRepository.save(event);
        log.info("Processed webhook {} type {} from {}", eventId, eventType, provider);
        return true;
    }

    @Transactional(readOnly = true)
    public List<BillingInvoiceDto> getTenantInvoices(UUID tenantId) {
        return invoiceRepository.findByTenantIdOrderByCreatedAtDesc(tenantId).stream()
                .map(this::mapToInvoiceDto)
                .collect(Collectors.toList());
    }

    private Subscription initDefaultTrial(UUID tenantId) {
        Restaurant restaurant = restaurantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant tenant not found: " + tenantId));
        return createTrialSubscription(restaurant, SubscriptionPlan.FREE_TRIAL);
    }

    private SubscriptionDetailsDto mapToSubscriptionDetailsDto(Subscription sub) {
        Instant now = Instant.now();
        long daysRemaining = 0;
        boolean isTrialActive = false;
        String milestone = "DAY_0";

        if (sub.getTrialEndAt() != null) {
            if (sub.getTrialEndAt().isAfter(now)) {
                daysRemaining = Math.max(0, Duration.between(now, sub.getTrialEndAt()).toDays() + 1);
            } else {
                daysRemaining = 0;
            }
        }

        SubscriptionStatus status = sub.getStatus();
        boolean canPerformOperations;

        switch (status) {
            case ACTIVE:
                canPerformOperations = true;
                milestone = "ACTIVE";
                break;
            case TRIALING:
                if (daysRemaining > 0) {
                    canPerformOperations = true;
                    isTrialActive = true;
                    if (daysRemaining >= 12) {
                        milestone = "DAY_0"; // Trial started
                    } else if (daysRemaining >= 8) {
                        milestone = "DAY_3"; // Activation assistance
                    } else if (daysRemaining >= 3) {
                        milestone = "DAY_7"; // Mid-trial reminder
                    } else if (daysRemaining >= 1) {
                        milestone = "DAY_12"; // Trial ending soon
                    } else {
                        milestone = "DAY_14"; // Trial expires
                    }
                } else {
                    canPerformOperations = false;
                    isTrialActive = false;
                    milestone = "EXPIRED";
                }
                break;
            case PAYMENT_PENDING:
                canPerformOperations = true; // Grace period
                milestone = "PAYMENT_PENDING";
                break;
            case TRIAL_EXPIRED:
            case PAST_DUE:
            case CANCELED:
            case SUSPENDED:
            case EXPIRED:
            default:
                canPerformOperations = false;
                milestone = "EXPIRED";
                break;
        }

        String planName = sub.getPlan() != null ? sub.getPlan().getName() :
                ("starter".equalsIgnoreCase(sub.getPlanCode()) ? "Starter" :
                 "multi_outlet".equalsIgnoreCase(sub.getPlanCode()) ? "Multi-Outlet" : "Growth");

        return SubscriptionDetailsDto.builder()
                .id(sub.getId())
                .tenantId(sub.getTenantId())
                .planCode(sub.getPlanCode())
                .planName(planName)
                .billingInterval(sub.getBillingInterval())
                .status(sub.getStatus())
                .trialStartAt(sub.getTrialStartAt())
                .trialEndAt(sub.getTrialEndAt())
                .daysRemainingInTrial(daysRemaining)
                .trialMilestone(milestone)
                .currentPeriodStart(sub.getCurrentPeriodStart())
                .currentPeriodEnd(sub.getCurrentPeriodEnd())
                .cancelAtPeriodEnd(sub.isCancelAtPeriodEnd())
                .canPerformOperations(canPerformOperations)
                .isTrialActive(isTrialActive)
                .provider(sub.getProvider())
                .build();
    }

    private PlanDto mapToPlanDto(Plan plan) {
        List<PlanFeatureDto> features = plan.getFeatures() != null ?
                plan.getFeatures().stream()
                        .map(f -> PlanFeatureDto.builder()
                                .id(f.getId())
                                .featureKey(f.getFeatureKey())
                                .featureName(f.getFeatureName())
                                .isIncluded(f.isIncluded())
                                .build())
                        .collect(Collectors.toList()) : List.of();

        return PlanDto.builder()
                .id(plan.getId())
                .code(plan.getCode())
                .name(plan.getName())
                .description(plan.getDescription())
                .monthlyPrice(plan.getMonthlyPrice())
                .annualPrice(plan.getAnnualPrice())
                .currency(plan.getCurrency())
                .maxOutlets(plan.getMaxOutlets())
                .isPopular(plan.isPopular())
                .isActive(plan.isActive())
                .features(features)
                .build();
    }

    private BillingInvoiceDto mapToInvoiceDto(BillingInvoice inv) {
        return BillingInvoiceDto.builder()
                .id(inv.getId())
                .invoiceNumber(inv.getInvoiceNumber())
                .amount(inv.getAmount())
                .taxAmount(inv.getTaxAmount())
                .totalAmount(inv.getTotalAmount())
                .currency(inv.getCurrency())
                .status(inv.getStatus())
                .dueDate(inv.getDueDate())
                .paidAt(inv.getPaidAt())
                .invoicePdfUrl(inv.getInvoicePdfUrl())
                .createdAt(inv.getCreatedAt())
                .build();
    }

    private SubscriptionPlan mapPlanCodeToEnum(String code) {
        if (code == null) return SubscriptionPlan.GROWTH;
        switch (code.toLowerCase()) {
            case "starter": return SubscriptionPlan.STARTER;
            case "growth": return SubscriptionPlan.GROWTH;
            case "multi_outlet": return SubscriptionPlan.MULTI_OUTLET;
            default: return SubscriptionPlan.GROWTH;
        }
    }
}
