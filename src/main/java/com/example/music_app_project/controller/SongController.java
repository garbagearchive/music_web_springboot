package com.example.music_app_project.controller;

import com.example.music_app_project.model.*;
import com.example.music_app_project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/songs")
@CrossOrigin(origins = "*")
public class SongController {

    @Autowired
    private SongRepository songRepository;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private GenreRepository genreRepository;

    // Get all songs
    @GetMapping
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    // Get song by ID
    @GetMapping("/{id}")
    public ResponseEntity<Song> getSongById(@PathVariable Integer id) {
        return songRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new song with an audio URL
    @PostMapping
    public ResponseEntity<Song> createSong(@RequestBody Song song) {
        if (!validateRelations(song)) {
            return ResponseEntity.badRequest().build();
        }
        Song savedSong = songRepository.save(song);
        return ResponseEntity.ok(savedSong);
    }

    // Update an existing song
    @PutMapping("/{id}")
    public ResponseEntity<Song> updateSong(@PathVariable Integer id, @RequestBody Song songDetails) {
        Optional<Song> existingOpt = songRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!validateRelations(songDetails)) {
            return ResponseEntity.badRequest().build();
        }
        Song existingSong = existingOpt.get();
        existingSong.setTitle(songDetails.getTitle());
        existingSong.setArtist(songDetails.getArtist());
        existingSong.setAlbum(songDetails.getAlbum());
        existingSong.setGenre(songDetails.getGenre());
        existingSong.setDuration(songDetails.getDuration());
        existingSong.setReleaseDate(songDetails.getReleaseDate());
        existingSong.setAudioFile(songDetails.getAudioFile());

        Song updated = songRepository.save(existingSong);
        return ResponseEntity.ok(updated);
    }

    // Delete song
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSong(@PathVariable Integer id) {
        if (!songRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        songRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Validate related entities exist
    private boolean validateRelations(Song song) {
        if (song.getArtist() != null && !artistRepository.existsById(song.getArtist().getArtistID())) {
            return false;
        }
        if (song.getAlbum() != null && !albumRepository.existsById(song.getAlbum().getAlbumID())) {
            return false;
        }
        if (song.getGenre() != null && !genreRepository.existsById(song.getGenre().getGenreID())) {
            return false;
        }
        return true;
    }
}