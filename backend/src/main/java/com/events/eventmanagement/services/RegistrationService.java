package com.events.eventmanagement.services;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Registration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RegistrationService {

    private final EventService eventService;

    // eventId -> (userId -> registration), so duplicate and capacity checks
    // touch only one event's map
    private final Map<Long, Map<Long, Registration>> registrations = new ConcurrentHashMap<>();

    private final AtomicLong idSequence = new AtomicLong(1);

    RegistrationService(EventService eventService) {
        this.eventService = eventService;

        // demo registrations so the API returns data on a fresh boot
        seed(2L, 1L, "2026-10-01T09:15:00"); // Ali -> AI Seminar
        seed(3L, 1L, "2026-10-02T14:40:00"); // Sara -> AI Seminar
        seed(2L, 2L, "2026-10-03T11:05:00"); // Ali -> Java Workshop
        seed(3L, 8L, "2026-10-04T16:20:00"); // Sara -> Spring Boot Workshop
        seed(2L, 20L, "2026-10-05T10:00:00"); // Ali -> Docker Workshop
    }

    // seed rows bypass the duplicate/capacity rules, they are trusted fixtures
    private void seed(Long userId, Long eventId, String registeredAt) {
        Map<Long, Registration> forEvent = registrations.computeIfAbsent(
                eventId,
                key -> new ConcurrentHashMap<>());

        forEvent.put(
                userId,
                new Registration(
                        idSequence.getAndIncrement(),
                        userId,
                        eventId,
                        registeredAt));
    }

    // post /api/register
    public Registration register(Long userId, Long eventId) {
        Event event = eventService.getById(eventId); // 404 when the event does not exist

        Map<Long, Registration> forEvent = registrations.computeIfAbsent(
                eventId,
                key -> new ConcurrentHashMap<>());

        // duplicate check + capacity check + insert in one atomic compute(),
        // so two parallel requests cannot both pass the capacity check
        forEvent.compute(userId, (key, existing) -> {
            if (existing != null) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "You are already registered for this event.");
            }

            if (forEvent.size() >= event.getCapacity()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Event is full.");
            }

            return new Registration(
                    idSequence.getAndIncrement(),
                    userId,
                    eventId,
                    LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS).toString());
        });

        return forEvent.get(userId);
    }

    // get /api/registrations: the scope comes from the caller's identity,
    // a student sees their own rows, an admin sees rows for events it created
    // (admins are event owners).
    public List<Registration> list(
            Long callerId,
            boolean admin,
            Long eventId,
            Long userId) {
        return registrations
                .values()
                .stream()
                .flatMap(forEvent -> forEvent.values().stream())
                .filter(registration ->
                        eventId == null || eventId.equals(registration.getEventId()))
                // scope first: student = own rows, admin = rows for events it owns
                .filter(registration -> admin
                        ? callerId.equals(
                                eventService.ownerOf(registration.getEventId()))
                        : callerId.equals(registration.getUserId()))
                // ?userId= narrows inside that scope, never widens it
                .filter(registration -> !admin
                        || userId == null
                        || userId.equals(registration.getUserId()))
                .sorted((a, b) -> a.getId().compareTo(b.getId()))
                .toList();
    }

    // used by DELETE /api/events/{id}
    public boolean hasRegistrations(Long eventId) {
        Map<Long, Registration> forEvent = registrations.get(eventId);

        return forEvent != null && !forEvent.isEmpty();
    }
}
