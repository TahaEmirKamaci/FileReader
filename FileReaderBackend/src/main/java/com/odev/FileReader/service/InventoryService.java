package com.odev.FileReader.service;

import com.odev.FileReader.model.Inventory;
import com.odev.FileReader.model.Role;
import com.odev.FileReader.model.User;
import com.odev.FileReader.repository.InventoryRepository;
import com.odev.FileReader.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleService roleService;

    public List<Inventory> getAllItems() {
        return inventoryRepository.findAll();
    }

    public Optional<Inventory> getItemById(Long id) {
        return inventoryRepository.findById(id);
    }

    public Inventory saveItem(Inventory item) {
        return inventoryRepository.save(item);
    }

    public void deleteItem(Long id) {
        inventoryRepository.deleteById(id);
    }

    // User ile ilgili metodlar kaldırıldı çünkü Inventory artık User ile ilişkili
    // değil

    public List<Inventory> getItemsByCategoryId(Long categoryId) {
        return inventoryRepository.findByCategoryId(categoryId);
    }

    // Tüm kullanıcılar tüm envanter öğelerini görebilir
    public List<Inventory> getItemsForCurrentUser() {
        // Artık Inventory ile User arasında doğrudan bir ilişki yok
        // Bu nedenle tüm kullanıcılar tüm envanter öğelerini görebilir
        return getAllItems();

        // Not: Eğer kullanıcıya özel envanter öğeleri gerekiyorsa,
        // Products tablosu üzerinden ilişki kurulabilir
    }

    public void assignItemToUser(Long userId, Long itemId) {
        User user = userRepository.findById(userId).orElseThrow();
        Inventory item = inventoryRepository.findById(itemId).orElseThrow();
        user.getInventoryItems().add(item); // Doğru alan
        userRepository.save(user);
    }
}