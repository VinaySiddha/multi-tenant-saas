package com.restaurantsaas.platform.dto.kitchen;

import com.restaurantsaas.platform.domain.enums.KotStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateKotStatusRequest {

    @NotNull(message = "Status is required")
    private KotStatus status;
}
