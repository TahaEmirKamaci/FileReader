# FileReader - Dosya Yükleme ve Veri Yönetim Sistemi

## Proje Özeti

FileReader, kullanıcıların JSON veya XML formatında dosya yükleyerek kişi verilerini sisteme ekleyebildiği, kullanıcı yönetimi, envanter takibi ve JWT tabanlı kimlik doğrulama içeren kapsamlı bir tam yığın (full-stack) uygulamadır. Sistem, modern web teknolojileri kullanılarak geliştirilmiş olup, kullanıcı dostu arayüzü ve güvenli yapısıyla öne çıkmaktadır.

## Özellikler

### Kullanıcı Yönetimi
- Kullanıcı kaydı ve girişi (JWT ile güvenli kimlik doğrulama)
- Rol tabanlı yetkilendirme (ADMIN ve USER rolleri)
- BCrypt ile şifre güvenliği
- Güvenli oturum yönetimi

### Dosya İşlemleri
- JSON ve XML formatında dosya yükleme desteği
- Yüklenen verilerin otomatik doğrulanması ve veritabanına kaydı
- Hatalı kayıtlar için detaylı validasyon ve kullanıcıya bildirim

### Veri Yönetimi
- Kişi verilerini tablo halinde görüntüleme
- Excel'e veri aktarma
- Filtreleme ve arama özellikleri

### Envanter Sistemi
- Kategori yönetimi
- Envanter takibi
- Kullanıcılara ekipman atama

### Arayüz
- Açık/koyu tema desteği
- Duyarlı (responsive) tasarım
- Modern ve kullanıcı dostu arayüz

## Teknolojiler

### Backend
- **Dil ve Framework:** Java 17, Spring Boot 3.2.6
- **Güvenlik:** Spring Security, JWT (JSON Web Token)
- **Veritabanı:** MySQL 8, JPA/Hibernate
- **API:** RESTful web servisleri
- **Doğrulama:** Jakarta Validation API
- **Dosya İşleme:** Jackson (JSON), JAXB (XML)

### Frontend
- **Framework:** React 18
- **UI Kütüphanesi:** PrimeReact 10, PrimeFlex, PrimeIcons
- **Durum Yönetimi:** React Context API
- **HTTP İstekleri:** Axios
- **Yönlendirme:** React Router 6
- **Veri Dışa Aktarma:** XLSX

## Sistem Mimarisi

### Backend Mimarisi
- **Controller:** API endpoint'leri ve istek yönetimi
- **Service:** İş mantığı ve veri işleme
- **Repository:** Veritabanı erişimi
- **Model:** Veri modelleri ve ilişkiler
- **DTO:** Veri transfer nesneleri
- **Security:** Kimlik doğrulama ve yetkilendirme

### Frontend Mimarisi
- **Pages:** Uygulama sayfaları
- **Components:** Yeniden kullanılabilir UI bileşenleri
- **Services:** API istekleri ve veri işleme
- **Context:** Uygulama genelinde durum yönetimi

## Veritabanı Şeması

- **role:** Kullanıcı rolleri (ADMIN, USER)
- **users:** Kullanıcı bilgileri ve kimlik doğrulama
- **category:** Envanter kategorileri
- **inventory:** Sistemdeki ekipmanlar
- **products:** Kullanıcılara atanan ekipmanlar
- **person:** Dosya yükleme ile eklenen kişi verileri

## Kurulum

### Gereksinimler
- Java 17 veya üzeri
- Node.js 14 veya üzeri
- MySQL 8 veya üzeri
- Maven

### Backend Kurulumu

1. **Projeyi klonlayın:**
   ```bash
   git clone <repo-url>
   cd FileReader
   ```

2. **MySQL'de veritabanı oluşturun:**
   ```sql
   CREATE DATABASE filereader_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **`application.properties` dosyasını düzenleyin:**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/filereader_db?useSSL=false&serverTimezone=UTC
   spring.datasource.username=<kullanıcı_adı>
   spring.datasource.password=<şifre>
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.hibernate.ddl-auto=none
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
   spring.sql.init.mode=always
   spring.jpa.defer-datasource-initialization=true
   ```

