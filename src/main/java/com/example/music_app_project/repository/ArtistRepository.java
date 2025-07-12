package com.example.music_app_project.repository;

import com.example.music_app_project.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtistRepository extends JpaRepository<Artist, Integer> {
    boolean existsByName(String name);
}
