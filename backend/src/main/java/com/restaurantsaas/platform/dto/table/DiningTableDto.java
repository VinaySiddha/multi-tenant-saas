package com.restaurantsaas.platform.dto.table;

import com.restaurantsaas.platform.domain.enums.TableStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiningTableDto {
    private UUID id;
    private UUID tenantId;
    private UUID branchId;
    private String tableNumber;
    private String section;
    private int capacity;
    private TableStatus status;
    private String qrCodeToken;
    private boolean isActive;
}
