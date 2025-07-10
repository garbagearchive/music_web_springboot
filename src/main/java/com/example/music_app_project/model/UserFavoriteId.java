package com.example.music_app_project.model;

import java.io.Serializable;

public class UserFavoriteId implements Serializable {
    private Integer userID;
    private Integer songID;

    // hashCode, equals, default constructor
    public Integer getUserID() {
        return userID;
    }

    public void setUserID() {
        this.userID = userID;
    }

    public Integer getSongID() {
        return songID;
    }

    public void setSongID(Integer songID) {
        this.songID = songID;
    }
}
