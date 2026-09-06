package com.restaurantsaas.platform.repository;

import com.restaurantsaas.platform.domain.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, UUID> {
    List<MenuItem> findAllByTenantIdAndIsAvailableTrue(UUID tenantId);
    List<MenuItem> findAllByTenantIdAndCategoryId(UUID tenantId, UUID categoryId);
    Optional<MenuItem> findByIdAndTenantId(UUID id, UUID tenantId);
}
