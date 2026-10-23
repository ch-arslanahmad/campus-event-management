package com.events.eventmanagement.services;

import com.events.eventmanagement.models.User;
import com.events.eventmanagement.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(User user) {
        // if not provided, throw 401 Unauthorized
        if (user.getEmail() == null || user.getPassword() == null) {
            throw unauthorized();
        }

        User oldUser = userRepository
            .findByEmail(user.getEmail().toLowerCase())
            .orElse(null);

        // if not found or password doesn't match, throw 401 Unauthorized
        // (same message for both, no user enumeration)
        if (
            oldUser == null ||
            !passwordEncoder.matches(
                user.getPassword(),
                oldUser.getPassword()
            )
        ) {
            throw unauthorized();
        }

        // return the user object if login is successful
        return oldUser;
    }

    @Transactional
    public User signup(User user) {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Email is required"
            );
        }

        String userEmail = user.getEmail().toLowerCase(); // input normalized
        user.setEmail(userEmail);

        // the server decides the role, whatever the body carried (a signup can
        // never mint an admin)
        user.setRole(User.ROLE.STUDENT);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        try {
            // saveAndFlush so the UNIQUE(email) index rejects duplicates here,
            // inside the catch (not at transaction commit)
            return userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException e) {
            // someone else owns this email (409 conflict), also solves
            // concurrent signup
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Email already registered"
            );
        }
    }

    public User getUserById(Long id) {
        return userRepository
            .findById(id)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
                )
            );
    }

    private ResponseStatusException unauthorized() {
        return new ResponseStatusException(
            HttpStatus.UNAUTHORIZED,
            "Invalid email or password"
        );
    }
}
