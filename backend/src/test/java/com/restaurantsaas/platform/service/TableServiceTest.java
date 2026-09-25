package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.ConflictException;
import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.DiningTable;
import com.restaurantsaas.platform.domain.enums.TableStatus;
import com.restaurantsaas.platform.dto.table.CreateTableRequest;
import com.restaurantsaas.platform.dto.table.DiningTableDto;
import com.restaurantsaas.platform.repository.DiningTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Mockito unit tests for {@link TableService}.
 */
@ExtendWith(MockitoExtension.class)
class TableServiceTest {

    @Mock
    private DiningTableRepository tableRepository;

    @InjectMocks
    private TableService tableService;

    private UUID tenantId;
    private UUID branchId;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        branchId = UUID.randomUUID();
        lenient().when(tableRepository.save(any(DiningTable.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    private DiningTable table(String number, TableStatus status) {
        DiningTable t = DiningTable.builder()
                .tableNumber(number)
                .section("Main Hall")
                .capacity(4)
                .status(status)
                .qrCodeToken("qr-" + number.toLowerCase())
                .isActive(true)
                .build();
        t.setId(UUID.randomUUID());
        t.setTenantId(tenantId);
        t.setBranchId(branchId);
        return t;
    }

    @Test
    void createTable_shouldPersistWithAvailableStatusAndQrToken() {
        CreateTableRequest req = new CreateTableRequest();
        req.setTableNumber("T-21");
        req.setSection("Rooftop");
        req.setCapacity(6);

        when(tableRepository.findByTenantIdAndBranchIdAndTableNumber(tenantId, branchId, "T-21"))
                .thenReturn(Optional.empty());

        DiningTableDto dto = tableService.createTable(tenantId, branchId, req);

        ArgumentCaptor<DiningTable> captor = ArgumentCaptor.forClass(DiningTable.class);
        verify(tableRepository).save(captor.capture());
        DiningTable saved = captor.getValue();

        assertEquals("T-21", saved.getTableNumber());
        assertEquals("Rooftop", saved.getSection());
        assertEquals(6, saved.getCapacity());
        assertEquals(TableStatus.AVAILABLE, saved.getStatus());
        assertTrue(saved.isActive());
        assertNotNull(saved.getQrCodeToken());
        assertTrue(saved.getQrCodeToken().startsWith("qr-"), "QR token must be generated with qr- prefix");

        assertEquals("T-21", dto.getTableNumber());
        assertEquals(TableStatus.AVAILABLE, dto.getStatus());
    }

    @Test
    void createTable_shouldRejectDuplicateTableNumberInBranch() {
        CreateTableRequest req = new CreateTableRequest();
        req.setTableNumber("T-1");

        when(tableRepository.findByTenantIdAndBranchIdAndTableNumber(tenantId, branchId, "T-1"))
                .thenReturn(Optional.of(table("T-1", TableStatus.AVAILABLE)));

        ConflictException ex = assertThrows(ConflictException.class,
                () -> tableService.createTable(tenantId, branchId, req));

        assertTrue(ex.getMessage().contains("T-1"));
        verify(tableRepository, never()).save(any());
    }

    @Test
    void getTables_shouldOnlyReturnActiveTablesMappedToDtos() {
        when(tableRepository.findAllByTenantIdAndBranchIdAndIsActiveTrue(tenantId, branchId))
                .thenReturn(List.of(table("T-1", TableStatus.AVAILABLE), table("T-2", TableStatus.OCCUPIED)));

        List<DiningTableDto> tables = tableService.getTables(tenantId, branchId);

        assertEquals(2, tables.size());
        assertEquals("T-1", tables.get(0).getTableNumber());
        assertEquals(TableStatus.OCCUPIED, tables.get(1).getStatus());
    }

    @Test
    void getTableById_shouldThrowWhenMissingOrCrossTenant() {
        UUID tableId = UUID.randomUUID();
        when(tableRepository.findByIdAndTenantId(tableId, tenantId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> tableService.getTableById(tenantId, tableId));
    }

    @Test
    void getTableByQrToken_shouldResolveTableForQrMenuFlow() {
        DiningTable t = table("T-5", TableStatus.AVAILABLE);
        when(tableRepository.findByQrCodeToken("qr-t-5")).thenReturn(Optional.of(t));

        DiningTableDto dto = tableService.getTableByQrToken("qr-t-5");

        assertEquals("T-5", dto.getTableNumber());
        assertEquals(t.getId(), dto.getId());
    }

    @Test
    void getTableByQrToken_shouldThrowForUnknownToken() {
        when(tableRepository.findByQrCodeToken("bogus")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> tableService.getTableByQrToken("bogus"));
    }

    @Test
    void updateTableStatus_shouldChangeStatusAndPersist() {
        DiningTable t = table("T-9", TableStatus.AVAILABLE);
        when(tableRepository.findByIdAndTenantId(t.getId(), tenantId)).thenReturn(Optional.of(t));

        DiningTableDto dto = tableService.updateTableStatus(tenantId, t.getId(), TableStatus.RESERVED);

        assertEquals(TableStatus.RESERVED, dto.getStatus());
        assertEquals(TableStatus.RESERVED, t.getStatus());
        verify(tableRepository).save(t);
    }
}
