package com.restaurantsaas.platform.common.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests verifying each domain exception carries the correct HTTP status
 * and message formatting contract used by the GlobalExceptionHandler.
 */
class ApiExceptionStatusTest {

    @Test
    void badRequest_shouldCarryHttpStatus400() {
        BadRequestException ex = new BadRequestException("invalid input");

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
        assertEquals("invalid input", ex.getMessage());
        assertInstanceOf(RuntimeException.class, ex);
    }

    @Test
    void unauthorized_shouldCarryHttpStatus401() {
        UnauthorizedException ex = new UnauthorizedException("nope");

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatus());
    }

    @Test
    void forbidden_shouldCarryHttpStatus403() {
        ForbiddenException ex = new ForbiddenException("denied");

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatus());
    }

    @Test
    void notFound_simpleMessage_shouldCarryHttpStatus404() {
        ResourceNotFoundException ex = new ResourceNotFoundException("gone");

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatus());
        assertEquals("gone", ex.getMessage());
    }

    @Test
    void notFound_typedConstructor_shouldFormatResourceFieldAndValue() {
        UUID id = UUID.fromString("00000000-0000-0000-0000-000000000001");

        ResourceNotFoundException ex = new ResourceNotFoundException("Order", "id", id);

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatus());
        assertEquals("Order not found with id: '" + id + "'", ex.getMessage());
    }

    @Test
    void conflict_shouldCarryHttpStatus409() {
        ConflictException ex = new ConflictException("duplicate");

        assertEquals(HttpStatus.CONFLICT, ex.getStatus());
    }

    @Test
    void tenantNotFound_shouldCarryBadRequestStatus() {
        TenantNotFoundException ex = new TenantNotFoundException("tenant missing");

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
        assertEquals("tenant missing", ex.getMessage());
    }

    @Test
    void tenantNotFound_missingHeaderFactory_shouldUseStandardMessage() {
        TenantNotFoundException ex = TenantNotFoundException.missingHeader();

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
        assertEquals("Missing required 'X-Tenant-ID' header in request", ex.getMessage());
    }
}
