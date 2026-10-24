package com.events.eventmanagement.services;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Registration;
import com.events.eventmanagement.models.User;
import com.events.eventmanagement.repository.EventRepository;
import com.events.eventmanagement.repository.RegistrationRepository;
import com.events.eventmanagement.repository.UserRepository;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    RegistrationService(
        RegistrationRepository registrationRepository,
        EventRepository eventRepository,
        UserRepository userRepository
    ) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    // post /api/register
    // @Transactional + PESSIMISTIC_WRITE on the event row replaces the in-memory
    // compute(): lock first, then check duplicate + capacity, then insert.
    @Transactional
    public Registration register(Long userId, Long eventId) {
        Event event = eventRepository
            .findByIdForUpdate(eventId)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Event with id " + eventId + " not found."
                )
            );

        if (
            registrationRepository.existsByUserIdAndEventId(userId, eventId)
        ) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "You are already registered for this event."
            );
        }

        if (
            registrationRepository.countByEventId(eventId) >=
            event.getCapacity()
        ) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Event is full."
            );
        }

        Registration registration = new Registration();
        registration.setUserId(userId);
        registration.setEventId(eventId);
        registration.setRegisteredAt(
            LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS)
        );

        try {
            return registrationRepository.saveAndFlush(registration);
        } catch (DataIntegrityViolationException e) {
            // the unique (user_id, event_id) index is the real guard under a race
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "You are already registered for this event."
            );
        }
    }

    // delete /api/registrations/{id}
    @Transactional
    public void cancel(Long registrationId, Long callerId, boolean admin) {
        Registration registration = registrationRepository
            .findById(registrationId)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Registration with id " + registrationId + " not found."
                )
            );

        boolean ownRegistration = registration.getUserId().equals(callerId);
        boolean ownsEvent =
            admin && ownsEvent(registration.getEventId(), callerId);

        if (!ownRegistration && !ownsEvent) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                admin
                    ? "You can only cancel registrations for events you created."
                    : "You can only cancel your own registration."
            );
        }

        registrationRepository.delete(registration);
    }

    private boolean ownsEvent(Long eventId, Long callerId) {
        return eventRepository
            .findById(eventId)
            .map(event -> callerId.equals(event.getCreatedBy()))
            .orElse(false);
    }

    public long countForEvent(Long eventId) {
        return registrationRepository.countByEventId(eventId);
    }

    // one query for a whole page of events
    public Map<Long, Long> countsByEvent(Collection<Long> eventIds) {
        if (eventIds.isEmpty()) {
            return Map.of();
        }

        Map<Long, Long> counts = new HashMap<>();

        for (Object[] row : registrationRepository.countGroupedByEventId(
            eventIds
        )) {
            counts.put((Long) row[0], ((Number) row[1]).longValue());
        }

        return counts;
    }

    public Map<Long, String> userNames(Collection<Long> userIds) {
        if (userIds.isEmpty()) {
            return Map.of();
        }

        return userRepository
            .findAllById(userIds)
            .stream()
            .collect(Collectors.toMap(User::getId, User::getName));
    }

    // get /api/registrations: the scope comes from the caller's identity,
    // a student sees their own rows, an admin sees rows for events it created
    // (admins are event owners). The scope lives in the query, so totalElements
    // counts only the rows the caller may see (ADR-0003).
    public Page<Registration> list(
        Long callerId,
        boolean admin,
        Long eventId,
        Long userId,
        Pageable pageable
    ) {
        if (admin) {
            List<Long> ownedEventIds = eventRepository.findIdsByCreatedBy(
                callerId
            );

            if (ownedEventIds.isEmpty()) {
                return Page.empty(pageable);
            }

            // ?eventId= narrows inside the owned set, never widens it
            if (eventId != null) {
                if (!ownedEventIds.contains(eventId)) {
                    return Page.empty(pageable);
                }

                ownedEventIds = List.of(eventId);
            }

            return userId == null
                ? registrationRepository.findByEventIdIn(
                      ownedEventIds,
                      pageable
                  )
                : registrationRepository.findByEventIdInAndUserId(
                      ownedEventIds,
                      userId,
                      pageable
                  );
        }

        // student: own rows only, ?userId= is ignored (it can never widen scope)
        return eventId == null
            ? registrationRepository.findByUserId(callerId, pageable)
            : registrationRepository.findByUserIdAndEventId(
                  callerId,
                  eventId,
                  pageable
              );
    }

}
