-- Executed against the Docker MySQL 8.4 container on 2026-11-02.
-- Command: docker compose exec -T db mysql -ucampus -pcampus123 campus_events --table < database-checks.sql
-- IDs are real seeded records, not placeholders: event_id=1 and registration_id=1.
SELECT COUNT(*) AS events FROM events;
SELECT COUNT(*) AS registrations FROM registrations;
SELECT COUNT(*) AS users FROM users;
SELECT id, created_by, title, capacity, category FROM events WHERE id = 1;
SELECT id, user_id, event_id FROM registrations WHERE id = 1;
SELECT COUNT(*) AS event_exists FROM events WHERE id = 1;
SELECT COUNT(*) AS registration_exists FROM registrations WHERE id = 1;
