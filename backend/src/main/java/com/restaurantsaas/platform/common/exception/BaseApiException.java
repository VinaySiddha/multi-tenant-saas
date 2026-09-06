package com.restaurantsaas.platform.common.exception;

import org.springframework.http.HttpStatus;

public abstract class BaseApiException extends RuntimeException {

    private final HttpStatus status;

    protected BaseApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    protected BaseApiException(String message, Throwable cause, HttpStatus status) {
        super(message, cause);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
