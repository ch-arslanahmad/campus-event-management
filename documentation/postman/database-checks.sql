-- Read-only baseline and per-test checks. Replace placeholders with IDs returned by the API.
SELECT COUNT(*) AS events FROM events;
SELECT COUNT(*) AS registrations FROM registrations;
SELECT COUNT(*) AS users FROM users;
SELECT id, created_by, title, capacity, category FROM events WHERE id = <eventId>;
SELECT id, user_id, event_id FROM registrations WHERE id = <registrationId>;
SELECT COUNT(*) AS event_exists FROM events WHERE id = <eventId>;
SELECT COUNT(*) AS registration_exists FROM registrations WHERE id = <registrationId>;
