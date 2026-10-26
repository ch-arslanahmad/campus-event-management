package com.events.eventmanagement.dto;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Query-param rules shared by every list endpoint (ADR-0003): {@code page} is
 * 0-based, {@code size} defaults to 20 and is capped at 100, anything outside
 * those ranges is a 400.
 */
public final class PageQuery {

    public static final int DEFAULT_SIZE = 20;
    public static final int MAX_SIZE = 100;

    private PageQuery() {}

    public static Pageable toPageable(int page, int size) {
        return toPageable(page, size, Sort.by(Sort.Direction.DESC, "id"));
    }

    public static Pageable toPageable(int page, int size, Sort sort) {
        if (page < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "page must be 0 or greater"
            );
        }

        if (size < 1 || size > MAX_SIZE) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "size must be between 1 and " + MAX_SIZE
            );
        }

        // explicit sort: page boundaries must not depend on storage order, or
        // consecutive pages overlap and skip rows
        return PageRequest.of(page, size, sort);
    }
}
