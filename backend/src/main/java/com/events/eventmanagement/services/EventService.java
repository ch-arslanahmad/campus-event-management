package com.events.eventmanagement.services;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Event.CategoryType;
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
public class EventService {

    Map<Long, Event> events = new ConcurrentHashMap<>(
        Map.ofEntries(
            Map.entry(
                1L,
                new Event(
                    1L,
                    "AI Seminar",
                    "Introduction to AI",
                    "2026-10-15",
                    "10:00 AM",
                    "Hall A",
                    CategoryType.seminar,
                    100,
                    false,
                    "2026-09-10"
                )
            ),
            Map.entry(
                2L,
                new Event(
                    2L,
                    "Java Workshop",
                    "Hands-on Java programming",
                    "2026-10-16",
                    "11:00 AM",
                    "Lab 1",
                    Event.CategoryType.workshop,
                    40,
                    true,
                    "2026-09-10"
                )
            ),
            Map.entry(
                3L,
                new Event(
                    3L,
                    "Football Tournament",
                    "Inter-department football match",
                    "2026-10-17",
                    "09:00 AM",
                    "Sports Ground",
                    Event.CategoryType.sports,
                    200,
                    false,
                    "2026-09-15"
                )
            ),
            Map.entry(
                4L,
                new Event(
                    4L,
                    "Coding Competition",
                    "Competitive programming contest",
                    "2026-10-18",
                    "12:00 PM",
                    "Lab 2",
                    Event.CategoryType.competition,
                    60,
                    false,
                    "2026-09-15"
                )
            ),
            Map.entry(
                5L,
                new Event(
                    5L,
                    "Tech Conference",
                    "Latest technology trends",
                    "2026-10-19",
                    "10:30 AM",
                    "Auditorium",
                    Event.CategoryType.conference,
                    300,
                    true,
                    "2026-09-10"
                )
            ),
            Map.entry(
                6L,
                new Event(
                    6L,
                    "Literary Society Meetup",
                    "Poetry and creative writing",
                    "2026-10-20",
                    "02:00 PM",
                    "Room 101",
                    Event.CategoryType.seminar,
                    50,
                    false,
                    "2026-09-10"
                )
            ),
            Map.entry(
                7L,
                new Event(
                    7L,
                    "Cybersecurity Seminar",
                    "Introduction to ethical hacking",
                    "2026-10-21",
                    "11:00 AM",
                    "Hall B",
                    Event.CategoryType.seminar,
                    120,
                    false,
                    "2026-09-15"
                )
            ),
            Map.entry(
                8L,
                new Event(
                    8L,
                    "Spring Boot Workshop",
                    "Building REST APIs",
                    "2026-10-22",
                    "01:00 PM",
                    "Lab 3",
                    Event.CategoryType.workshop,
                    35,
                    false,
                    "2026-09-10"
                )
            ),
            Map.entry(
                9L,
                new Event(
                    9L,
                    "Cricket Match",
                    "Annual university cricket match",
                    "2026-10-23",
                    "09:30 AM",
                    "Cricket Ground",
                    Event.CategoryType.sports,
                    250,
                    true,
                    "2026-09-15"
                )
            ),
            Map.entry(
                10L,
                new Event(
                    10L,
                    "Hackathon",
                    "Build a solution in 24 hours",
                    "2026-10-24",
                    "08:00 AM",
                    "Innovation Lab",
                    Event.CategoryType.competition,
                    80,
                    false,
                    "2026-09-10"
                )
            ),
            Map.entry(
                11L,
                new Event(
                    11L,
                    "Software Engineering Conference",
                    "Modern software development",
                    "2026-10-25",
                    "10:00 AM",
                    "Main Auditorium",
                    Event.CategoryType.conference,
                    180,
                    true,
                    "2026-09-15"
                )
            ),
            Map.entry(
                12L,
                new Event(
                    12L,
                    "Photography Exhibition",
                    "Student photography showcase",
                    "2026-10-26",
                    "03:00 PM",
                    "Art Gallery",
                    Event.CategoryType.workshop,
                    70,
                    false,
                    "2026-09-10"
                )
            ),
            Map.entry(
                13L,
                new Event(
                    13L,
                    "Data Science Seminar",
                    "Introduction to data analytics",
                    "2026-10-27",
                    "10:00 AM",
                    "Hall C",
                    Event.CategoryType.seminar,
                    90,
                    true,
                    "2026-09-15"
                )
            ),
            Map.entry(
                14L,
                new Event(
                    14L,
                    "Git Workshop",
                    "Version control for beginners",
                    "2026-10-28",
                    "12:00 PM",
                    "Lab 4",
                    Event.CategoryType.workshop,
                    45,
                    false,
                    "2026-09-10"
                )
            ),
            Map.entry(
                15L,
                new Event(
                    15L,
                    "Basketball Tournament",
                    "Inter-university basketball",
                    "2026-10-29",
                    "09:00 AM",
                    "Indoor Court",
                    Event.CategoryType.sports,
                    100,
                    true,
                    "2026-09-15"
                )
            ),
            Map.entry(
                16L,
                new Event(
                    16L,
                    "Project Presentation Contest",
                    "Final-year project competition",
                    "2026-10-30",
                    "11:00 AM",
                    "Seminar Room",
                    Event.CategoryType.competition,
                    75,
                    true,
                    "2026-09-15"
                )
            ),
            Map.entry(
                17L,
                new Event(
                    17L,
                    "Cloud Computing Conference",
                    "Cloud infrastructure and deployment",
                    "2026-10-31",
                    "10:00 AM",
                    "Auditorium B",
                    Event.CategoryType.conference,
                    220,
                    true,
                    "2026-09-15"
                )
            ),
            Map.entry(
                18L,
                new Event(
                    18L,
                    "Programming Society Meetup",
                    "Discuss coding projects",
                    "2026-11-01",
                    "02:00 PM",
                    "Room 202",
                    Event.CategoryType.seminar,
                    40,
                    false,
                    "2026-09-10"
                )
            ),
            Map.entry(
                19L,
                new Event(
                    19L,
                    "Database Design Seminar",
                    "Relational database fundamentals",
                    "2026-11-02",
                    "11:30 AM",
                    "Hall A",
                    Event.CategoryType.seminar,
                    110,
                    true,
                    "2026-09-15"
                )
            ),
            Map.entry(
                20L,
                new Event(
                    20L,
                    "Docker Workshop",
                    "Containerization for developers",
                    "2026-11-03",
                    "01:30 PM",
                    "Lab 5",
                    Event.CategoryType.workshop,
                    30,
                    true,
                    "2026-09-15"
                )
            )
        )
    );

    // server-assigned ids: starts after the 20 seeded events
    private final AtomicLong idSequence = new AtomicLong(21);

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
    public Long create(Event event) {
        Long newId = idSequence.getAndIncrement(); // server assigns the id
        event.setId(newId);
        event.setCreated_at(
            LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS).toString()
        );
        events.put(newId, event);
        return newId;
    }

    // delete /api/events/:id
    public boolean delete(Long id) {
        if (!isExists(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Event with id " + id + " not found."
            );
        }
        return events.remove(id) != null;
    }

    // put /api/events/:id
    public Event update(Long id, Event updated) {
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

        updated.setId(id);
        updated.setCreated_at(existing.getCreated_at());
        events.put(id, updated);
        return updated;
    }
}
