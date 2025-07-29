package com.odev.FileReader.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InventoryDTO {
    private Long id;

    @NotBlank(message = "Eşya adı boş olamaz")
    private String name;

    @NotNull(message = "Kategori ID boş olamaz")
    private Long categoryId;

    private String categoryName;
    
    @NotNull(message = "Toplam miktar boş olamaz")
    private Integer totalAmount;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Description alanı kaldırıldı

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    // User ile ilgili alanlar kaldırıldı
    
    public Integer getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }
}