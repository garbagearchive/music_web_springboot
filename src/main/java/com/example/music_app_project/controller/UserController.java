package com.example.music_app_project.controller;

import com.example.music_app_project.model.User;
import com.example.music_app_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
// Không cần import LocalDateTime ở đây nữa vì việc set createdAt đã được đẩy xuống model

@CrossOrigin(origins = "*") // Cho phép cross-origin requests
@RestController
@RequestMapping("/api/users") // Base path cho các API về User
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Lấy tất cả người dùng
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Lấy người dùng theo ID
    @GetMapping("/{id}") // Đường dẫn sử dụng {id}
    public ResponseEntity<User> getUserById(@PathVariable Integer id) { // Tham số là 'id'
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo người dùng mới
    // Lưu ý: Đối với đăng ký, nên dùng AuthController. Phương thức này có thể dùng cho Admin tạo user.
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // Loại bỏ dòng này vì @PrePersist trong model User đã xử lý việc set createdAt
        // if (user.getCreatedAt() == null) {
        //     user.setCreatedAt(LocalDateTime.now());
        // }
        // Lưu ý: Mật khẩu nên được mã hóa trước khi lưu vào database trong thực tế.
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // Cập nhật thông tin người dùng
    @PutMapping("/{id}") // Đường dẫn sử dụng {id}
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User userDetails) { // Tham số là 'id'
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            // Cập nhật các trường thông tin cần thiết
            existingUser.setUsername(userDetails.getUsername());
            existingUser.setEmail(userDetails.getEmail());
            // Cẩn thận khi cập nhật mật khẩu, thường sẽ có một endpoint riêng hoặc quy trình phức tạp hơn
            existingUser.setPassword(userDetails.getPassword()); // Cập nhật mật khẩu nếu có
            // created_at thường không được cập nhật

            User updatedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Xóa người dùng theo ID
    @DeleteMapping("/{id}") // Đường dẫn sử dụng {id}
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) { // Tham số là 'id'
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}