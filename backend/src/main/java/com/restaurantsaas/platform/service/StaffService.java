package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.ConflictException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.Role;
import com.restaurantsaas.platform.domain.entity.User;
import com.restaurantsaas.platform.domain.enums.RoleType;
import com.restaurantsaas.platform.dto.staff.CreateStaffRequest;
import com.restaurantsaas.platform.dto.staff.StaffDto;
import com.restaurantsaas.platform.dto.staff.UpdateStaffRequest;
import com.restaurantsaas.platform.repository.RoleRepository;
import com.restaurantsaas.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StaffService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<StaffDto> getStaff(UUID tenantId, UUID branchId) {
        List<User> users = (branchId != null)
                ? userRepository.findAllByTenantIdAndBranchId(tenantId, branchId)
                : userRepository.findAllByTenantId(tenantId);

        return users.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StaffDto getStaffById(UUID tenantId, UUID userId) {
        User user = userRepository.findById(userId)
                .filter(u -> tenantId.equals(u.getTenantId()))
                .orElseThrow(() -> new ResourceNotFoundException("Staff member", "id", userId));
        return mapToDto(user);
    }

    @Transactional
    public StaffDto createStaff(UUID tenantId, UUID defaultBranchId, CreateStaffRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new ConflictException("A user with email " + cleanEmail + " already exists");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(request.getRole())
                        .description(request.getRole().name())
                        .build()));

        UUID effectiveBranchId = request.getBranchId() != null ? request.getBranchId() : defaultBranchId;

        User user = User.builder()
                .tenantId(tenantId)
                .branchId(effectiveBranchId)
                .email(cleanEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .phoneNumber(request.getPhoneNumber())
                .primaryRole(request.getRole())
                .roles(new HashSet<>(Collections.singleton(role)))
                .isActive(true)
                .build();

        user = userRepository.save(user);
        log.info("Created staff user: {} ({}) for tenant: {}", user.getEmail(), user.getPrimaryRole(), tenantId);
        return mapToDto(user);
    }

    @Transactional
    public StaffDto updateStaff(UUID tenantId, UUID userId, UpdateStaffRequest request) {
        User user = userRepository.findById(userId)
                .filter(u -> tenantId.equals(u.getTenantId()))
                .orElseThrow(() -> new ResourceNotFoundException("Staff member", "id", userId));

        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber());

        if (request.getRole() != null && !request.getRole().equals(user.getPrimaryRole())) {
            Role role = roleRepository.findByName(request.getRole())
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .name(request.getRole())
                            .description(request.getRole().name())
                            .build()));
            user.setPrimaryRole(request.getRole());
            user.setRoles(new HashSet<>(Collections.singleton(role)));
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword().trim()));
        }

        user = userRepository.save(user);
        log.info("Updated staff member: {} (ID: {})", user.getEmail(), user.getId());
        return mapToDto(user);
    }

    @Transactional
    public StaffDto toggleStatus(UUID tenantId, UUID userId, boolean active) {
        User user = userRepository.findById(userId)
                .filter(u -> tenantId.equals(u.getTenantId()))
                .orElseThrow(() -> new ResourceNotFoundException("Staff member", "id", userId));

        user.setActive(active);
        user = userRepository.save(user);
        log.info("Toggled active status for staff member {}: {}", user.getEmail(), active);
        return mapToDto(user);
    }

    @Transactional
    public void deleteStaff(UUID tenantId, UUID userId) {
        User user = userRepository.findById(userId)
                .filter(u -> tenantId.equals(u.getTenantId()))
                .orElseThrow(() -> new ResourceNotFoundException("Staff member", "id", userId));

        userRepository.delete(user);
        log.info("Deleted staff member: {} (ID: {})", user.getEmail(), userId);
    }

    private StaffDto mapToDto(User u) {
        return StaffDto.builder()
                .id(u.getId())
                .tenantId(u.getTenantId())
                .branchId(u.getBranchId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .phoneNumber(u.getPhoneNumber())
                .role(u.getPrimaryRole())
                .isActive(u.isActive())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .build();
    }
}
