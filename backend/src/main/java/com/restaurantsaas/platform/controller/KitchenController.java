package com.restaurantsaas.platform.controller;

import com.restaurantsaas.platform.common.dto.ApiResponse;
import com.restaurantsaas.platform.common.exception.TenantNotFoundException;
import com.restaurantsaas.platform.domain.enums.KotStatus;
import com.restaurantsaas.platform.dto.kitchen.KitchenTicketDto;
import com.restaurantsaas.platform.dto.kitchen.UpdateKotStatusRequest;
import com.restaurantsaas.platform.service.KitchenService;
import com.restaurantsaas.platform.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/kitchen")
@RequiredArgsConstructor
@Tag(name = "Kitchen Display System (KDS)", description = "KOT routing and preparation tracking")
public class KitchenController {

    private final KitchenService kitchenService;

    @GetMapping("/tickets")
    @Operation(summary = "Get Active Kitchen Tickets", description = "List pending, in-progress and ready tickets for the kitchen display")
    public ResponseEntity<ApiResponse<List<KitchenTicketDto>>> getActiveTickets() {
        UUID tenantId = getTenantIdOrThrow();
        UUID branchId = TenantContext.getBranchId();
        List<KitchenTicketDto> tickets = kitchenService.getActiveTickets(tenantId, branchId);
        return ResponseEntity.ok(ApiResponse.success(tickets));
    }

    @PatchMapping("/tickets/{id}/status")
    @Operation(summary = "Update KOT Status", description = "Update ticket status (PENDING -> IN_PROGRESS -> READY -> SERVED)")
    public ResponseEntity<ApiResponse<KitchenTicketDto>> updateTicketStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateKotStatusRequest request) {
        UUID tenantId = getTenantIdOrThrow();
        KitchenTicketDto ticket = kitchenService.updateTicketStatus(tenantId, id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success(ticket, "Ticket status updated"));
    }

    private UUID getTenantIdOrThrow() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        return tenantId;
    }
}
