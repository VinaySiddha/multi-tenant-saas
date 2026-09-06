package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.ConflictException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.DiningTable;
import com.restaurantsaas.platform.domain.enums.TableStatus;
import com.restaurantsaas.platform.dto.table.CreateTableRequest;
import com.restaurantsaas.platform.dto.table.DiningTableDto;
import com.restaurantsaas.platform.repository.DiningTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
                .tableNumber(request.getTableNumber())
                .section(request.getSection())
                .capacity(request.getCapacity())
                .status(TableStatus.AVAILABLE)
                .qrCodeToken("qr-" + UUID.randomUUID().toString().substring(0, 8))
                .isActive(true)
                .build();

        table = tableRepository.save(table);
        return mapToDto(table);
    }

    @Transactional
    public DiningTableDto updateTableStatus(UUID tenantId, UUID tableId, TableStatus newStatus) {
        DiningTable table = tableRepository.findByIdAndTenantId(tableId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("DiningTable", "id", tableId));

        table.setStatus(newStatus);
        table = tableRepository.save(table);
        return mapToDto(table);
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
