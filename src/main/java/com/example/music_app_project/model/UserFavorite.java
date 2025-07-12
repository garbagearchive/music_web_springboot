package com.example.music_app_project.model;

import java.time.*;

import jakarta.persistence.*;

@Entity
@Table(name = "UserFavorites")
@IdClass(UserFavoriteId.class)
public class UserFavorite {

    @Id
    private Integer userID;

    @Id
    private Integer songID;

    @ManyToOne
    @JoinColumn(name = "userID", insertable = false, updatable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "songID", insertable = false, updatable = false)
    private Song song;

    private LocalDateTime favoritedAt;

    @PrePersist
    protected void onCreate() {
        this.favoritedAt = LocalDateTime.now();
    }

    // Getters and Setters
    // userID
    public Integer getUserID() {
        return userID;
    }

    public void setUserID(Integer userID) {
        this.userID = userID;
    }

    // songID
    public Integer getSongID() {
        return songID;
    }

    public void setSongID(Integer songID) {
        this.songID = songID;
    }

    // user
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // song
    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    // favoritedAt
    public LocalDateTime getFavoritedAt() {
        return favoritedAt;

    }

    public void setFavoritedAt(LocalDateTime favoritedAt) {
        this.favoritedAt = favoritedAt;
    }
}
