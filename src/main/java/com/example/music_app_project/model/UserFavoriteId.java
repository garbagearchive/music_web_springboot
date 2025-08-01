package com.example.music_app_project.model;

import java.io.Serializable;
import java.util.Objects;

public class UserFavoriteId implements Serializable {
    private Integer user; // Phải khớp với tên thuộc tính 'user' trong UserFavorite
    private Integer song; // Phải khớp với tên thuộc tính 'song' trong UserFavorite

    // Constructors
    public UserFavoriteId() {}

    public UserFavoriteId(Integer user, Integer song) {
        this.user = user;
        this.song = song;
    }

    // Getters và Setters
    public Integer getUser() {
        return user;
    }

    public void setUser(Integer user) {
        this.user = user;
    }

    public Integer getSong() {
        return song;
    }

    public void setSong(Integer song) {
        this.song = song;
    }

    // equals() và hashCode() là bắt buộc cho khóa phức hợp
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserFavoriteId that = (UserFavoriteId) o;
        return Objects.equals(user, that.user) &&
               Objects.equals(song, that.song);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, song);
    }
}
