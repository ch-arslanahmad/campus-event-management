package com.events.eventmanagement.dto;

import com.events.eventmanagement.models.Registration;

public record RegistrationResponse(
    Long id,
    Long userId,
    Long eventId,
    String registeredAt
) {
    public static RegistrationResponse from(Registration registration) {
        return new RegistrationResponse(
            registration.getId(),
            registration.getUserId(),
            registration.getEventId(),
            registration.getRegisteredAt() == null
                ? null
                : registration.getRegisteredAt().toString()
        );
    }
}
