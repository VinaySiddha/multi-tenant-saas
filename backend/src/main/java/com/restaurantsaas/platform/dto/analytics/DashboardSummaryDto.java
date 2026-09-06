package com.restaurantsaas.platform.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {
    private BigDecimal todayRevenue;
    private long todayOrdersCount;
    private long activeOrdersCount;
    private long occupiedTablesCount;
    private long totalTablesCount;
    private double tableOccupancyRate;
    private double avgPrepTimeMinutes;
    private List<Map<String, Object>> topSellingItems;
    private List<Map<String, Object>> recentOrders;
}
