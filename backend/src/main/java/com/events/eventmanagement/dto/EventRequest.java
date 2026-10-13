package com.events.eventmanagement.dto;

import com.events.eventmanagement.models.Event;
import com.events.eventmanagement.models.Event.CategoryType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

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
        regexp = "^\\d{1,2}:\\d{2} (AM|PM)$",
        message = "Time must be like 10:00 AM"
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
        return new Event(
            null, // id
            this.title,
            this.description,
            this.date,
            this.time,
            this.location,
            this.category,
            this.capacity,
            this.featured,
            null // created_at
        );
    }
}
