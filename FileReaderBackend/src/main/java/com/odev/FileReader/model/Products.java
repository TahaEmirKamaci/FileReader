package com.odev.FileReader.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products", uniqueConstraints = {@UniqueConstraint(columnNames = {"inventory_id", "user_id"})})
public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int amount;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Inventory getInventory() { return inventory; }
    public void setInventory(Inventory inventory) { this.inventory = inventory; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public int getAmount() { return amount; }
    public void setAmount(int amount) { this.amount = amount; }
}