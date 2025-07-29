package com.odev.FileReader.service;

import com.odev.FileReader.model.Products;
import com.odev.FileReader.model.User;
import com.odev.FileReader.model.Inventory;
import com.odev.FileReader.repository.ProductsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductsService {
    @Autowired
    private ProductsRepository productsRepository;

    public List<Products> getProductsByUser(User user) {
        return productsRepository.findByUser(user);
    }

    public List<Products> getProductsByInventory(Inventory inventory) {
        return productsRepository.findByInventory(inventory);
    }

    public Products getProductByUserAndInventory(User user, Inventory inventory) {
        return productsRepository.findByUserAndInventory(user, inventory);
    }

    public Products saveProduct(Products product) {
        return productsRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productsRepository.deleteById(id);
    }
}