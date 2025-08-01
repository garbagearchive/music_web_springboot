package com.example.music_app_project.controller;

import com.example.music_app_project.model.*;
import com.example.music_app_project.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/playlist-songs")
public class PlaylistSongController {

    @Autowired
    private PlaylistSongRepository playlistSongRepository;

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private SongRepository songRepository;

    // Get all playlist-song entries
    @GetMapping
    public List<PlaylistSong> getAllPlaylistSongs() {
        return playlistSongRepository.findAll();
    }

    // Get all songs in a playlist
    @GetMapping("/playlist/{playlistID}")
    public List<PlaylistSong> getSongsByPlaylist(@PathVariable Integer playlistID) {
        return playlistSongRepository.findByPlaylist_PlaylistID(playlistID);
    }

    // Get all playlists containing a song
    @GetMapping("/song/{songID}")
    public List<PlaylistSong> getPlaylistsBySong(@PathVariable Integer songID) {
        return playlistSongRepository.findBySong_SongID(songID);
    }

    // Add song to playlist
    @PostMapping
    public ResponseEntity<PlaylistSong> addSongToPlaylist(@RequestBody PlaylistSong ps) {
        if (!playlistRepository.existsById(ps.getPlaylistID()) || !songRepository.existsById(ps.getSongID())) {
            return ResponseEntity.badRequest().build();
        }

        ps.setAddedAt(LocalDateTime.now()); // set the current time
        PlaylistSong saved = playlistSongRepository.save(ps);
        return ResponseEntity.ok(saved);
    }

    // Remove song from playlist
    @DeleteMapping("/playlist/{playlistID}/song/{songID}")
    public ResponseEntity<Void> removeSongFromPlaylist(@PathVariable Integer playlistID, @PathVariable Integer songID) {
        PlaylistSongId id = new PlaylistSongId(playlistID, songID);
        if (!playlistSongRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        playlistSongRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
