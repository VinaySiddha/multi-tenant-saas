package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.ConflictException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.common.exception.UnauthorizedException;
import com.restaurantsaas.platform.domain.entity.Branch;
import com.restaurantsaas.platform.domain.entity.Restaurant;
import com.restaurantsaas.platform.domain.entity.Role;
import com.restaurantsaas.platform.domain.entity.User;
import com.restaurantsaas.platform.domain.enums.RoleType;
import com.restaurantsaas.platform.domain.enums.SubscriptionPlan;
import com.restaurantsaas.platform.dto.auth.AuthResponse;
import com.restaurantsaas.platform.dto.auth.LoginRequest;
import com.restaurantsaas.platform.dto.auth.RegisterRestaurantRequest;
import com.restaurantsaas.platform.dto.auth.UserDto;
import com.restaurantsaas.platform.repository.BranchRepository;
import com.restaurantsaas.platform.repository.RestaurantRepository;
import com.restaurantsaas.platform.repository.RoleRepository;
import com.restaurantsaas.platform.repository.UserRepository;
import com.restaurantsaas.platform.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Mockito unit tests for {@link AuthService}.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private RestaurantRepository restaurantRepository;
    @Mock
    private BranchRepository branchRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private UUID tenantId;
    private UUID branchId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        branchId = UUID.randomUUID();
        userId = UUID.randomUUID();
    }

    private org.springframework.security.core.Authentication successfulAuthentication() {
        Role ownerRole = Role.builder().name(RoleType.RESTAURANT_OWNER).build();
        User user = User.builder()
                .email("owner@demo.com")
                .passwordHash("hash")
                .fullName("Demo Owner")
                .primaryRole(RoleType.RESTAURANT_OWNER)
                .roles(Set.of(ownerRole))
                .isActive(true)
                .build();
        user.setId(userId);
        user.setTenantId(tenantId);
        user.setBranchId(branchId);

        return new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                com.restaurantsaas.platform.security.UserPrincipal.create(user), null,
                List.of(new SimpleGrantedAuthority("ROLE_RESTAURANT_OWNER")));
    }

    @Test
    void login_shouldReturnTokensAndProfileOnSuccess() {
        LoginRequest request = new LoginRequest();
        request.setEmail("  Owner@Demo.com ");
        request.setPassword("secret");

        when(authenticationManager.authenticate(any())).thenReturn(successfulAuthentication());
        when(tokenProvider.generateAccessToken(any())).thenReturn("access-jwt");
        when(tokenProvider.generateRefreshToken(any())).thenReturn("refresh-jwt");

        Restaurant restaurant = Restaurant.builder().name("Demo Foods").slug("demo-foods").build();
        restaurant.setId(tenantId);
        Branch branch = Branch.builder().name("HQ").code("HQ").build();
        branch.setId(branchId);
        when(restaurantRepository.findById(tenantId)).thenReturn(Optional.of(restaurant));
        when(branchRepository.findById(branchId)).thenReturn(Optional.of(branch));

        AuthResponse response = authService.login(request);

        assertEquals("access-jwt", response.getAccessToken());
        assertEquals("refresh-jwt", response.getRefreshToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals("owner@demo.com", response.getUser().getEmail());
        assertEquals("Demo Foods", response.getRestaurant().getName());
        assertEquals("HQ", response.getBranch().getCode());
    }

    @Test
    void login_shouldNormalizeEmailBeforeAuthenticating() {
        LoginRequest request = new LoginRequest();
        request.setEmail(" MixedCase@Demo.COM ");
        request.setPassword("pw");

        when(authenticationManager.authenticate(any())).thenAnswer(inv -> {
            var auth = inv.getArgument(0, org.springframework.security.core.Authentication.class);
            assertEquals("mixedcase@demo.com", auth.getPrincipal(),
                    "Email must be trimmed and lower-cased before authentication");
            return successfulAuthentication();
        });
        when(tokenProvider.generateAccessToken(any())).thenReturn("a");
        when(tokenProvider.generateRefreshToken(any())).thenReturn("r");
        when(restaurantRepository.findById(any())).thenReturn(Optional.empty());
        when(branchRepository.findById(any())).thenReturn(Optional.empty());

        AuthResponse response = authService.login(request);

        assertNull(response.getRestaurant());
        assertNull(response.getBranch());
    }

    @Test
    void login_shouldThrowUnauthorizedOnBadCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("owner@demo.com");
        request.setPassword("wrong");

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("bad credentials"));

        UnauthorizedException ex = assertThrows(UnauthorizedException.class,
                () -> authService.login(request));

        assertEquals("Invalid email or password", ex.getMessage(),
                "Must not leak the underlying failure reason");
        verifyNoInteractions(tokenProvider);
    }

    @Test
    void registerRestaurant_shouldRejectDuplicateEmail() {
        RegisterRestaurantRequest request = new RegisterRestaurantRequest();
        request.setEmail("taken@demo.com");

        when(userRepository.existsByEmail("taken@demo.com")).thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class,
                () -> authService.registerRestaurant(request));
        assertTrue(ex.getMessage().contains("taken@demo.com"));
        verify(restaurantRepository, never()).save(any());
    }

    @Test
    void registerRestaurant_shouldRejectDuplicateSlug() {
        RegisterRestaurantRequest request = new RegisterRestaurantRequest();
        request.setEmail("fresh@demo.com");
        request.setSlug("existing-slug");

        when(userRepository.existsByEmail("fresh@demo.com")).thenReturn(false);
        when(restaurantRepository.existsBySlug("existing-slug")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.registerRestaurant(request));
        verify(restaurantRepository, never()).save(any());
    }

    @Test
    void registerRestaurant_shouldCreateTenantBranchOwnerAndReturnTokens() {
        RegisterRestaurantRequest request = new RegisterRestaurantRequest();
        request.setRestaurantName("Spice Route");
        request.setSlug("Spice Route");
        request.setEmail("owner@spiceroute.com");
        request.setPassword("Str0ng!Pass");
        request.setOwnerName("Curry King");
        request.setPhoneNumber("+91-9999999999");
        request.setBranchName("Main Street");
        request.setBranchCode("main");
        request.setPlan(SubscriptionPlan.PRO);

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(restaurantRepository.existsBySlug(request.getSlug())).thenReturn(false);

        Restaurant savedRestaurant = Restaurant.builder().name("Spice Route").slug("spice-route").build();
        savedRestaurant.setId(tenantId);
        Branch savedBranch = Branch.builder().name("Main Street").code("MAIN").build();
        savedBranch.setId(branchId);

        when(restaurantRepository.save(any(Restaurant.class))).thenAnswer(inv -> {
            Restaurant r = inv.getArgument(0);
            // slug must be normalized: lowercased, whitespace -> dash
            assertEquals("spice-route", r.getSlug());
            return savedRestaurant;
        });
        when(branchRepository.save(any(Branch.class))).thenAnswer(inv -> {
            Branch b = inv.getArgument(0);
            assertEquals("MAIN", b.getCode(), "Branch code must be upper-cased");
            assertEquals(tenantId, b.getTenantId());
            return savedBranch;
        });
        when(roleRepository.findByName(RoleType.RESTAURANT_OWNER)).thenReturn(Optional.empty());
        when(roleRepository.save(any(Role.class))).thenAnswer(inv -> inv.getArgument(0));
        when(passwordEncoder.encode("Str0ng!Pass")).thenReturn("bcrypt-hash");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            assertEquals(tenantId, u.getTenantId());
            assertEquals(branchId, u.getBranchId());
            assertEquals("bcrypt-hash", u.getPasswordHash(), "Raw password must never be stored");
            assertEquals(RoleType.RESTAURANT_OWNER, u.getPrimaryRole());
            return u;
        });
        when(tokenProvider.generateTokenForPrincipal(any(), anyLong())).thenReturn("access-jwt");
        when(tokenProvider.generateRefreshToken(any())).thenReturn("refresh-jwt");

        AuthResponse response = authService.registerRestaurant(request);

        assertEquals("access-jwt", response.getAccessToken());
        assertEquals("Spice Route", response.getRestaurant().getName());
        assertEquals("owner@spiceroute.com", response.getUser().getEmail());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("Curry King", userCaptor.getValue().getFullName());
    }

    @Test
    void getCurrentUser_shouldThrowWhenUnauthenticated() {
        assertThrows(UnauthorizedException.class, () -> authService.getCurrentUser(null));
    }

    @Test
    void getCurrentUser_shouldThrowWhenUserMissing() {
        com.restaurantsaas.platform.security.UserPrincipal principal =
                com.restaurantsaas.platform.security.UserPrincipal.builder()
                        .id(userId).email("ghost@demo.com").primaryRole(RoleType.WAITER)
                        .authorities(List.of()).active(true).build();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> authService.getCurrentUser(principal));
    }

    @Test
    void getCurrentUser_shouldReturnMappedUser() {
        User user = User.builder()
                .email("waiter@demo.com")
                .passwordHash("hash")
                .fullName("Waiter One")
                .primaryRole(RoleType.WAITER)
                .roles(Set.of())
                .isActive(true)
                .build();
        user.setId(userId);
        user.setTenantId(tenantId);

        com.restaurantsaas.platform.security.UserPrincipal principal =
                com.restaurantsaas.platform.security.UserPrincipal.builder()
                        .id(userId).email("waiter@demo.com").primaryRole(RoleType.WAITER)
                        .authorities(List.of()).active(true).build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        UserDto dto = authService.getCurrentUser(principal);

        assertEquals(userId, dto.getId());
        assertEquals("waiter@demo.com", dto.getEmail());
        assertEquals("Waiter One", dto.getFullName());
        assertEquals(RoleType.WAITER, dto.getPrimaryRole());
    }
}
