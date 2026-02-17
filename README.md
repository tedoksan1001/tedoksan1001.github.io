# Gıda Dedektifi 🕵️‍♂️🍎

Gıda Dedektifi, gıda israfını önlemek ve sağlıklı beslenmeyi teşvik etmek amacıyla tasarlanmış bir mobil uygulama prototipidir.

## Özellikler
- **Barkod Okuyucu:** Ürünleri barkodla kaydedin, son kullanma tarihlerini takip edin.
- **Akıllı Bildirimler:** Ürününüzün süresi dolmasına 2 gün kala bildirim alın.
- **Artan Yemek Değerlendirme:** Evdeki malzemeleri seçin, size uygun tarifleri bulun.
- **eTwinning Dünya Mutfağı:** Farklı ülkelerden geleneksel tarifleri keşfedin ve kendi tariflerinizi paylaşın.
- **Biyoloji Temelli:** MEB 9. Sınıf Biyoloji müfredatındaki organik moleküller ve sağlıklı beslenme bilgilerine dayalı içerik.

## Teknik Detaylar
- **Frontend:** HTML5, CSS3 (Bootstrap 5), JavaScript (ES6).
- **Backend:** Firebase Cloud Firestore.
- **PWA:** Çevrimdışı çalışma ve ana ekrana ekleme desteği.
- **Scanner:** `html5-qrcode` kütüphanesi.

## Firebase Kurulumu
Uygulamanın çalışması için `app.js` dosyasındaki `firebaseConfig` nesnesini kendi Firebase projenizle güncellemeniz gerekebilir:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyABTomIDlkfHmW_YrL0a5vpbnxNxeed3jg",
    projectId: "gida-dedektifi",
    // ... diğer alanlar
};
```
*Not: Firestore kurallarınızın 'public' olduğundan emin olun.*

## APK Olarak Paketleme (Android)

Bu projeyi gerçek bir Android APK dosyasına dönüştürmek için aşağıdaki yöntemlerden birini kullanabilirsiniz:

### 1. Yöntem: Capacitor (Tavsiye Edilen)
En modern ve performanslı yöntemdir.
1. Proje klasöründe terminali açın:
   ```bash
   npm init -y
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init GidaDedektifi com.gidadedektifi.app
   ```
2. Android platformunu ekleyin:
   ```bash
   npx cap add android
   npx cap copy
   ```
3. Android Studio ile açıp Build edin:
   ```bash
   npx cap open android
   ```

### 2. Yöntem: Trusted Web Activities (TWA) - Bubblewrap
PWA'nızı direkt olarak Play Store uyumlu bir APK'ya dönüştürür.
1. Bubblewrap CLI yükleyin:
   ```bash
   npm install -g @bubblewrap/cli
   ```
2. Uygulamayı başlatın:
   ```bash
   bubblewrap init --manifest=manifest.json
   bubblewrap build
   ```

### 3. Yöntem: Online Araçlar
Kodlama bilmeden APK almak için [PWA2APK](https://www.pwabuilder.com/) gibi araçları kullanabilirsiniz.

---
© 2025 Gıda Dedektifi Projesi
