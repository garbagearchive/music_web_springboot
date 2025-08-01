package com.example.music_app_project.model;

import java.io.Serializable;
import java.util.Objects;

public class PlaylistSongId implements Serializable {
    private Integer playlistID;
    private Integer songID;

    // No-arg constructor (required by JPA)
    public PlaylistSongId() {
    }

    // Optional: All-args constructor (can be useful)
    public PlaylistSongId(Integer playlistID, Integer songID) {
        this.playlistID = playlistID;
        this.songID = songID;
    }

    // Getters and Setters
    public Integer getPlaylistID() {
        return playlistID;
    }

    public void setPlaylistID(Integer playlistID) {
        this.playlistID = playlistID;
    }

    public Integer getSongID() {
        return songID;
    }

    public void setSongID(Integer songID) {
        this.songID = songID;
    }

    // Required: equals() and hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof PlaylistSongId))
            return false;
        PlaylistSongId that = (PlaylistSongId) o;
        return Objects.equals(playlistID, that.playlistID) &&
                Objects.equals(songID, that.songID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playlistID, songID);
    }
}
