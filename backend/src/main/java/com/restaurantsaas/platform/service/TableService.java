package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.ConflictException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.DiningTable;
import com.restaurantsaas.platform.domain.enums.TableStatus;
import com.restaurantsaas.platform.dto.table.CreateTableRequest;
import com.restaurantsaas.platform.dto.table.DiningTableDto;
import com.restaurantsaas.platform.dto.table.UpdateTableRequest;
import com.restaurantsaas.platform.repository.DiningTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TableService {

    private final DiningTableRepository tableRepository;

    @Transactional(readOnly = true)
    public List<DiningTableDto> getTables(UUID tenantId, UUID branchId) {
        return tableRepository.findAllByTenantIdAndBranchIdAndIsActiveTrue(tenantId, branchId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DiningTableDto getTableById(UUID tenantId, UUID tableId) {
        DiningTable table = tableRepository.findByIdAndTenantId(tableId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("DiningTable", "id", tableId));
        return mapToDto(table);
    }

    @Transactional(readOnly = true)
    public DiningTableDto getTableByQrToken(String qrToken) {
        DiningTable table = tableRepository.findByQrCodeToken(qrToken)
                .orElseThrow(() -> new ResourceNotFoundException("DiningTable", "qrToken", qrToken));
        return mapToDto(table);
    }

    @Transactional
    public DiningTableDto createTable(UUID tenantId, UUID branchId, CreateTableRequest request) {
        if (tableRepository.findByTenantIdAndBranchIdAndTableNumber(tenantId, branchId, request.getTableNumber()).isPresent()) {
            throw new ConflictException("Table number already exists: " + request.getTableNumber());
        }

        DiningTable table = DiningTable.builder()
                .tenantId(tenantId)
                .branchId(branchId)
                .tableNumber(request.getTableNumber().trim())
                .section(request.getSection().trim())
                .capacity(request.getCapacity())
                .status(TableStatus.AVAILABLE)
                .qrCodeToken("qr-" + UUID.randomUUID().toString().substring(0, 8))
                .isActive(true)
                .build();

        table = tableRepository.save(table);
        log.info("Created table {} in section {} for branch {}", table.getTableNumber(), table.getSection(), branchId);
        return mapToDto(table);
    }

    @Transactional
    public DiningTableDto updateTable(UUID tenantId, UUID tableId, UpdateTableRequest request) {
        DiningTable table = tableRepository.findByIdAndTenantId(tableId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("DiningTable", "id", tableId));

        // Check if table number changed and if it already exists
        if (!table.getTableNumber().equalsIgnoreCase(request.getTableNumber())) {
            Optional<DiningTable> existing = tableRepository.findByTenantIdAndBranchIdAndTableNumber(tenantId, table.getBranchId(), request.getTableNumber());
            if (existing.isPresent() && !existing.get().getId().equals(tableId)) {
                throw new ConflictException("Table number already exists: " + request.getTableNumber());
            }
        }

        table.setTableNumber(request.getTableNumber().trim());
        table.setSection(request.getSection().trim());
        table.setCapacity(request.getCapacity());
        if (request.getStatus() != null) {
            table.setStatus(request.getStatus());
        }

        table = tableRepository.save(table);
        log.info("Updated table: {} (ID: {})", table.getTableNumber(), table.getId());
        return mapToDto(table);
    }

    @Transactional
    public DiningTableDto updateTableStatus(UUID tenantId, UUID tableId, TableStatus newStatus) {
        DiningTable table = tableRepository.findByIdAndTenantId(tableId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("DiningTable", "id", tableId));

        table.setStatus(newStatus);
        table = tableRepository.save(table);
        log.info("Updated status of table {} to {}", table.getTableNumber(), newStatus);
        return mapToDto(table);
    }

    @Transactional
    public DiningTableDto regenerateQrCode(UUID tenantId, UUID tableId) {
        DiningTable table = tableRepository.findByIdAndTenantId(tableId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("DiningTable", "id", tableId));

        table.setQrCodeToken("qr-" + UUID.randomUUID().toString().substring(0, 8));
        table = tableRepository.save(table);
        log.info("Regenerated QR code for table {}: {}", table.getTableNumber(), table.getQrCodeToken());
        return mapToDto(table);
    }

    @Transactional
    public void deleteTable(UUID tenantId, UUID tableId) {
        DiningTable table = tableRepository.findByIdAndTenantId(tableId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("DiningTable", "id", tableId));

        table.setActive(false);
        tableRepository.save(table);
        log.info("Deactivated table: {} (ID: {})", table.getTableNumber(), tableId);
    }

    private DiningTableDto mapToDto(DiningTable t) {
        return DiningTableDto.builder()
                .id(t.getId())
                .tenantId(t.getTenantId())
                .branchId(t.getBranchId())
                .tableNumber(t.getTableNumber())
                .section(t.getSection())
                .capacity(t.getCapacity())
                .status(t.getStatus())
                .qrCodeToken(t.getQrCodeToken())
                .isActive(t.isActive())
                .build();
    }
}
