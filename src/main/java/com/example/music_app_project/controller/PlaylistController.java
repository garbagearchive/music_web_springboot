package com.example.music_app_project.controller;

import com.example.music_app_project.model.Playlist;
import com.example.music_app_project.repository.PlaylistRepository;
import com.example.music_app_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "*") // Allow frontend to access
public class PlaylistController {

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Get all playlists
    @GetMapping
    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }

    // ✅ Get playlist by ID
    @GetMapping("/{id}")
    public ResponseEntity<Playlist> getPlaylistById(@PathVariable Integer id) {
        return playlistRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Create a new playlist
    @PostMapping
    public ResponseEntity<?> createPlaylist(@RequestBody Playlist playlist) {
        if (playlist.getUser() == null || playlist.getUser().getId() == null ||
                !userRepository.existsById(playlist.getUser().getId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or missing user ID"));
        }

        if (playlist.getName() == null || playlist.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Playlist name is required"));
        }

        Playlist saved = playlistRepository.save(playlist);
        return ResponseEntity.ok(saved);
    }

    // ✅ Update a playlist
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlaylist(@PathVariable Integer id, @RequestBody Playlist details) {
        Optional<Playlist> existingOpt = playlistRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (details.getUser() == null || details.getUser().getId() == null ||
                !userRepository.existsById(details.getUser().getId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID"));
        }

        if (details.getName() == null || details.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Playlist name cannot be empty"));
        }

        Playlist existing = existingOpt.get();
        existing.setName(details.getName());
        existing.setUser(details.getUser());

        Playlist updated = playlistRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    // ✅ Delete a playlist
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable Integer id) {
        if (!playlistRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        playlistRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
