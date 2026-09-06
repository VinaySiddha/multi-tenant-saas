package com.restaurantsaas.platform.repository;

import com.restaurantsaas.platform.domain.entity.Order;
import com.restaurantsaas.platform.domain.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findAllByTenantIdAndBranchIdOrderByCreatedAtDesc(UUID tenantId, UUID branchId);
    Optional<Order> findByIdAndTenantId(UUID id, UUID tenantId);
    Optional<Order> findByTenantIdAndOrderNumber(UUID tenantId, String orderNumber);
    List<Order> findAllByTenantIdAndBranchIdAndStatusIn(UUID tenantId, UUID branchId, List<OrderStatus> statuses);

    @Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM Order o WHERE o.tenantId = :tenantId AND o.branchId = :branchId AND o.paymentStatus = 'PAID' AND o.createdAt >= :startDate")
    BigDecimal calculateTotalRevenueSince(@Param("tenantId") UUID tenantId, @Param("branchId") UUID branchId, @Param("startDate") Instant startDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.tenantId = :tenantId AND o.branchId = :branchId AND o.createdAt >= :startDate")
    long countOrdersSince(@Param("tenantId") UUID tenantId, @Param("branchId") UUID branchId, @Param("startDate") Instant startDate);
}
