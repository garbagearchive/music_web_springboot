package com.example.music_app_project.model;

import java.io.Serializable;

public class PlaylistSongId implements Serializable {
    private Integer playlistID;
    private Integer songID;

    // hashCode, equals, default constructor
    // playlistID
    public Integer getPlaylistID() {
        return playlistID;
    }

    public void setPlaylistID(Integer playlistID) {
        this.playlistID = playlistID;
    }

    // songID
    public Integer getSongID() {
        return songID;
    }

    public void setSongID(Integer songID) {
        this.songID = songID;
    }
}
