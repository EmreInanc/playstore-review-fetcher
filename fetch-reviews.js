const { google } = require('googleapis');
const https = require('https');
const path = require('path');
const fs = require('fs');

// ─────────────────────────────────────────────
// CONFIGURATION — Update these for your app
// ─────────────────────────────────────────────

// Name of your Google Play API service account JSON key file
const KEY_FILE_NAME = 'play-api-credentials.json';

// Your app's Google Play package name (e.g. com.company.appname)
const PACKAGE_NAME = 'com.example.yourapp';

// ─────────────────────────────────────────────

// Read and parse the service account key file
const keyFile = fs.readFileSync(path.join(__dirname, KEY_FILE_NAME), 'utf8');
const key = JSON.parse(keyFile);
const privateKey = key.private_key.replace(/\\n/g, '\n');

// Google Play Android Publisher API base URL
const BASE_URL = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications';

// ─────────────────────────────────────────────
// Makes an authenticated GET request to the given URL
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
// Main function: fetches Play Store reviews and prints them to the console
// ─────────────────────────────────────────────
async function fetchLatestReviews() {

  // Authenticate using a Google service account via JWT
  const auth = new google.auth.JWT({
    email: key.client_email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });

  // Obtain an access token
  const tokenResponse = await auth.getAccessToken();
  const accessToken = tokenResponse.token;

  // Fetch reviews from the Play Publisher API
  const url = `${BASE_URL}/${PACKAGE_NAME}/reviews`;

  console.log('🔍 Fetching latest reviews...\n');
  const result = await httpsGet(url, accessToken);

  // Handle errors
  if (result.status !== 200) {
    console.error(`❌ Failed to fetch reviews (HTTP ${result.status}):`, JSON.stringify(result.body, null, 2));
    return;
  }

  const reviews = result.body.reviews || [];

  if (reviews.length === 0) {
    console.log('⚠️  No reviews found yet.');
    return;
  }

  console.log(`✅ Found ${reviews.length} review(s):\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  reviews.forEach((review) => {
    // Google Play review data is nested inside a comments array
    const userComment = review.comments[0].userComment;

    const author = review.authorName || 'Anonymous';

    const stars = userComment.starRating;
    const text = userComment.text ? userComment.text.trim() : '(No review text)';

    // Device metadata may not be present for all users
    const deviceMeta = userComment.deviceMetadata || {};
    const deviceName = deviceMeta.productName || 'Unknown Device';
    const manufacturer = deviceMeta.manufacturer || '';
    const deviceFull = manufacturer ? `${manufacturer} ${deviceName}` : deviceName;

    // Visual star rating
    const starVisual = '⭐'.repeat(stars) + '☆'.repeat(5 - stars);

    console.log(`👤 Author  : ${author}`);
    console.log(`🌟 Rating  : ${starVisual} (${stars}/5)`);
    console.log(`📱 Device  : ${deviceFull}`);
    console.log(`💬 Review  : "${text}"`);
    console.log('─────────────────────────────────────────────────');
  });
}

fetchLatestReviews();
