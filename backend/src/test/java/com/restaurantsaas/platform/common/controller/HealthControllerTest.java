package com.restaurantsaas.platform.common.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testHealthEndpointReturnsSuccess() throws Exception {
        mockMvc.perform(get("/health")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"));
    }

    @Test
    void testTenantHeaderInjection() throws Exception {
        UUID tenantId = UUID.randomUUID();
        UUID branchId = UUID.randomUUID();

        mockMvc.perform(get("/health")
                        .header("X-Tenant-ID", tenantId.toString())
                        .header("X-Branch-ID", branchId.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.activeTenantId").value(tenantId.toString()))
                .andExpect(jsonPath("$.data.activeBranchId").value(branchId.toString()))
                .andExpect(header().string("X-Tenant-ID", tenantId.toString()))
                .andExpect(header().string("X-Branch-ID", branchId.toString()));
    }
}
