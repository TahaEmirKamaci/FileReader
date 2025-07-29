package com.odev.FileReader.controller;

import com.odev.FileReader.model.Products;
import com.odev.FileReader.model.User;
import com.odev.FileReader.model.Inventory;
import com.odev.FileReader.service.ProductsService;
import com.odev.FileReader.service.UserService;
import com.odev.FileReader.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductsController {
    @Autowired
    private ProductsService productsService;
    @Autowired
    private UserService userService;
    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/assign")
    public ResponseEntity<?> assignProduct(@RequestBody AssignRequest request) {
        // Sadece admin yetkisi kontrolü
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> adminOpt = userService.findByUsername(authentication.getName());
        if (adminOpt.isEmpty() || !"ADMIN".equals(adminOpt.get().getRole().getName())) {
            return ResponseEntity.status(403).body("Yetkisiz işlem");
        }
        Optional<User> userOpt = userService.getUserById(request.getUserId());
        Optional<Inventory> inventoryOpt = inventoryService.getItemById(request.getInventoryId());
        if (userOpt.isEmpty() || inventoryOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Kullanıcı veya ürün bulunamadı");
        }
        // Stok kontrolü (örnek: toplam stok - atanan miktar >= atanacak miktar olmalı)
        // Burada Inventory'de toplam stok tutuluyorsa, atanan miktarları toplamak gerekir
        // (Bu örnekte basitçe atama yapılacak)
        Products product = productsService.getProductByUserAndInventory(userOpt.get(), inventoryOpt.get());
        if (product == null) {
            product = new Products();
            product.setUser(userOpt.get());
            product.setInventory(inventoryOpt.get());
        }
        product.setAmount(request.getAmount());
        productsService.saveProduct(product);
        return ResponseEntity.ok("Ürün atandı");
    }

    public static class AssignRequest {
        private Long userId;
        private Long inventoryId;
        private int amount;
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getInventoryId() { return inventoryId; }
        public void setInventoryId(Long inventoryId) { this.inventoryId = inventoryId; }
        public int getAmount() { return amount; }
        public void setAmount(int amount) { this.amount = amount; }
    }
}