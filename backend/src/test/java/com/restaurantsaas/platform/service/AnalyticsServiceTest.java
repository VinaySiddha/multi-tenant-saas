package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.domain.entity.DiningTable;
import com.restaurantsaas.platform.domain.entity.Order;
import com.restaurantsaas.platform.domain.enums.OrderStatus;
import com.restaurantsaas.platform.domain.enums.TableStatus;
import com.restaurantsaas.platform.dto.analytics.DashboardSummaryDto;
import com.restaurantsaas.platform.repository.DiningTableRepository;
import com.restaurantsaas.platform.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

/**
 * Mockito unit tests for {@link AnalyticsService} dashboard aggregation.
 */
@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private DiningTableRepository tableRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    private UUID tenantId;
    private UUID branchId;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        branchId = UUID.randomUUID();
    }

    private DiningTable table(TableStatus status) {
        DiningTable t = DiningTable.builder()
                .tableNumber("T-" + status.name()).status(status).isActive(true).build();
        t.setId(UUID.randomUUID());
        t.setTenantId(tenantId);
        return t;
    }

    @Test
    void getDashboardSummary_shouldAggregateRevenueOrdersAndOccupancy() {
        when(orderRepository.calculateTotalRevenueSince(eq(tenantId), eq(branchId), any(Instant.class)))
                .thenReturn(new BigDecimal("12500.50"));
        when(orderRepository.countOrdersSince(eq(tenantId), eq(branchId), any(Instant.class)))
                .thenReturn(42L);
        when(orderRepository.findAllByTenantIdAndBranchIdAndStatusIn(
                eq(tenantId), eq(branchId),
                eq(List.of(OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.IN_KITCHEN, OrderStatus.READY))))
                .thenReturn(List.of(
                        Order.builder().orderNumber("ORD-A").status(OrderStatus.PLACED).build(),
                        Order.builder().orderNumber("ORD-B").status(OrderStatus.IN_KITCHEN).build(),
                        Order.builder().orderNumber("ORD-C").status(OrderStatus.READY).build()));
        when(tableRepository.findAllByTenantIdAndBranchIdAndIsActiveTrue(tenantId, branchId))
                .thenReturn(List.of(
                        table(TableStatus.AVAILABLE),
                        table(TableStatus.OCCUPIED),
                        table(TableStatus.BILLING),
                        table(TableStatus.CLEANING)));

        DashboardSummaryDto summary = analyticsService.getDashboardSummary(tenantId, branchId);

        assertEquals(new BigDecimal("12500.50"), summary.getTodayRevenue());
        assertEquals(42L, summary.getTodayOrdersCount());
        assertEquals(3L, summary.getActiveOrdersCount());
        assertEquals(4L, summary.getTotalTablesCount());
        assertEquals(2L, summary.getOccupiedTablesCount(), "OCCUPIED and BILLING count as occupied");
        assertEquals(50.0, summary.getTableOccupancyRate(), 0.001);
    }

    @Test
    void getDashboardSummary_shouldDefaultToZeroWhenNoRevenueOrTables() {
        when(orderRepository.calculateTotalRevenueSince(any(), any(), any())).thenReturn(null);
        when(orderRepository.countOrdersSince(any(), any(), any())).thenReturn(0L);
        when(orderRepository.findAllByTenantIdAndBranchIdAndStatusIn(any(), any(), any()))
                .thenReturn(List.of());
        when(tableRepository.findAllByTenantIdAndBranchIdAndIsActiveTrue(tenantId, branchId))
                .thenReturn(List.of());

        DashboardSummaryDto summary = analyticsService.getDashboardSummary(tenantId, branchId);

        assertEquals(BigDecimal.ZERO, summary.getTodayRevenue(), "Null revenue must normalize to ZERO");
        assertEquals(0L, summary.getActiveOrdersCount());
        assertEquals(0.0, summary.getTableOccupancyRate(), 0.001,
                "Occupancy rate must be 0 (no division by zero) with no tables");
    }

    @Test
    void getDashboardSummary_shouldRoundOccupancyRateToOneDecimal() {
        when(orderRepository.calculateTotalRevenueSince(any(), any(), any())).thenReturn(BigDecimal.TEN);
        when(orderRepository.countOrdersSince(any(), any(), any())).thenReturn(1L);
        when(orderRepository.findAllByTenantIdAndBranchIdAndStatusIn(any(), any(), any()))
                .thenReturn(List.of());
        // 1 of 3 tables occupied => 33.333...% => rounded to 33.3
        when(tableRepository.findAllByTenantIdAndBranchIdAndIsActiveTrue(tenantId, branchId))
                .thenReturn(List.of(
                        table(TableStatus.OCCUPIED),
                        table(TableStatus.AVAILABLE),
                        table(TableStatus.AVAILABLE)));

        DashboardSummaryDto summary = analyticsService.getDashboardSummary(tenantId, branchId);

        assertEquals(33.3, summary.getTableOccupancyRate(), 0.001);
    }
}
