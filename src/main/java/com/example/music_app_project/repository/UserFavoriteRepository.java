package com.example.music_app_project.repository;

import com.example.music_app_project.model.UserFavorite;
import com.example.music_app_project.model.UserFavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, UserFavoriteId> {
    List<UserFavorite> findByUser_Id(Long userId);

    List<UserFavorite> findBySong_SongID(Integer songID);
}
