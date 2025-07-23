package com.odev.FileReader.controller;

import com.odev.FileReader.dto.UserDTO;
import com.odev.FileReader.model.User;
import com.odev.FileReader.security.JwtUtil;
import com.odev.FileReader.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDTO userDTO) {
        User user = userService.register(userDTO);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
        return userService.login(userDTO.getUsername(), userDTO.getPassword())
                .<ResponseEntity<?>>map(user -> {
                    String token = jwtUtil.generateToken(user.getUsername());
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("token", token);
                    resp.put("username", user.getUsername());
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.status(401).body("Kullanıcı adı veya şifre hatalı!"));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
} 