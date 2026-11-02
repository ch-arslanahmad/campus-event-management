-- =====================================================
-- Campus Event Management System
-- Database verification checks (issue #18, PR #42 review item 3)
--
-- Run against the Docker Compose MySQL after `docker compose up -d db`:
--
--   docker compose exec -T db mysql -ucampus -pcampus123 campus_events \
--     < documentation/postman/database-checks.sql
--
-- Every check produces a PASS/FAIL verdict, so a run can be read without
-- comparing numbers by eye. The script is read-only against real data: the
-- constraint section runs inside a transaction that is always rolled back,
-- so the seeded counts are unchanged afterwards.
--
-- Sections:
--   1. seed baseline          - the documented dataset is present
--   2. integrity invariants   - no orphans, duplicates or oversubscription
--   3. seed edge cases        - the rows seed.sql advertises are really there
--   4. constraint enforcement - the schema rejects bad writes (rolled back)
--   5. recorded run evidence  - cleanup from the 2026-11-01 Postman run
-- =====================================================

USE campus_events;

DROP TEMPORARY TABLE IF EXISTS db_check_results;
CREATE TEMPORARY TABLE db_check_results (
    section    VARCHAR(20)  NOT NULL,
    check_name VARCHAR(100) NOT NULL,
    actual     VARCHAR(120) NOT NULL,
    expected   VARCHAR(120) NOT NULL,
    verdict    ENUM('PASS','FAIL') NOT NULL
);


-- -----------------------------------------------------
-- 1. Seed baseline
-- seed.sql header: 100 users (5 admins, 95 students),
-- 555 events, 1000 registrations.
-- -----------------------------------------------------

INSERT INTO db_check_results
SELECT 'seed', 'users count', COUNT(*), '100',
       IF(COUNT(*) = 100, 'PASS', 'FAIL')
FROM users;

INSERT INTO db_check_results
SELECT 'seed', 'events count', COUNT(*), '555',
       IF(COUNT(*) = 555, 'PASS', 'FAIL')
FROM events;

INSERT INTO db_check_results
SELECT 'seed', 'registrations count', COUNT(*), '1000',
       IF(COUNT(*) = 1000, 'PASS', 'FAIL')
FROM registrations;

INSERT INTO db_check_results
SELECT 'seed', 'admin users count', COUNT(*), '5',
       IF(COUNT(*) = 5, 'PASS', 'FAIL')
FROM users
WHERE role = 'ADMIN';


-- -----------------------------------------------------
-- 2. Integrity invariants
-- -----------------------------------------------------

INSERT INTO db_check_results
SELECT 'integrity', 'registrations with missing user', COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM registrations r
LEFT JOIN users u ON u.id = r.user_id
WHERE u.id IS NULL;

INSERT INTO db_check_results
SELECT 'integrity', 'registrations with missing event', COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM registrations r
LEFT JOIN events e ON e.id = r.event_id
WHERE e.id IS NULL;

INSERT INTO db_check_results
SELECT 'integrity', 'events with missing creator', COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM events e
LEFT JOIN users u ON u.id = e.created_by
WHERE u.id IS NULL;

INSERT INTO db_check_results
SELECT 'integrity', 'duplicate (user_id, event_id) pairs', COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM (
    SELECT 1
    FROM registrations
    GROUP BY user_id, event_id
    HAVING COUNT(*) > 1
) duplicates;

INSERT INTO db_check_results
SELECT 'integrity', 'events over capacity', COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM (
    SELECT e.id
    FROM events e
    JOIN registrations r ON r.event_id = e.id
    GROUP BY e.id, e.capacity
    HAVING COUNT(*) > e.capacity
) oversubscribed;

INSERT INTO db_check_results
SELECT 'integrity', 'events with capacity <= 0', COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM events
WHERE capacity <= 0;

INSERT INTO db_check_results
SELECT 'integrity', 'events with unknown category', COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM events
WHERE category NOT IN
      ('SEMINAR', 'WORKSHOP', 'SPORTS', 'COMPETITION', 'CONFERENCE', 'CULTURAL');


-- -----------------------------------------------------
-- 3. Seed edge cases advertised in seed.sql
-- -----------------------------------------------------

INSERT INTO db_check_results
SELECT 'edge case', 'event 3 sold out (registrations/capacity)',
       CONCAT((SELECT COUNT(*) FROM registrations WHERE event_id = 3),
              '/',
              (SELECT capacity FROM events WHERE id = 3)),
       '20/20',
       IF((SELECT COUNT(*) FROM registrations WHERE event_id = 3) =
          (SELECT capacity FROM events WHERE id = 3), 'PASS', 'FAIL');

INSERT INTO db_check_results
SELECT 'edge case', 'event 8 nearly full (registrations/capacity)',
       CONCAT((SELECT COUNT(*) FROM registrations WHERE event_id = 8),
              '/',
              (SELECT capacity FROM events WHERE id = 8)),
       '24/25',
       IF((SELECT COUNT(*) FROM registrations WHERE event_id = 8) = 24
          AND (SELECT capacity FROM events WHERE id = 8) = 25, 'PASS', 'FAIL');

INSERT INTO db_check_results
SELECT 'edge case', 'event 9 has no registrations', COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM registrations
WHERE event_id = 9;

INSERT INTO db_check_results
SELECT 'edge case', 'event 10 title length', CHAR_LENGTH(title), '200',
       IF(CHAR_LENGTH(title) = 200, 'PASS', 'FAIL')
FROM events
WHERE id = 10;

INSERT INTO db_check_results
SELECT 'edge case', 'event 18 description is NULL',
       IF(description IS NULL, 'NULL', 'not NULL'), 'NULL',
       IF(description IS NULL, 'PASS', 'FAIL')
FROM events
WHERE id = 18;

INSERT INTO db_check_results
SELECT 'edge case', 'event 24 description is empty string',
       IF(description = '', 'empty', 'not empty'), 'empty',
       IF(description = '', 'PASS', 'FAIL')
FROM events
WHERE id = 24;

INSERT INTO db_check_results
SELECT 'edge case', 'user 6 registrations', COUNT(*), '45',
       IF(COUNT(*) = 45, 'PASS', 'FAIL')
FROM registrations
WHERE user_id = 6;

INSERT INTO db_check_results
SELECT 'edge case', 'user 7 registrations', COUNT(*), '1',
       IF(COUNT(*) = 1, 'PASS', 'FAIL')
FROM registrations
WHERE user_id = 7;

INSERT INTO db_check_results
SELECT 'edge case', 'users 99 and 100 have no registrations', COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM registrations
WHERE user_id IN (99, 100);

INSERT INTO db_check_results
SELECT 'edge case', 'admin user 5 created no events', COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM events
WHERE created_by = 5;


-- -----------------------------------------------------
-- 4. Constraint enforcement
-- Each statement below must be rejected by the schema. The whole
-- block runs in a transaction that is rolled back, so no rows leak.
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS db_run_constraint_checks;

DELIMITER //
CREATE PROCEDURE db_run_constraint_checks()
BEGIN
    DECLARE v_errno INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        GET DIAGNOSTICS CONDITION 1 v_errno = MYSQL_ERRNO;

    START TRANSACTION;

    -- 1062: uq_user_event
    SET v_errno = 0;
    INSERT INTO registrations (user_id, event_id)
        SELECT user_id, event_id FROM registrations LIMIT 1;
    SET @c_dup_registration = v_errno;

    -- 1062: users.email UNIQUE
    SET v_errno = 0;
    INSERT INTO users (name, email, password, role)
        SELECT 'Duplicate Email Check', email, 'x', 'STUDENT' FROM users LIMIT 1;
    SET @c_dup_email = v_errno;

    -- 1452: fk_events_created_by
    SET v_errno = 0;
    INSERT INTO events
        (title, date, time, location, category, capacity, created_by)
        VALUES ('Orphan Event', '2027-01-01', '10:00', 'QA Lab', 'SEMINAR', 10, 999999);
    SET @c_fk_creator = v_errno;

    -- 1452: fk_registrations_user
    SET v_errno = 0;
    INSERT INTO registrations (user_id, event_id) VALUES (999999, 1);
    SET @c_fk_reg_user = v_errno;

    -- 1452: fk_registrations_event
    SET v_errno = 0;
    INSERT INTO registrations (user_id, event_id) VALUES (1, 999999);
    SET @c_fk_reg_event = v_errno;

    -- 3819: chk_events_capacity
    SET v_errno = 0;
    INSERT INTO events
        (title, date, time, location, category, capacity, created_by)
        VALUES ('Zero Capacity', '2027-01-01', '10:00', 'QA Lab', 'SEMINAR', 0, 1);
    SET @c_capacity = v_errno;

    -- 3819: chk_events_category
    SET v_errno = 0;
    INSERT INTO events
        (title, date, time, location, category, capacity, created_by)
        VALUES ('Bad Category', '2027-01-01', '10:00', 'QA Lab', 'INVALID', 10, 1);
    SET @c_category = v_errno;

    -- 1048: events.title NOT NULL
    SET v_errno = 0;
    INSERT INTO events
        (title, date, time, location, category, capacity, created_by)
        VALUES (NULL, '2027-01-01', '10:00', 'QA Lab', 'SEMINAR', 10, 1);
    SET @c_null_title = v_errno;

    -- 1451: deleting an event with registrations is blocked (API 409)
    SET v_errno = 0;
    DELETE FROM events WHERE id = (SELECT event_id FROM registrations LIMIT 1);
    SET @c_delete_referenced = v_errno;

    ROLLBACK;
END//
DELIMITER ;

CALL db_run_constraint_checks();

INSERT INTO db_check_results VALUES
    ('constraint', 'duplicate registration rejected', @c_dup_registration, '1062',
     IF(@c_dup_registration = 1062, 'PASS', 'FAIL')),
    ('constraint', 'duplicate email rejected', @c_dup_email, '1062',
     IF(@c_dup_email = 1062, 'PASS', 'FAIL')),
    ('constraint', 'event with missing creator rejected', @c_fk_creator, '1452',
     IF(@c_fk_creator = 1452, 'PASS', 'FAIL')),
    ('constraint', 'registration with missing user rejected', @c_fk_reg_user, '1452',
     IF(@c_fk_reg_user = 1452, 'PASS', 'FAIL')),
    ('constraint', 'registration with missing event rejected', @c_fk_reg_event, '1452',
     IF(@c_fk_reg_event = 1452, 'PASS', 'FAIL')),
    ('constraint', 'zero capacity rejected', @c_capacity, '3819',
     IF(@c_capacity = 3819, 'PASS', 'FAIL')),
    ('constraint', 'invalid category rejected', @c_category, '3819',
     IF(@c_category = 3819, 'PASS', 'FAIL')),
    ('constraint', 'NULL title rejected', @c_null_title, '1048',
     IF(@c_null_title = 1048, 'PASS', 'FAIL')),
    ('constraint', 'event delete with registrations rejected', @c_delete_referenced, '1451',
     IF(@c_delete_referenced = 1451, 'PASS', 'FAIL'));


-- -----------------------------------------------------
-- 5. Recorded run evidence (2026-11-01, see run.log)
-- The API created event 557 (created_by = 1, body sent 999999) and
-- registration 1002 (user_id = 6, body sent 999999), then removed both.
-- Set the ids from the API responses when re-running with a live stack.
-- -----------------------------------------------------

SET @event_id = 557;
SET @registration_id = 1002;

INSERT INTO db_check_results
SELECT 'recorded run', CONCAT('event ', @event_id, ' removed'), COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM events
WHERE id = @event_id;

INSERT INTO db_check_results
SELECT 'recorded run', CONCAT('registration ', @registration_id, ' removed'), COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM registrations
WHERE id = @registration_id;

INSERT INTO db_check_results
SELECT 'recorded run', 'leftover temporary QA events', COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM events
WHERE title LIKE 'Postman QA Temporary Event%';

INSERT INTO db_check_results
SELECT 'recorded run', 'rows over the 200-char column limit', COUNT(*), '0',
       IF(COUNT(*) = 0, 'PASS', 'FAIL')
FROM events
WHERE CHAR_LENGTH(title) > 200 OR CHAR_LENGTH(location) > 200;


-- -----------------------------------------------------
-- Summary
-- -----------------------------------------------------

SELECT section, check_name, actual, expected, verdict
FROM db_check_results
ORDER BY FIELD(section, 'seed', 'integrity', 'edge case', 'constraint', 'recorded run'),
         check_name;

SELECT COUNT(*)                                  AS total_checks,
       SUM(verdict = 'PASS')                     AS passed,
       SUM(verdict = 'FAIL')                     AS failed,
       IF(SUM(verdict = 'FAIL') = 0,
          'ALL CHECKS PASSED',
          'FAILURES PRESENT - see rows above')   AS result
FROM db_check_results;

DROP PROCEDURE IF EXISTS db_run_constraint_checks;
DROP TEMPORARY TABLE IF EXISTS db_check_results;
