package com.events.eventmanagement.dto;

import jakarta.validation.constraints.NotNull;

// userId is never taken from the body: the JWT principal supplies it
public record RegisterRequest(
    @NotNull(message = "Event id is required") Long eventId
) {}
