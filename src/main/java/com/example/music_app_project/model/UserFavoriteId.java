package com.example.music_app_project.model;

import java.io.Serializable;
import java.util.Objects;

// ✅ This class is the composite key for UserFavorite
public class UserFavoriteId implements Serializable {

    private Integer userID;
    private Integer songID;

    // No-arg constructor
    public UserFavoriteId() {
    }

    // All-arg constructor
    public UserFavoriteId(Integer userID, Integer songID) {
        this.userID = userID;
        this.songID = songID;
    }

    // Getters and setters
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

    // equals and hashCode (required for @IdClass to work)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserFavoriteId)) return false;
        UserFavoriteId that = (UserFavoriteId) o;
        return Objects.equals(userID, that.userID) &&
               Objects.equals(songID, that.songID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userID, songID);
    }
}
