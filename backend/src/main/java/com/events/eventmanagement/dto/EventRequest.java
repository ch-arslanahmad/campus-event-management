package com.events.eventmanagement.dto;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Event.CategoryType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalTime;

public record EventRequest(
    @NotBlank(message = "Title is required") String title,
    String description,

    @Pattern(
        regexp = "^\\d{4}-\\d{2}-\\d{2}$",
        message = "Date must be YYYY-MM-DD"
    )
    @NotBlank(message = "Date is required")
    String date,

    @Pattern(
        regexp = "^([01]\\d|2[0-3]):[0-5]\\d$",
        message = "Time must be HH:mm in 24-hour format, e.g. 14:30"
    )
    @NotBlank(message = "Time is required")
    String time,
    @NotBlank(message = "Location is required") String location,
    @NotNull(message = "Category is required") CategoryType category,

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    Integer capacity,

    Boolean featured
) {
    public EventRequest {
        if (description == null || description.isBlank()) {
            description = "No description provided";
        }
        if (featured == null) {
            featured = false;
        }
    }

    public Event to() {
        Event event = new Event();

        event.setTitle(this.title);
        event.setDescription(this.description);
        // @Pattern already pinned the wire format, so parsing cannot fail here
        event.setDate(LocalDate.parse(this.date));
        event.setTime(LocalTime.parse(this.time));
        event.setLocation(this.location);
        event.setCategory(this.category);
        event.setCapacity(this.capacity);
        event.setFeatured(this.featured);
        // id, created_at and created_by are assigned by the service/database

        return event;
    }
}
