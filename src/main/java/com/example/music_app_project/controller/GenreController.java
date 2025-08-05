package com.example.music_app_project.controller;

import com.example.music_app_project.model.Genre;
import com.example.music_app_project.repository.GenreRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/genres")
@CrossOrigin // Thêm dòng này để cho phép CORS
public class GenreController {

    @Autowired
    private GenreRepository genreRepository;

    // Get all genres
    @GetMapping
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    // Get genre by ID
    @GetMapping("/{id}")
    public ResponseEntity<Genre> getGenreById(@PathVariable Integer id) {
        return genreRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new genre
    @PostMapping
    public ResponseEntity<Genre> createGenre(@RequestBody Genre genre) {
        if (genreRepository.existsByName(genre.getGenreName())) {
            return ResponseEntity.badRequest().body(null); // Name must be unique
        }
        Genre saved = genreRepository.save(genre);
        return ResponseEntity.ok(saved);
    }

    // Update a genre
    @PutMapping("/{id}")
    public ResponseEntity<Genre> updateGenre(@PathVariable Integer id, @RequestBody Genre updatedGenre) {
        Optional<Genre> genreOpt = genreRepository.findById(id);
        if (genreOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Genre existing = genreOpt.get();
        existing.setGenreName(updatedGenre.getGenreName());

        genreRepository.save(existing);
        return ResponseEntity.ok(existing);
    }

    // Delete a genre
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGenre(@PathVariable Integer id) {
        if (!genreRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        genreRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
