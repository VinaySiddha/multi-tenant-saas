package com.restaurantsaas.platform.repository;

import com.restaurantsaas.platform.domain.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findAllByOrderId(UUID orderId);
    List<Payment> findAllByTenantIdAndBranchIdOrderByPaidAtDesc(UUID tenantId, UUID branchId);
}
