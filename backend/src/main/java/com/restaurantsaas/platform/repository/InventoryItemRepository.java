package com.restaurantsaas.platform.repository;

import com.restaurantsaas.platform.domain.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, UUID> {

    List<InventoryItem> findAllByTenantIdOrderByCreatedAtDesc(UUID tenantId);

    List<InventoryItem> findAllByTenantIdAndBranchIdOrderByCreatedAtDesc(UUID tenantId, UUID branchId);

    Optional<InventoryItem> findByIdAndTenantId(UUID id, UUID tenantId);

    @Query("SELECT i FROM InventoryItem i WHERE i.tenantId = :tenantId AND i.currentStock <= i.minThreshold ORDER BY i.currentStock ASC")
    List<InventoryItem> findLowStockItemsByTenantId(@Param("tenantId") UUID tenantId);
}
