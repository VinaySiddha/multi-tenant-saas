package com.restaurantsaas.platform.common.exception;

import org.springframework.http.HttpStatus;

public class ConflictException extends BaseApiException {
    public ConflictException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
