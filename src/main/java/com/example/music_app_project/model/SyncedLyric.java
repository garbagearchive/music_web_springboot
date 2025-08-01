package com.example.music_app_project.model;

import jakarta.persistence.*;

@Entity
@Table(name = "SyncedLyrics")
public class SyncedLyric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer syncedLyricID;

    @ManyToOne
    @JoinColumn(name = "songID", nullable = false)
    private Song song;

    private Integer timeStampSeconds;

    @Column(length = 500)
    private String line;

    // Getters and Setters
    // syncedLyricID
    public Integer getSyncedLyricID() {
        return syncedLyricID;
    }

    public void setSyncedLyricID(Integer syncedLyricID) {
        this.syncedLyricID = syncedLyricID;
    }

    // song
    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    // timeStampSeconds
    public Integer getTimeStampSeconds() {
        return timeStampSeconds;

    }

    public void setTimeStampSeconds(Integer timeStampSeconds) {
        this.timeStampSeconds = timeStampSeconds;
    }

    // line
    public String getLine() {
        return line;
    }

    public void setLine(String line) {
        this.line = line;
    }

}
