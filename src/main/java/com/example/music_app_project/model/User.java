package com.example.music_app_project.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Đổi từ userID thành id để khớp với schema bạn cung cấp

    @Column(nullable = false, length = 100, unique = true)
    private String username;

    @Column(nullable = false, length = 255, unique = true)
    private String email;

    // Thay đổi từ passwordHash thành password để khớp với Controller và DB schema
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    // Đảm bảo tên cột trong DB là CreatedAt, và tên trường là createdAt
    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    // Constructor mặc định (cần thiết cho JPA)
    public User() {
    }

    // Constructor cho việc đăng ký (phù hợp với AuthController)
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        // createdAt sẽ được set bởi @PrePersist hoặc bởi hàm gọi
    }

    // --- Getters và Setters ---

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Getter và Setter cho trường password
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
        // Trả về thời gian hiện tại nếu không được set
    }

    // Phương thức này sẽ được gọi trước khi lưu đối tượng vào DB lần đầu
    @PrePersist
    protected void onCreated() {
        if (this.createdAt == null) { // Chỉ set nếu chưa được set bởi constructor
            this.createdAt = LocalDateTime.now();
        }
    }
}
