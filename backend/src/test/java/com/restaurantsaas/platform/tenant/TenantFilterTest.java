package com.restaurantsaas.platform.tenant;

import jakarta.servlet.ServletException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for {@link TenantFilter}: header parsing, invalid headers,
 * and ThreadLocal cleanup after the request completes.
 */
class TenantFilterTest {

    private final TenantFilter filter = new TenantFilter();

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void doFilter_shouldPopulateContextFromValidHeaders() throws ServletException, IOException {
        UUID tenantId = UUID.randomUUID();
        UUID branchId = UUID.randomUUID();

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/orders");
        request.addHeader(TenantFilter.TENANT_HEADER, tenantId.toString());
        request.addHeader(TenantFilter.BRANCH_HEADER, branchId.toString());

        AtomicReference<UUID> seenTenant = new AtomicReference<>();
        AtomicReference<UUID> seenBranch = new AtomicReference<>();
        MockFilterChain chain = new MockFilterChain() {
            @Override
            public void doFilter(jakarta.servlet.ServletRequest req, jakarta.servlet.ServletResponse res) {
                seenTenant.set(TenantContext.getTenantId());
                seenBranch.set(TenantContext.getBranchId());
            }
        };

        filter.doFilter(request, new MockHttpServletResponse(), chain);

        assertEquals(tenantId, seenTenant.get(), "Tenant must be visible inside the filter chain");
        assertEquals(branchId, seenBranch.get(), "Branch must be visible inside the filter chain");
    }

    @Test
    void doFilter_shouldTrimWhitespaceInHeaders() throws ServletException, IOException {
        UUID tenantId = UUID.randomUUID();

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/orders");
        request.addHeader(TenantFilter.TENANT_HEADER, "  " + tenantId + "  ");

        AtomicReference<UUID> seenTenant = new AtomicReference<>();
        MockFilterChain chain = new MockFilterChain() {
            @Override
            public void doFilter(jakarta.servlet.ServletRequest req, jakarta.servlet.ServletResponse res) {
                seenTenant.set(TenantContext.getTenantId());
            }
        };

        filter.doFilter(request, new MockHttpServletResponse(), chain);

        assertEquals(tenantId, seenTenant.get());
    }

    @Test
    void doFilter_shouldIgnoreInvalidUuidHeadersWithoutFailing() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/orders");
        request.addHeader(TenantFilter.TENANT_HEADER, "not-a-uuid");
        request.addHeader(TenantFilter.BRANCH_HEADER, "12345");

        AtomicReference<Boolean> chainInvoked = new AtomicReference<>(false);
        MockFilterChain chain = new MockFilterChain() {
            @Override
            public void doFilter(jakarta.servlet.ServletRequest req, jakarta.servlet.ServletResponse res) {
                chainInvoked.set(true);
            }
        };

        filter.doFilter(request, new MockHttpServletResponse(), chain);

        assertTrue(chainInvoked.get(), "Filter chain must still be invoked for malformed headers");
        assertNull(TenantContext.getTenantId());
        assertNull(TenantContext.getBranchId());
    }

    @Test
    void doFilter_shouldClearContextAfterRequestCompletes() throws ServletException, IOException {
        UUID tenantId = UUID.randomUUID();

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/orders");
        request.addHeader(TenantFilter.TENANT_HEADER, tenantId.toString());

        filter.doFilter(request, new MockHttpServletResponse(), new MockFilterChain());

        assertFalse(TenantContext.hasTenant(), "ThreadLocal must be cleaned up after the request");
        assertFalse(TenantContext.hasBranch());
    }

    @Test
    void doFilter_shouldClearContextEvenWhenDownstreamThrows() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/orders");
        request.addHeader(TenantFilter.TENANT_HEADER, UUID.randomUUID().toString());

        MockFilterChain failingChain = new MockFilterChain() {
            @Override
            public void doFilter(jakarta.servlet.ServletRequest req, jakarta.servlet.ServletResponse res)
                    throws IOException {
                throw new IOException("boom");
            }
        };

        assertThrows(IOException.class,
                () -> filter.doFilter(request, new MockHttpServletResponse(), failingChain));

        assertFalse(TenantContext.hasTenant(), "Context must be cleared even on exception (finally block)");
    }
}
