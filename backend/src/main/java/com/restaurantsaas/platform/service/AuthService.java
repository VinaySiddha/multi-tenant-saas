package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.BadRequestException;
import com.restaurantsaas.platform.common.exception.ConflictException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.common.exception.UnauthorizedException;
import com.restaurantsaas.platform.domain.entity.Branch;
import com.restaurantsaas.platform.domain.entity.Restaurant;
import com.restaurantsaas.platform.domain.entity.Role;
import com.restaurantsaas.platform.domain.entity.User;
import com.restaurantsaas.platform.domain.enums.RoleType;
import com.restaurantsaas.platform.domain.enums.SubscriptionPlan;
import com.restaurantsaas.platform.domain.enums.SubscriptionStatus;
import com.restaurantsaas.platform.dto.auth.AuthResponse;
import com.restaurantsaas.platform.dto.auth.LoginRequest;
import com.restaurantsaas.platform.dto.auth.RegisterRestaurantRequest;
import com.restaurantsaas.platform.dto.auth.UserDto;
import com.restaurantsaas.platform.dto.restaurant.BranchDto;
import com.restaurantsaas.platform.dto.restaurant.RestaurantDto;
import com.restaurantsaas.platform.repository.BranchRepository;
import com.restaurantsaas.platform.repository.RestaurantRepository;
import com.restaurantsaas.platform.repository.RoleRepository;
import com.restaurantsaas.platform.repository.UserRepository;
import com.restaurantsaas.platform.security.JwtTokenProvider;
import com.restaurantsaas.platform.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RestaurantRepository restaurantRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        log.info("Attempting login for email: {}", cleanEmail);
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(cleanEmail, request.getPassword())
            );
        } catch (Exception e) {
            log.warn("Authentication failed for email [{}]: {}", cleanEmail, e.getMessage());
            throw new UnauthorizedException("Invalid email or password");
        }

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(principal);

        Restaurant restaurant = principal.getTenantId() != null
                ? restaurantRepository.findById(principal.getTenantId()).orElse(null)
                : null;

        Branch branch = principal.getBranchId() != null
                ? branchRepository.findById(principal.getBranchId()).orElse(null)
                : null;

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(mapToUserDto(principal))
                .restaurant(restaurant != null ? mapToRestaurantDto(restaurant) : null)
                .branch(branch != null ? mapToBranchDto(branch) : null)
                .build();
    }

    @Transactional
    public AuthResponse registerRestaurant(RegisterRestaurantRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("User already exists with email: " + request.getEmail());
        }
        if (restaurantRepository.existsBySlug(request.getSlug())) {
            throw new ConflictException("Restaurant slug is already taken: " + request.getSlug());
        }

        // 1. Create Restaurant Tenant
        Restaurant restaurant = Restaurant.builder()
                .name(request.getRestaurantName())
                .slug(request.getSlug().toLowerCase().trim().replaceAll("\\s+", "-"))
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .subscriptionPlan(request.getPlan() != null ? request.getPlan() : SubscriptionPlan.FREE_TRIAL)
                .subscriptionStatus(SubscriptionStatus.ACTIVE)
                .subscriptionEndsAt(Instant.now().plus(14, ChronoUnit.DAYS))
                .isActive(true)
                .build();
        restaurant = restaurantRepository.save(restaurant);

        // 2. Create Default Branch
        Branch branch = Branch.builder()
                .tenantId(restaurant.getId())
                .name(request.getBranchName())
                .code(request.getBranchCode().toUpperCase().trim())
                .phoneNumber(request.getPhoneNumber())
                .currency("INR")
                .isActive(true)
                .build();
        branch = branchRepository.save(branch);

        // 3. Find or Create RESTAURANT_OWNER role
        Role ownerRole = roleRepository.findByName(RoleType.RESTAURANT_OWNER)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(RoleType.RESTAURANT_OWNER)
                        .description("Restaurant Owner and Superuser")
                        .build()));

        // 4. Create User
        User user = User.builder()
                .tenantId(restaurant.getId())
                .branchId(branch.getId())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getOwnerName())
                .phoneNumber(request.getPhoneNumber())
                .primaryRole(RoleType.RESTAURANT_OWNER)
                .roles(Collections.singleton(ownerRole))
                .isActive(true)
                .build();
        user = userRepository.save(user);

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateTokenForPrincipal(principal, 86400000);
        String refreshToken = tokenProvider.generateRefreshToken(principal);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(mapToUserDto(principal))
                .restaurant(mapToRestaurantDto(restaurant))
                .branch(mapToBranchDto(branch))
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        return mapToUserDto(user);
    }

    private UserDto mapToUserDto(UserPrincipal principal) {
        return UserDto.builder()
                .id(principal.getId())
                .tenantId(principal.getTenantId())
                .branchId(principal.getBranchId())
                .email(principal.getEmail())
                .fullName(principal.getFullName())
                .primaryRole(principal.getPrimaryRole())
                .isActive(principal.isActive())
                .createdAt(Instant.now())
                .build();
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .tenantId(user.getTenantId())
                .branchId(user.getBranchId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .primaryRole(user.getPrimaryRole())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private RestaurantDto mapToRestaurantDto(Restaurant r) {
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
