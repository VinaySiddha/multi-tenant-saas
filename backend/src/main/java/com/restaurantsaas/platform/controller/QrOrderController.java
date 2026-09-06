package com.restaurantsaas.platform.controller;

import com.restaurantsaas.platform.common.dto.ApiResponse;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.DiningTable;
import com.restaurantsaas.platform.domain.enums.OrderType;
import com.restaurantsaas.platform.dto.menu.CategoryDto;
import com.restaurantsaas.platform.dto.menu.MenuItemDto;
import com.restaurantsaas.platform.dto.order.CreateOrderRequest;
import com.restaurantsaas.platform.dto.order.OrderDto;
import com.restaurantsaas.platform.dto.table.DiningTableDto;
import com.restaurantsaas.platform.repository.DiningTableRepository;
import com.restaurantsaas.platform.service.MenuService;
import com.restaurantsaas.platform.service.OrderService;
import com.restaurantsaas.platform.service.TableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/qr")
@RequiredArgsConstructor
@Tag(name = "Self-Service QR Ordering", description = "Customer mobile self-ordering via QR table scans")
public class QrOrderController {

    private final DiningTableRepository tableRepository;
    private final TableService tableService;
    private final MenuService menuService;
    private final OrderService orderService;

    @GetMapping("/menu/{tableId}")
    @Operation(summary = "Get QR Table Menu", description = "Public endpoint to retrieve table details and full food catalog for customer mobile ordering")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getQrMenu(@PathVariable UUID tableId) {
        DiningTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("DiningTable", "id", tableId));

        UUID tenantId = table.getTenantId();
        List<CategoryDto> categories = menuService.getCategories(tenantId);
        List<MenuItemDto> items = menuService.getMenuItems(tenantId, null);

        Map<String, Object> response = new HashMap<>();
        response.put("table", DiningTableDto.builder()
                .id(table.getId())
                .tenantId(table.getTenantId())
                .branchId(table.getBranchId())
                .tableNumber(table.getTableNumber())
                .section(table.getSection())
                .capacity(table.getCapacity())
                .status(table.getStatus())
                .build());
        response.put("categories", categories);
        response.put("menuItems", items);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/orders")
    @Operation(summary = "Place Customer QR Order", description = "Place a self-service customer order from QR menu")
    public ResponseEntity<ApiResponse<OrderDto>> placeQrOrder(@Valid @RequestBody CreateOrderRequest request) {
        if (request.getTableId() == null) {
            throw new IllegalArgumentException("Table ID is required for QR orders");
        }

        DiningTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException("DiningTable", "id", request.getTableId()));

        request.setOrderType(OrderType.QR_ORDER);
        OrderDto order = orderService.createOrder(table.getTenantId(), table.getBranchId(), request, null);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(order, "Order placed successfully from table " + table.getTableNumber()));
    }
}
