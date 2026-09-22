package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.BadRequestException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.InventoryItem;
import com.restaurantsaas.platform.dto.inventory.AdjustStockRequest;
import com.restaurantsaas.platform.dto.inventory.CreateInventoryItemRequest;
import com.restaurantsaas.platform.dto.inventory.InventoryItemDto;
import com.restaurantsaas.platform.dto.inventory.UpdateInventoryItemRequest;
import com.restaurantsaas.platform.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryItemRepository inventoryItemRepository;

    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItems(UUID tenantId, UUID branchId) {
        List<InventoryItem> items = (branchId != null)
                ? inventoryItemRepository.findAllByTenantIdAndBranchIdOrderByCreatedAtDesc(tenantId, branchId)
                : inventoryItemRepository.findAllByTenantIdOrderByCreatedAtDesc(tenantId);

        return items.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryItemDto> getLowStockItems(UUID tenantId) {
        return inventoryItemRepository.findLowStockItemsByTenantId(tenantId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InventoryItemDto getItemById(UUID tenantId, UUID id) {
        InventoryItem item = inventoryItemRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "id", id));
        return mapToDto(item);
    }

    @Transactional
    public InventoryItemDto createItem(UUID tenantId, UUID branchId, CreateInventoryItemRequest request) {
        UUID effectiveBranchId = request.getBranchId() != null ? request.getBranchId() : branchId;

        InventoryItem item = InventoryItem.builder()
                .tenantId(tenantId)
                .branchId(effectiveBranchId)
                .name(request.getName().trim())
                .unit(request.getUnit().trim().toLowerCase())
                .currentStock(request.getCurrentStock() != null ? request.getCurrentStock() : BigDecimal.ZERO)
                .minThreshold(request.getMinThreshold() != null ? request.getMinThreshold() : new BigDecimal("5.000"))
                .costPerUnit(request.getCostPerUnit())
                .build();

        item = inventoryItemRepository.save(item);
        log.info("Created inventory item: {} (ID: {}) for tenant: {}", item.getName(), item.getId(), tenantId);
        return mapToDto(item);
    }

    @Transactional
    public InventoryItemDto updateItem(UUID tenantId, UUID id, UpdateInventoryItemRequest request) {
        InventoryItem item = inventoryItemRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "id", id));

        item.setName(request.getName().trim());
        item.setUnit(request.getUnit().trim().toLowerCase());
        item.setMinThreshold(request.getMinThreshold());
        item.setCostPerUnit(request.getCostPerUnit());

        item = inventoryItemRepository.save(item);
        log.info("Updated inventory item: {} (ID: {})", item.getName(), item.getId());
        return mapToDto(item);
    }

    @Transactional
    public InventoryItemDto adjustStock(UUID tenantId, UUID id, AdjustStockRequest request) {
        InventoryItem item = inventoryItemRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "id", id));

        BigDecimal current = item.getCurrentStock() != null ? item.getCurrentStock() : BigDecimal.ZERO;
        BigDecimal delta = request.getQuantity();

        BigDecimal newStock;
        String type = request.getType() != null ? request.getType().toUpperCase() : "RESTOCK";

        switch (type) {
            case "RESTOCK":
                newStock = current.add(delta.abs());
                break;
            case "WASTE":
            case "DEDUCT":
                newStock = current.subtract(delta.abs());
                if (newStock.compareTo(BigDecimal.ZERO) < 0) {
                    newStock = BigDecimal.ZERO;
                }
                break;
            case "ADJUST_ABSOLUTE":
            case "SET":
                if (delta.compareTo(BigDecimal.ZERO) < 0) {
                    throw new BadRequestException("Stock quantity cannot be negative");
                }
                newStock = delta;
                break;
            default:
                throw new BadRequestException("Invalid adjustment type: " + type + ". Supported: RESTOCK, WASTE, DEDUCT, SET");
        }

        item.setCurrentStock(newStock);
        item = inventoryItemRepository.save(item);
        log.info("Adjusted stock for item {} (ID: {}): {} -> {} (Type: {}, Reason: {})",
                item.getName(), item.getId(), current, newStock, type, request.getReason());

        return mapToDto(item);
    }

    @Transactional
    public void deleteItem(UUID tenantId, UUID id) {
        InventoryItem item = inventoryItemRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "id", id));
        inventoryItemRepository.delete(item);
        log.info("Deleted inventory item: {} (ID: {})", item.getName(), id);
    }

    private InventoryItemDto mapToDto(InventoryItem item) {
        boolean isLow = item.getCurrentStock() != null
                && item.getMinThreshold() != null
                && item.getCurrentStock().compareTo(item.getMinThreshold()) <= 0;

        return InventoryItemDto.builder()
                .id(item.getId())
                .tenantId(item.getTenantId())
                .branchId(item.getBranchId())
                .name(item.getName())
                .unit(item.getUnit())
                .currentStock(item.getCurrentStock())
                .minThreshold(item.getMinThreshold())
                .costPerUnit(item.getCostPerUnit())
                .isLowStock(isLow)
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
