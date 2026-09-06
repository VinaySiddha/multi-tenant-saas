package com.restaurantsaas.platform.tenant;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Filter that parses X-Tenant-ID and X-Branch-ID HTTP headers and establishes
 * the TenantContext for the lifecycle of the request.
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class TenantFilter extends OncePerRequestFilter {

    public static final String TENANT_HEADER = "X-Tenant-ID";
    public static final String BRANCH_HEADER = "X-Branch-ID";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String tenantHeader = request.getHeader(TENANT_HEADER);
            if (StringUtils.hasText(tenantHeader)) {
                try {
                    UUID tenantId = UUID.fromString(tenantHeader.trim());
                    TenantContext.setTenantId(tenantId);
                    log.trace("Extracted Tenant ID: {} from request: {}", tenantId, request.getRequestURI());
                } catch (IllegalArgumentException e) {
                    log.warn("Invalid UUID format for {}: {}", TENANT_HEADER, tenantHeader);
                }
            }

            String branchHeader = request.getHeader(BRANCH_HEADER);
            if (StringUtils.hasText(branchHeader)) {
                try {
                    UUID branchId = UUID.fromString(branchHeader.trim());
                    TenantContext.setBranchId(branchId);
                    log.trace("Extracted Branch ID: {} from request: {}", branchId, request.getRequestURI());
                } catch (IllegalArgumentException e) {
                    log.warn("Invalid UUID format for {}: {}", BRANCH_HEADER, branchHeader);
                }
            }

            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
