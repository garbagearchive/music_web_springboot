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
    
    // Thêm constructor mặc định (không tham số) - bắt buộc cho Jackson
    public Song() {
    }

    public Song(Album album, Artist artist, String audioFile, Integer duration, Genre genre, LocalDate releaseDate, Integer songID, String title) {
        this.album = album;
        this.artist = artist;
        this.audioFile = audioFile;
        this.duration = duration;
        this.genre = genre;
        this.releaseDate = releaseDate;
        this.songID = songID;
        this.title = title;
    }

    // Getters and setters
    public Integer getSongID() {
     return songID;
    }

    public void setSongID(Integer songID) {
        this.songID = songID;
}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
}

    public Artist getArtist() {
        return artist;
    }

    public void setArtist(Artist artist) {
        this.artist = artist;
}

    public Album getAlbum() {
        return album;
    }

    public void setAlbum(Album album) {
        this.album = album;
     }

    public Genre getGenre() {
        return genre;
    }
    
// ĐÃ SỬA: Tên phương thức được đổi từ setGerne thành setGenre
    public void setGenre(Genre genre) {
      this.genre = genre;
}

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
}

    public LocalDate getReleaseDate() {
        return releaseDate;
}

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
}

    public String getAudioFile() {
        return audioFile;
    }

    public void setAudioFile(String audioFile) {
        this.audioFile = audioFile;
    }
}