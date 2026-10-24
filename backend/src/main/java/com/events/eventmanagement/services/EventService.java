package com.events.eventmanagement.services;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Event.CategoryType;
import com.events.eventmanagement.repository.EventRepository;
import com.events.eventmanagement.repository.RegistrationRepository;
import java.time.LocalDate;
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
    private final RegistrationRepository registrationRepository;

    EventService(
        EventRepository eventRepository,
        RegistrationRepository registrationRepository
    ) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    // unknown category -> empty page, not 400
    public Page<Event> list(
        String category,
        Long createdBy,
        Boolean featured,
        LocalDate from,
        String q,
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

        String search = (q == null || q.isBlank()) ? null : q.trim();

        return eventRepository.search(
            parsed,
            createdBy,
            featured,
            from,
            search,
            pageable
        );
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

        // ownership first: otherwise a caller learns whether someone else's
        // event has registrations (409 instead of 403)
        assertOwner(existing, callerId);

        if (registrationRepository.existsByEventId(id)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Event has registrations and cannot be deleted."
            );
        }

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

        long taken = registrationRepository.countByEventId(id);

        if (updated.getCapacity() < taken) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Capacity cannot be lower than the " +
                    taken +
                    " existing registration" +
                    (taken == 1 ? "." : "s.")
            );
        }

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
