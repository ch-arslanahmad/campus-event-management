package com.events.eventmanagement.repository;

import com.events.eventmanagement.models.Registration;
import java.util.Collection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    boolean existsByEventId(Long eventId);

    long countByEventId(Long eventId);

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
