package com.example.music_app_project.controller;

import com.example.music_app_project.model.Lyric;
import com.example.music_app_project.repository.LyricRepository;
import com.example.music_app_project.repository.SongRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/lyrics")
@CrossOrigin // Thêm dòng này để cho phép CORS
public class LyricController {

    @Autowired
    private LyricRepository lyricRepository;

    @Autowired
    private SongRepository songRepository;

    // ✅ Get all lyrics
    @GetMapping
    public List<Lyric> getAllLyrics() {
        return lyricRepository.findAll();
    }

    // ✅ Get lyric by ID
    @GetMapping("/{id}")
    public ResponseEntity<Lyric> getLyricById(@PathVariable Integer id) {
        return lyricRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get lyrics by songID (multiple or first one)
    @GetMapping("/song/{songID}")
    public ResponseEntity<List<Lyric>> getLyricsBySongId(@PathVariable Integer songID) {
        List<Lyric> lyrics = lyricRepository.findBySong_SongID(songID);
        if (lyrics.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lyrics);
    }

    // ✅ Create new lyric
    @PostMapping
    public ResponseEntity<Lyric> createLyric(@RequestBody Lyric lyric) {
        if (lyric.getSongID() == null || lyric.getSongID().getSongID() == null ||
                !songRepository.existsById(lyric.getSongID().getSongID())) {
            return ResponseEntity.badRequest().body(null);
        }

        Lyric saved = lyricRepository.save(lyric);
        return ResponseEntity.ok(saved);
    }

    // ✅ Update lyric
    @PutMapping("/{id}")
    public ResponseEntity<Lyric> updateLyric(@PathVariable Integer id, @RequestBody Lyric updatedLyric) {
        Optional<Lyric> existingOpt = lyricRepository.findById(id);
        if (existingOpt.isEmpty())
            return ResponseEntity.notFound().build();

        if (updatedLyric.getSongID() == null || updatedLyric.getSongID().getSongID() == null ||
                !songRepository.existsById(updatedLyric.getSongID().getSongID())) {
            return ResponseEntity.badRequest().build();
        }

        Lyric existing = existingOpt.get();
        existing.setSongID(updatedLyric.getSongID());
        existing.setContent(updatedLyric.getContent());
        existing.setLanguage(updatedLyric.getLanguage());

        return ResponseEntity.ok(lyricRepository.save(existing));
    }

    // ✅ Delete lyric
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLyric(@PathVariable Integer id) {
        if (!lyricRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        lyricRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
