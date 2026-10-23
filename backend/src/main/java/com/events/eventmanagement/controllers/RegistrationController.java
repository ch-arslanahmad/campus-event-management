package com.events.eventmanagement.controllers;

import com.events.eventmanagement.dto.PageQuery;
import com.events.eventmanagement.dto.PageResponse;
import com.events.eventmanagement.dto.RegisterRequest;
import com.events.eventmanagement.dto.RegistrationResponse;
import com.events.eventmanagement.models.Registration;
import com.events.eventmanagement.services.RegistrationService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // get /api/registrations, optional ?eventId= and ?userId=, paged with
    // ?page= / ?size= (ADR-0003)
    @GetMapping("/api/registrations")
    public ResponseEntity<PageResponse<RegistrationResponse>> list(
        @RequestParam(name = "eventId", required = false) Long eventId,
        @RequestParam(name = "userId", required = false) Long userId,
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "size", defaultValue = "20") int size,
        Authentication auth
    ) {
        Long callerId = (Long) auth.getPrincipal();
        boolean admin = auth
            .getAuthorities()
            .stream()
            .anyMatch(authority ->
                "ROLE_ADMIN".equals(authority.getAuthority())
            );

        Page<Registration> registrations = registrationService.list(
            callerId,
            admin,
            eventId,
            userId,
            PageQuery.toPageable(page, size)
        );

        return ResponseEntity.ok(
            PageResponse.of(registrations.map(RegistrationResponse::from))
        );
    }
}
