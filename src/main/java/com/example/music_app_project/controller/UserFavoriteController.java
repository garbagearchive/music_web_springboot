package com.example.music_app_project.controller;

import com.example.music_app_project.model.*;
import com.example.music_app_project.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/user-favorites")
public class UserFavoriteController {

    @Autowired
    private UserFavoriteRepository userFavoriteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SongRepository songRepository;

    // Get all favorites
    @GetMapping
    public List<UserFavorite> getAllFavorites() {
        return userFavoriteRepository.findAll();
    }

    // Get all favorite songs by a user
    @GetMapping("/user/{userID}")
    public List<UserFavorite> getFavoritesByUser(@PathVariable Integer userID) {
        return userFavoriteRepository.findByUser_UserID(userID);
    }

    // Get all users who favorited a song
    @GetMapping("/song/{songID}")
    public List<UserFavorite> getUsersBySong(@PathVariable Integer songID) {
        return userFavoriteRepository.findBySong_SongID(songID);
    }

    // Add song to user favorites
    @PostMapping
    public ResponseEntity<UserFavorite> addFavorite(@RequestBody UserFavorite favorite) {
        if (!userRepository.existsById(favorite.getUserID()) || !songRepository.existsById(favorite.getSongID())) {
            return ResponseEntity.badRequest().build();
        }

        favorite.setFavoritedAt(LocalDateTime.now());
        UserFavorite saved = userFavoriteRepository.save(favorite);
        return ResponseEntity.ok(saved);
    }

    // Remove a favorite
    @DeleteMapping("/user/{userID}/song/{songID}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Integer userID, @PathVariable Integer songID) {
        UserFavoriteId id = new UserFavoriteId(userID, songID);
        if (!userFavoriteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        userFavoriteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
