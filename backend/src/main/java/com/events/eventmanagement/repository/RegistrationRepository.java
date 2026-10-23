package com.events.eventmanagement.repository;

import com.events.eventmanagement.models.Registration;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    boolean existsByEventId(Long eventId);

    long countByEventId(Long eventId);

    List<Registration> findByUserIdOrderByIdAsc(Long userId);

    List<Registration> findByUserIdAndEventIdOrderByIdAsc(Long userId, Long eventId);

    List<Registration> findByEventIdInOrderByIdAsc(Collection<Long> eventIds);

    List<Registration> findByEventIdInAndUserIdOrderByIdAsc(Collection<Long> eventIds, Long userId);
}
