package com.odev.FileReader.service;


import com.odev.FileReader.dto.UserDTO;
import com.odev.FileReader.model.Role;
import com.odev.FileReader.model.User;
import com.odev.FileReader.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private RoleService roleService;

    public User register(@Valid UserDTO userDTO) throws Exception {
        // Kullanıcı adı kontrolü
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new Exception("Bu kullanıcı adı zaten kullanılıyor");
        }
        
        // Email kontrolü
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new Exception("Bu email adresi zaten kullanılıyor");
        }
        
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        
        // Varsayılan rol ataması (USER)
        Role userRole = roleService.getOrCreateRole("USER");
        user.setRole(userRole);
        
        return userRepository.save(user);
    }

    public Optional<User> login(String username, String rawPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() && passwordEncoder.matches(rawPassword, userOpt.get().getPassword())) {
            return userOpt;
        }
        return Optional.empty();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}