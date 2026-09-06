package com.restaurantsaas.platform.dto.table;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateTableRequest {

    @NotBlank(message = "Table number is required")
    private String tableNumber;

    private String section;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity = 4;
}
