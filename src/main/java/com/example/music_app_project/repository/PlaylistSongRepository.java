package com.example.music_app_project.repository;

import com.example.music_app_project.model.PlaylistSong;
import com.example.music_app_project.model.PlaylistSongId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, PlaylistSongId> {
    List<PlaylistSong> findByPlaylist_PlaylistID(Integer playlistID);

    List<PlaylistSong> findBySong_SongID(Integer songID);
}
