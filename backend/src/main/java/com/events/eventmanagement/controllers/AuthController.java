package com.events.eventmanagement.controllers;

import com.events.eventmanagement.dto.LoginRequest;
import com.events.eventmanagement.dto.SignupRequest;
import com.events.eventmanagement.dto.UserResponse;
import com.events.eventmanagement.models.User;
import com.events.eventmanagement.services.UserService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest user) {
        // Call the login method in UserService and get the response
        Map<Long, String> response = userService.login(user.to());

        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of(
                "id",
                response.keySet().toString(),
                "token",
                response.values()
            )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
        @RequestBody @Valid SignupRequest newUser
    ) {
        Map<String, User> response = userService.signup(newUser.to());

        Map.Entry<String, User> entry = response.entrySet().iterator().next();

        String token = entry.getKey();
        User user = entry.getValue();

        UserResponse userResponse = UserResponse.from(user); // value stripped

        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of("token", token, "user", userResponse)
        );
    }
}
