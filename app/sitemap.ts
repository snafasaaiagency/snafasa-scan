import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://snafasascan.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/convert",
    "/pricing",
    "/account",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/refund-policy",
    "/blog",
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
