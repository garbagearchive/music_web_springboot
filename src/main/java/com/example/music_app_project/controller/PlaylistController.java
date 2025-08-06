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

import com.example.music_app_project.model.Playlist;
import com.example.music_app_project.repository.PlaylistRepository;
import com.example.music_app_project.repository.UserRepository;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin // Thêm dòng này để cho phép CORS
public class PlaylistController {

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all playlists
    @GetMapping
    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }

    // Get playlist by ID
    @GetMapping("/{id}")
    public ResponseEntity<Playlist> getPlaylistById(@PathVariable Integer id) {
        return playlistRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new playlist
    @PostMapping
    public ResponseEntity<Playlist> createPlaylist(@RequestBody Playlist playlist) {
        if (playlist.getUser() == null || !userRepository.existsById(playlist.getUser().getId())) {
            return ResponseEntity.badRequest().build();
        }

        // createdAt is handled by @PrePersist
        Playlist saved = playlistRepository.save(playlist);
        return ResponseEntity.ok(saved);
    }

    // Update a playlist
    @PutMapping("/{id}")
    public ResponseEntity<Playlist> updatePlaylist(@PathVariable Integer id, @RequestBody Playlist details) {
        Optional<Playlist> existingOpt = playlistRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (details.getUser() == null || !userRepository.existsById(details.getUser().getId())) {
            return ResponseEntity.badRequest().build();
        }

        Playlist existing = existingOpt.get();
        existing.setName(details.getName());
        existing.setUser(details.getUser());
        // Note: Don't update createdAt

        Playlist updated = playlistRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    // Delete a playlist
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable Integer id) {
        if (!playlistRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        playlistRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
