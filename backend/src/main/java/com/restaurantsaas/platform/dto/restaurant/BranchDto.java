package com.restaurantsaas.platform.dto.restaurant;

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
public class BranchDto {
    private UUID id;
    private UUID tenantId;
    private String name;
    private String code;
    private String address;
    private String city;
    private String state;
    private String phoneNumber;
    private String email;
    private String gstNumber;
    private String fssaiNumber;
    private String currency;
    private boolean isActive;
    private Instant createdAt;
}
