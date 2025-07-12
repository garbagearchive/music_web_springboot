package com.example.music_app_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.music_app_project.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
