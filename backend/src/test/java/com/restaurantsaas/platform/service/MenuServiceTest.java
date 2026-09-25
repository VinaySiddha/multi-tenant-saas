package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.Category;
import com.restaurantsaas.platform.domain.entity.MenuItem;
import com.restaurantsaas.platform.dto.menu.CategoryDto;
import com.restaurantsaas.platform.dto.menu.CreateCategoryRequest;
import com.restaurantsaas.platform.dto.menu.CreateMenuItemRequest;
import com.restaurantsaas.platform.dto.menu.MenuItemDto;
import com.restaurantsaas.platform.repository.CategoryRepository;
import com.restaurantsaas.platform.repository.MenuItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Mockito unit tests for {@link MenuService}.
 */
@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private MenuItemRepository menuItemRepository;

    @InjectMocks
    private MenuService menuService;

    private UUID tenantId;
    private UUID categoryId;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        categoryId = UUID.randomUUID();
        lenient().when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> inv.getArgument(0));
        lenient().when(menuItemRepository.save(any(MenuItem.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    private Category category(String name) {
        Category c = Category.builder().name(name).displayOrder(1).isActive(true).build();
        c.setId(categoryId);
        c.setTenantId(tenantId);
        return c;
    }

    @Test
    void createCategory_shouldPersistTenantScopedActiveCategory() {
        CreateCategoryRequest req = new CreateCategoryRequest();
        req.setName("Starters");
        req.setDescription("Small plates");
        req.setDisplayOrder(3);

        CategoryDto dto = menuService.createCategory(tenantId, req);

        ArgumentCaptor<Category> captor = ArgumentCaptor.forClass(Category.class);
        verify(categoryRepository).save(captor.capture());
        Category saved = captor.getValue();

        assertEquals(tenantId, saved.getTenantId());
        assertEquals("Starters", saved.getName());
        assertEquals(3, saved.getDisplayOrder());
        assertTrue(saved.isActive());
        assertEquals("Starters", dto.getName());
    }

    @Test
    void getCategories_shouldReturnOrderedActiveCategories() {
        when(categoryRepository.findAllByTenantIdAndIsActiveTrueOrderByDisplayOrderAsc(tenantId))
                .thenReturn(List.of(category("Starters"), category("Mains")));

        List<CategoryDto> dtos = menuService.getCategories(tenantId);

        assertEquals(2, dtos.size());
        assertEquals("Starters", dtos.get(0).getName());
        assertEquals("Mains", dtos.get(1).getName());
    }

    @Test
    void getMenuItems_withoutCategoryId_shouldReturnAvailableItemsOnly() {
        MenuItem item = MenuItem.builder()
                .categoryId(categoryId).name("Soup").price(new BigDecimal("90.00")).isAvailable(true).build();
        item.setId(UUID.randomUUID());
        item.setTenantId(tenantId);

        when(menuItemRepository.findAllByTenantIdAndIsAvailableTrue(tenantId)).thenReturn(List.of(item));

        List<MenuItemDto> dtos = menuService.getMenuItems(tenantId, null);

        assertEquals(1, dtos.size());
        assertEquals("Soup", dtos.get(0).getName());
        verify(menuItemRepository, never()).findAllByTenantIdAndCategoryId(any(), any());
    }

    @Test
    void getMenuItems_withCategoryId_shouldFilterByCategory() {
        when(menuItemRepository.findAllByTenantIdAndCategoryId(tenantId, categoryId)).thenReturn(List.of());

        List<MenuItemDto> dtos = menuService.getMenuItems(tenantId, categoryId);

        assertTrue(dtos.isEmpty());
        verify(menuItemRepository, never()).findAllByTenantIdAndIsAvailableTrue(any());
    }

    @Test
    void createMenuItem_shouldValidateCategoryBelongsToTenant() {
        CreateMenuItemRequest req = new CreateMenuItemRequest();
        req.setCategoryId(categoryId);
        req.setName("Butter Chicken");
        req.setPrice(new BigDecimal("350.00"));
        req.setTaxRate(new BigDecimal("5.00"));

        // Category exists but belongs to another tenant -> empty lookup
        when(categoryRepository.findByIdAndTenantId(categoryId, tenantId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> menuService.createMenuItem(tenantId, req));
        verify(menuItemRepository, never()).save(any());
    }

    @Test
    void createMenuItem_shouldPersistItemAndAttachCategoryName() {
        CreateMenuItemRequest req = new CreateMenuItemRequest();
        req.setCategoryId(categoryId);
        req.setName("Butter Chicken");
        req.setDescription("Creamy tomato gravy");
        req.setPrice(new BigDecimal("350.00"));
        req.setCostPrice(new BigDecimal("180.00"));
        req.setTaxRate(new BigDecimal("5.00"));
        req.setPreparationTimeMinutes(25);

        when(categoryRepository.findByIdAndTenantId(categoryId, tenantId))
                .thenReturn(Optional.of(category("Mains")));

        MenuItemDto dto = menuService.createMenuItem(tenantId, req);

        ArgumentCaptor<MenuItem> captor = ArgumentCaptor.forClass(MenuItem.class);
        verify(menuItemRepository).save(captor.capture());
        MenuItem saved = captor.getValue();

        assertEquals(tenantId, saved.getTenantId());
        assertEquals(categoryId, saved.getCategoryId());
        assertEquals("Butter Chicken", saved.getName());
        assertEquals(0, saved.getPrice().compareTo(new BigDecimal("350.00")));
        assertEquals(25, saved.getPreparationTimeMinutes());

        assertEquals("Mains", dto.getCategoryName(), "DTO must carry denormalized category name");
    }
}
