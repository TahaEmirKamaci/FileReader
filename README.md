# FileReader Uygulaması

Bu proje, kullanıcıların JSON veya XML formatında dosya yükleyerek kişi verilerini sisteme ekleyebildiği, kullanıcı yönetimi ve JWT tabanlı kimlik doğrulama içeren bir tam yığın (full-stack) uygulamadır.

## İçerik
- [Genel Bakış](#genel-bakış)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
  - [Backend Kurulumu](#backend-kurulumu)
  - [Frontend Kurulumu](#frontend-kurulumu)
- [Kullanım](#kullanım)
- [API Endpoints](#api-endpoints)
- [Notlar](#notlar)

---

## Genel Bakış

- Kullanıcılar kayıt olabilir ve giriş yapabilir.
- Giriş yapan kullanıcılar JSON veya XML dosyası yükleyerek kişi verilerini sisteme ekleyebilir.
- Kişiler tablo halinde görüntülenebilir ve Excel'e aktarılabilir.
- JWT ile güvenli oturum yönetimi sağlanır.

## Teknolojiler

- **Backend:** Java 17+, Spring Boot, Spring Security, JWT, JPA (Hibernate), H2 veya başka bir veritabanı
- **Frontend:** React, PrimeReact, PrimeFlex, PrimeIcons, Axios, XLSX

## Kurulum

### Backend Kurulumu

1. **Dizine gidin:**
   ```bash
   cd FileReaderBackend
   ```
2. **Bağımlılıkları yükleyin ve başlatın:**
   - Windows:
     ```bash
     mvnw.cmd spring-boot:run
     ```
   - Linux/Mac:
     ```bash
     ./mvnw spring-boot:run
     ```
3. **Varsayılan olarak backend** `http://localhost:8080` adresinde çalışır.

### Frontend Kurulumu

1. **Dizine gidin:**
   ```bash
   cd FileReaderFrontend/primereact-app
   ```
2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```
3. **Uygulamayı başlatın:**
   ```bash
   npm start
   ```
4. **Varsayılan olarak frontend** `http://localhost:3000` (veya 3001) adresinde açılır.

> Eğer backend farklı bir portta çalışıyorsa, frontend köküne `.env` dosyası ekleyip şu satırı yazın:
> ```
> REACT_APP_API_URL=http://localhost:8080
> ```

## Kullanım

1. **Kayıt Ol / Giriş Yap:**
   - Uygulama açıldığında kayıt olabilir veya giriş yapabilirsiniz.
2. **Dosya Yükle:**
   - Giriş yaptıktan sonra JSON veya XML dosyası seçip yükleyebilirsiniz.
   - Yüklenen kişiler tabloya eklenir, hatalı kayıtlar ayrı gösterilir.
3. **Kişileri Görüntüle:**
   - "Kişiler" sekmesinde tüm kayıtlı kişileri görebilir ve Excel'e aktarabilirsiniz.

## API Endpoints (Özet)

- `POST /api/auth/register` — Kullanıcı kaydı
- `POST /api/auth/login` — Giriş
- `POST /api/upload/json` — JSON dosya yükleme
- `POST /api/upload/xml` — XML dosya yükleme
- `GET /api/persons` — Kişi listesini getir

## Notlar

- Backend ve frontend aynı anda çalışmalıdır.
- Dosya yükleme için backend'de `UploadController` mutlaka tanımlı olmalıdır.
- JWT token otomatik olarak isteklerde kullanılır.
- CORS ayarları backend'de `CorsConfig.java` ile yapılmıştır.
- Hatalı kayıtlar frontend'de kullanıcıya bildirilir.

---
Herhangi bir sorunla karşılaşırsanız, hata mesajını veya logları paylaşarak destek alabilirsiniz.
