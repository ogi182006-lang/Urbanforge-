// ============================================================
// UrbanForge — Dynamic Sitemap (app/sitemap.ts)
// ============================================================
import type { MetadataRoute } from "next";
import { getAllProductIds } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://urbanforge.in";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...(["streetwear", "tech", "accessories", "footwear"] as const).map((cat) => ({
      url: `${baseUrl}/products?category=${cat}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const ids = await getAllProductIds();
    productPages = ids.map((id) => ({
      url: `${baseUrl}/products/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch {
    // Silently fail — sitemap will still include static pages
  }

  return [...staticPages, ...productPages];
}
