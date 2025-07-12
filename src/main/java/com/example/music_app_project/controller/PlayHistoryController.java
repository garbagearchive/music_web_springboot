package com.example.music_app_project.controller;

import com.example.music_app_project.model.PlayHistory;
import com.example.music_app_project.repository.PlayHistoryRepository;
import com.example.music_app_project.repository.SongRepository;
import com.example.music_app_project.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/play-history")
public class PlayHistoryController {

    @Autowired
    private PlayHistoryRepository playHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SongRepository songRepository;

    // Get all play history entries
    @GetMapping
    public List<PlayHistory> getAllPlayHistory() {
        return playHistoryRepository.findAll();
    }

    // Get play history by ID
    @GetMapping("/{id}")
    public ResponseEntity<PlayHistory> getPlayHistoryById(@PathVariable Integer id) {
        return playHistoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new play history entry
    @PostMapping
    public ResponseEntity<PlayHistory> createPlayHistory(@RequestBody PlayHistory history) {
        if (history.getUser() == null || !userRepository.existsById(history.getUser().getUserID())) {
            return ResponseEntity.badRequest().build();
        }
        if (history.getSong() == null || !songRepository.existsById(history.getSong().getSongID())) {
            return ResponseEntity.badRequest().build();
        }

        PlayHistory saved = playHistoryRepository.save(history);
        return ResponseEntity.ok(saved);
    }

    // Delete a play history record
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayHistory(@PathVariable Integer id) {
        if (!playHistoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        playHistoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
