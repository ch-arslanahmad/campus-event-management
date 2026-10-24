package com.events.eventmanagement.repository;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Event.CategoryType;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Long> {

    // every filter optional; null = not filtered
    @Query(
        "select e from Event e " +
            "where (:category is null or e.category = :category) " +
            "and (:createdBy is null or e.createdBy = :createdBy) " +
            "and (:featured is null or e.featured = :featured) " +
            "and (:from is null or e.date >= :from) " +
            "and (:q is null or lower(e.title) like lower(concat('%', :q, '%')))"
    )
    Page<Event> search(
        @Param("category") CategoryType category,
        @Param("createdBy") Long createdBy,
        @Param("featured") Boolean featured,
        @Param("from") LocalDate from,
        @Param("q") String q,
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
