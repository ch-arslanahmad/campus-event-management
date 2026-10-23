package com.events.eventmanagement.dto;

import com.events.eventmanagement.models.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// No role field on purpose: signup always creates a STUDENT (UserService decides),
// so a role sent in the body was only ever discarded.
public record SignupRequest(
    @NotBlank(message = "Name is required") String name,

    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@(gmail\\.com|outlook\\.com|hotmail\\.com|yahoo\\.com)$",
        flags = Pattern.Flag.CASE_INSENSITIVE,
        message = "Email must be from a supported provider (gmail, outlook, hotmail, or yahoo)"
    )
    @NotBlank(message = "Email is required")
    String email,

    @Size(min = 8, max = 72, message = "Password must be 8-72 characters")
    @NotBlank(message = "Password is required")
    String password
) {
    public User to() {
        return new User(
            null, // id
            this.name,
            this.email,
            this.password,
            null // role, assigned by the service
        );
    }
}
