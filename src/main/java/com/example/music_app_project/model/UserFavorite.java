package com.example.music_app_project.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Khóa phức hợp (composite key) cần được định nghĩa rõ ràng
@Entity
@Table(name = "UserFavorites")
@IdClass(UserFavoriteId.class)
public class UserFavorite {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID") // Tên cột trong CSDL vẫn là UserID
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SongID") // Tên cột trong CSDL vẫn là SongID
    private Song song;

    @Column(name = "FavoritedAt")
    private LocalDateTime favoritedAt;

    // Constructors, Getters, and Setters
    public UserFavorite() {}

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
