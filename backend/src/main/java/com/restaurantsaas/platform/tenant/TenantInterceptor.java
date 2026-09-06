package com.restaurantsaas.platform.tenant;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
public class TenantInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (TenantContext.hasTenant()) {
            response.setHeader("X-Tenant-ID", TenantContext.getTenantId().toString());
        }
        if (TenantContext.hasBranch()) {
            response.setHeader("X-Branch-ID", TenantContext.getBranchId().toString());
        }
        return true;
    }
}
