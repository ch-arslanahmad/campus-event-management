package com.events.eventmanagement.dto;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Event.CategoryType;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.format.DateTimeFormatter;

public record EventResponse(
    Long id,
    String title,
    String description,
    String date,
    String time,
    String location,
    CategoryType category,
    Integer capacity,
    long registeredCount,
    Boolean featured,
    @JsonProperty("created_at") String createdAt,
    @JsonProperty("created_by") Long createdBy
) {
    static final DateTimeFormatter CREATED_AT_FORMAT = DateTimeFormatter.ofPattern(
        "yyyy-MM-dd HH:mm:ss"
    );

    // no single-argument overload: a caller that lacks the count passes 0
    // explicitly instead of shipping a silently wrong number
    public static EventResponse from(Event event, long registeredCount) {
        return new EventResponse(
            event.getId(),
            event.getTitle(),
            event.getDescription(),
            event.getDate() == null ? null : event.getDate().toString(),
            event.getTime() == null ? null : event.getTime().toString(),
            event.getLocation(),
            event.getCategory(),
            event.getCapacity(),
            registeredCount,
            event.getFeatured(),
            event.getCreatedAt() == null
                ? null
                : CREATED_AT_FORMAT.format(event.getCreatedAt()),
            event.getCreatedBy()
        );
    }
}
