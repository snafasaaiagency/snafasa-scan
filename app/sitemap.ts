import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE_URL = getBaseUrl();
  const routes = [
    "",
    "/convert",
    "/account",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/refund-policy",
    "/blog",
    "/blog/ultimate-guide-in-browser-wasm-ocr-privacy",
    "/blog/how-to-extract-text-from-scanned-pdf",
    "/blog/ocr-best-practices-document-photography",
    "/blog/free-vs-paid-ocr-tools-comparison",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/blog") ? "weekly" : "daily",
    priority: route === "" ? 1.0 : route === "/convert" ? 0.9 : 0.7,
  }));
}
