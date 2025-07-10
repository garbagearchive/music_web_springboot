package com.example.music_app_project.model;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "Artists")
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer artistID;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String bio;

    @Column(length = 50)
    private String country;

    private LocalDate birthDate;

    // Getters and setters
    // ArtistID
    public Integer getArtistID() {
        return artistID;
    }

    public void setArtistID(Integer artistID) {
        this.artistID = artistID;
    }

    // ArtistName
    public String getArtistName() {
        return name;
    }

    public void setArtistName(String name) {
        this.name = name;
    }

    // ArtistBio
    public String getArtistBio() {
        return bio;
    }

    public void setArtistBio(String bio) {
        this.bio = bio;
    }

    // ArtistCountry
    public String getArtistCountry() {
        return country;
    }

    public void setArtistCountry(String country) {
        this.country = country;
    }

    // ArtistBirthDate
    public LocalDate getArtistBirthDate() {
        return birthDate;
    }

    public void setArtistBirthday(LocalDate birthDate) {
        this.birthDate = birthDate;
    }
}