4. **Backend'i başlatın:**
   ```bash
   cd FileReaderBackend
   ./mvnw spring-boot:run   # Linux/Mac
   mvnw.cmd spring-boot:run  # Windows
   ```

### Frontend Kurulumu

1. **Bağımlılıkları yükleyin:**
   ```bash
   cd FileReaderFrontend/primereact-app
   npm install
   ```

2. **Uygulamayı başlatın:**
   ```bash
   npm start
   ```

3. **Tarayıcıda açın:** `http://localhost:3000` veya `http://localhost:3001`

## Kullanım Kılavuzu

### Kullanıcı Kaydı ve Girişi
1. Ana sayfada "Kayıt Ol" sekmesine tıklayın
2. Kullanıcı adı, e-posta ve şifre bilgilerinizi girin
3. Kayıt olduktan sonra "Giriş Yap" sekmesinden giriş yapın

### Dosya Yükleme
1. Giriş yaptıktan sonra "Dosya Yükle" menüsüne tıklayın
2. Dosya türünü seçin (JSON veya XML)
3. Dosyayı sürükleyip bırakın veya "Dosya Seç" butonuna tıklayın
4. "Yükle" butonuna tıklayarak dosyayı yükleyin
5. Yükleme sonuçlarını ve hata mesajlarını kontrol edin

### Kişileri Görüntüleme
1. "Kişiler" menüsüne tıklayın
2. Tabloda tüm kayıtlı kişileri görüntüleyin
3. Arama, filtreleme ve sıralama özelliklerini kullanın
4. "Excel'e Aktar" butonu ile verileri dışa aktarın

### Kategori ve Envanter Yönetimi
1. "Kategoriler" menüsünden kategori ekleyin veya düzenleyin
2. "Envanter" menüsünden ekipmanları görüntüleyin ve yönetin
3. "Ekipman Ata" özelliği ile kullanıcılara ekipman atayın

## API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Dosya Yükleme
- `POST /api/upload/json` - JSON dosya yükleme
- `POST /api/upload/xml` - XML dosya yükleme

### Kişi Yönetimi
- `GET /api/persons` - Tüm kişileri getir

### Kategori Yönetimi
- `GET /api/categories` - Tüm kategorileri getir
- `POST /api/categories` - Kategori ekle
- `PUT /api/categories/{id}` - Kategori güncelle
- `DELETE /api/categories/{id}` - Kategori sil

### Envanter Yönetimi
- `GET /api/inventory` - Tüm envanter öğelerini getir
- `POST /api/inventory` - Envanter öğesi ekle
- `PUT /api/inventory/{id}` - Envanter öğesi güncelle
- `DELETE /api/inventory/{id}` - Envanter öğesi sil
- `POST /api/inventory/assign` - Kullanıcıya ekipman ata

## Güvenlik Notları

- JWT token kullanılarak güvenli kimlik doğrulama sağlanmaktadır
- Şifreler BCrypt ile hashlenerek saklanmaktadır
- Rol tabanlı yetkilendirme ile kaynaklara erişim kontrol edilmektedir
- CORS ayarları ile güvenli cross-origin istekleri yapılandırılmıştır
- Hassas bilgiler (veritabanı bağlantı bilgileri vb.) güvenli şekilde saklanmalıdır

## Geliştirme Notları

- Backend ve frontend aynı anda çalışmalıdır
- Dosya yükleme için backend'de `UploadController` tanımlıdır
- JWT token otomatik olarak isteklerde kullanılır
- CORS ayarları backend'de `CorsConfig.java` ile yapılmıştır
- Hatalı kayıtlar frontend'de kullanıcıya bildirilir

## Katkıda Bulunma

Projeye katkıda bulunmak için:
1. Projeyi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

---

© 2025 FileReader Projesi