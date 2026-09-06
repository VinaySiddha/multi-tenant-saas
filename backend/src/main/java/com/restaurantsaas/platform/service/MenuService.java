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
import com.restaurantsaas.platform.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getCategories(UUID tenantId) {
        return categoryRepository.findAllByTenantIdAndIsActiveTrueOrderByDisplayOrderAsc(tenantId).stream()
                .map(this::mapCategoryToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto createCategory(UUID tenantId, CreateCategoryRequest request) {
        Category category = Category.builder()
                .tenantId(tenantId)
                .name(request.getName())
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder())
                .imageUrl(request.getImageUrl())
                .isActive(true)
                .build();

        category = categoryRepository.save(category);
        return mapCategoryToDto(category);
    }

    @Transactional(readOnly = true)
    public List<MenuItemDto> getMenuItems(UUID tenantId, UUID categoryId) {
        List<MenuItem> items = categoryId != null
                ? menuItemRepository.findAllByTenantIdAndCategoryId(tenantId, categoryId)
                : menuItemRepository.findAllByTenantIdAndIsAvailableTrue(tenantId);

        return items.stream()
                .map(this::mapMenuItemToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MenuItemDto createMenuItem(UUID tenantId, CreateMenuItemRequest request) {
        Category category = categoryRepository.findByIdAndTenantId(request.getCategoryId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        MenuItem item = MenuItem.builder()
                .tenantId(tenantId)
                .categoryId(category.getId())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .costPrice(request.getCostPrice())
                .taxRate(request.getTaxRate())
                .isVeg(request.isVeg())
                .isAvailable(request.isAvailable())
                .imageUrl(request.getImageUrl())
                .preparationTimeMinutes(request.getPreparationTimeMinutes())
                .build();

        item = menuItemRepository.save(item);
        MenuItemDto dto = mapMenuItemToDto(item);
        dto.setCategoryName(category.getName());
        return dto;
    }

    private CategoryDto mapCategoryToDto(Category c) {
        return CategoryDto.builder()
                .id(c.getId())
                .tenantId(c.getTenantId())
                .name(c.getName())
                .description(c.getDescription())
                .displayOrder(c.getDisplayOrder())
                .imageUrl(c.getImageUrl())
                .isActive(c.isActive())
                .build();
    }

    private MenuItemDto mapMenuItemToDto(MenuItem m) {
        return MenuItemDto.builder()
                .id(m.getId())
                .tenantId(m.getTenantId())
                .categoryId(m.getCategoryId())
                .categoryName(m.getCategory() != null ? m.getCategory().getName() : null)
                .name(m.getName())
                .description(m.getDescription())
                .price(m.getPrice())
                .costPrice(m.getCostPrice())
                .taxRate(m.getTaxRate())
                .isVeg(m.isVeg())
                .isAvailable(m.isAvailable())
                .imageUrl(m.getImageUrl())
                .preparationTimeMinutes(m.getPreparationTimeMinutes())
                .build();
    }
}
