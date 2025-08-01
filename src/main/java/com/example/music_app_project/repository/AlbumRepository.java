package com.example.music_app_project.repository;

import com.example.music_app_project.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlbumRepository extends JpaRepository<Album, Integer> {
    boolean existsByTitle(String title);
}
