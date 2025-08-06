package com.example.music_app_project.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.music_app_project.model.Album;
import com.example.music_app_project.model.Artist;
import com.example.music_app_project.repository.AlbumRepository;
import com.example.music_app_project.repository.ArtistRepository;

@RestController
@RequestMapping("/api/albums")
@CrossOrigin // Allow CORS for this controller
public class AlbumController {

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private ArtistRepository artistRepository;

    // Get all albums
    @GetMapping
    public List<Album> getAllAlbums() {
        return albumRepository.findAll();
    }

    // Get album by ID
    @GetMapping("/{id}")
    public ResponseEntity<Album> getAlbumById(@PathVariable Integer id) {
        Optional<Album> album = albumRepository.findById(id);
        return album.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create new album
    @PostMapping
    public ResponseEntity<Album> createAlbum(@RequestBody Album album) {
        Optional<Artist> artist = artistRepository.findById(album.getArtist().getArtistID());
        if (artist.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        album.setArtist(artist.get());
        Album savedAlbum = albumRepository.save(album);
        return ResponseEntity.ok(savedAlbum);
    }

    // Update album
    @PutMapping("/{id}")
    public ResponseEntity<Album> updateAlbum(@PathVariable Integer id, @RequestBody Album albumDetails) {
        Optional<Album> existingAlbumOpt = albumRepository.findById(id);
        if (existingAlbumOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Album existingAlbum = existingAlbumOpt.get();
        existingAlbum.setTitle(albumDetails.getTitle());
        existingAlbum.setReleaseDate(albumDetails.getReleaseDate());
        existingAlbum.setCoverImage(albumDetails.getCoverImage());

        Optional<Artist> artist = artistRepository.findById(albumDetails.getArtist().getArtistID());
        if (artist.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        existingAlbum.setArtist(artist.get());

        Album updatedAlbum = albumRepository.save(existingAlbum);
        return ResponseEntity.ok(updatedAlbum);
    }

    // Delete album
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable Integer id) {
        if (!albumRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        albumRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
