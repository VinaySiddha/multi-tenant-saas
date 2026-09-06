package com.restaurantsaas.platform.controller;

import com.restaurantsaas.platform.common.dto.ApiResponse;
import com.restaurantsaas.platform.dto.auth.AuthResponse;
import com.restaurantsaas.platform.dto.auth.LoginRequest;
import com.restaurantsaas.platform.dto.auth.RegisterRestaurantRequest;
import com.restaurantsaas.platform.dto.auth.UserDto;
import com.restaurantsaas.platform.security.UserPrincipal;
import com.restaurantsaas.platform.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Tenant registration, User authentication, JWT issuance")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticate with email and password to receive JWT tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/register-restaurant")
    @Operation(summary = "Onboard New Restaurant Tenant", description = "Register a new restaurant tenant with default branch and owner account")
    public ResponseEntity<ApiResponse<AuthResponse>> registerRestaurant(@Valid @RequestBody RegisterRestaurantRequest request) {
        AuthResponse response = authService.registerRestaurant(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Restaurant registered successfully"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get Current User Profile", description = "Retrieve current authenticated user context and roles")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserDto user = authService.getCurrentUser(principal);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}
