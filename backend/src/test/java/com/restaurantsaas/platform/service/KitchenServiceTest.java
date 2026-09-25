package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.KitchenTicket;
import com.restaurantsaas.platform.domain.entity.Order;
import com.restaurantsaas.platform.domain.enums.KotStatus;
import com.restaurantsaas.platform.domain.enums.OrderStatus;
import com.restaurantsaas.platform.dto.kitchen.KitchenTicketDto;
import com.restaurantsaas.platform.repository.KitchenTicketRepository;
import com.restaurantsaas.platform.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Mockito unit tests for {@link KitchenService}: KOT lifecycle transitions and
 * order-status synchronization.
 */
@ExtendWith(MockitoExtension.class)
class KitchenServiceTest {

    @Mock
    private KitchenTicketRepository kitchenTicketRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private KitchenService kitchenService;

    private UUID tenantId;
    private UUID branchId;
    private UUID orderId;
    private UUID ticketId;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        branchId = UUID.randomUUID();
        orderId = UUID.randomUUID();
        ticketId = UUID.randomUUID();
        lenient().when(kitchenTicketRepository.save(any(KitchenTicket.class)))
                .thenAnswer(inv -> inv.getArgument(0));
    }

    private KitchenTicket pendingTicket() {
        KitchenTicket ticket = KitchenTicket.builder()
                .kotNumber("KOT-01")
                .orderId(orderId)
                .tableNumber("T-4")
                .orderType("DINE_IN")
                .status(KotStatus.PENDING)
                .itemsSummary("2x Butter Chicken; ")
                .build();
        ticket.setId(ticketId);
        ticket.setTenantId(tenantId);
        ticket.setBranchId(branchId);
        ticket.setCreatedAt(Instant.now().minus(20, ChronoUnit.MINUTES));
        return ticket;
    }

    @Test
    void getActiveTickets_shouldReturnMappedPendingTickets() {
        when(kitchenTicketRepository.findAllByTenantIdAndBranchIdAndStatusInOrderByCreatedAtAsc(
                eq(tenantId), eq(branchId), argThat(list -> list.containsAll(
                        List.of(KotStatus.PENDING, KotStatus.IN_PROGRESS, KotStatus.READY)))))
                .thenReturn(List.of(pendingTicket()));

        List<KitchenTicketDto> tickets = kitchenService.getActiveTickets(tenantId, branchId);

        assertEquals(1, tickets.size());
        assertEquals("KOT-01", tickets.get(0).getKotNumber());
        assertTrue(tickets.get(0).getElapsedMinutes() >= 20,
                "Elapsed minutes should reflect ticket age (~20 min)");
    }

    @Test
    void updateTicketStatus_toInProgress_shouldStampStartedAtAndMovePlacedOrderToKitchen() {
        KitchenTicket ticket = pendingTicket();
        Order order = Order.builder().orderNumber("ORD-1").status(OrderStatus.PLACED).build();
        order.setId(orderId);
        order.setTenantId(tenantId);

        when(kitchenTicketRepository.findByIdAndTenantId(ticketId, tenantId)).thenReturn(Optional.of(ticket));
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        KitchenTicketDto dto = kitchenService.updateTicketStatus(tenantId, ticketId, KotStatus.IN_PROGRESS);

        assertNotNull(ticket.getStartedAt());
        assertNull(ticket.getCompletedAt());
        assertEquals(KotStatus.IN_PROGRESS, dto.getStatus());
        assertEquals(OrderStatus.IN_KITCHEN, order.getStatus());
        verify(orderRepository).save(order);
        verify(notificationService).sendKotUpdatedEvent(eq(tenantId), eq(branchId), any(KitchenTicketDto.class));
        verify(notificationService, never()).sendOrderReadyEvent(any(), any(), any());
    }

    @Test
    void updateTicketStatus_toInProgress_shouldNotDowngradeAlreadyAdvancedOrder() {
        KitchenTicket ticket = pendingTicket();
        Order order = Order.builder().orderNumber("ORD-1").status(OrderStatus.CONFIRMED).build();
        order.setId(orderId);

        when(kitchenTicketRepository.findByIdAndTenantId(ticketId, tenantId)).thenReturn(Optional.of(ticket));
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        kitchenService.updateTicketStatus(tenantId, ticketId, KotStatus.IN_PROGRESS);

        assertEquals(OrderStatus.CONFIRMED, order.getStatus(),
                "Only PLACED orders should transition to IN_KITCHEN");
        verify(orderRepository, never()).save(any());
    }

    @Test
    void updateTicketStatus_toReady_shouldCompleteTicketBroadcastAndMarkOrderReady() {
        KitchenTicket ticket = pendingTicket();
        Order order = Order.builder().orderNumber("ORD-1").status(OrderStatus.IN_KITCHEN).build();
        order.setId(orderId);

        when(kitchenTicketRepository.findByIdAndTenantId(ticketId, tenantId)).thenReturn(Optional.of(ticket));
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        KitchenTicketDto dto = kitchenService.updateTicketStatus(tenantId, ticketId, KotStatus.READY);

        assertNotNull(ticket.getCompletedAt());
        assertEquals(KotStatus.READY, dto.getStatus());
        assertEquals(OrderStatus.READY, order.getStatus());
        verify(notificationService).sendOrderReadyEvent(eq(tenantId), eq(branchId), eq(order));
        verify(notificationService).sendKotUpdatedEvent(eq(tenantId), eq(branchId), any(KitchenTicketDto.class));
    }

    @Test
    void updateTicketStatus_shouldThrowWhenTicketNotInTenantScope() {
        when(kitchenTicketRepository.findByIdAndTenantId(ticketId, tenantId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> kitchenService.updateTicketStatus(tenantId, ticketId, KotStatus.READY));
        verify(kitchenTicketRepository, never()).save(any());
    }
}
