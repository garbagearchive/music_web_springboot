package com.example.music_app_project.controller;

import com.example.music_app_project.model.SyncedLyric;
import com.example.music_app_project.repository.SyncedLyricRepository;
import com.example.music_app_project.repository.SongRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/synced-lyrics")
@CrossOrigin // Thêm dòng này để cho phép CORS
public class SyncedLyricController {

    @Autowired
    private SyncedLyricRepository syncedLyricRepository;

    @Autowired
    private SongRepository songRepository;

    // Get all synced lyrics
    @GetMapping
    public List<SyncedLyric> getAll() {
        return syncedLyricRepository.findAll();
    }

    // Get synced lyrics for a specific song, ordered by timestamp
    @GetMapping("/song/{songID}")
    public List<SyncedLyric> getBySongId(@PathVariable Integer songID) {
        return syncedLyricRepository.findBySong_SongIDOrderByTimeStampSeconds(songID);
    }

    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<SyncedLyric> getById(@PathVariable Integer id) {
        return syncedLyricRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new synced lyric
    @PostMapping
    public ResponseEntity<SyncedLyric> create(@RequestBody SyncedLyric lyric) {
        if (lyric.getSong() == null || !songRepository.existsById(lyric.getSong().getSongID())) {
            return ResponseEntity.badRequest().build();
        }

        SyncedLyric saved = syncedLyricRepository.save(lyric);
        return ResponseEntity.ok(saved);
    }

    // Update synced lyric
    @PutMapping("/{id}")
    public ResponseEntity<SyncedLyric> update(@PathVariable Integer id, @RequestBody SyncedLyric updated) {
        Optional<SyncedLyric> existingOpt = syncedLyricRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (updated.getSong() == null || !songRepository.existsById(updated.getSong().getSongID())) {
            return ResponseEntity.badRequest().build();
        }

        SyncedLyric existing = existingOpt.get();
        existing.setSong(updated.getSong());
        existing.setTimeStampSeconds(updated.getTimeStampSeconds());
        existing.setLine(updated.getLine());

        return ResponseEntity.ok(syncedLyricRepository.save(existing));
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!syncedLyricRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        syncedLyricRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
