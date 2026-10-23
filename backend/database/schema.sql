
-- =====================================================
-- Campus Event Management System
-- Database Schema
-- Issue #5
-- =====================================================

-- Create the database if it does not exist.
CREATE DATABASE IF NOT EXISTS campus_events;

-- Select the database.
USE campus_events;


-- =====================================================
-- TABLE 1: users
-- Stores students and administrators.
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- TABLE 2: events
-- Stores campus event information.
-- =====================================================

CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,

    CONSTRAINT fk_events_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id),

    CONSTRAINT chk_events_capacity
        CHECK (capacity > 0),

    CONSTRAINT chk_events_category
        CHECK (category IN ('SEMINAR','WORKSHOP','SPORTS','COMPETITION','CONFERENCE','CULTURAL'))
);


-- =====================================================
-- TABLE 3: registrations
-- Stores event registrations by users.
-- =====================================================

CREATE TABLE IF NOT EXISTS registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    registration_date DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_registrations_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_registrations_event
        FOREIGN KEY (event_id)
        REFERENCES events(id),

    CONSTRAINT uq_user_event
        UNIQUE (user_id, event_id)
);


-- =====================================================
-- END OF SCHEMA
-- =====================================================
