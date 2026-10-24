package com.events.eventmanagement.repository;

import com.events.eventmanagement.models.Registration;
import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    boolean existsByEventId(Long eventId);

    long countByEventId(Long eventId);

    // registeredCount for a page of events in one query: {eventId, count}.
    // Doing it per row would turn GET /api/events into an N+1.
    @Query(
        "select r.eventId, count(r) from Registration r " +
            "where r.eventId in :eventIds group by r.eventId"
    )
    List<Object[]> countGroupedByEventId(
        @Param("eventIds") Collection<Long> eventIds
    );

    // paged variants: the authorization scope is applied by the query, so
    // totalElements counts only the rows the caller may see (ADR-0003)
    Page<Registration> findByUserId(Long userId, Pageable pageable);

    Page<Registration> findByUserIdAndEventId(
        Long userId,
        Long eventId,
        Pageable pageable
    );

    Page<Registration> findByEventIdIn(
        Collection<Long> eventIds,
        Pageable pageable
    );

    Page<Registration> findByEventIdInAndUserId(
        Collection<Long> eventIds,
        Long userId,
        Pageable pageable
    );
}
