package com.example.music_app_project.model;

import jakarta.persistence.*;
import java.time.*;

@Entity
@Table(name = "Playlists")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer playlistID;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    // playlistID
    public Integer getPlaylistID() {
        return playlistID;
    }

    public void setPlaylistID(Integer playlistID) {
        this.playlistID = playlistID;
    }

    // name
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // user
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // createAt
    public LocalDateTime getCreateAt() {
        return createdAt;
    }

    public void setCreateAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
