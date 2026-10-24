package com.events.eventmanagement.dto;

import com.events.eventmanagement.models.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
    @NotBlank(message = "Email is required") String email,
    @Size(min = 8, max = 72, message = "Password must be 8-72 characters")
    @NotBlank(message = "Password is required")
    String password
) {
    public User to() {
        return new User(
            null, // id
            null, // name
            this.email,
            this.password,
            null // role
        );
    }
}
