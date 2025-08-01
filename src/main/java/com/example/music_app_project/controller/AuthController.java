package com.example.music_app_project.controller;

import com.example.music_app_project.dto.AuthRequest;
import com.example.music_app_project.model.User;
import com.example.music_app_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Register endpoint
    @PostMapping("/register")
    public String register(@RequestBody AuthRequest request) {
        Optional<User> existingUser = userRepository.findByUsername(request.getUsername());
        if (existingUser.isPresent()) {
            return "Username already exists!";
        }
        User user = new User(request.getUsername(), request.getEmail(), request.getPassword());
        userRepository.save(user);
        return "User registered successfully!";
    }

    // Login endpoint
    @PostMapping("/login")
    public String login(@RequestBody AuthRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(request.getPassword())) {
                return "Login successful!";
            }
        }
        return "Invalid username or password";
    }

    // Forgot Password endpoint
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return "Password reset instructions sent to " + email;
        } else {
            return "Email not found!";
        }
    }

    @GetMapping("/")
    public String home() {
        return "Auth API is running!";
    }

    @GetMapping("/test")
    public String test() {
        return "AuthController is working!";
    }
}
