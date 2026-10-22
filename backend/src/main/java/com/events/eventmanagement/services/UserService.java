package com.events.eventmanagement.services;

import com.events.eventmanagement.models.User;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // id -> User (the store, same pattern as EventService's ConcurrentHashMap)
    private final Map<Long, User> users = new ConcurrentHashMap<>();

    // email -> id : the unique-email guard. signup() claims an email via
    // computeIfAbsent (atomic) instead of scanning `users` first, a scan-then-put
    // would let two same-email signups both pass the check and both insert.
    private final Map<String, Long> emailIndex = new ConcurrentHashMap<>(); // email mapping to user id

    // server-assigned ids, starts after the 3 seeded users below
    private final AtomicLong idSequence = new AtomicLong(4);

    // One shared BCrypt hash for all demo accounts.
    // demo password: demo1234, change on real signup
    private static final String PASSWORD_HASH = "$2a$10$DsWbyMlRHFOx4fgUzE1ApehWcPz.2WBV09.CHuYeAAziNwCOvPrsq";

    public UserService() {
        seed(1L, "Campus Admin", "admin@gmail.com", User.ROLE.admin);
        seed(2L, "Ali Khan", "ali.khan@gmail.com", User.ROLE.student);
        seed(3L, "Sara Noor", "sara.noor@yahoo.com", User.ROLE.student);
    }

    private void seed(Long id, String name, String email, User.ROLE role) {
        User user = new User(
                id,
                name,
                email.toLowerCase(),
                PASSWORD_HASH,
                role);
        users.put(id, user); // users map, id key
        emailIndex.put(user.getEmail(), id); // email mapped to an id
    }

    public User login(User user) {
        // if not provided, throw 401 Unauthorized
        if (user.getEmail() == null || user.getPassword() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password");
        }

        // if provided(find)
        User oldUser = users.get(emailIndex.get(user.getEmail().toLowerCase())); // emailIndex gives index(Long n) from
        // email

        // if not found or password doesn't match, throw 401 Unauthorized
        if (oldUser == null ||
                !passwordEncoder.matches(user.getPassword(), oldUser.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password");
        }

        // return the user object if login is successful
        return oldUser;
    }

    public User signup(User user) {
        String userEmail = user.getEmail().toLowerCase(); // input normalized

        if (userEmail == null || userEmail.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email is required");
        }

        user.setEmail(userEmail);

        // fix 4: server decides the role, whatever the body carried (because no
        // role-based access control yet, and we don't want to let a user signup as
        // admin)
        user.setRole(User.ROLE.student);

        // If email available (user in list), returns the existing owner's userId.
        // Otherwise creates the user and returns the new userId.
        Long claimed = emailIndex.computeIfAbsent(userEmail, key -> {
            user.setId(idSequence.getAndIncrement()); // assign a new id
            user.setPassword(passwordEncoder.encode(user.getPassword())); // hash the password
            users.put(user.getId(), user); // add to users map
            return user.getId(); // claim result: our id
        });

        // if the id created/fetched is not ours, then someone else owns this email (409
        // conflict)
        if (!claimed.equals(user.getId())) {
            // we didn't write, someone else owns this email (409 conflict), solves
            // concurrent signup
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already registered");
        }

        // password hash never leaves the server (issue #8: passwords never echoed)
        // callers map this to UserResponse, which has no password field
        return user;
    }

    public User getUserById(Long id) {
        User user = users.get(id);
        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found");
        }
        return user;
    }
}
