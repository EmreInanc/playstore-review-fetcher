# 📱 Play Store Review Fetcher

Google Play Store yorumlarını terminal üzerinden çeken minimal bir Node.js scripti.

Play Console'un mobil arayüzü yorumları takip etmek için kullanışlı değil — her birini teker teker açmak, filtreleme yapamamak can sıkıcı. Bu script sayesinde tek komutla tüm yorumları temiz bir formatta görürsünüz.

Yazar isimleri otomatik olarak anonim hale getirilir. (örn: `Ahmet Yılmaz` → `Ahmet Y.`)

---

## 🖥️ Örnek Çıktı

```
🔍 Son yorumlar çekiliyor...

✅ Toplam 6 güncel yorum bulundu:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Yazar  : Ahmet Y.
🌟 Puan   : ⭐⭐⭐⭐⭐ (5/5)
📱 Cihaz  : Samsung Galaxy S24 Ultra
💬 Yorum  : "Çok güzel tasarlanmış, her şeye erişim çok kolay."
─────────────────────────────────────────────────
```

---

## 🚀 Kurulum

### 1. Gereksinimler

- Node.js (v14 veya üzeri)
- Google Play Console erişimi olan bir Google hesabı

### 2. Bağımlılıkları yükleyin

```bash
npm install googleapis
```

### 3. Google Play API servis hesabı oluşturun

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. **APIs & Services → Enable APIs** kısmından `Google Play Android Developer API`'yi etkinleştirin
4. **IAM & Admin → Service Accounts** bölümünden yeni bir servis hesabı oluşturun
5. Oluşturulan hesap için JSON anahtar dosyası indirin
6. İndirilen dosyayı `play-api-credentials.json` adıyla script ile aynı klasöre koyun

### 4. Play Console'da servis hesabına yetki verin

1. [Play Console](https://play.google.com/console) → **Kullanıcılar ve İzinler** bölümüne gidin
2. Oluşturduğunuz servis hesabının e-posta adresini davet edin
3. **Finansal veriler hariç** görüntüleme iznini verin

### 5. Paket adını ve Google Cloud Console dan aldığınız play-api-xxx.json dosyasının adını güncelleyin

`fetch-reviews.js` dosyasını açın ve şu satırı kendi uygulamanıza göre düzenleyin:

```js
// Google Play API servis hesabı JSON anahtar dosyasının adı
const KEY_FILE_NAME = 'play-api-credentials.json';

// Uygulamanızın Google Play paket adı (örn: com.sirket.uygulama)
const PACKAGE_NAME = 'com.example.yourapp';
```

---

## ▶️ Çalıştırma

```bash
node fetch-reviews.js
```




## 📦 Kullanılan Paketler

| Paket | Açıklama |
|---|---|
| `googleapis` | Google API kimlik doğrulaması ve erişimi |
| `https` | HTTP istekleri (Node.js built-in) |
| `fs` / `path` | Dosya okuma (Node.js built-in) |

---

## 📄 Lisans

MIT — dilediğiniz gibi kullanabilirsiniz.
