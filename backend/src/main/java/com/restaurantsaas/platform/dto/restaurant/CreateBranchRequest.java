package com.restaurantsaas.platform.dto.restaurant;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateBranchRequest {

    @NotBlank(message = "Branch name is required")
    private String name;

    @NotBlank(message = "Branch code is required")
    private String code;

    private String address;
    private String city;
    private String state;
    private String phoneNumber;
    private String email;
    private String gstNumber;
    private String fssaiNumber;
    private String currency = "INR";
}
