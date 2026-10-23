package com.events.eventmanagement.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "events")
public class Event {

    public enum CategoryType {
        SEMINAR,
        WORKSHOP,
        SPORTS,
        COMPETITION,
        CONFERENCE,
        CULTURAL,
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 200)
    String title;

    @Column(columnDefinition = "TEXT")
    String description;

    // DB columns are DATE / TIME / DATETIME (schema.sql), so the entity uses the
    // matching java.time types; the API layer formats them back to strings
    @Column(name = "date", nullable = false)
    LocalDate date;

    @Column(name = "time", nullable = false)
    LocalTime time;

    @Column(nullable = false, length = 200)
    String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    CategoryType category;

    @Column(nullable = false)
    Integer capacity;

    @Column(nullable = false)
    Boolean featured;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    // owner of the event, set by the service from the JWT principal (NOT NULL in the schema)
    @Column(name = "created_by", nullable = false)
    Long createdBy;
}
