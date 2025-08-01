package com.example.music_app_project.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.music_app_project.model.UserFavorite;
import com.example.music_app_project.model.UserFavoriteId;
import com.example.music_app_project.repository.SongRepository;
import com.example.music_app_project.repository.UserFavoriteRepository;
import com.example.music_app_project.repository.UserRepository;

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
    @GetMapping("/user/{userId}") // Đã đổi tên path variable từ userID thành userId
    public List<UserFavorite> getFavoritesByUser(@PathVariable Integer userId) {
        // Gọi phương thức repository đã được cập nhật
        return userFavoriteRepository.findByUser_Id(userId);
    }

    // Get all users who favorited a song
    @GetMapping("/song/{songID}")
    public List<UserFavorite> getUsersBySong(@PathVariable Integer songID) {
        // Phương thức này không bị ảnh hưởng vì nó chỉ dùng SongID
        return userFavoriteRepository.findBySong_SongID(songID);
    }

    // Add song to user favorites
    @PostMapping
    public ResponseEntity<UserFavorite> addFavorite(@RequestBody UserFavorite favorite) {
        // Sử dụng favorite.getUser().getId() để lấy ID của user
        if (!userRepository.existsById(favorite.getUser().getId()) || !songRepository.existsById(favorite.getSong().getSongID())) {
            return ResponseEntity.badRequest().build();
        }

        favorite.setFavoritedAt(LocalDateTime.now());
        UserFavorite saved = userFavoriteRepository.save(favorite);
        return ResponseEntity.ok(saved);
    }

    // Remove a favorite
    @DeleteMapping("/user/{userId}/song/{songID}") // Đã đổi tên path variable từ userID thành userId
    public ResponseEntity<Void> removeFavorite(@PathVariable Integer userId, @PathVariable Integer songID) {
        // Sử dụng UserFavoriteId mới để tạo khóa
        UserFavoriteId id = new UserFavoriteId(userId, songID);

        if (!userFavoriteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        userFavoriteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
