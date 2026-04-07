const { google } = require('googleapis');
const https = require('https');
const path = require('path');
const fs = require('fs');

// ─────────────────────────────────────────────
// YAPILANDIRMA — Kendi uygulamanız için burası değiştirin
// ─────────────────────────────────────────────

// Google Play API servis hesabı JSON anahtar dosyasının adı
const KEY_FILE_NAME = 'play-api-credentials.json';

// Uygulamanızın Google Play paket adı (örn: com.sirket.uygulama)
const PACKAGE_NAME = 'com.example.yourapp';

// ─────────────────────────────────────────────

// Anahtar dosyasını okuyup private key'i parse ediyoruz
const keyFile = fs.readFileSync(path.join(__dirname, KEY_FILE_NAME), 'utf8');
const key = JSON.parse(keyFile);
const privateKey = key.private_key.replace(/\\n/g, '\n');

// Google Play Publisher API temel URL'i
const BASE_URL = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications';


// ─────────────────────────────────────────────
// Verilen URL'e Authorization header ile GET isteği atar
// ─────────────────────────────────────────────
function httpsGet(url, accessToken) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Authorization: `Bearer ${accessToken}` } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    }).on('error', reject);
  });
}

// ─────────────────────────────────────────────
// Ana fonksiyon: Play Store yorumlarını çeker ve konsola yazar
// ─────────────────────────────────────────────
async function fetchLatestReviews() {

  // Google servis hesabı ile JWT kimlik doğrulaması yapıyoruz
  const auth = new google.auth.JWT({
    email: key.client_email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });

  // Erişim token'ı alıyoruz
  const tokenResponse = await auth.getAccessToken();
  const accessToken = tokenResponse.token;

  // Play Publisher API'den yorumları çekiyoruz
  const url = `${BASE_URL}/${PACKAGE_NAME}/reviews`;

  console.log('🔍 Son yorumlar çekiliyor...\n');
  const result = await httpsGet(url, accessToken);

  // Hata durumunu kontrol ediyoruz
  if (result.status !== 200) {
    console.error(`❌ Yorumlar alınamadı (HTTP ${result.status}):`, JSON.stringify(result.body, null, 2));
    return;
  }

  const reviews = result.body.reviews || [];

  if (reviews.length === 0) {
    console.log('⚠️  Henüz hiç yorum bulunmuyor.');
    return;
  }

  console.log(`✅ Toplam ${reviews.length} güncel yorum bulundu:\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  reviews.forEach((review) => {
    // Google Play yorum verisi iç içe JSON yapısındadır
    const userComment = review.comments[0].userComment;

    const author = review.authorName || 'Gizli Kullanıcı';

    const stars = userComment.starRating;
    const text = userComment.text ? userComment.text.trim() : '(Yorum metni yok)';

    // Cihaz bilgilerini güvenli şekilde okuyoruz (bazı kullanıcılarda bu bilgi olmayabilir)
    const deviceMeta = userComment.deviceMetadata || {};
    const deviceName = deviceMeta.productName || 'Bilinmeyen Cihaz';
    const manufacturer = deviceMeta.manufacturer || '';
    const deviceFull = manufacturer ? `${manufacturer} ${deviceName}` : deviceName;

    // Yıldız puanını görsel olarak gösteriyoruz
    const starVisual = '⭐'.repeat(stars) + '☆'.repeat(5 - stars);

    console.log(`👤 Yazar  : ${author}`);
    console.log(`🌟 Puan   : ${starVisual} (${stars}/5)`);
    console.log(`📱 Cihaz  : ${deviceFull}`);
    console.log(`💬 Yorum  : "${text}"`);
    console.log('─────────────────────────────────────────────────');
  });
}

fetchLatestReviews();
