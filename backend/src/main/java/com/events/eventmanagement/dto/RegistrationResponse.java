package com.events.eventmanagement.dto;

import com.events.eventmanagement.models.Registration;

public record RegistrationResponse(
    Long id,
    Long userId,
    Long eventId,
    String registeredAt,
    // admin-only: students must never see other students' names
    String userName
) {
    public static RegistrationResponse from(
        Registration registration,
        String userName
    ) {
        return new RegistrationResponse(
            registration.getId(),
            registration.getUserId(),
            registration.getEventId(),
            registration.getRegisteredAt() == null
                ? null
                : registration.getRegisteredAt().toString(),
            userName
        );
    }
}
