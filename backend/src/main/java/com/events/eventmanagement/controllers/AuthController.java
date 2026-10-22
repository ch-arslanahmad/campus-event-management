package com.events.eventmanagement.controllers;

import com.events.eventmanagement.config.JWTUtil;
import com.events.eventmanagement.dto.LoginRequest;
import com.events.eventmanagement.dto.SignupRequest;
import com.events.eventmanagement.dto.UserResponse;
import com.events.eventmanagement.models.User;
import com.events.eventmanagement.services.UserService;
import jakarta.validation.Valid;
import java.time.Duration;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JWTUtil jwtUtil;

    private final boolean cookieSecure;

    public AuthController(
            UserService userService,
            JWTUtil jwtUtil,
            @Value("${app.cookie.secure}") boolean cookieSecure) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.cookieSecure = cookieSecure;
    }

    // HELPER FUNCTIONS

    // create token from userId + role using JWTUtil.
    // mint means to create/issue a token
    private String mint(User user) {
        return jwtUtil.generateToken(user.getId(), user.getRole().name());
    }

    // the single place the cookie shape is defined (created), so login and logout
    // cannot drift
    private ResponseCookie sessionCookie(String jwt, long maxAgeSeconds) {
        return ResponseCookie.from("jwt_token", jwt)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .sameSite("Lax") // prevent CSRF, (the cookie is sent on same-site requests and top-level
                                 // navigation GET requests)
                .maxAge(Duration.ofSeconds(maxAgeSeconds))
                .build();
    }

    // === API ENDPOINTS ===

    // POST /api/auth/login: verify credentials, mint the access JWT, deliver it as
    // an httpOnly cookie
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @RequestBody @Valid LoginRequest request) {
        User user = userService.login(request.to());

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        sessionCookie(mint(user), jwtUtil.ttlSeconds()).toString())
                .body(UserResponse.from(user)); // body carries the user, never the token (ADR-0002)
    }

    // POST /api/auth/register: 201 + same cookie, still no token in the body
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestBody @Valid SignupRequest request) {
        User user = userService.signup(request.to());

        return ResponseEntity.status(HttpStatus.CREATED)
                .header(
                        HttpHeaders.SET_COOKIE,
                        sessionCookie(mint(user), jwtUtil.ttlSeconds()).toString() // cookieSecure is set with expired
                                                                                   // on n time.
                )
                .body(UserResponse.from(user));
    }

    // POST /api/auth/logout: clear the cookie. Same name + path, Max-Age 0 is what
    // deletes it
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie dead = sessionCookie("", 0); // Max-Age 0 = delete

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, dead.toString()) // clear the cookie
                .body(Map.of("message", "Logged out successfully"));
    }

    // GET /api/auth/me: identity comes from the cookie, JWTFilter puts the user id
    // in the principal
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication auth) {
        User user = userService.getUserById((Long) auth.getPrincipal());

        return ResponseEntity.ok(UserResponse.from(user));
    }
}
