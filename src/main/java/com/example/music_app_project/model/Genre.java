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
    // GerneID
    public Integer getGerneID() {
        return genreID;
    }

    public void setGerneID(Integer gerneID) {
        this.genreID = gerneID;
    }

    // GerneName
    public String getGerneName() {
        return name;
    }

    public void setGerneName(String name) {
        this.name = name;
    }

}
