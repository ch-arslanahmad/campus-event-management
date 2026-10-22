package com.events.eventmanagement.models;

import lombok.Data;

@Data
public class Registration {

    Long id;
    Long userId;
    Long eventId;
    String registeredAt;

    public Registration(Long id, Long userId, Long eventId, String registeredAt) {
        this.id = id;
        this.userId = userId;
        this.eventId = eventId;
        this.registeredAt = registeredAt;
    }
}
