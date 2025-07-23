package com.odev.FileReader.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDTO {
    @NotBlank(message = "Kullanıcı adı boş olamaz")
    private String username;

    @NotBlank(message = "Email boş olamaz")
    @Email(message = "Geçersiz email")
    private String email;

    @NotBlank(message = "Şifre boş olamaz")
    @Size(min = 3, message = "Şifre en az 3 karakter olmalı")
    private String password;

    // Getter ve Setter'lar
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
} 