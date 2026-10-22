package com.events.eventmanagement.services;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Event.CategoryType;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EventService {

    // created_at is stored and returned as "YYYY-MM-DD HH:mm:ss" (same shape as MySQL DATETIME)
    private static final DateTimeFormatter CREATED_AT_FORMAT =
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    Map<Long, Event> events = new ConcurrentHashMap<>(
        Map.ofEntries(
            Map.entry(
                1L,
                new Event(
                    1L,
                    "AI Seminar",
                    "Introduction to AI",
                    "2026-10-15",
                    "10:00",
                    "Hall A",
                    CategoryType.SEMINAR,
                    100,
                    false,
                    "2026-09-10 09:00:00"
                )
            ),
            Map.entry(
                2L,
                new Event(
                    2L,
                    "Java Workshop",
                    "Hands-on Java programming",
                    "2026-10-16",
                    "11:00",
                    "Lab 1",
                    Event.CategoryType.WORKSHOP,
                    40,
                    true,
                    "2026-09-10 09:00:00"
                )
            ),
            Map.entry(
                3L,
                new Event(
                    3L,
                    "Football Tournament",
                    "Inter-department football match",
                    "2026-10-17",
                    "09:00",
                    "Sports Ground",
                    Event.CategoryType.SPORTS,
                    200,
                    false,
                    "2026-09-15 09:00:00"
                )
            ),
            Map.entry(
                4L,
                new Event(
                    4L,
                    "Coding Competition",
                    "Competitive programming contest",
                    "2026-10-18",
                    "12:00",
                    "Lab 2",
                    Event.CategoryType.COMPETITION,
                    60,
                    false,
                    "2026-09-15 09:00:00"
                )
            ),
            Map.entry(
                5L,
                new Event(
                    5L,
                    "Tech Conference",
                    "Latest technology trends",
                    "2026-10-19",
                    "10:30",
                    "Auditorium",
                    Event.CategoryType.CONFERENCE,
                    300,
                    true,
                    "2026-09-10 09:00:00"
                )
            ),
            Map.entry(
                6L,
                new Event(
                    6L,
                    "Literary Society Meetup",
                    "Poetry and creative writing",
                    "2026-10-20",
                    "14:00",
                    "Room 101",
                    Event.CategoryType.SEMINAR,
                    50,
                    false,
                    "2026-09-10 09:00:00"
                )
            ),
            Map.entry(
                7L,
                new Event(
                    7L,
                    "Cybersecurity Seminar",
                    "Introduction to ethical hacking",
                    "2026-10-21",
                    "11:00",
                    "Hall B",
                    Event.CategoryType.SEMINAR,
                    120,
                    false,
                    "2026-09-15 09:00:00"
                )
            ),
            Map.entry(
                8L,
                new Event(
                    8L,
                    "Spring Boot Workshop",
                    "Building REST APIs",
                    "2026-10-22",
                    "13:00",
                    "Lab 3",
                    Event.CategoryType.WORKSHOP,
                    35,
                    false,
                    "2026-09-10 09:00:00"
                )
            ),
            Map.entry(
                9L,
                new Event(
                    9L,
                    "Cricket Match",
                    "Annual university cricket match",
                    "2026-10-23",
                    "09:30",
                    "Cricket Ground",
                    Event.CategoryType.SPORTS,
                    250,
                    true,
                    "2026-09-15 09:00:00"
                )
            ),
            Map.entry(
                10L,
                new Event(
                    10L,
                    "Hackathon",
                    "Build a solution in 24 hours",
                    "2026-10-24",
                    "08:00",
                    "Innovation Lab",
                    Event.CategoryType.COMPETITION,
                    80,
                    false,
                    "2026-09-10 09:00:00"
                )
            ),
            Map.entry(
                11L,
                new Event(
                    11L,
                    "Software Engineering Conference",
                    "Modern software development",
                    "2026-10-25",
                    "10:00",
                    "Main Auditorium",
                    Event.CategoryType.CONFERENCE,
                    180,
                    true,
                    "2026-09-15 09:00:00"
                )
            ),
            Map.entry(
                12L,
                new Event(
                    12L,
                    "Photography Exhibition",
                    "Student photography showcase",
                    "2026-10-26",
                    "15:00",
                    "Art Gallery",
                    Event.CategoryType.WORKSHOP,
                    70,
                    false,
                    "2026-09-10 09:00:00"
                )
            ),
            Map.entry(
                13L,
                new Event(
                    13L,
                    "Data Science Seminar",
                    "Introduction to data analytics",
                    "2026-10-27",
                    "10:00",
                    "Hall C",
                    Event.CategoryType.SEMINAR,
                    90,
                    true,
                    "2026-09-15 09:00:00"
                )
            ),
            Map.entry(
                14L,
                new Event(
                    14L,
                    "Git Workshop",
                    "Version control for beginners",
                    "2026-10-28",
                    "12:00",
                    "Lab 4",
                    Event.CategoryType.WORKSHOP,
                    45,
                    false,
                    "2026-09-10 09:00:00"
                )
            ),
            Map.entry(
                15L,
                new Event(
                    15L,
                    "Basketball Tournament",
                    "Inter-university basketball",
                    "2026-10-29",
                    "09:00",
                    "Indoor Court",
                    Event.CategoryType.SPORTS,
                    100,
                    true,
                    "2026-09-15 09:00:00"
                )
            ),
            Map.entry(
                16L,
                new Event(
                    16L,
                    "Project Presentation Contest",
                    "Final-year project competition",
                    "2026-10-30",
                    "11:00",
                    "Seminar Room",
                    Event.CategoryType.COMPETITION,
                    75,
                    true,
                    "2026-09-15 09:00:00"
                )
            ),
            Map.entry(
                17L,
                new Event(
                    17L,
                    "Cloud Computing Conference",
                    "Cloud infrastructure and deployment",
                    "2026-10-31",
                    "10:00",
                    "Auditorium B",
                    Event.CategoryType.CONFERENCE,
                    220,
                    true,
                    "2026-09-15 09:00:00"
                )
            ),
            Map.entry(
                18L,
                new Event(
                    18L,
                    "Programming Society Meetup",
                    "Discuss coding projects",
                    "2026-11-01",
                    "14:00",
                    "Room 202",
                    Event.CategoryType.SEMINAR,
                    40,
                    false,
                    "2026-09-10 09:00:00"
                )
            ),
            Map.entry(
                19L,
                new Event(
                    19L,
                    "Database Design Seminar",
                    "Relational database fundamentals",
                    "2026-11-02",
                    "11:30",
                    "Hall A",
                    Event.CategoryType.SEMINAR,
                    110,
                    true,
                    "2026-09-15 09:00:00"
                )
            ),
            Map.entry(
                20L,
                new Event(
                    20L,
                    "Docker Workshop",
                    "Containerization for developers",
                    "2026-11-03",
                    "13:30",
                    "Lab 5",
                    Event.CategoryType.WORKSHOP,
                    30,
                    true,
                    "2026-09-15 09:00:00"
                )
            )
        )
    );

    // server-assigned ids: starts after the 20 seeded events
    private final AtomicLong idSequence = new AtomicLong(21);

    EventService() {
        // seeded ownership: ids 1-10 belong to admin 1, ids 11-20 to admin 2
        // (see UserService seeds); new events get their owner from the principal
        events
            .values()
            .forEach(event ->
                event.setCreatedBy(event.getId() <= 10 ? 1L : 4L)
            );
    }

    // Get all events, /api/events
    public List<Event> list() {
        return events.values().stream().toList();
    }

    public Event getById(Long id) {
        if (!isExists(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Event with id " + id + " not found."
            );
        }

        return events.get(id);
    }

    // Get events by category, /api/events/?category=
    public List<Event> listByCategory(String category) {
        return events
            .values()
            .stream()
            .filter(event ->
                event.getCategory().name().equalsIgnoreCase(category)
            )
            .toList();
    }

    // event exists (helper method)

    boolean isExists(Long id) {
        return events
            .values()
            .stream()
            .anyMatch(event -> event.getId().equals(id));
    }

    // post /api/events
    public Long create(Event event, Long ownerId) {
        Long newId = idSequence.getAndIncrement(); // server assigns the id
        event.setId(newId);
        event.setCreatedBy(ownerId); // owner is never taken from the body
        event.setCreated_at(
            LocalDateTime.now()
                .truncatedTo(ChronoUnit.SECONDS)
                .format(CREATED_AT_FORMAT)
        );
        events.put(newId, event);
        return newId;
    }

    // delete /api/events/:id
    public boolean delete(Long id, Long callerId) {
        if (!isExists(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Event with id " + id + " not found."
            );
        }

        assertOwner(events.get(id), callerId);

        return events.remove(id) != null;
    }

    // owner of an event, null when it does not exist (used by registration scoping)
    public Long ownerOf(Long eventId) {
        Event event = events.get(eventId);

        return event == null ? null : event.getCreatedBy();
    }

    // an admin may only change events it created
    private void assertOwner(Event event, Long callerId) {
        if (
            event.getCreatedBy() == null ||
            !event.getCreatedBy().equals(callerId)
        ) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You can only modify events you created."
            );
        }
    }

    // put /api/events/:id
    public Event update(Long id, Event updated, Long callerId) {
        Event existing = events
            .values()
            .stream()
            .filter(event -> id.equals(event.getId()))
            .findFirst()
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Event with id " + id + " not found."
                )
            );

        assertOwner(existing, callerId);

        updated.setId(id);
        updated.setCreated_at(existing.getCreated_at());
        updated.setCreatedBy(existing.getCreatedBy()); // owner never changes
        events.put(id, updated);
        return updated;
    }
}
