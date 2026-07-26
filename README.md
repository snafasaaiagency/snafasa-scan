# 🔍 SnafasaScan — Full-Stack Browser-Side OCR Web Application

> **A product of Snafasa AI Agency**  
> *Extract text from any image — privately, instantly, free.*

SnafasaScan is a full-stack Next.js web application built by **Snafasa AI Agency**. It converts image-bound text into editable, searchable, copy-pasteable text without privacy compromises or expensive monthly subscriptions.

---

## ⚡ Key Highlights

- **100% Client-Side OCR:** Powered by [Tesseract.js](https://github.com/naptha/tesseract.js) (WebAssembly). Zero image bytes ever leave the visitor's browser.
- **Zero Ongoing Cost:** Built on genuinely free tiers — Next.js 14, Tailwind CSS, Firebase Spark (Free) plan, Vercel Hobby tier, and open-source WASM OCR.
- **Canvas Image Enhancement:** Auto-grayscale, contrast boost, and sharpening pre-processing pipeline for maximum character recognition accuracy.
- **Manual Payoneer Payment Flow:** 4 feature tiers unlocked via one-time payments with in-app reference code tracking.
- **SEO & AdSense Monetization:** SEO-optimized structured data (SoftwareApplication), dynamic sitemap, blog articles, and conditional AdSense placement for non-premium users.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+
- npm 9+
- A free Firebase account ([firebase.google.com](https://firebase.google.com))

### 2. Installation
```bash
git clone https://github.com/snafasaaiagency/snafasa-scan.git
cd snafasa-scan
npm install
```

### 3. Environment Setup
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

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
[User pays on Payoneer link & submits Payoneer Transaction ID]
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

## 📄 License & Attribution

- Built by **Snafasa AI Agency** (*A product of Snafasa AI Agency*).
- OCR engine: [Tesseract.js](https://tesseract.projectnaptha.com/) (Apache-2.0 / MIT).
