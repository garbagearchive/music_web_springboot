package com.example.music_app_project.model;

import jakarta.persistence.*;
import java.time.*;

@Entity
@Table(name = "Lyrics")
public class Lyric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer lyricID;

    @ManyToOne
    @JoinColumn(name = "songID", nullable = false)
    private Song song;

    @Column(columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String content;

    @Column(length = 50)
    private String language = "English";

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    // lyricID
    public Integer getLyricID() {
        return lyricID;
    }

    public void setLyricID(Integer lyricID) {
        this.lyricID = lyricID;
    }

    // song
    public Song getSongID() {
        return song;
    }

    public void setSongID(Song song) {
        this.song = song;
    }

    // content
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
    // language

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    // createAt
    public LocalDateTime getCreateAt() {
        return createdAt;
    }

    public void setCreateAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
