package com.events.eventmanagement.services;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Event.CategoryType;
import com.events.eventmanagement.repository.EventRepository;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // Get events, /api/events. The caller passes category + page/size (and the
    // sort, ADR-0003); the DB store made the old ConcurrentHashMap seeds
    // unnecessary.
    //
    // category and createdBy are independent filters, so they are resolved once
    // here instead of in four controller branches: an unknown category still
    // returns an empty page (it matched nothing before), never a 400.
    public Page<Event> list(
        String category,
        Long createdBy,
        Pageable pageable
    ) {
        CategoryType parsed = null;

        if (category != null && !category.isBlank()) {
            try {
                parsed = CategoryType.valueOf(category.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                return Page.empty(pageable);
            }
        }

        if (parsed != null && createdBy != null) {
            return eventRepository.findByCategoryAndCreatedBy(
                parsed,
                createdBy,
                pageable
            );
        }

        if (parsed != null) {
            return eventRepository.findByCategory(parsed, pageable);
        }

        if (createdBy != null) {
            return eventRepository.findByCreatedBy(createdBy, pageable);
        }

        return eventRepository.findAll(pageable);
    }

    public Event getById(Long id) {
        return eventRepository
            .findById(id)
            .orElseThrow(() -> notFound(id));
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
