package com.restaurantsaas.platform.controller;

import com.restaurantsaas.platform.common.dto.ApiResponse;
import com.restaurantsaas.platform.common.exception.TenantNotFoundException;
import com.restaurantsaas.platform.dto.analytics.DashboardSummaryDto;
import com.restaurantsaas.platform.service.AnalyticsService;
import com.restaurantsaas.platform.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Tag(name = "Reports & Analytics", description = "Real-time sales summaries and operational KPIs")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    @Operation(summary = "Get Dashboard Summary", description = "Fetch today's revenue, order totals, and table occupancy rate")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getDashboardSummary() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw TenantNotFoundException.missingHeader();
        }
        UUID branchId = TenantContext.getBranchId();
        DashboardSummaryDto summary = analyticsService.getDashboardSummary(tenantId, branchId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
