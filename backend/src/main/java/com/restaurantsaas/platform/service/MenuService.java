package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.Category;
import com.restaurantsaas.platform.domain.entity.MenuItem;
import com.restaurantsaas.platform.dto.menu.CategoryDto;
import com.restaurantsaas.platform.dto.menu.CreateCategoryRequest;
import com.restaurantsaas.platform.dto.menu.CreateMenuItemRequest;
import com.restaurantsaas.platform.dto.menu.MenuItemDto;
import com.restaurantsaas.platform.dto.menu.UpdateMenuItemRequest;
import com.restaurantsaas.platform.repository.CategoryRepository;
import com.restaurantsaas.platform.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
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
                .name(request.getName().trim())
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder())
                .imageUrl(request.getImageUrl())
                .isActive(true)
                .build();

        category = categoryRepository.save(category);
        log.info("Created category: {} (ID: {})", category.getName(), category.getId());
        return mapCategoryToDto(category);
    }

    @Transactional
    public CategoryDto updateCategory(UUID tenantId, UUID categoryId, CreateCategoryRequest request) {
        Category category = categoryRepository.findByIdAndTenantId(categoryId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        category.setDisplayOrder(request.getDisplayOrder());
        category.setImageUrl(request.getImageUrl());

        category = categoryRepository.save(category);
        log.info("Updated category: {} (ID: {})", category.getName(), category.getId());
        return mapCategoryToDto(category);
    }

    @Transactional
    public void deleteCategory(UUID tenantId, UUID categoryId) {
        Category category = categoryRepository.findByIdAndTenantId(categoryId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        category.setActive(false);
        categoryRepository.save(category);
        log.info("Deactivated category: {} (ID: {})", category.getName(), categoryId);
    }

    @Transactional(readOnly = true)
    public List<MenuItemDto> getMenuItems(UUID tenantId, UUID categoryId) {
        List<MenuItem> items = categoryId != null
                ? menuItemRepository.findAllByTenantIdAndCategoryId(tenantId, categoryId)
                : menuItemRepository.findAllByTenantId(tenantId);

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
                .name(request.getName().trim())
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
        log.info("Created menu item: {} (ID: {})", item.getName(), item.getId());
        MenuItemDto dto = mapMenuItemToDto(item);
        dto.setCategoryName(category.getName());
        return dto;
    }

    @Transactional
    public MenuItemDto updateMenuItem(UUID tenantId, UUID itemId, UpdateMenuItemRequest request) {
        MenuItem item = menuItemRepository.findByIdAndTenantId(itemId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemId));

        Category category = categoryRepository.findByIdAndTenantId(request.getCategoryId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        item.setCategoryId(category.getId());
        item.setName(request.getName().trim());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCostPrice(request.getCostPrice());
        item.setTaxRate(request.getTaxRate());
        item.setVeg(request.isVeg());
        item.setAvailable(request.isAvailable());
        item.setImageUrl(request.getImageUrl());
        item.setPreparationTimeMinutes(request.getPreparationTimeMinutes());

        item = menuItemRepository.save(item);
        log.info("Updated menu item: {} (ID: {})", item.getName(), item.getId());
        MenuItemDto dto = mapMenuItemToDto(item);
        dto.setCategoryName(category.getName());
        return dto;
    }

    @Transactional
    public MenuItemDto toggleItemAvailability(UUID tenantId, UUID itemId, boolean isAvailable) {
        MenuItem item = menuItemRepository.findByIdAndTenantId(itemId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemId));

        item.setAvailable(isAvailable);
        item = menuItemRepository.save(item);
        log.info("Toggled availability for menu item {}: {}", item.getName(), isAvailable);
        return mapMenuItemToDto(item);
    }

    @Transactional
    public void deleteMenuItem(UUID tenantId, UUID itemId) {
        MenuItem item = menuItemRepository.findByIdAndTenantId(itemId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemId));
        menuItemRepository.delete(item);
        log.info("Deleted menu item: {} (ID: {})", item.getName(), itemId);
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
