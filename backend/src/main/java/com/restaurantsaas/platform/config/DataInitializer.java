package com.restaurantsaas.platform.config;

import com.restaurantsaas.platform.domain.entity.*;
import com.restaurantsaas.platform.domain.enums.*;
import com.restaurantsaas.platform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final RestaurantRepository restaurantRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final DiningTableRepository tableRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Initializing baseline platform roles and demo restaurant data...");

        // 1. Initialize Roles
        Role ownerRole = getOrCreateRole(RoleType.RESTAURANT_OWNER, "Restaurant Owner and Administrator");
        Role cashierRole = getOrCreateRole(RoleType.CASHIER, "POS Cashier and Billing Operator");
        Role chefRole = getOrCreateRole(RoleType.CHEF, "Kitchen Display System Chef");
        Role waiterRole = getOrCreateRole(RoleType.WAITER, "Table Service Captain");
        Role adminRole = getOrCreateRole(RoleType.PLATFORM_ADMIN, "Platform Super Admin");
        getOrCreateRole(RoleType.BRANCH_MANAGER, "Branch Operations Manager");

        // 2. Initialize Demo Restaurant
        Restaurant restaurant = restaurantRepository.findByEmail("owner@royalbistro.com")
                .orElseGet(() -> {
                    Restaurant r = Restaurant.builder()
                            .name("The Royal Bistro")
                            .slug("royal-bistro")
                            .email("owner@royalbistro.com")
                            .phoneNumber("+91 98765 43210")
                            .address("100 Feet Road, Indiranagar, Bengaluru, KA 560038")
                            .subscriptionPlan(SubscriptionPlan.ENTERPRISE)
                            .subscriptionStatus(SubscriptionStatus.ACTIVE)
                            .subscriptionEndsAt(Instant.now().plus(365, ChronoUnit.DAYS))
                            .isActive(true)
                            .build();
                    return restaurantRepository.save(r);
                });

        // 3. Initialize Branches
        Branch branch = branchRepository.findAllByTenantIdAndIsActiveTrue(restaurant.getId()).stream()
                .filter(b -> "IND-01".equals(b.getCode()))
                .findFirst()
                .orElseGet(() -> {
                    Branch b = Branch.builder()
                            .tenantId(restaurant.getId())
                            .name("Indiranagar Flagship")
                            .code("IND-01")
                            .address("100 Feet Road, Indiranagar")
                            .city("Bengaluru")
                            .state("Karnataka")
                            .phoneNumber("+91 98765 43210")
                            .email("indiranagar@royalbistro.com")
                            .currency("INR")
                            .isActive(true)
                            .build();
                    return branchRepository.save(b);
                });

        // 4. Initialize Users with verified password "Admin@123"
        createOrUpdateUser(
                "owner@royalbistro.com",
                "Admin@123",
                "Alex Mercer",
                "+91 98765 43210",
                RoleType.RESTAURANT_OWNER,
                ownerRole,
                restaurant.getId(),
                branch.getId()
        );

        createOrUpdateUser(
                "cashier@royalbistro.com",
                "Admin@123",
                "Rahul Verma",
                "+91 98765 43211",
                RoleType.CASHIER,
                cashierRole,
                restaurant.getId(),
                branch.getId()
        );

        createOrUpdateUser(
                "chef@royalbistro.com",
                "Admin@123",
                "Sanjay Kapoor",
                "+91 98765 43212",
                RoleType.CHEF,
                chefRole,
                restaurant.getId(),
                branch.getId()
        );

        createOrUpdateUser(
                "admin@restaurantsaas.io",
                "Admin@123",
                "System Administrator",
                "+91 98765 43200",
                RoleType.PLATFORM_ADMIN,
                adminRole,
                restaurant.getId(),
                branch.getId()
        );

        // 5. Initialize Menu Categories & Items
        if (categoryRepository.findAllByTenantIdAndIsActiveTrueOrderByDisplayOrderAsc(restaurant.getId()).isEmpty()) {
            Category mainCourse = categoryRepository.save(Category.builder()
                    .tenantId(restaurant.getId())
                    .branchId(branch.getId())
                    .name("Main Course")
                    .description("Rich curries and signature dishes")
                    .displayOrder(1)
                    .isActive(true)
                    .build());

            Category breads = categoryRepository.save(Category.builder()
                    .tenantId(restaurant.getId())
                    .branchId(branch.getId())
                    .name("Breads & Rice")
                    .description("Clay oven flatbreads and biryanis")
                    .displayOrder(2)
                    .isActive(true)
                    .build());

            Category starters = categoryRepository.save(Category.builder()
                    .tenantId(restaurant.getId())
                    .branchId(branch.getId())
                    .name("Starters & Appetizers")
                    .description("Crispy snacks and appetizers")
                    .displayOrder(3)
                    .isActive(true)
                    .build());

            Category beverages = categoryRepository.save(Category.builder()
                    .tenantId(restaurant.getId())
                    .branchId(branch.getId())
                    .name("Beverages")
                    .description("Cold drinks, lassis and mocktails")
                    .displayOrder(4)
                    .isActive(true)
                    .build());

            // Menu items
            menuItemRepository.save(MenuItem.builder()
                    .tenantId(restaurant.getId())
                    .branchId(branch.getId())
                    .categoryId(mainCourse.getId())
                    .name("Paneer Butter Masala")
                    .description("Fresh cottage cheese cubes in rich tomato butter gravy")
                    .price(new BigDecimal("340.00"))
                    .costPrice(new BigDecimal("110.00"))
                    .taxRate(new BigDecimal("5.00"))
                    .isVeg(true)
                    .isAvailable(true)
                    .preparationTimeMinutes(15)
                    .build());

            menuItemRepository.save(MenuItem.builder()
                    .tenantId(restaurant.getId())
                    .branchId(branch.getId())
                    .categoryId(mainCourse.getId())
                    .name("Butter Chicken Masala")
                    .description("Smoked chicken tikka tossed in traditional makhani gravy")
                    .price(new BigDecimal("420.00"))
                    .costPrice(new BigDecimal("150.00"))
                    .taxRate(new BigDecimal("5.00"))
                    .isVeg(false)
                    .isAvailable(true)
                    .preparationTimeMinutes(20)
                    .build());

            menuItemRepository.save(MenuItem.builder()
                    .tenantId(restaurant.getId())
                    .branchId(branch.getId())
                    .categoryId(breads.getId())
                    .name("Butter Garlic Naan")
                    .description("Soft clay-oven baked bread glazed with roasted garlic butter")
                    .price(new BigDecimal("65.00"))
                    .costPrice(new BigDecimal("15.00"))
                    .taxRate(new BigDecimal("5.00"))
                    .isVeg(true)
                    .isAvailable(true)
                    .preparationTimeMinutes(8)
                    .build());

            menuItemRepository.save(MenuItem.builder()
                    .tenantId(restaurant.getId())
                    .branchId(branch.getId())
                    .categoryId(breads.getId())
                    .name("Chicken Dum Biryani")
                    .description("Hyderabadi spiced long grain basmati rice with tender chicken")
                    .price(new BigDecimal("380.00"))
                    .costPrice(new BigDecimal("140.00"))
                    .taxRate(new BigDecimal("5.00"))
                    .isVeg(false)
                    .isAvailable(true)
                    .preparationTimeMinutes(18)
                    .build());

            menuItemRepository.save(MenuItem.builder()
                    .tenantId(restaurant.getId())
                    .branchId(branch.getId())
                    .categoryId(starters.getId())
                    .name("Crispy Corn Pepper Salt")
                    .description("Sweet corn tossed with bell peppers and crushed black pepper")
                    .price(new BigDecimal("260.00"))
                    .costPrice(new BigDecimal("60.00"))
                    .taxRate(new BigDecimal("5.00"))
                    .isVeg(true)
                    .isAvailable(true)
                    .preparationTimeMinutes(10)
                    .build());

            menuItemRepository.save(MenuItem.builder()
                    .tenantId(restaurant.getId())
                    .branchId(branch.getId())
                    .categoryId(beverages.getId())
                    .name("Mango Lassi")
                    .description("Chilled creamy yogurt blended with sweet Ratnagiri Alphonso mango pulp")
                    .price(new BigDecimal("120.00"))
                    .costPrice(new BigDecimal("35.00"))
                    .taxRate(new BigDecimal("5.00"))
                    .isVeg(true)
                    .isAvailable(true)
                    .preparationTimeMinutes(5)
                    .build());
        }

        // 6. Initialize Dining Tables
        if (tableRepository.findAllByTenantIdAndBranchIdAndIsActiveTrue(restaurant.getId(), branch.getId()).isEmpty()) {
            createTableIfNotExists(restaurant.getId(), branch.getId(), "T-01", "Ground Floor AC", 4, TableStatus.AVAILABLE);
            createTableIfNotExists(restaurant.getId(), branch.getId(), "T-02", "Ground Floor AC", 2, TableStatus.AVAILABLE);
            createTableIfNotExists(restaurant.getId(), branch.getId(), "T-03", "Rooftop Lounge", 6, TableStatus.AVAILABLE);
            createTableIfNotExists(restaurant.getId(), branch.getId(), "T-04", "Rooftop Lounge", 4, TableStatus.AVAILABLE);
        }

        log.info("Platform demo initialization complete. Login credentials: owner@royalbistro.com / Admin@123");
    }

    private Role getOrCreateRole(RoleType roleType, String desc) {
        return roleRepository.findByName(roleType)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(roleType)
                        .description(desc)
                        .build()));
    }

    private void createOrUpdateUser(String email, String rawPassword, String fullName, String phone,
                                    RoleType roleType, Role role, UUID tenantId, UUID branchId) {
        String cleanEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail).orElse(null);
        String encodedPass = passwordEncoder.encode(rawPassword);

        if (user == null) {
            user = User.builder()
                    .email(cleanEmail)
                    .passwordHash(encodedPass)
                    .fullName(fullName)
                    .phoneNumber(phone)
                    .primaryRole(roleType)
                    .roles(Collections.singleton(role))
                    .tenantId(tenantId)
                    .branchId(branchId)
                    .isActive(true)
                    .build();
            userRepository.save(user);
            log.info("Created user: {}", cleanEmail);
        } else {
            user.setPasswordHash(encodedPass);
            user.setTenantId(tenantId);
            user.setBranchId(branchId);
            user.setPrimaryRole(roleType);
            user.setRoles(Collections.singleton(role));
            user.setActive(true);
            userRepository.save(user);
            log.info("Updated and verified credentials for user: {}", cleanEmail);
        }
    }

    private void createTableIfNotExists(UUID tenantId, UUID branchId, String tableNumber, String section, int capacity, TableStatus status) {
        if (tableRepository.findByTenantIdAndBranchIdAndTableNumber(tenantId, branchId, tableNumber).isEmpty()) {
            tableRepository.save(DiningTable.builder()
                    .tenantId(tenantId)
                    .branchId(branchId)
                    .tableNumber(tableNumber)
                    .section(section)
                    .capacity(capacity)
                    .status(status)
                    .qrCodeToken("qr-" + UUID.randomUUID().toString().substring(0, 8))
                    .isActive(true)
                    .build());
        }
    }
}
