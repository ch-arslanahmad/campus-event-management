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
    Boolean featured,

    @JsonProperty("created_at") String createdAt,

    @JsonProperty("created_by") Long createdBy
) {
    // the API keeps the string shapes the frontend already consumes
    static final DateTimeFormatter CREATED_AT_FORMAT = DateTimeFormatter.ofPattern(
        "yyyy-MM-dd HH:mm:ss"
    );

    public static EventResponse from(Event event) {
        return new EventResponse(
            event.getId(),
            event.getTitle(),
            event.getDescription(),
            event.getDate() == null ? null : event.getDate().toString(),
            event.getTime() == null ? null : event.getTime().toString(),
            event.getLocation(),
            event.getCategory(),
            event.getCapacity(),
            event.getFeatured(),
            event.getCreatedAt() == null
                ? null
                : CREATED_AT_FORMAT.format(event.getCreatedAt()),
            event.getCreatedBy()
        );
    }
}
