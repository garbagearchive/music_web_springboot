package com.example.music_app_project.dto;

public class AuthRequest {
    private String username;
    private String email; // for register
    private String password; // This field is used for both login and register

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}