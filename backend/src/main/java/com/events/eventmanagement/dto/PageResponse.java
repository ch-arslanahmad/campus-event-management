package com.events.eventmanagement.dto;

import java.util.List;
import org.springframework.data.domain.Page;

/**
 * The one envelope every list endpoint returns (ADR-0003).
 *
 * It is deliberately not Spring's {@code Page} itself: serializing that leaks
 * internal fields (pageable, sort, numberOfElements) and couples the JSON to
 * Spring Data.
 */
public record PageResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean first,
    boolean last
) {
    public static <T> PageResponse<T> of(Page<T> page) {
        return new PageResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isFirst(),
            page.isLast()
        );
    }
}
