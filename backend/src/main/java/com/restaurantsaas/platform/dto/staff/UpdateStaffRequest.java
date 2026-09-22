package com.restaurantsaas.platform.dto.staff;

import com.restaurantsaas.platform.domain.enums.RoleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStaffRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phoneNumber;

    @NotNull(message = "Role is required")
    private RoleType role;

    private String password;
}
