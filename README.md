# 📱 Play Store Review Fetcher

A minimal Node.js script that fetches your Google Play Store reviews directly from the terminal.

Play Console's mobile UI makes it painful to track reviews — you open them one by one, no filtering, no export. This script gives you all your reviews in a clean, readable format with a single command.

---

## 🖥️ Example Output

```
🔍 Fetching latest reviews...

✅ Found 6 review(s):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Author  : John Doe
🌟 Rating  : ⭐⭐⭐⭐⭐ (5/5)
📱 Device  : Samsung Galaxy S24 Ultra
💬 Review  : "First time I've seen a free app like this on the market."
─────────────────────────────────────────────────
```

---

## 🚀 Setup

### 1. Requirements

- Node.js v14 or higher
- A Google account with access to Google Play Console

### 2. Install dependencies

```bash
npm install googleapis
```

### 3. Create a Google Play API service account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Play Android Developer API** under APIs & Services
4. Go to **IAM & Admin → Service Accounts** and create a new service account
5. Generate and download a JSON key for the service account
6. Rename the downloaded file to `play-api-credentials.json` and place it in the same folder as the script

### 4. Grant access in Play Console

1. Go to [Play Console](https://play.google.com/console) → **Users and Permissions**
2. Invite the service account email address
3. Grant **View app information** permission (no financial access needed)

### 5. Update your package name and the JSON key file name from Google Cloud Console

Open `fetch-reviews.js` and update the following lines:

```js
// Name of your Google Play API service account JSON key file
const KEY_FILE_NAME = 'play-api-credentials.json';

// Your app's Google Play package name (e.g. com.company.appname)
const PACKAGE_NAME = 'com.example.yourapp';
```

---

## ▶️ Run

```bash
node fetch-reviews.js
```


play-api-credentials.json
```

---

## 📦 Dependencies

| Package | Description |
|---|---|
| `googleapis` | Google API authentication and access |
| `https` | HTTP requests (Node.js built-in) |
| `fs` / `path` | File reading (Node.js built-in) |

---

## 📄 License

MIT — use it however you like.
