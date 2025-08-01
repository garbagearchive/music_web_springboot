package com.example.music_app_project.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping; // Đảm bảo import LocalDateTime
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.music_app_project.dto.AuthRequest;
import com.example.music_app_project.model.User;
import com.example.music_app_project.repository.UserRepository;

@CrossOrigin(origins = "*") // Cho phép cross-origin requests từ mọi nguồn
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
        // Tạo User mới. Lưu ý: Mật khẩu nên được mã hóa (hashing) trong thực tế.
        // Hiện tại dùng trực tiếp để phù hợp với code bạn cung cấp.
        User user = new User(request.getUsername(), request.getEmail(), request.getPassword());
        user.setCreatedAt(LocalDateTime.now()); // Set createdAt nếu constructor không tự làm
        userRepository.save(user);
        return "User registered successfully!";
    }

    // Login endpoint
    @PostMapping("/login")
    public String login(@RequestBody AuthRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // So sánh mật khẩu. Lưu ý: Trong thực tế, bạn cần so sánh mật khẩu đã mã hóa.
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