package com.restaurantsaas.platform.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long jwtExpirationInMs;
    private final long refreshExpirationInMs;
    private final String issuer;

    public JwtTokenProvider(
            @Value("${app.jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}") String jwtSecret,
            @Value("${app.jwt.expiration-ms:86400000}") long jwtExpirationInMs,
            @Value("${app.jwt.refresh-expiration-ms:604800000}") long refreshExpirationInMs,
            @Value("${app.jwt.issuer:restaurant-saas-platform}") String issuer) {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationInMs = jwtExpirationInMs;
        this.refreshExpirationInMs = refreshExpirationInMs;
        this.issuer = issuer;
    }

    public String generateAccessToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return generateTokenForPrincipal(userPrincipal, jwtExpirationInMs);
    }

    public String generateRefreshToken(UserPrincipal userPrincipal) {
        return generateTokenForPrincipal(userPrincipal, refreshExpirationInMs);
    }

    public String generateTokenForPrincipal(UserPrincipal userPrincipal, long expiryDurationMs) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiryDurationMs);

        var builder = Jwts.builder()
                .subject(userPrincipal.getEmail())
                .issuer(issuer)
                .issuedAt(now)
                .expiration(expiryDate)
                .claim("userId", userPrincipal.getId().toString())
                .claim("role", userPrincipal.getPrimaryRole().name())
                .claim("fullName", userPrincipal.getFullName());

        if (userPrincipal.getTenantId() != null) {
            builder.claim("tenantId", userPrincipal.getTenantId().toString());
        }
        if (userPrincipal.getBranchId() != null) {
            builder.claim("branchId", userPrincipal.getBranchId().toString());
        }

        return builder.signWith(key).compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public UUID getTenantIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String tenantIdStr = claims.get("tenantId", String.class);
        return tenantIdStr != null ? UUID.fromString(tenantIdStr) : null;
    }

    public UUID getBranchIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String branchIdStr = claims.get("branchId", String.class);
        return branchIdStr != null ? UUID.fromString(branchIdStr) : null;
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(authToken);
            return true;
        } catch (SecurityException | MalformedJwtException ex) {
            log.warn("Invalid JWT signature or token format");
        } catch (ExpiredJwtException ex) {
            log.warn("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.warn("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.warn("JWT claims string is empty");
        }
        return false;
    }
}
