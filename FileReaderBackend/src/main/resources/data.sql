-- Roller
INSERT INTO role (name) VALUES ('ADMIN') ON DUPLICATE KEY UPDATE name = 'ADMIN';
INSERT INTO role (name) VALUES ('USER') ON DUPLICATE KEY UPDATE name = 'USER';

-- Kategoriler
INSERT INTO category (name, description) VALUES ('MASA', 'Çalışma masaları') ON DUPLICATE KEY UPDATE name = 'MASA';
INSERT INTO category (name, description) VALUES ('TELEFON', 'Cep telefonları') ON DUPLICATE KEY UPDATE name = 'TELEFON';
INSERT INTO category (name, description) VALUES ('BILGISAYAR', 'Bilgisayarlar') ON DUPLICATE KEY UPDATE name = 'BILGISAYAR';
INSERT INTO category (name, description) VALUES ('TABLET', 'Tablet cihazlar') ON DUPLICATE KEY UPDATE name = 'TABLET';
INSERT INTO category (name, description) VALUES ('AKSESUAR', 'Aksesuarlar') ON DUPLICATE KEY UPDATE name = 'AKSESUAR';


-- Kullanıcıya ürün atama örneği (admin'e 2 masa, 1 telefon, 1 kulaklık, 1 mouse)
INSERT INTO products (inventory_id, user_id, amount)
SELECT i.id, u.id, 2 FROM inventory i, users u WHERE i.name = 'Masa' AND u.username = 'emir' ON DUPLICATE KEY UPDATE amount = 2;
INSERT INTO products (inventory_id, user_id, amount)
SELECT i.id, u.id, 1 FROM inventory i, users u WHERE i.name = 'iPhone 13' AND u.username = 'emir' ON DUPLICATE KEY UPDATE amount = 1;
INSERT INTO products (inventory_id, user_id, amount)
SELECT i.id, u.id, 1 FROM inventory i, users u WHERE i.name = 'Kulaklık' AND u.username = 'emir' ON DUPLICATE KEY UPDATE amount = 1;
INSERT INTO products (inventory_id, user_id, amount)
SELECT i.id, u.id, 1 FROM inventory i, users u WHERE i.name = 'Mouse' AND u.username = 'emir' ON DUPLICATE KEY UPDATE amount = 1;