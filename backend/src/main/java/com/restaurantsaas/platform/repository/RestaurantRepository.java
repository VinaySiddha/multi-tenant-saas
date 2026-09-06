package com.restaurantsaas.platform.repository;

import com.restaurantsaas.platform.domain.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, UUID> {
    Optional<Restaurant> findBySlug(String slug);
    Optional<Restaurant> findByEmail(String email);
    boolean existsBySlug(String slug);
    boolean existsByEmail(String email);
}
