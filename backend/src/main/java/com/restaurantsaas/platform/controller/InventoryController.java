package com.restaurantsaas.platform.controller;

import com.restaurantsaas.platform.common.dto.ApiResponse;
import com.restaurantsaas.platform.common.exception.TenantNotFoundException;
import com.restaurantsaas.platform.dto.inventory.AdjustStockRequest;
import com.restaurantsaas.platform.dto.inventory.CreateInventoryItemRequest;
import com.restaurantsaas.platform.dto.inventory.InventoryItemDto;
import com.restaurantsaas.platform.dto.inventory.UpdateInventoryItemRequest;
import com.restaurantsaas.platform.service.InventoryService;
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
@RequestMapping("/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory & Stock", description = "Raw ingredient stock levels, low-stock warnings and replenishment tracking")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @Operation(summary = "List Inventory Items", description = "Get all stock items for current branch / tenant")
    public ResponseEntity<ApiResponse<List<InventoryItemDto>>> getInventory(
            @RequestParam(required = false) UUID branchId) {
        UUID tenantId = getTenantIdOrThrow();
        UUID effectiveBranchId = branchId != null ? branchId : TenantContext.getBranchId();
        List<InventoryItemDto> items = inventoryService.getInventoryItems(tenantId, effectiveBranchId);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Get Low Stock Alerts", description = "Get inventory items that have fallen below minimum safety threshold")
    public ResponseEntity<ApiResponse<List<InventoryItemDto>>> getLowStockItems() {
        UUID tenantId = getTenantIdOrThrow();
        List<InventoryItemDto> items = inventoryService.getLowStockItems(tenantId);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Item Details", description = "Get inventory item by UUID")
    public ResponseEntity<ApiResponse<InventoryItemDto>> getItemById(@PathVariable UUID id) {
        UUID tenantId = getTenantIdOrThrow();
        InventoryItemDto item = inventoryService.getItemById(tenantId, id);
        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER', 'CHEF')")
    @Operation(summary = "Create Inventory Item", description = "Add a new raw material or ingredient to track")
    public ResponseEntity<ApiResponse<InventoryItemDto>> createItem(
            @Valid @RequestBody CreateInventoryItemRequest request) {
        UUID tenantId = getTenantIdOrThrow();
        UUID branchId = TenantContext.getBranchId();
        InventoryItemDto item = inventoryService.createItem(tenantId, branchId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(item, "Inventory item created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER', 'CHEF')")
    @Operation(summary = "Update Inventory Item", description = "Update item details and threshold")
    public ResponseEntity<ApiResponse<InventoryItemDto>> updateItem(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateInventoryItemRequest request) {
        UUID tenantId = getTenantIdOrThrow();
        InventoryItemDto item = inventoryService.updateItem(tenantId, id, request);
        return ResponseEntity.ok(ApiResponse.success(item, "Inventory item updated successfully"));
    }

    @PostMapping("/{id}/adjust")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER', 'CHEF', 'CASHIER')")
    @Operation(summary = "Adjust Stock Quantity", description = "Restock, deduct for wastage, or perform audit physical recount")
    public ResponseEntity<ApiResponse<InventoryItemDto>> adjustStock(
            @PathVariable UUID id,
            @Valid @RequestBody AdjustStockRequest request) {
        UUID tenantId = getTenantIdOrThrow();
        InventoryItemDto item = inventoryService.adjustStock(tenantId, id, request);
        return ResponseEntity.ok(ApiResponse.success(item, "Stock adjusted successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER')")
    @Operation(summary = "Delete Inventory Item", description = "Remove an item from inventory tracking")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable UUID id) {
        UUID tenantId = getTenantIdOrThrow();
        inventoryService.deleteItem(tenantId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Inventory item deleted successfully"));
    }

    private UUID getTenantIdOrThrow() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        return tenantId;
    }
}
