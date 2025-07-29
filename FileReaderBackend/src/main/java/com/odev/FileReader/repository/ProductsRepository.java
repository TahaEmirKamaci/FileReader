package com.odev.FileReader.repository;

import com.odev.FileReader.model.Products;
import com.odev.FileReader.model.User;
import com.odev.FileReader.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductsRepository extends JpaRepository<Products, Long> {
    List<Products> findByUser(User user);
    List<Products> findByInventory(Inventory inventory);
    Products findByUserAndInventory(User user, Inventory inventory);
}