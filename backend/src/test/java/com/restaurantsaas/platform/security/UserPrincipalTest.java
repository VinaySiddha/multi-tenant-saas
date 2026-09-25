package com.restaurantsaas.platform.security;

import com.restaurantsaas.platform.domain.entity.Role;
import com.restaurantsaas.platform.domain.entity.User;
import com.restaurantsaas.platform.domain.enums.RoleType;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for {@link UserPrincipal} factory mapping and UserDetails contract.
 */
class UserPrincipalTest {

    @Test
    void create_shouldMapUserFieldsToPrincipal() {
        UUID userId = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();
        UUID branchId = UUID.randomUUID();

        Role chefRole = Role.builder().name(RoleType.CHEF).build();
        User user = User.builder()
                .email("chef@demo.com")
                .passwordHash("hash")
                .fullName("Chef Gordon")
                .primaryRole(RoleType.BRANCH_MANAGER)
                .roles(Set.of(chefRole))
                .isActive(true)
                .build();
        user.setId(userId);
        user.setTenantId(tenantId);
        user.setBranchId(branchId);

        UserPrincipal principal = UserPrincipal.create(user);

        assertEquals(userId, principal.getId());
        assertEquals(tenantId, principal.getTenantId());
        assertEquals(branchId, principal.getBranchId());
        assertEquals("chef@demo.com", principal.getEmail());
        assertEquals("chef@demo.com", principal.getUsername(), "Username must resolve to email");
        assertEquals("hash", principal.getPassword());
        assertEquals("Chef Gordon", principal.getFullName());
        assertEquals(RoleType.BRANCH_MANAGER, principal.getPrimaryRole());
        assertTrue(principal.isEnabled());
        assertTrue(principal.isAccountNonExpired());
        assertTrue(principal.isAccountNonLocked());
        assertTrue(principal.isCredentialsNonExpired());
    }

    @Test
    void create_shouldIncludeRoleAuthoritiesAndPrimaryRoleAuthority() {
        Role chefRole = Role.builder().name(RoleType.CHEF).build();
        User user = User.builder()
                .email("multi@demo.com")
                .passwordHash("hash")
                .fullName("Multi Role")
                .primaryRole(RoleType.WAITER)
                .roles(Set.of(chefRole))
                .isActive(true)
                .build();

        UserPrincipal principal = UserPrincipal.create(user);

        Set<String> authorities = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.toSet());

        assertTrue(authorities.contains("ROLE_CHEF"), "Explicit role authority expected");
        assertTrue(authorities.contains("ROLE_WAITER"), "Primary role authority expected");
        assertEquals(2, authorities.size());
    }

    @Test
    void isEnabled_shouldReflectActiveFlag() {
        User inactive = User.builder()
                .email("ghost@demo.com")
                .passwordHash("hash")
                .fullName("Ghost")
                .primaryRole(RoleType.CASHIER)
                .roles(Set.of())
                .isActive(false)
                .build();

        UserPrincipal principal = UserPrincipal.create(inactive);

        assertFalse(principal.isEnabled());
        // Only the primary-role authority should exist when no explicit roles are assigned
        assertEquals(1, principal.getAuthorities().size());
        assertEquals("ROLE_CASHIER",
                principal.getAuthorities().iterator().next().getAuthority());
    }
}
