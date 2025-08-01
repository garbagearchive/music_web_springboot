package com.example.music_app_project.repository;

import com.example.music_app_project.model.SyncedLyric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SyncedLyricRepository extends JpaRepository<SyncedLyric, Integer> {
    List<SyncedLyric> findBySong_SongIDOrderByTimeStampSeconds(Integer songID);
}
