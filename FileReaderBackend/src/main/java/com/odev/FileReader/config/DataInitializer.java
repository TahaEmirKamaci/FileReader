package com.odev.FileReader.config;

import com.odev.FileReader.model.Category;
import com.odev.FileReader.model.Inventory;
import com.odev.FileReader.model.Role;
import com.odev.FileReader.model.User;
import com.odev.FileReader.service.CategoryService;
import com.odev.FileReader.service.InventoryService;
import com.odev.FileReader.service.RoleService;
import com.odev.FileReader.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleService roleService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private InventoryService inventoryService;
    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Statik rolleri oluştur
        createRoleIfNotExists("ADMIN");
        createRoleIfNotExists("USER");

        // Kategorileri ve örnek ürünleri oluştur
        createCategoriesAndItems();
    }

    private void createRoleIfNotExists(String roleName) {
        roleService.getRoleByName(roleName)
                .orElseGet(() -> {
                    Role role = new Role(roleName);
                    return roleService.saveRole(role);
                });
    }

    private void createCategoriesAndItems() {
        // Kategoriler ve ürünler
        Object[][] data = {
            {"Kalem", "Yazı gereci", new String[][]{{"Tükenmez Kalem", "Mavi mürekkepli"}, {"Kurşun Kalem", "HB"}}},
            {"Defter", "Not tutma aracı", new String[][]{{"Çizgili Defter", "A4 boyut"}, {"Kareli Defter", "A5 boyut"}}},
            {"Bilgisayar", "Elektronik cihaz", new String[][]{{"Dizüstü Bilgisayar", "16GB RAM"}, {"Masaüstü Bilgisayar", "i5 işlemci"}}},
            {"Telefon", "İletişim aracı", new String[][]{{"Cep Telefonu", "Android"}, {"Sabit Telefon", "Ofis tipi"}}},
            {"Çanta", "Taşıma aracı", new String[][]{{"Sırt Çantası", "Su geçirmez"}, {"Evrak Çantası", "Deri"}}},
            {"Kitap", "Okuma materyali", new String[][]{{"Roman", "Kurgusal"}, {"Ders Kitabı", "Matematik"}}}
        };
        // İlk kullanıcıyı ürünlerin sahibi olarak ata (varsa)
        User owner = userService.getAllUsers().stream().findFirst().orElse(null);
        for (Object[] cat : data) {
            String catName = (String) cat[0];
            String catDesc = (String) cat[1];
            String[][] items = (String[][]) cat[2];
            Category category = categoryService.getOrCreateCategory(catName, catDesc);
            if (owner != null) {
                for (String[] item : items) {
                    String itemName = item[0];
                    String itemDesc = item[1]; // Bu bilgiyi şu an kullanmıyoruz ama ileride gerekebilir
                    Inventory invItem = new Inventory(itemName, category, 10); // Varsayılan olarak 10 adet
                    inventoryService.saveItem(invItem);
                }
            }
        }
    }
}