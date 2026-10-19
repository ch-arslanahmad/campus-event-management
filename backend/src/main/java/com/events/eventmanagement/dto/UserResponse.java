package com.events.eventmanagement.dto;

import com.events.eventmanagement.models.User;
import com.events.eventmanagement.models.User.ROLE;

public record UserResponse(Long id, String name, String email, ROLE role) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
    }
}
