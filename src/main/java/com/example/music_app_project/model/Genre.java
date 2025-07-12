package com.example.music_app_project.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Genres")
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer genreID;

    @Column(nullable = false, length = 50, unique = true)
    private String name;

    // Getters and setters
    public Integer getGenreID() {
        return genreID;
    }

    public void setGenreID(Integer genreID) {
        this.genreID = genreID;
    }

    public String getGenreName() {
        return name;
    }

    public void setGenreName(String name) {
        this.name = name;
    }
}
