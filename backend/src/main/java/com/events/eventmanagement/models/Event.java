package com.events.eventmanagement.models;

import lombok.Data;

@Data
public class Event {

    public enum CategoryType {
        SEMINAR,
        WORKSHOP,
        SPORTS,
        COMPETITION,
        CONFERENCE,
        CULTURAL,
    }

    Long id;
    String title;
    String description;
    String date;
    String time;
    String location;
    CategoryType category;
    Integer capacity;

    // newly added fields
    Boolean featured;
    String created_at;

    // owner of the event, set by the service from the JWT principal
    Long createdBy;

    // default constructor
    public Event(
        Long id,
        String title,
        String description,
        String date,
        String time,
        String location,
        CategoryType category,
        Integer capacity,
        Boolean featured,
        String created_at
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.date = date;
        this.time = time;
        this.location = location;
        this.category = category;
        this.capacity = capacity;
        this.featured = featured;
        this.created_at = created_at;
    }
}
