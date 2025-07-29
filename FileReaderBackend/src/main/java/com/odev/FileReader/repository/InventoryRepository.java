package com.odev.FileReader.repository;

import com.odev.FileReader.model.Inventory;
import com.odev.FileReader.service.InventoryItem;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByCategoryId(Long categoryId);

    InventoryItem save(InventoryItem item);
}