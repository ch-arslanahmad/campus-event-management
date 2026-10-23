package com.events.eventmanagement.repository;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Event.CategoryType;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByCategory(CategoryType category, Sort sort);

    // ids of the events one admin owns, used to scope its registration view
    @Query("select e.id from Event e where e.createdBy = :ownerId")
    List<Long> findIdsByCreatedBy(@Param("ownerId") Long ownerId);

    // row lock for the registration capacity check (replaces the in-memory compute())
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select e from Event e where e.id = :id")
    Optional<Event> findByIdForUpdate(@Param("id") Long id);
}
