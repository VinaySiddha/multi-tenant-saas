package com.restaurantsaas.platform.tenant;

import java.util.UUID;

/**
 * ThreadLocal storage for multi-tenant and multi-branch context.
 * Enables automatic tenancy resolution for database queries and business logic.
 */
public final class TenantContext {

    private static final ThreadLocal<UUID> CURRENT_TENANT = new ThreadLocal<>();
    private static final ThreadLocal<UUID> CURRENT_BRANCH = new ThreadLocal<>();

    private TenantContext() {
        // Utility class
    }

    public static void setTenantId(UUID tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    public static UUID getTenantId() {
        return CURRENT_TENANT.get();
    }

    public static void setBranchId(UUID branchId) {
        CURRENT_BRANCH.set(branchId);
    }

    public static UUID getBranchId() {
        return CURRENT_BRANCH.get();
    }

    public static void clear() {
        CURRENT_TENANT.remove();
        CURRENT_BRANCH.remove();
    }

    public static boolean hasTenant() {
        return CURRENT_TENANT.get() != null;
    }

    public static boolean hasBranch() {
        return CURRENT_BRANCH.get() != null;
    }
}
