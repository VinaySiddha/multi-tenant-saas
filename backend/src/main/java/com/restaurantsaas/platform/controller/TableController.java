package com.restaurantsaas.platform.controller;

import com.restaurantsaas.platform.common.dto.ApiResponse;
import com.restaurantsaas.platform.common.exception.TenantNotFoundException;
import com.restaurantsaas.platform.domain.enums.TableStatus;
import com.restaurantsaas.platform.dto.table.CreateTableRequest;
import com.restaurantsaas.platform.dto.table.DiningTableDto;
import com.restaurantsaas.platform.service.TableService;
import com.restaurantsaas.platform.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tables")
@RequiredArgsConstructor
@Tag(name = "Dining Tables", description = "Floor tables and occupancy management")
public class TableController {

    private final TableService tableService;

    @GetMapping
    @Operation(summary = "List Tables", description = "List all dining tables for the active tenant branch")
    public ResponseEntity<ApiResponse<List<DiningTableDto>>> getTables() {
        UUID tenantId = getTenantIdOrThrow();
        UUID branchId = TenantContext.getBranchId();
        List<DiningTableDto> tables = tableService.getTables(tenantId, branchId);
        return ResponseEntity.ok(ApiResponse.success(tables));
    }

    @PostMapping
    @Operation(summary = "Create Table", description = "Add a new table to the active branch")
    public ResponseEntity<ApiResponse<DiningTableDto>> createTable(@Valid @RequestBody CreateTableRequest request) {
        UUID tenantId = getTenantIdOrThrow();
        UUID branchId = TenantContext.getBranchId();
        DiningTableDto table = tableService.createTable(tenantId, branchId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(table, "Table created successfully"));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update Table Status", description = "Change table status (AVAILABLE, OCCUPIED, BILLING, CLEANING)")
    public ResponseEntity<ApiResponse<DiningTableDto>> updateStatus(
            @PathVariable UUID id,
            @RequestParam TableStatus status) {
        UUID tenantId = getTenantIdOrThrow();
        DiningTableDto table = tableService.updateTableStatus(tenantId, id, status);
        return ResponseEntity.ok(ApiResponse.success(table, "Table status updated"));
    }

    private UUID getTenantIdOrThrow() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        return tenantId;
    }
}
