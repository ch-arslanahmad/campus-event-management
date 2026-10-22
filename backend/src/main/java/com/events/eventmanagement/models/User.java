package com.events.eventmanagement.models;

import lombok.Data;

@Data
public class User {

    public enum ROLE {
        STUDENT,
        ADMIN, // create events, update/delete own events only (not global admin)
    }

    private Long id;
    private String name;
    private String email;
    String password;
    ROLE role;

    public User(
        Long id,
        String name,
        String email,
        String password,
        ROLE role
    ) {
        this.password = password;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
