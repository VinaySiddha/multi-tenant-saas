package com.restaurantsaas.platform.common.dto;

import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Sort;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for common response wrapper DTOs.
 */
class ApiResponseTest {

    @Test
    void successStaticFactory_shouldWrapDataWithSuccessFlag() {
        ApiResponse<String> response = ApiResponse.success("payload");

        assertTrue(response.isSuccess());
        assertEquals("payload", response.getData());
        assertEquals("Operation completed successfully", response.getMessage());
        assertNotNull(response.getTimestamp());
    }

    @Test
    void successWithCustomMessage_shouldKeepDataAndMessage() {
        ApiResponse<Integer> response = ApiResponse.success(7, "Created");

        assertTrue(response.isSuccess());
        assertEquals(7, response.getData());
        assertEquals("Created", response.getMessage());
    }

    @Test
    void errorStaticFactory_shouldFlagFailureWithoutData() {
        ApiResponse<Object> response = ApiResponse.error("Something broke");

        assertFalse(response.isSuccess());
        assertEquals("Something broke", response.getMessage());
        assertNull(response.getData());
    }

    @Test
    void pageResponse_from_shouldMapAllPageMetadata() {
        Page<String> page = new PageImpl<>(
                List.of("a", "b", "c"),
                PageRequest.of(1, 3, Sort.by("name")),
                10L);

        PageResponse<String> response = PageResponse.from(page);

        assertEquals(List.of("a", "b", "c"), response.getContent());
        assertEquals(1, response.getPageNumber());
        assertEquals(3, response.getPageSize());
        assertEquals(10L, response.getTotalElements());
        assertEquals(4, response.getTotalPages());
        assertFalse(response.isFirst());
        assertFalse(response.isLast());
        assertTrue(response.isHasNext());
        assertTrue(response.isHasPrevious());
    }

    @Test
    void pageResponse_from_lastPage_shouldReportCorrectFlags() {
        Page<String> page = new PageImpl<>(List.of("z"), PageRequest.of(0, 10), 1L);

        PageResponse<String> response = PageResponse.from(page);

        assertTrue(response.isFirst());
        assertTrue(response.isLast());
        assertFalse(response.isHasNext());
        assertFalse(response.isHasPrevious());
    }
}
