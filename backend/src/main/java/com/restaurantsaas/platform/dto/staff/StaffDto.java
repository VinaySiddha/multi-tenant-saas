package com.restaurantsaas.platform.dto.staff;

import com.restaurantsaas.platform.domain.enums.RoleType;
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
public class StaffDto {
    private UUID id;
    private UUID tenantId;
    private UUID branchId;
    private String email;
    private String fullName;
    private String phoneNumber;
    private RoleType role;
    private boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}
