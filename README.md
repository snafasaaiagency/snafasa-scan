# 🔍 SnafasaScan — Full-Stack Browser-Side OCR Web Application

> **A product of Snafasa AI Agency**  
> *Extract text from any image — privately, instantly, free.*

SnafasaScan is a full-stack Next.js web application built for **Snafasa AI Agency**. It solves a major pain point: converting image-bound text into editable, searchable, copy-pasteable text without privacy compromises or expensive monthly subscriptions.

---

## ⚡ Key Highlights

- **100% Client-Side OCR:** Powered by [Tesseract.js](https://github.com/naptha/tesseract.js) (WebAssembly). Zero image bytes ever leave the visitor's browser.
- **Zero Ongoing Cost:** Built entirely on genuinely free tiers — Next.js 14, Tailwind CSS, Firebase Spark (Free) plan, Vercel Hobby tier, and open-source WASM OCR.
- **Canvas Image Enhancement:** Auto-grayscale, contrast boost, and sharpening pre-processing pipeline for maximum character recognition accuracy.
- **Manual Payoneer Payment Flow:** 4 feature tiers unlocked via one-time payments with in-app reference code tracking and admin screenshot review.
- **SEO & AdSense Monetization:** SEO-optimized structured data (SoftwareApplication), dynamic sitemap, blog articles, and conditional AdSense placement for non-premium users.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+
- npm 9+
- A free Firebase account ([firebase.google.com](https://firebase.google.com))

### 2. Installation
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/snafasa-scan.git
cd snafasa-scan
npm install
```

### 3. Environment Setup
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Fill in your Firebase keys (see [Firebase Setup Guide](#-firebase-setup-guide) below).

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔥 Firebase Setup Guide (Free Spark Plan)

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Create a project**. Name it `snafasa-scan`.
2. Enable **Firebase Analytics** (free, unlimited).
3. **Authentication:**
   - Go to **Build → Authentication → Get Started**.
   - Enable **Email/Password** sign-in.
   - Enable **Google Sign-in**.
4. **Cloud Firestore:**
   - Go to **Build → Firestore Database → Create database**.
   - Choose production mode and your preferred location.
   - Copy the contents of `firestore.rules` into the Rules tab and click **Publish**.
5. **Firebase Storage:**
   - Go to **Build → Storage → Get Started**.
   - Copy the contents of `storage.rules` into the Rules tab and click **Publish**.
6. **Get Config Keys:**
   - Go to **Project Settings (Gear icon) → General → Your apps → Add Web App**.
   - Copy the `firebaseConfig` object values into your `.env.local` file.

---

## 👑 First Admin Setup

Clients cannot self-assign `admin` roles due to Firestore security rules. To grant yourself admin access for the `/admin` dashboard:

1. Sign up for an account on your live app or local server.
2. Open **Firebase Console → Firestore Database → `users` collection**.
3. Locate your user document (ID matches your Auth UID).
4. Edit or add the field: `role` (string) = `"admin"`.
5. Refresh the app — your account menu will now display an **Admin** link to `/admin`.

---

## 💳 Payment Verification Flow Architecture

Payoneer hosted links do not provide direct webhooks without a registered marketplace API account. SnafasaScan implements a **smooth manual verification workflow**:

```
[User selects Tier on /pricing]
          │
          ▼
[App generates Order Ref SNF-XXXXXX & saves pendingPayments doc]
          │
          ▼
[User pays on Payoneer link & uploads screenshot + transaction ID]
          │
          ▼
[Doc status updates to 'submitted'] ──► App displays 'Reviewing...' state
          │
          ▼
[Admin opens /admin, verifies Payoneer dashboard, clicks Approve]
          │
          ▼
[Firestore updates users/{uid}.plan to Tier]
          │
          ▼
[Real-time listener on client upgrades UI instantly without page refresh!]
```

---

## ⚠️ Important Note on Vercel Hobby Terms (Fair-Use Boundary)

Vercel's free Hobby plan terms state that requesting payments or serving ads is intended for non-commercial or personal projects. While small side projects frequently run monetization on Hobby without issue, SnafasaScan is architected for **zero vendor lock-in**:

- No Vercel-proprietary APIs (`@vercel/kv`, `@vercel/postgres`, Vercel Functions) are used.
- The build produces standard static/Next.js output.
- If you ever need to migrate away from Vercel, you can deploy the exact same repository to **Cloudflare Pages** or **Netlify** in under 5 minutes without changing a single line of code.

---

## 📢 Google AdSense Setup

1. Deploy SnafasaScan to your production domain with real legal pages and content.
2. Apply for Google AdSense with your custom domain.
3. Once approved, copy your Publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXXX`).
4. Set `NEXT_PUBLIC_ADSENSE_CLIENT` in your Vercel project environment variables.
5. Ad slots will automatically begin rendering for free-tier and unauthenticated visitors (premium users will remain completely ad-free).

---

## 🛣️ Phase 2 Roadmap & Future Improvements

- **Payoneer Checkout API / Automatic Webhooks:** Investigate Payoneer Business Checkout API or an alternative zero-monthly-cost processor (e.g., Paddle/LemonSqueezy) for instant automated tier unlocking.
- **Batch Export to ZIP:** Enhanced JSZip bundling for 50+ image conversions.
- **Offline PWA Support:** Service worker caching for 100% offline conversion capability once loaded.

---

## 📄 License & Attribution

- Built for **Snafasa AI Agency** (Footer credit: *A product of Snafasa AI Agency*).
- OCR engine: [Tesseract.js](https://tesseract.projectnaptha.com/) (Apache-2.0 / MIT).
