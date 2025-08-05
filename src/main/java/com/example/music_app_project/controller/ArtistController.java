package com.example.music_app_project.controller;

import com.example.music_app_project.model.Artist;
import com.example.music_app_project.repository.ArtistRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/artists")
@CrossOrigin // Thêm dòng này để cho phép CORS
public class ArtistController {

    @Autowired
    private ArtistRepository artistRepository;

    // Get all artists
    @GetMapping
    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }

    // Get artist by ID
    @GetMapping("/{id}")
    public ResponseEntity<Artist> getArtistById(@PathVariable Integer id) {
        Optional<Artist> artist = artistRepository.findById(id);
        return artist.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new artist
    @PostMapping
    public ResponseEntity<Artist> createArtist(@RequestBody Artist artist) {
        Artist savedArtist = artistRepository.save(artist);
        return ResponseEntity.ok(savedArtist);
    }

    // Update an artist
    @PutMapping("/{id}")
    public ResponseEntity<Artist> updateArtist(@PathVariable Integer id, @RequestBody Artist artistDetails) {
        Optional<Artist> existingArtistOpt = artistRepository.findById(id);
        if (existingArtistOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Artist existingArtist = existingArtistOpt.get();
        existingArtist.setArtistName(artistDetails.getArtistName());
        existingArtist.setArtistBio(artistDetails.getArtistBio());
        existingArtist.setArtistCountry(artistDetails.getArtistCountry());
        existingArtist.setArtistBirthday(artistDetails.getArtistBirthDate());

        Artist updatedArtist = artistRepository.save(existingArtist);
        return ResponseEntity.ok(updatedArtist);
    }

    // Delete an artist
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtist(@PathVariable Integer id) {
        if (!artistRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        artistRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
