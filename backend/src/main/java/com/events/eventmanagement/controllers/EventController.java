package com.events.eventmanagement.controllers;

import com.events.eventmanagement.dto.EventRequest;
import com.events.eventmanagement.dto.EventResponse;
import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.services.EventService;
import com.events.eventmanagement.services.RegistrationService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/events")
public class EventController {

    public final EventService eventService;
    private final RegistrationService registrationService;

    EventController(
        EventService eventService,
        RegistrationService registrationService
    ) {
        this.eventService = eventService;
        this.registrationService = registrationService;
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents(
        @RequestParam(name = "category", required = false) String category
    ) {
        List<Event> events_list =
            category != null && !category.isBlank()
                ? eventService.listByCategory(category)
                : eventService.list();

        List<EventResponse> events = EventResponse.fromList(events_list);

        return ResponseEntity.status(200).body(events);
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        // Logic to retrieve a specific event by ID from the database
        Event event = eventService.getById(id);

        EventResponse eventResponse = EventResponse.from(event);

        return ResponseEntity.status(200).body(eventResponse);
    }

    @PostMapping
    public ResponseEntity<?> createEvent(
        @RequestBody @Valid EventRequest requestEvent,
        Authentication auth
    ) {
        // Logic to create a new event in the database
        Event event = requestEvent.to();
        Long id = eventService.create(event, (Long) auth.getPrincipal());

        return ResponseEntity.status(201).body(
            Map.of("message", "Event created successfully", "id", id)
        );
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteEvent(
        @PathVariable Long id,
        Authentication auth
    ) {
        // Logic to delete a specific event by ID from the database
        if (registrationService.hasRegistrations(id)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Event has registrations and cannot be deleted."
            );
        }

        eventService.delete(id, (Long) auth.getPrincipal());

        return ResponseEntity.noContent().build(); // only returns status code 204 (HTTP code) with no content in the response body
    }

    @PutMapping("{id}")
    public ResponseEntity<?> update(
        @PathVariable Long id,
        @RequestBody @Valid EventRequest requestEvent,
        Authentication auth
    ) {
        // Logic to update a specific event by ID in the database

        Event event = requestEvent.to(); // for the updation function
        Event updatedEvent = eventService.update(
            id,
            event,
            (Long) auth.getPrincipal()
        );

        return ResponseEntity.status(200).body(
            Map.of(
                "message",
                "Event updated successfully",
                "event",
                updatedEvent
            )
        );
    }
}
