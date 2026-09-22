package com.restaurantsaas.platform.controller;

import com.restaurantsaas.platform.common.dto.ApiResponse;
import com.restaurantsaas.platform.common.exception.TenantNotFoundException;
import com.restaurantsaas.platform.dto.menu.CategoryDto;
import com.restaurantsaas.platform.dto.menu.CreateCategoryRequest;
import com.restaurantsaas.platform.dto.menu.CreateMenuItemRequest;
import com.restaurantsaas.platform.dto.menu.MenuItemDto;
import com.restaurantsaas.platform.dto.menu.UpdateMenuItemRequest;
import com.restaurantsaas.platform.service.MenuService;
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
@RequestMapping("/menu")
@RequiredArgsConstructor
@Tag(name = "Menu & Catalog", description = "Category and Menu Item management")
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/categories")
    @Operation(summary = "List Categories", description = "Get all active categories for the tenant")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories() {
        UUID tenantId = getTenantIdOrThrow();
        List<CategoryDto> categories = menuService.getCategories(tenantId);
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @PostMapping("/categories")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER')")
    @Operation(summary = "Create Category", description = "Add a new menu category")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        UUID tenantId = getTenantIdOrThrow();
        CategoryDto category = menuService.createCategory(tenantId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(category, "Category created successfully"));
    }

    @PutMapping("/categories/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER')")
    @Operation(summary = "Update Category", description = "Update category name or display order")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody CreateCategoryRequest request) {
        UUID tenantId = getTenantIdOrThrow();
        CategoryDto category = menuService.updateCategory(tenantId, id, request);
        return ResponseEntity.ok(ApiResponse.success(category, "Category updated successfully"));
    }

    @DeleteMapping("/categories/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER')")
    @Operation(summary = "Delete Category", description = "Soft delete / deactivate a category")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable UUID id) {
        UUID tenantId = getTenantIdOrThrow();
        menuService.deleteCategory(tenantId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deactivated successfully"));
    }

    @GetMapping("/items")
    @Operation(summary = "List Menu Items", description = "Get menu items, optionally filtered by category")
    public ResponseEntity<ApiResponse<List<MenuItemDto>>> getMenuItems(@RequestParam(required = false) UUID categoryId) {
        UUID tenantId = getTenantIdOrThrow();
        List<MenuItemDto> items = menuService.getMenuItems(tenantId, categoryId);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @PostMapping("/items")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER', 'CHEF')")
    @Operation(summary = "Create Menu Item", description = "Add a new menu item to a category")
    public ResponseEntity<ApiResponse<MenuItemDto>> createMenuItem(@Valid @RequestBody CreateMenuItemRequest request) {
        UUID tenantId = getTenantIdOrThrow();
        MenuItemDto item = menuService.createMenuItem(tenantId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(item, "Menu item created successfully"));
    }

    @PutMapping("/items/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER', 'CHEF')")
    @Operation(summary = "Update Menu Item", description = "Modify menu item details, prices, or prep time")
    public ResponseEntity<ApiResponse<MenuItemDto>> updateMenuItem(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateMenuItemRequest request) {
        UUID tenantId = getTenantIdOrThrow();
        MenuItemDto item = menuService.updateMenuItem(tenantId, id, request);
        return ResponseEntity.ok(ApiResponse.success(item, "Menu item updated successfully"));
    }

    @PatchMapping("/items/{id}/availability")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER', 'CHEF', 'CASHIER')")
    @Operation(summary = "Toggle Item Availability", description = "86 an item or mark it back in stock")
    public ResponseEntity<ApiResponse<MenuItemDto>> toggleAvailability(
            @PathVariable UUID id,
            @RequestParam boolean available) {
        UUID tenantId = getTenantIdOrThrow();
        MenuItemDto item = menuService.toggleItemAvailability(tenantId, id, available);
        return ResponseEntity.ok(ApiResponse.success(item, "Availability updated"));
    }

    @DeleteMapping("/items/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'BRANCH_MANAGER')")
    @Operation(summary = "Delete Menu Item", description = "Permanently remove a menu item")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable UUID id) {
        UUID tenantId = getTenantIdOrThrow();
        menuService.deleteMenuItem(tenantId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Menu item deleted successfully"));
    }

    private UUID getTenantIdOrThrow() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        return tenantId;
    }
}
