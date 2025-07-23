package com.odev.FileReader.dto;

import jakarta.validation.constraints.*;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlAccessType;

@XmlRootElement(name = "person")
@XmlAccessorType(XmlAccessType.FIELD)
public class PersonDTO {
    @NotBlank(message = "İsim boş olamaz")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "İsim sadece harf içermelidir")
    private String name;

    @NotBlank(message = "Email boş olamaz")
    @Email(message = "Geçersiz email")
    private String email;

    @NotNull(message = "Yaş boş olamaz")
    @Min(value = 0, message = "Yaş negatif olamaz")
    @Max(value = 120, message = "Yaş 120'den büyük olamaz")
    private Integer age;

    // Getter ve Setter'lar
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
} 