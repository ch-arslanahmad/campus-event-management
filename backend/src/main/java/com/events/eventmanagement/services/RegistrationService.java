package com.events.eventmanagement.services;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Registration;
import com.events.eventmanagement.repository.EventRepository;
import com.events.eventmanagement.repository.RegistrationRepository;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    RegistrationService(
        RegistrationRepository registrationRepository,
        EventRepository eventRepository
    ) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
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

    // get /api/registrations: the scope comes from the caller's identity,
    // a student sees their own rows, an admin sees rows for events it created
    // (admins are event owners).
    public List<Registration> list(
        Long callerId,
        boolean admin,
        Long eventId,
        Long userId
    ) {
        if (admin) {
            List<Long> ownedEventIds = eventRepository.findIdsByCreatedBy(
                callerId
            );

            if (ownedEventIds.isEmpty()) {
                return List.of();
            }

            // ?eventId= narrows inside the owned set, never widens it
            if (eventId != null) {
                if (!ownedEventIds.contains(eventId)) {
                    return List.of();
                }

                ownedEventIds = List.of(eventId);
            }

            return userId == null
                ? registrationRepository.findByEventIdInOrderByIdAsc(
                      ownedEventIds
                  )
                : registrationRepository.findByEventIdInAndUserIdOrderByIdAsc(
                      ownedEventIds,
                      userId
                  );
        }

        // student: own rows only, ?userId= is ignored (it can never widen scope)
        return eventId == null
            ? registrationRepository.findByUserIdOrderByIdAsc(callerId)
            : registrationRepository.findByUserIdAndEventIdOrderByIdAsc(
                  callerId,
                  eventId
              );
    }

    // used by DELETE /api/events/{id}
    public boolean hasRegistrations(Long eventId) {
        return registrationRepository.existsByEventId(eventId);
    }
}
