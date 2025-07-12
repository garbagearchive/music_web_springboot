package com.example.music_app_project.repository;

import com.example.music_app_project.model.PlayHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayHistoryRepository extends JpaRepository<PlayHistory, Integer> {
}
