package com.events.eventmanagement.dto;

import com.events.eventmanagement.models.Registration;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
            registration.getRegisteredAt()
        );
    }

    public static List<RegistrationResponse> fromList(
        List<Registration> registrations
    ) {
        if (registrations == null || registrations.isEmpty()) {
            return new ArrayList<>();
        }

        return registrations
            .stream()
            .map(registration -> from(registration))
            .collect(Collectors.toList());
    }
}
