package com.example.music_app_project.repository;

import com.example.music_app_project.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre, Integer> {
    boolean existsByName(String name);
}
