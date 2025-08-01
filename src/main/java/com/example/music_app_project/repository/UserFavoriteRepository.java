package com.example.music_app_project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.music_app_project.model.UserFavorite;
import com.example.music_app_project.model.UserFavoriteId;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, UserFavoriteId> {
    // Tìm tất cả các bài hát yêu thích của một người dùng
    // Sử dụng findByUser_Id để ánh xạ đến trường 'id' trong đối tượng User
    List<UserFavorite> findByUser_Id(Integer userId);

    // Tìm tất cả người dùng yêu thích một bài hát
    // Sử dụng findBySong_SongID để ánh xạ đến trường 'songID' trong đối tượng Song
    List<UserFavorite> findBySong_SongID(Integer songId);

    // Phương thức tìm kiếm bằng id phức hợp vẫn giữ nguyên
}
