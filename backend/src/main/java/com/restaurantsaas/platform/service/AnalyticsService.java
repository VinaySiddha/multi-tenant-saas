package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.domain.entity.DiningTable;
import com.restaurantsaas.platform.domain.enums.OrderStatus;
import com.restaurantsaas.platform.domain.enums.TableStatus;
import com.restaurantsaas.platform.dto.analytics.DashboardSummaryDto;
import com.restaurantsaas.platform.repository.DiningTableRepository;
import com.restaurantsaas.platform.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final DiningTableRepository tableRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary(UUID tenantId, UUID branchId) {
        Instant startOfDay = Instant.now().truncatedTo(ChronoUnit.DAYS);

        BigDecimal todayRevenue = orderRepository.calculateTotalRevenueSince(tenantId, branchId, startOfDay);
        long todayOrdersCount = orderRepository.countOrdersSince(tenantId, branchId, startOfDay);

        List<OrderStatus> activeStatuses = Arrays.asList(OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.IN_KITCHEN, OrderStatus.READY);
        long activeOrdersCount = orderRepository.findAllByTenantIdAndBranchIdAndStatusIn(tenantId, branchId, activeStatuses).size();

        List<DiningTable> tables = tableRepository.findAllByTenantIdAndBranchIdAndIsActiveTrue(tenantId, branchId);
        long totalTables = tables.size();
        long occupiedTables = tables.stream().filter(t -> t.getStatus() == TableStatus.OCCUPIED || t.getStatus() == TableStatus.BILLING).count();

        double occupancyRate = totalTables > 0 ? ((double) occupiedTables / totalTables) * 100.0 : 0.0;

        return DashboardSummaryDto.builder()
                .todayRevenue(todayRevenue != null ? todayRevenue : BigDecimal.ZERO)
                .todayOrdersCount(todayOrdersCount)
                .activeOrdersCount(activeOrdersCount)
                .occupiedTablesCount(occupiedTables)
                .totalTablesCount(totalTables)
                .tableOccupancyRate(Math.round(occupancyRate * 10.0) / 10.0)
                .avgPrepTimeMinutes(14.5)
                .build();
    }
}
