package com.restaurantsaas.platform.controller;

import com.restaurantsaas.platform.common.dto.ApiResponse;
import com.restaurantsaas.platform.common.exception.TenantNotFoundException;
import com.restaurantsaas.platform.dto.order.CreateOrderRequest;
import com.restaurantsaas.platform.dto.order.OrderDto;
import com.restaurantsaas.platform.security.UserPrincipal;
import com.restaurantsaas.platform.service.OrderService;
import com.restaurantsaas.platform.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Orders & Billing", description = "POS Order creation, lifecycle and billing")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create POS Order", description = "Place a new Dine-In, Takeaway, or Delivery order with automated KOT generation")
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID tenantId = getTenantIdOrThrow();
        UUID branchId = TenantContext.getBranchId();
        UUID userId = principal != null ? principal.getId() : null;

        OrderDto order = orderService.createOrder(tenantId, branchId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(order, "Order placed successfully"));
    }

    @GetMapping
    @Operation(summary = "List Orders", description = "Get orders for current branch")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getOrders() {
        UUID tenantId = getTenantIdOrThrow();
        UUID branchId = TenantContext.getBranchId();
        List<OrderDto> orders = orderService.getOrders(tenantId, branchId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Order Details", description = "Get order by UUID")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(@PathVariable UUID id) {
        UUID tenantId = getTenantIdOrThrow();
        OrderDto order = orderService.getOrderById(tenantId, id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel Order", description = "Cancel an active order and release table")
    public ResponseEntity<ApiResponse<OrderDto>> cancelOrder(
            @PathVariable UUID id,
            @RequestParam(required = false, defaultValue = "Customer request") String reason) {
        UUID tenantId = getTenantIdOrThrow();
        OrderDto order = orderService.cancelOrder(tenantId, id, reason);
        return ResponseEntity.ok(ApiResponse.success(order, "Order cancelled successfully"));
    }

    private UUID getTenantIdOrThrow() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        return tenantId;
    }
}
