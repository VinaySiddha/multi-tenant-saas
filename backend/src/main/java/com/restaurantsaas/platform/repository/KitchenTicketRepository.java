package com.restaurantsaas.platform.repository;

import com.restaurantsaas.platform.domain.entity.KitchenTicket;
import com.restaurantsaas.platform.domain.enums.KotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface KitchenTicketRepository extends JpaRepository<KitchenTicket, UUID> {
    List<KitchenTicket> findAllByTenantIdAndBranchIdAndStatusInOrderByCreatedAtAsc(
            UUID tenantId, UUID branchId, List<KotStatus> statuses);
    Optional<KitchenTicket> findByIdAndTenantId(UUID id, UUID tenantId);
    List<KitchenTicket> findAllByOrderId(UUID orderId);
}
