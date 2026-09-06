package com.restaurantsaas.platform.service;

import com.restaurantsaas.platform.common.exception.ResourceNotFoundException;
import com.restaurantsaas.platform.domain.entity.KitchenTicket;
import com.restaurantsaas.platform.domain.entity.Order;
import com.restaurantsaas.platform.domain.enums.KotStatus;
import com.restaurantsaas.platform.domain.enums.OrderStatus;
import com.restaurantsaas.platform.dto.kitchen.KitchenTicketDto;
import com.restaurantsaas.platform.repository.KitchenTicketRepository;
import com.restaurantsaas.platform.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class KitchenService {

    private final KitchenTicketRepository kitchenTicketRepository;
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<KitchenTicketDto> getActiveTickets(UUID tenantId, UUID branchId) {
        List<KotStatus> activeStatuses = Arrays.asList(KotStatus.PENDING, KotStatus.IN_PROGRESS, KotStatus.READY);
        return kitchenTicketRepository.findAllByTenantIdAndBranchIdAndStatusInOrderByCreatedAtAsc(tenantId, branchId, activeStatuses)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public KitchenTicketDto updateTicketStatus(UUID tenantId, UUID ticketId, KotStatus newStatus) {
        KitchenTicket ticket = kitchenTicketRepository.findByIdAndTenantId(ticketId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("KitchenTicket", "id", ticketId));

        ticket.setStatus(newStatus);
        Instant now = Instant.now();

        if (newStatus == KotStatus.IN_PROGRESS && ticket.getStartedAt() == null) {
            ticket.setStartedAt(now);
            Order order = orderRepository.findById(ticket.getOrderId()).orElse(null);
            if (order != null && order.getStatus() == OrderStatus.PLACED) {
                order.setStatus(OrderStatus.IN_KITCHEN);
                orderRepository.save(order);
            }
        } else if (newStatus == KotStatus.READY) {
            ticket.setCompletedAt(now);
            Order order = orderRepository.findById(ticket.getOrderId()).orElse(null);
            if (order != null) {
                order.setStatus(OrderStatus.READY);
                orderRepository.save(order);
                notificationService.sendOrderReadyEvent(tenantId, ticket.getBranchId(), order);
            }
        }

        ticket = kitchenTicketRepository.save(ticket);
        KitchenTicketDto dto = mapToDto(ticket);

        notificationService.sendKotUpdatedEvent(tenantId, ticket.getBranchId(), dto);
        return dto;
    }

    private KitchenTicketDto mapToDto(KitchenTicket t) {
        long elapsedMinutes = 0;
        if (t.getCreatedAt() != null) {
            elapsedMinutes = Duration.between(t.getCreatedAt(), Instant.now()).toMinutes();
        }

        return KitchenTicketDto.builder()
                .id(t.getId())
                .tenantId(t.getTenantId())
                .branchId(t.getBranchId())
                .orderId(t.getOrderId())
                .kotNumber(t.getKotNumber())
                .tableNumber(t.getTableNumber())
                .orderType(t.getOrderType())
                .status(t.getStatus())
                .itemsSummary(t.getItemsSummary())
                .specialInstructions(t.getSpecialInstructions())
                .createdAt(t.getCreatedAt())
                .startedAt(t.getStartedAt())
                .completedAt(t.getCompletedAt())
                .elapsedMinutes(Math.max(0, elapsedMinutes))
                .build();
    }
}
