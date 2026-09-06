package com.restaurantsaas.platform.dto.kitchen;

import com.restaurantsaas.platform.domain.enums.KotStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KitchenTicketDto {
    private UUID id;
    private UUID tenantId;
    private UUID branchId;
    private UUID orderId;
    private String kotNumber;
    private String tableNumber;
    private String orderType;
    private KotStatus status;
    private String itemsSummary;
    private String specialInstructions;
    private Instant createdAt;
    private Instant startedAt;
    private Instant completedAt;
    private long elapsedMinutes;
}
