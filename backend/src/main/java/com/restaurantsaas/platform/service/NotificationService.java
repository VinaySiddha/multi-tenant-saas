package com.restaurantsaas.platform.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendOrderCreatedEvent(UUID tenantId, UUID branchId, Object order) {
        String destination = String.format("/topic/tenant/%s/branch/%s/orders", tenantId, branchId);
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "ORDER_CREATED");
        payload.put("data", order);
        log.info("Broadcasting ORDER_CREATED event to {}", destination);
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void sendKotUpdatedEvent(UUID tenantId, UUID branchId, Object kot) {
        String destination = String.format("/topic/tenant/%s/branch/%s/kot", tenantId, branchId);
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "KOT_UPDATED");
        payload.put("data", kot);
        log.info("Broadcasting KOT_UPDATED event to {}", destination);
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void sendOrderReadyEvent(UUID tenantId, UUID branchId, Object order) {
        String destination = String.format("/topic/tenant/%s/branch/%s/orders", tenantId, branchId);
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "ORDER_READY");
        payload.put("data", order);
        log.info("Broadcasting ORDER_READY event to {}", destination);
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void sendPaymentCompletedEvent(UUID tenantId, UUID branchId, Object payment) {
        String destination = String.format("/topic/tenant/%s/branch/%s/payments", tenantId, branchId);
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "PAYMENT_COMPLETED");
        payload.put("data", payment);
        log.info("Broadcasting PAYMENT_COMPLETED event to {}", destination);
        messagingTemplate.convertAndSend(destination, payload);
    }
}
