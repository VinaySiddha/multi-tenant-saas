package com.restaurantsaas.platform.common.exception;

import org.springframework.http.HttpStatus;

public class TenantNotFoundException extends BaseApiException {

    public TenantNotFoundException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }

    public static TenantNotFoundException missingHeader() {
        return new TenantNotFoundException("Missing required 'X-Tenant-ID' header in request");
    }
}
