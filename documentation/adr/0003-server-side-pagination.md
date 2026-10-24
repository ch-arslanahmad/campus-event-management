# ADR-0003: Server-side pagination on list endpoints

Status: Accepted — 2026-10-22

## Context

- List endpoints return the whole store as a bare array. The database seed (PR #14) holds 555 events and 1000 registrations, so an unpaginated call is ~100-250 KB of JSON.
- The response shape is a one-way door: switching to a paginated envelope after the React client merges breaks every call site.
- The store is in-memory initally and MySQL/JPA later, so the shape should match what JPA's `Page<>` serializes to.

## Decision

- Query params: `page` (0-based, default `0`, negative → 400) and `size` (default `20`, allowed `1..100`, outside → 400).
- Envelope: `content`, `page`, `size`, `totalElements`, `totalPages`, `first`, `last`.
- Filters (`?category=`) apply before counting and slicing, so `totalElements` reflects the filtered set.
- Sort explicitly by `id` before slicing — never slice `ConcurrentHashMap` iteration order, or pages overlap between requests.
- Registrations are authorization-scoped before pagination (student: own rows, admin: rows for events they created). Scope is never a caller-chosen query param.

## Consequences

- Frontend reads `res.content` / `res.totalPages`; no client-side paging on top.
- One shared `PageResponse<T>` for every list endpoint.
- The JPA swap changes the query, not the JSON.
- Cost: roughly 35 lines plus one record.
