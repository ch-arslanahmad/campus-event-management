package com.events.eventmanagement.controllers;

import com.events.eventmanagement.dto.RegisterRequest;
import com.events.eventmanagement.dto.RegistrationResponse;
import com.events.eventmanagement.models.Registration;
import com.events.eventmanagement.services.RegistrationService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegistrationController {

    private final RegistrationService registrationService;

    RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    // post /api/register
    @PostMapping("/api/register")
    public ResponseEntity<?> register(
        @RequestBody @Valid RegisterRequest request,
        Authentication auth
    ) {
        // the user id comes from the JWT, never from the request body
        Long userId = (Long) auth.getPrincipal();

        Registration registration = registrationService.register(
            userId,
            request.eventId()
        );

        return ResponseEntity.status(201).body(
            Map.of(
                "message",
                "Registered successfully",
                "id",
                registration.getId()
            )
        );
    }

    // get /api/registrations, optional ?eventId= and ?userId=
    @GetMapping("/api/registrations")
    public ResponseEntity<List<RegistrationResponse>> list(
        @RequestParam(name = "eventId", required = false) Long eventId,
        @RequestParam(name = "userId", required = false) Long userId,
        Authentication auth
    ) {
        Long callerId = (Long) auth.getPrincipal();
        boolean admin = auth
            .getAuthorities()
            .stream()
            .anyMatch(authority ->
                "ROLE_ADMIN".equals(authority.getAuthority())
            );

        List<Registration> registrations = registrationService.list(
            callerId,
            admin,
            eventId,
            userId
        );

        return ResponseEntity.ok(RegistrationResponse.fromList(registrations));
    }
}
