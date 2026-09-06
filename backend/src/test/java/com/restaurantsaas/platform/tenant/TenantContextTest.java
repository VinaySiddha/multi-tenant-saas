package com.restaurantsaas.platform.tenant;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class TenantContextTest {

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testTenantContextSetAndGet() {
        UUID tenantId = UUID.randomUUID();
        UUID branchId = UUID.randomUUID();

        TenantContext.setTenantId(tenantId);
        TenantContext.setBranchId(branchId);

        assertTrue(TenantContext.hasTenant());
        assertTrue(TenantContext.hasBranch());
        assertEquals(tenantId, TenantContext.getTenantId());
        assertEquals(branchId, TenantContext.getBranchId());

        TenantContext.clear();
        assertFalse(TenantContext.hasTenant());
        assertFalse(TenantContext.hasBranch());
        assertNull(TenantContext.getTenantId());
        assertNull(TenantContext.getBranchId());
    }

    @Test
    void testThreadIsolation() throws InterruptedException {
        UUID mainTenantId = UUID.randomUUID();
        TenantContext.setTenantId(mainTenantId);

        UUID[] threadTenantId = new UUID[1];
        Thread thread = new Thread(() -> {
            threadTenantId[0] = TenantContext.getTenantId();
        });
        thread.start();
        thread.join();

        assertNull(threadTenantId[0], "Child thread must not leak parent ThreadLocal context");
        assertEquals(mainTenantId, TenantContext.getTenantId());
    }
}
