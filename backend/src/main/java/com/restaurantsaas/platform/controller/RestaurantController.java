package com.restaurantsaas.platform.controller;

import com.restaurantsaas.platform.common.dto.ApiResponse;
import com.restaurantsaas.platform.common.exception.TenantNotFoundException;
import com.restaurantsaas.platform.dto.restaurant.BranchDto;
import com.restaurantsaas.platform.dto.restaurant.CreateBranchRequest;
import com.restaurantsaas.platform.dto.restaurant.RestaurantDto;
import com.restaurantsaas.platform.service.RestaurantService;
import com.restaurantsaas.platform.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
@Tag(name = "Restaurant & Branches", description = "Multi-tenant restaurant profiles and branch configuration")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping("/current")
    @Operation(summary = "Get Active Restaurant Info", description = "Fetch details of the current tenant")
    public ResponseEntity<ApiResponse<RestaurantDto>> getCurrentRestaurant() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        RestaurantDto dto = restaurantService.getRestaurant(tenantId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/branches")
    @Operation(summary = "List Restaurant Branches", description = "List all active branches for current tenant")
    public ResponseEntity<ApiResponse<List<BranchDto>>> getBranches() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        List<BranchDto> branches = restaurantService.getBranches(tenantId);
        return ResponseEntity.ok(ApiResponse.success(branches));
    }

    @PostMapping("/branches")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'PLATFORM_ADMIN')")
    @Operation(summary = "Create New Branch", description = "Add a new branch outlet to the restaurant")
    public ResponseEntity<ApiResponse<BranchDto>> createBranch(@Valid @RequestBody CreateBranchRequest request) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        BranchDto branch = restaurantService.createBranch(tenantId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(branch, "Branch created successfully"));
    }
}
