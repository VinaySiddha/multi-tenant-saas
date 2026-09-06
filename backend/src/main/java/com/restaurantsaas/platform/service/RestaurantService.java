package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.ConflictException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.Branch;
import com.restaurantsaas.platform.domain.entity.Restaurant;
import com.restaurantsaas.platform.dto.restaurant.BranchDto;
import com.restaurantsaas.platform.dto.restaurant.CreateBranchRequest;
import com.restaurantsaas.platform.dto.restaurant.RestaurantDto;
import com.restaurantsaas.platform.repository.BranchRepository;
import com.restaurantsaas.platform.repository.RestaurantRepository;
import com.restaurantsaas.platform.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final BranchRepository branchRepository;

    @Transactional(readOnly = true)
    public RestaurantDto getRestaurant(UUID id) {
        Restaurant r = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));
        return mapToDto(r);
    }

    @Transactional(readOnly = true)
    public List<BranchDto> getBranches(UUID tenantId) {
        return branchRepository.findAllByTenantIdAndIsActiveTrue(tenantId).stream()
                .map(this::mapToBranchDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BranchDto createBranch(UUID tenantId, CreateBranchRequest request) {
        if (branchRepository.existsByTenantIdAndCode(tenantId, request.getCode())) {
            throw new ConflictException("Branch code already exists in this restaurant: " + request.getCode());
        }

        Branch branch = Branch.builder()
                .tenantId(tenantId)
                .name(request.getName())
                .code(request.getCode().toUpperCase().trim())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .gstNumber(request.getGstNumber())
                .fssaiNumber(request.getFssaiNumber())
                .currency(request.getCurrency())
                .isActive(true)
                .build();

        branch = branchRepository.save(branch);
        return mapToBranchDto(branch);
    }

    private RestaurantDto mapToDto(Restaurant r) {
        return RestaurantDto.builder()
                .id(r.getId())
                .name(r.getName())
                .slug(r.getSlug())
                .email(r.getEmail())
                .phoneNumber(r.getPhoneNumber())
                .address(r.getAddress())
                .logoUrl(r.getLogoUrl())
                .subscriptionPlan(r.getSubscriptionPlan())
                .subscriptionStatus(r.getSubscriptionStatus())
                .subscriptionEndsAt(r.getSubscriptionEndsAt())
                .isActive(r.isActive())
                .createdAt(r.getCreatedAt())
                .build();
    }

    private BranchDto mapToBranchDto(Branch b) {
        return BranchDto.builder()
                .id(b.getId())
                .tenantId(b.getTenantId())
                .name(b.getName())
                .code(b.getCode())
                .address(b.getAddress())
                .city(b.getCity())
                .state(b.getState())
                .phoneNumber(b.getPhoneNumber())
                .email(b.getEmail())
                .gstNumber(b.getGstNumber())
                .fssaiNumber(b.getFssaiNumber())
                .currency(b.getCurrency())
                .isActive(b.isActive())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
