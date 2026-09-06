package com.restaurantsaas.platform;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurantsaas.platform.domain.entity.Restaurant;
import com.restaurantsaas.platform.domain.entity.Role;
import com.restaurantsaas.platform.domain.entity.User;
import com.restaurantsaas.platform.domain.enums.RoleType;
import com.restaurantsaas.platform.dto.auth.LoginRequest;
import com.restaurantsaas.platform.dto.auth.RegisterRestaurantRequest;
import com.restaurantsaas.platform.dto.menu.CreateCategoryRequest;
import com.restaurantsaas.platform.dto.menu.CreateMenuItemRequest;
import com.restaurantsaas.platform.dto.order.CreateOrderRequest;
import com.restaurantsaas.platform.dto.order.OrderItemRequest;
import com.restaurantsaas.platform.dto.payment.PaymentRequest;
import com.restaurantsaas.platform.dto.table.CreateTableRequest;
import com.restaurantsaas.platform.repository.RoleRepository;
import com.restaurantsaas.platform.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MvpIntegrationFlowTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        if (roleRepository.findByName(RoleType.RESTAURANT_OWNER).isEmpty()) {
            roleRepository.save(Role.builder()
                    .name(RoleType.RESTAURANT_OWNER)
                    .description("Owner")
                    .build());
        }
    }

    @Test
    void testCompleteRestaurantOnboardingAndPosBillingFlow() throws Exception {
        // 1. Register a new Restaurant Tenant
        RegisterRestaurantRequest regReq = new RegisterRestaurantRequest();
        regReq.setRestaurantName("Gourmet Express");
        regReq.setSlug("gourmet-express-" + System.currentTimeMillis());
        regReq.setOwnerName("Gordon Ramsay");
        regReq.setEmail("gordon" + System.currentTimeMillis() + "@gourmet.com");
        regReq.setPassword("Password@123");
        regReq.setBranchName("Central Outlet");
        regReq.setBranchCode("CEN-01");

        MvcResult regResult = mockMvc.perform(post("/auth/register-restaurant")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andReturn();

        String regJson = regResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(regJson).path("data").path("accessToken").asText();
        String tenantId = objectMapper.readTree(regJson).path("data").path("restaurant").path("id").asText();
        String branchId = objectMapper.readTree(regJson).path("data").path("branch").path("id").asText();

        // 2. Create Category
        CreateCategoryRequest catReq = new CreateCategoryRequest();
        catReq.setName("Artisan Burgers");
        catReq.setDescription("Handcrafted gourmet burgers");
        catReq.setDisplayOrder(1);

        MvcResult catResult = mockMvc.perform(post("/menu/categories")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Tenant-ID", tenantId)
                        .header("X-Branch-ID", branchId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(catReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Artisan Burgers"))
                .andReturn();

        String categoryId = objectMapper.readTree(catResult.getResponse().getContentAsString())
                .path("data").path("id").asText();

        // 3. Create Menu Item
        CreateMenuItemRequest itemReq = new CreateMenuItemRequest();
        itemReq.setCategoryId(UUID.fromString(categoryId));
        itemReq.setName("Truffle Mushroom Burger");
        itemReq.setPrice(new BigDecimal("350.00"));
        itemReq.setTaxRate(new BigDecimal("5.00"));
        itemReq.setVeg(true);

        MvcResult itemResult = mockMvc.perform(post("/menu/items")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Tenant-ID", tenantId)
                        .header("X-Branch-ID", branchId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(itemReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Truffle Mushroom Burger"))
                .andReturn();

        String menuItemId = objectMapper.readTree(itemResult.getResponse().getContentAsString())
                .path("data").path("id").asText();

        // 4. Create Dining Table
        CreateTableRequest tableReq = new CreateTableRequest();
        tableReq.setTableNumber("T-10");
        tableReq.setSection("Terrace");
        tableReq.setCapacity(4);

        MvcResult tableResult = mockMvc.perform(post("/tables")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Tenant-ID", tenantId)
                        .header("X-Branch-ID", branchId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tableReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.tableNumber").value("T-10"))
                .andReturn();

        String tableId = objectMapper.readTree(tableResult.getResponse().getContentAsString())
                .path("data").path("id").asText();

        // 5. Place POS Order (Dine-In)
        CreateOrderRequest orderReq = new CreateOrderRequest();
        orderReq.setTableId(UUID.fromString(tableId));
        orderReq.setCustomerName("John Doe");
        orderReq.setNotes("Extra crispy fries");

        OrderItemRequest orderItemReq = new OrderItemRequest();
        orderItemReq.setMenuItemId(UUID.fromString(menuItemId));
        orderItemReq.setQuantity(2);
        orderReq.setItems(List.of(orderItemReq));

        MvcResult orderResult = mockMvc.perform(post("/orders")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Tenant-ID", tenantId)
                        .header("X-Branch-ID", branchId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.orderNumber").isNotEmpty())
                .andExpect(jsonPath("$.data.status").value("PLACED"))
                .andExpect(jsonPath("$.data.grandTotal").value(735.00)) // 350*2 + 5% GST = 700 + 35 = 735
                .andReturn();

        String orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString())
                .path("data").path("id").asText();

        // 6. Check Kitchen Display Tickets
        MvcResult kdsResult = mockMvc.perform(get("/kitchen/tickets")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Tenant-ID", tenantId)
                        .header("X-Branch-ID", branchId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andReturn();

        // 7. Settle Bill & Complete Order
        PaymentRequest payReq = new PaymentRequest();
        payReq.setOrderId(UUID.fromString(orderId));
        payReq.setAmount(new BigDecimal("735.00"));
        payReq.setPaymentMethod(com.restaurantsaas.platform.domain.enums.PaymentMethod.UPI);
        payReq.setTransactionReference("UPI-TXN-98214");

        mockMvc.perform(post("/payments/settle")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Tenant-ID", tenantId)
                        .header("X-Branch-ID", branchId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value("PAID"));

        // 8. Verify Analytics
        mockMvc.perform(get("/analytics/summary")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Tenant-ID", tenantId)
                        .header("X-Branch-ID", branchId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.todayRevenue").value(735.00));
    }
}
