<div align="center">

  <h1>🔍 SnafasaScan</h1>

  <p>
    <strong>Extract text from any image — instantly, privately, and for free.</strong>
  </p>

  <p>
    A high-performance, full-stack WebAssembly OCR application built by <strong>Snafasa AI Agency</strong>.<br />
    100% client-side text recognition with zero server uploads.
  </p>

  <p>
    <a href="https://snafasa-scan.vercel.app"><strong style="color: #00f2fe;">Explore Live App »</strong></a>
    ·
    <a href="#-key-features">Features</a>
    ·
    <a href="#-getting-started">Quick Start</a>
    ·
    <a href="#-architecture">Architecture</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Framework-Next.js%2014-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 14" />
    <img src="https://img.shields.io/badge/OCR%20Engine-Tesseract.js%20WASM-blueviolet?style=for-the-badge" alt="Tesseract.js WASM" />
    <img src="https://img.shields.io/badge/Privacy-100%25%20Local-success?style=for-the-badge" alt="100% Local Privacy" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
  </p>

</div>

---

## 🌟 Overview

**SnafasaScan** is an open-source, privacy-first optical character recognition (OCR) application. Designed for students, professionals, and enterprise workflows, it allows users to extract text from images, documents, screenshots, and scanned PDFs directly within their web browser.

Unlike traditional OCR web tools that upload user files to external servers or paid cloud APIs, SnafasaScan runs the OCR engine locally inside the visitor's browser using **WebAssembly (WASM)**.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔒 **100% Client-Side Privacy** | Your images never touch a server. All text extraction runs locally in WebAssembly. |
| ⚡ **Instant Pre-processing** | Automatic image enhancement (grayscale, contrast boost, and sharpening) for maximum character accuracy. |
| 🌐 **Multi-Language Recognition** | Extract text in 20+ languages including English, Spanish, French, German, Arabic, Chinese, Japanese, and Hindi. |
| 📄 **Multi-Format Export** | Download extracted text cleanly as `.txt`, `.docx`, `.pdf`, or `.csv` files with a single click. |
| 📷 **Camera Capture & Drag-and-Drop** | Upload files via drag-and-drop, clipboard paste (`Ctrl+V`), or live webcam capture. |
| 🌙 **Dark Mode Included** | Built-in sleek dark mode toggle with smooth CSS variable token system. |
| 💎 **100% Free Unlimited Access** | All features, languages, export formats, and tools are 100% free with no paid plans or subscriptions. |

---

## ⚡ Comparison

| Feature | SnafasaScan | Hosted OCR APIs (Cloud) | Traditional Desktop Software |
|---|---|---|---|
| **Data Privacy** | 🟢 100% Local Browser Processing | 🔴 Uploads images to cloud servers | 🟢 Local |
| **API / Usage Cost** | 🟢 Completely Free | 🔴 Paid per 1,000 API requests | 🔴 High license fees |
| **Cross-Platform** | 🟢 Any browser (Web, Mobile, Tablet) | 🟢 Web | 🔴 OS-specific installation |
| **Speed** | ⚡ Instant (WASM) | 🟡 Network latency dependent | ⚡ Fast |

---

## 🧠 Architecture & How It Works

SnafasaScan uses a decoupled, browser-native pipeline:

```
[ User Image / Camera Capture ]
               │
               ▼
   [ Canvas 2D Pipeline ] ──► (Grayscale, Contrast Boost, Sharpening Filter)
               │
               ▼
  [ Tesseract.js WASM Engine ] ──► (Runs locally inside Browser Web Worker thread)
               │
               ▼
   [ Instant Output & Export ] ──► (.txt, .docx, .pdf, .csv downloads)
```

1. **Pre-processing:** The input image is drawn to an offscreen HTML5 `<canvas>` element to normalize illumination, enhance contrast, and sharpen text edges.
2. **Execution:** The canvas image buffer is passed to a dedicated Tesseract.js WebAssembly Web Worker thread.
3. **Formatting:** The raw OCR output is parsed into editable text and presented with 1-click copy and multi-format export capabilities.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/snafasaaiagency/snafasa-scan.git
   cd snafasa-scan
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000` to view the application.

---

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js 14 (App Router, React 18, TypeScript)
- **Styling:** Vanilla CSS design token system with Tailwind CSS utilities
- **OCR Engine:** Tesseract.js (WebAssembly / Open Source)
- **Backend & Database:** Firebase Authentication & Cloud Firestore
- **Document Export:** `jspdf` & `docx` libraries
- **Deployment:** Vercel / Cloudflare Pages ready

---

## 🤝 Contributing

Contributions are welcome! If you would like to report a bug, suggest a feature, or submit a pull request:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

  <p>Crafted with ❤️ by <strong><a href="https://snafasa.com">Snafasa AI Agency</a></strong></p>

</div>
