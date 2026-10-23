package com.events.eventmanagement.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    public enum ROLE {
        STUDENT,
        ADMIN, // create events, update/delete own events only (not global admin)
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    // BCrypt hash, never echoed (issue #8)
    @Column(nullable = false, length = 255)
    String password;

    // DB column: ENUM('STUDENT','ADMIN'); stored as the enum name
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ROLE role;

    // owned by the database (DEFAULT CURRENT_TIMESTAMP), never written by JPA
    @Column(name = "created_at", insertable = false, updatable = false)
    LocalDateTime createdAt;

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
