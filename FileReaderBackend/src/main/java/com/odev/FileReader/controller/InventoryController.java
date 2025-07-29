package com.odev.FileReader.controller;

import com.odev.FileReader.dto.InventoryDTO;
import com.odev.FileReader.model.Category;
import com.odev.FileReader.model.Inventory;
import com.odev.FileReader.model.User;
import com.odev.FileReader.service.CategoryService;
import com.odev.FileReader.service.InventoryService;
import com.odev.FileReader.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    @GetMapping("/items")
    public ResponseEntity<List<InventoryDTO>> getItemsForCurrentUser() {
        List<InventoryDTO> items = inventoryService.getItemsForCurrentUser().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<InventoryDTO> getItemById(@PathVariable Long id) {
        return inventoryService.getItemById(id)
                .map(item -> ResponseEntity.ok(convertToDTO(item)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/items/category/{categoryId}")
    public ResponseEntity<List<InventoryDTO>> getItemsByCategoryId(@PathVariable Long categoryId) {
        List<InventoryDTO> items = inventoryService.getItemsByCategoryId(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @PostMapping("/items")
    public ResponseEntity<?> createItem(@Valid @RequestBody InventoryDTO itemDTO) {
        // Kategori kontrolü
        Optional<Category> categoryOpt = categoryService.getCategoryById(itemDTO.getCategoryId());
        if (categoryOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Kategori bulunamadı");
        }

        Inventory item = convertToEntity(itemDTO);
        item.setCategory(categoryOpt.get());


        Inventory savedItem = inventoryService.saveItem(item);
        return ResponseEntity.ok(convertToDTO(savedItem));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody InventoryDTO itemDTO) {
        Optional<Inventory> itemOpt = inventoryService.getItemById(id);
        if (itemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Kategori kontrolü
        Optional<Category> categoryOpt = categoryService.getCategoryById(itemDTO.getCategoryId());
        if (categoryOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Kategori bulunamadı");
        }

        Inventory existingItem = itemOpt.get();

        existingItem.setName(itemDTO.getName());
        existingItem.setCategory(categoryOpt.get());
        existingItem.setTotalAmount(itemDTO.getTotalAmount());

        Inventory updatedItem = inventoryService.saveItem(existingItem);
        return ResponseEntity.ok(convertToDTO(updatedItem));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        Optional<Inventory> itemOpt = inventoryService.getItemById(id);
        if (itemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Artık kullanıcı kontrolü yapmıyoruz çünkü Inventory ile User arasında ilişki
        // yok

        inventoryService.deleteItem(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignItemToUser(@RequestParam Long userId, @RequestParam Long itemId) {
        User user = userService.getUserById(userId).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        Inventory item = inventoryService.getItemById(itemId).orElseThrow(() -> new RuntimeException("Ekipman bulunamadı"));
        user.getInventoryItems().add(item);
        userService.save(user); // saveUser değil, save olmalı
        return ResponseEntity.ok("Ekipman kullanıcıya atandı.");
    }

    @PostMapping("/assign-to-self")
    public ResponseEntity<?> assignItemToSelf(@RequestParam Long itemId, Principal principal) {
        String username = principal.getName();
        User user = userService.findByUsername(username).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        Inventory item = inventoryService.getItemById(itemId).orElseThrow(() -> new RuntimeException("Ekipman bulunamadı"));
        user.getInventoryItems().add(item);
        userService.save(user);
        return ResponseEntity.ok("Ekipman kendi envanterinize atandı.");
    }

    @GetMapping("/user-items")
    public ResponseEntity<?> getUserItems(@RequestParam(required = false) Long userId, Principal principal) {
        Long id = userId;
        if (id == null) {
            // Giriş yapan kullanıcının id'sini bul
            String username = principal.getName();
            User user = userService.findByUsername(username).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
            id = user.getId();
        }
        User user = userService.getUserById(id).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        Set<Inventory> items = user.getInventoryItems();
        return ResponseEntity.ok(items);
    }

    // ADMIN: Tüm ürünleri getir
    @GetMapping("/all-products")
    public ResponseEntity<?> getAllProducts() {
        List<Inventory> products = inventoryService.getAllItems();
        return ResponseEntity.ok(products);
    }

    // USER: Sadece kullanıcının sahip olduğu ürünleri getir
    @GetMapping("/user-products")
    public ResponseEntity<?> getUserProducts(Principal principal) {
        String username = principal.getName();
        User user = userService.findByUsername(username).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        Set<Inventory> products = user.getInventoryItems();
        return ResponseEntity.ok(products);
    }

    // ADMIN: Kullanıcıdan ürün çıkarma
    @PostMapping("/remove-from-user")
    public ResponseEntity<?> removeItemFromUser(@RequestParam Long userId, @RequestParam Long itemId) {
        User user = userService.getUserById(userId).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        Inventory item = inventoryService.getItemById(itemId).orElseThrow(() -> new RuntimeException("Ekipman bulunamadı"));
        user.getInventoryItems().remove(item);
        userService.save(user);
        return ResponseEntity.ok("Ekipman kullanıcıdan çıkarıldı.");
    }

    private InventoryDTO convertToDTO(Inventory item) {
        InventoryDTO dto = new InventoryDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setCategoryId(item.getCategory().getId());
        dto.setCategoryName(item.getCategory().getName());
        dto.setTotalAmount(item.getTotalAmount());
        return dto;
    }

    private Inventory convertToEntity(InventoryDTO dto) {
        Inventory item = new Inventory();
        item.setId(dto.getId());
        item.setName(dto.getName());
        item.setTotalAmount(dto.getTotalAmount());
        return item;
    }
}