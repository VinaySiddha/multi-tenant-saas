package com.restaurantsaas.platform.repository;

import com.restaurantsaas.platform.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findAllByTenantId(UUID tenantId);
    List<User> findAllByTenantIdAndBranchId(UUID tenantId, UUID branchId);
}
