package com.example.music_app_project.model;

import jakarta.persistence.*;

import java.time.*;

@Entity
@Table(name = "Songs")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer songID;

    @Column(nullable = false, length = 100)
    private String title;

    @ManyToOne
    @JoinColumn(name = "artistID")
    private Artist artist;

    @ManyToOne
    @JoinColumn(name = "albumID")
    private Album album;

    @ManyToOne
    @JoinColumn(name = "genreID")
    private Genre genre;

    private Integer duration;

    private LocalDate releaseDate;

    @Column(length = 255)
    private String audioFile;

    // Getters and setters
    // songID
    public Integer getSongID() {
        return songID;
    }

    public void setSongID(Integer songID) {
        this.songID = songID;
    }

    // title
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    // artist
    public Artist getArtist() {
        return artist;
    }

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    // album
    public Album getAlbum() {
        return album;
    }

    public void setAlbum(Album album) {
        this.album = album;
    }

    // gerne
    public Genre getGenre() {
        return genre;
    }

    public void setGerne(Genre gerne) {
        this.genre = gerne;
    }

    // duration
    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    // releaseDate
    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    // audioFile
    public String getAudioFile() {
        return audioFile;
    }

    public void setAudioFile(String audioFile) {
        this.audioFile = audioFile;
    }

}
