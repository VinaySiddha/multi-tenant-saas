package com.restaurantsaas.platform.repository;

import com.restaurantsaas.platform.domain.entity.WebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WebhookEventRepository extends JpaRepository<WebhookEvent, UUID> {
    Optional<WebhookEvent> findByProviderAndEventId(String provider, String eventId);
    boolean existsByProviderAndEventId(String provider, String eventId);
}
