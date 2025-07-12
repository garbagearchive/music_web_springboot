package com.example.music_app_project.model;

import java.time.*;

import jakarta.persistence.*;

@Entity
@Table(name = "PlaylistSongs")
@IdClass(PlaylistSongId.class)
public class PlaylistSong {

    @Id
    private Integer playlistID;

    @Id
    private Integer songID;

    @ManyToOne
    @JoinColumn(name = "playlistID", insertable = false, updatable = false)
    private Playlist playlist;

    @ManyToOne
    @JoinColumn(name = "songID", insertable = false, updatable = false)
    private Song song;

    private LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        this.addedAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    // playlist
    public Playlist getPlaylist() {
        return playlist;
    }

    public void setPlaylist(Playlist playlist) {
        this.playlist = playlist;
    }

    // song
    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    // addedAt
    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }
}
