package com.events.eventmanagement.services;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Event.CategoryType;
import com.events.eventmanagement.repository.EventRepository;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EventService {

    private final EventRepository eventRepository;

    EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Get all events, /api/events. Sorted by id so paging wraps it consistently
    // (ADR-0003); the DB store made the old ConcurrentHashMap seeds unnecessary.
    public List<Event> list() {
        return eventRepository.findAll(Sort.by("id"));
    }

    public Event getById(Long id) {
        return eventRepository
            .findById(id)
            .orElseThrow(() -> notFound(id));
    }

    // Get events by category, /api/events/?category=
    // An unknown category matched nothing before, so it still returns an empty list.
    public List<Event> listByCategory(String category) {
        CategoryType parsed;

        try {
            parsed = CategoryType.valueOf(category.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return List.of();
        }

        return eventRepository.findByCategory(parsed, Sort.by("id"));
    }

    // event exists (helper method)
    boolean isExists(Long id) {
        return eventRepository.existsById(id);
    }

    // post /api/events
    @Transactional
    public Long create(Event event, Long ownerId) {
        event.setId(null); // server assigns the id (AUTO_INCREMENT)
        event.setCreatedBy(ownerId); // owner is never taken from the body
        event.setCreatedAt(
            LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS)
        );

        return eventRepository.save(event).getId();
    }

    // delete /api/events/:id
    @Transactional
    public boolean delete(Long id, Long callerId) {
        Event existing = eventRepository
            .findById(id)
            .orElseThrow(() -> notFound(id));

        assertOwner(existing, callerId);
        eventRepository.delete(existing);

        return true;
    }

    // owner of an event, null when it does not exist (used by registration scoping)
    public Long ownerOf(Long eventId) {
        return eventRepository
            .findById(eventId)
            .map(Event::getCreatedBy)
            .orElse(null);
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
    @Transactional
    public Event update(Long id, Event updated, Long callerId) {
        Event existing = eventRepository
            .findById(id)
            .orElseThrow(() -> notFound(id));

        assertOwner(existing, callerId);

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setDate(updated.getDate());
        existing.setTime(updated.getTime());
        existing.setLocation(updated.getLocation());
        existing.setCategory(updated.getCategory());
        existing.setCapacity(updated.getCapacity());
        existing.setFeatured(updated.getFeatured());
        // id, created_at and created_by never change

        return eventRepository.save(existing);
    }

    private ResponseStatusException notFound(Long id) {
        return new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Event with id " + id + " not found."
        );
    }
}
