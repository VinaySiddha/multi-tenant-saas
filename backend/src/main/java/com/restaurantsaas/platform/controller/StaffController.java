package com.restaurantsaas.platform.controller;

import com.restaurantsaas.platform.common.dto.ApiResponse;
import com.restaurantsaas.platform.common.exception.TenantNotFoundException;
import com.restaurantsaas.platform.dto.staff.CreateStaffRequest;
import com.restaurantsaas.platform.dto.staff.StaffDto;
import com.restaurantsaas.platform.dto.staff.UpdateStaffRequest;
import com.restaurantsaas.platform.service.StaffService;
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
@RequestMapping("/staff")
@RequiredArgsConstructor
@Tag(name = "Staff & Access Control", description = "Employee roster and role-based permissions management")
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER')")
    @Operation(summary = "List Staff Members", description = "Get list of all employees for the restaurant")
    public ResponseEntity<ApiResponse<List<StaffDto>>> getStaff(
            @RequestParam(required = false) UUID branchId) {
        UUID tenantId = getTenantIdOrThrow();
        List<StaffDto> staff = staffService.getStaff(tenantId, branchId);
        return ResponseEntity.ok(ApiResponse.success(staff));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER')")
    @Operation(summary = "Get Staff Details", description = "Get single staff member profile")
    public ResponseEntity<ApiResponse<StaffDto>> getStaffById(@PathVariable UUID id) {
        UUID tenantId = getTenantIdOrThrow();
        StaffDto staff = staffService.getStaffById(tenantId, id);
        return ResponseEntity.ok(ApiResponse.success(staff));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER')")
    @Operation(summary = "Add Staff Member", description = "Create employee account with designated role")
    public ResponseEntity<ApiResponse<StaffDto>> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        UUID tenantId = getTenantIdOrThrow();
        UUID branchId = TenantContext.getBranchId();
        StaffDto staff = staffService.createStaff(tenantId, branchId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(staff, "Staff member created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER')")
    @Operation(summary = "Update Staff Member", description = "Modify employee details or change system role")
    public ResponseEntity<ApiResponse<StaffDto>> updateStaff(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStaffRequest request) {
        UUID tenantId = getTenantIdOrThrow();
        StaffDto staff = staffService.updateStaff(tenantId, id, request);
        return ResponseEntity.ok(ApiResponse.success(staff, "Staff member updated successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER')")
    @Operation(summary = "Toggle Staff Active Status", description = "Suspend or reactivate staff access")
    public ResponseEntity<ApiResponse<StaffDto>> toggleStatus(
            @PathVariable UUID id,
            @RequestParam boolean active) {
        UUID tenantId = getTenantIdOrThrow();
        StaffDto staff = staffService.toggleStatus(tenantId, id, active);
        return ResponseEntity.ok(ApiResponse.success(staff, "Staff status updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @Operation(summary = "Delete Staff Member", description = "Remove staff member account")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable UUID id) {
        UUID tenantId = getTenantIdOrThrow();
        staffService.deleteStaff(tenantId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Staff member deleted successfully"));
    }

    private UUID getTenantIdOrThrow() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        return tenantId;
    }
}
