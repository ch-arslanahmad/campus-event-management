package com.events.eventmanagement.repository;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Event.CategoryType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Long> {

    // paged so ?category= is filtered by the database before counting
    Page<Event> findByCategory(CategoryType category, Pageable pageable);

    // ?createdBy= scopes the list to one owner's events (admin dashboard). It
    // replaces the client-side filter on created_by, which could only ever
    // filter the page it had already fetched, so totalElements was wrong.
    Page<Event> findByCreatedBy(Long ownerId, Pageable pageable);

    Page<Event> findByCategoryAndCreatedBy(
        CategoryType category,
        Long ownerId,
        Pageable pageable
    );

    // ids of the events one admin owns, used to scope its registration view
    @Query("select e.id from Event e where e.createdBy = :ownerId")
    List<Long> findIdsByCreatedBy(@Param("ownerId") Long ownerId);

    // Row lock for the registration capacity check (replaces the in-memory
    // compute()). The statement is native so the lock clause is written here:
    // letting the dialect generate it appends "for update of <alias>", which
    // some engines reject. Plain FOR UPDATE is portable, and the caller's
    // transaction holds the lock until it commits.
    @Query(
        value = "select * from events where id = :id for update",
        nativeQuery = true
    )
    Optional<Event> findByIdForUpdate(@Param("id") Long id);
}
