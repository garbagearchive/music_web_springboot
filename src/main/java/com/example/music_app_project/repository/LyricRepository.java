package com.example.music_app_project.repository;

import com.example.music_app_project.model.Lyric;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LyricRepository extends JpaRepository<Lyric, Integer> {
    List<Lyric> findBySongSongID(Integer songID); // Optional: find all lyrics for a song
}
