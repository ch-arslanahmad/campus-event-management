package com.events.eventmanagement.dto;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Event.CategoryType;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    @JsonProperty("created_at") String createdAt
) {
    public static EventResponse from(Event event) {
        return new EventResponse(
            event.getId(),
            event.getTitle(),
            event.getDescription(),
            event.getDate(),
            event.getTime(),
            event.getLocation(),
            event.getCategory(),
            event.getCapacity(),
            event.getFeatured(),
            event.getCreated_at()
        );
    }

    public static List<EventResponse> fromList(List<Event> events) {
        if (events == null || events.isEmpty()) {
            return new ArrayList<>();
        }

        return events
            .stream()
            .map(event -> from(event))
            .collect(Collectors.toList());
    }
}
