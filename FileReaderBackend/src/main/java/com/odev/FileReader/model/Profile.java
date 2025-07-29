package com.odev.FileReader.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Profile {
    @Id
    private Long id;
    private String role;

    
    
}