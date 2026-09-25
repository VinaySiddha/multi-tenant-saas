package com.restaurantsaas.platform.security;

import com.restaurantsaas.platform.domain.entity.Role;
import com.restaurantsaas.platform.domain.entity.User;
import com.restaurantsaas.platform.domain.enums.RoleType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pure unit tests for {@link JwtTokenProvider} — no Spring context required.
 */
class JwtTokenProviderTest {

    private static final String SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private static final String ISSUER = "restaurant-saas-platform";

    private JwtTokenProvider tokenProvider;
    private UUID tenantId;
    private UUID branchId;
    private UUID userId;
    private UserPrincipal principal;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(SECRET, 86400000L, 604800000L, ISSUER);

        tenantId = UUID.randomUUID();
        branchId = UUID.randomUUID();
        userId = UUID.randomUUID();

        Role ownerRole = Role.builder().name(RoleType.RESTAURANT_OWNER).build();
        User user = User.builder()
                .email("owner@demo.com")
                .passwordHash("encoded-password")
                .fullName("Demo Owner")
                .primaryRole(RoleType.RESTAURANT_OWNER)
                .roles(Set.of(ownerRole))
                .isActive(true)
                .build();
        user.setId(userId);
        user.setTenantId(tenantId);
        user.setBranchId(branchId);

        principal = UserPrincipal.create(user);
    }

    @Test
    void generateAccessToken_shouldProduceValidTokenWithExpectedClaims() {
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                principal, null, List.of(new SimpleGrantedAuthority("ROLE_RESTAURANT_OWNER")));

        String token = tokenProvider.generateAccessToken(authentication);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals("owner@demo.com", tokenProvider.getUsernameFromToken(token));
        assertEquals(tenantId, tokenProvider.getTenantIdFromToken(token));
        assertEquals(branchId, tokenProvider.getBranchIdFromToken(token));
    }

    @Test
    void generateRefreshToken_shouldContainUserClaims() {
        String token = tokenProvider.generateRefreshToken(principal);

        Claims claims = Jwts.parser().verifyWith(secretKey()).build()
                .parseSignedClaims(token).getPayload();

        assertEquals("owner@demo.com", claims.getSubject());
        assertEquals(ISSUER, claims.getIssuer());
        assertEquals(userId.toString(), claims.get("userId", String.class));
        assertEquals(RoleType.RESTAURANT_OWNER.name(), claims.get("role", String.class));
        assertEquals("Demo Owner", claims.get("fullName", String.class));
        assertEquals(tenantId.toString(), claims.get("tenantId", String.class));
        assertEquals(branchId.toString(), claims.get("branchId", String.class));
    }

    @Test
    void generateTokenForPrincipal_shouldOmitTenantAndBranchClaimsWhenNull() {
        UserPrincipal platformAdmin = UserPrincipal.builder()
                .id(userId)
                .email("admin@platform.com")
                .fullName("Platform Admin")
                .primaryRole(RoleType.PLATFORM_ADMIN)
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_PLATFORM_ADMIN")))
                .active(true)
                .build();

        String token = tokenProvider.generateTokenForPrincipal(platformAdmin, 60000);

        Claims claims = Jwts.parser().verifyWith(secretKey()).build()
                .parseSignedClaims(token).getPayload();

        assertNull(claims.get("tenantId", String.class));
        assertNull(claims.get("branchId", String.class));
        assertNull(tokenProvider.getTenantIdFromToken(token));
        assertNull(tokenProvider.getBranchIdFromToken(token));
    }

    @Test
    void validateToken_shouldRejectExpiredToken() {
        String expired = tokenProvider.generateTokenForPrincipal(principal, -10_000);

        assertFalse(tokenProvider.validateToken(expired));
        assertThrows(ExpiredJwtException.class, () -> tokenProvider.getUsernameFromToken(expired));
    }

    @Test
    void validateToken_shouldRejectTokenSignedWithDifferentKey() {
        String foreignToken = Jwts.builder()
                .subject("attacker@evil.com")
                .signWith(Keys.hmacShaKeyFor(
                        "completely-different-secret-key-that-is-long-enough-32bytes!!".getBytes(StandardCharsets.UTF_8)))
                .compact();

        assertFalse(tokenProvider.validateToken(foreignToken));
    }

    @Test
    void validateToken_shouldRejectMalformedAndEmptyTokens() {
        assertFalse(tokenProvider.validateToken("not-a-jwt"));
        assertFalse(tokenProvider.validateToken(""));
        assertFalse(tokenProvider.validateToken("a.b.c"));
    }

    private SecretKey secretKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }
}
