package com.restaurantsaas.platform.repository;

import com.restaurantsaas.platform.domain.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlanRepository extends JpaRepository<Plan, UUID> {
    Optional<Plan> findByCode(String code);
    List<Plan> findByIsActiveTrue();
}
