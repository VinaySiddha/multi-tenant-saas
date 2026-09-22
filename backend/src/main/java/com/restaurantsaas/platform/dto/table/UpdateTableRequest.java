package com.restaurantsaas.platform.dto.table;

import com.restaurantsaas.platform.domain.enums.TableStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateTableRequest {

    @NotBlank(message = "Table number is required")
    private String tableNumber;

    @NotBlank(message = "Section name is required")
    private String section;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    private TableStatus status;
}
