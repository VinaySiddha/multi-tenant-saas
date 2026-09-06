package com.restaurantsaas.platform.common.controller;

import com.restaurantsaas.platform.common.dto.ApiResponse;
import com.restaurantsaas.platform.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
@Tag(name = "Health & System", description = "System health check and multi-tenant context inspector")
public class HealthController {

    @GetMapping
    @Operation(summary = "Health check", description = "Check if the SaaS platform backend is healthy and running")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "UP");
        data.put("service", "Enterprise Restaurant SaaS Platform");
        data.put("timestamp", Instant.now());
        data.put("activeTenantId", TenantContext.getTenantId());
        data.put("activeBranchId", TenantContext.getBranchId());

        return ResponseEntity.ok(ApiResponse.success(data, "System is healthy"));
    }
}
