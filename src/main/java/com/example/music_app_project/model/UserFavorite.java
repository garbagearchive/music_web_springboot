package com.example.music_app_project.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "UserFavorites")
@IdClass(UserFavoriteId.class)
public class UserFavorite {

    @Id
    @Column(name = "userID")
    private Integer userID;

    @Id
    @Column(name = "songID")
    private Integer songID;

    @ManyToOne
    @JoinColumn(name = "userID", insertable = false, updatable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "songID", insertable = false, updatable = false)
    private Song song;

    @Column(name = "favoritedAt")
    private LocalDateTime favoritedAt;

    @PrePersist
    protected void onCreate() {
        this.favoritedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getUserID() {
        return userID;
    }

    public void setUserID(Integer userID) {
        this.userID = userID;
    }

    public Integer getSongID() {
        return songID;
    }

    public void setSongID(Integer songID) {
        this.songID = songID;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    public LocalDateTime getFavoritedAt() {
        return favoritedAt;
    }

    public void setFavoritedAt(LocalDateTime favoritedAt) {
        this.favoritedAt = favoritedAt;
    }
}
