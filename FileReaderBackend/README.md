# FileReader Uygulaması

Bu proje, kullanıcıların JSON veya XML formatında dosya yükleyerek veritabanına veri kaydedebildiği, JWT ile güvenli giriş/çıkış işlemlerinin olduğu modern bir Spring Boot uygulamasıdır.

## Özellikler
- Kullanıcı kayıt ve giriş (JWT ile kimlik doğrulama)
- BCrypt ile şifre güvenliği
- JSON/XML dosya yükleme ve veritabanına kayıt
- Yüklenen verileri tablo olarak görüntüleme ve Excel'e aktarma
- Hatalı kayıtlar için detaylı validasyon ve kullanıcıya hata mesajı
- Modern, kullanıcı dostu arayüz (Bootstrap)

## Kurulum

### 1. Backend (Spring Boot)

1. **Projeyi klonlayın:**
   ```sh
   git clone <repo-url>
   cd FileReader
   ```
2. **Gerekli Java sürümünü kurun:**
   - Java 17 önerilir.
3. **MySQL'de bir veritabanı oluşturun:**
   ```sql
   CREATE DATABASE filereader_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. **`src/main/resources/application.properties` dosyasını oluşturun:**
   > **Dikkat:** Bu dosya **gizli** tutulmalı, Github'a yüklenmemelidir!
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/filereader_db?useSSL=false&serverTimezone=UTC
   spring.datasource.username=KENDI_KULLANICI_ADINIZ
   spring.datasource.password=KENDI_SIFRENIZ
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
   ```
5. **Projeyi derleyin ve başlatın:**
   ```sh
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

### 2. Frontend
- `index.html` dosyasını doğrudan Spring Boot ile kullanabilirsiniz: `http://localhost:8080/index.html`

## Güvenlik
- `application.properties` dosyanızı **asla Github'a yüklemeyin**. Kullanıcı adı, şifre gibi hassas bilgileri gizli tutun.
- `.gitignore` dosyanıza şu satırı ekleyin:
  ```
  src/main/resources/application.properties
  ```

## Katkı
Pull request ve issue'larınızı bekliyoruz!

## Lisans
MIT 