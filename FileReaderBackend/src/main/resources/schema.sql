-- Roller
CREATE TABLE IF NOT EXISTS role (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name ENUM('ADMIN', 'USER') NOT NULL UNIQUE
);

-- Kullanıcılar
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Kategoriler
CREATE TABLE IF NOT EXISTS category (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- Envanter (ürün türleri ve toplam sistemdeki miktar)
CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    total_amount INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- Kullanıcıya atanan ürünler (mapping tablo)
CREATE TABLE IF NOT EXISTS products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    inventory_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    amount INT NOT NULL,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_inventory (inventory_id, user_id)
);
 
CREATE TABLE IF NOT EXISTS person (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INT NOT NULL
);