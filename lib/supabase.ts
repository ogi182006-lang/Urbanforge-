// ============================================================
// UrbanForge — Supabase Client & Data Fetchers
// ============================================================
import { createClient } from "@supabase/supabase-js";
import type { Product, ProductRow } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

/** Singleton Supabase client — always use this, never create inline */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 10 } },
});

// ── Type mapper: DB row → app Product ──────────────────────────────────────
function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    original_price: row.original_price ?? undefined,
    images: row.images ?? [],
    category: row.category as Product["category"],
    tags: row.tags ?? [],
    variants: row.variants ?? [],
    stock: row.stock,
    is_featured: row.is_featured,
    is_new: row.is_new,
    rating: row.rating,
    review_count: row.review_count,
    model_3d_url: row.model_3d_url ?? undefined,
    created_at: row.created_at,
  };
}

// ── Queries ─────────────────────────────────────────────────────────────────

/** Fetch all featured products for home Bento grid */
export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("getFeaturedProducts error:", error);
    }
    return getMockProducts(); // Fallback to mock data
  }

  return (data as ProductRow[]).map(mapProduct);
}

/** Fetch single product by ID */
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("getProductById error:", error);
    }
    return getMockProducts().find((p) => p.id === id) ?? null;
  }

  return mapProduct(data as ProductRow);
}

/** Fetch product by slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return getMockProducts().find((p) => p.slug === slug) ?? null;
  }

  return mapProduct(data as ProductRow);
}

/** Fetch related products by category */
export async function getRelatedProducts(
  category: string,
  excludeId: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("id", excludeId)
    .limit(4);

  if (error) {
    return getMockProducts()
      .filter((p) => p.category === category && p.id !== excludeId)
      .slice(0, 4);
  }

  return (data as ProductRow[]).map(mapProduct);
}

/** Search products by name/tags */
export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(8);

  if (error) {
    const q = query.toLowerCase();
    return getMockProducts().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return (data as ProductRow[]).map(mapProduct);
}

/** Get all product IDs/slugs for static generation */
export async function getAllProductIds(): Promise<string[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id");

  if (error) return getMockProducts().map((p) => p.id);
  return (data as { id: string }[]).map((r) => r.id);
}

// ── Mock Data (fallback when Supabase not connected) ─────────────────────────
export function getMockProducts(): Product[] {
  return [
    {
      id: "1",
      name: "Void Runner Hoodie",
      slug: "void-runner-hoodie",
      description:
        "Premium heavyweight streetwear hoodie with embroidered chaos sigil. 400GSM fleece, oversized cut, thumb holes. Born in the streets of South Delhi.",
      price: 2499,
      original_price: 3299,
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
      ],
      category: "streetwear",
      tags: ["hoodie", "oversized", "premium", "new drop"],
      variants: [
        { id: "v1", label: "S", type: "size", stock: 5 },
        { id: "v2", label: "M", type: "size", stock: 12 },
        { id: "v3", label: "L", type: "size", stock: 8 },
        { id: "v4", label: "XL", type: "size", stock: 3 },
      ],
      stock: 28,
      is_featured: true,
      is_new: true,
      rating: 4.8,
      review_count: 124,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Neural Link Earbuds",
      slug: "neural-link-earbuds",
      description:
        "True wireless earbuds with 40dB ANC, 36hr battery. Transparent design with LED breathing effect. The ultimate Delhi commuter tech.",
      price: 4999,
      original_price: 6999,
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
        "https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?w=800&q=80",
      ],
      category: "tech",
      tags: ["earbuds", "anc", "wireless", "led"],
      variants: [
        { id: "c1", label: "Phantom Black", type: "color", stock: 15, colorHex: "#1a1a2e" },
        { id: "c2", label: "Neon Frost", type: "color", stock: 8, colorHex: "#00f0ff" },
        { id: "c3", label: "Violet Haze", type: "color", stock: 6, colorHex: "#c300ff" },
      ],
      stock: 29,
      is_featured: true,
      is_new: true,
      rating: 4.6,
      review_count: 89,
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Cipher Chain Necklace",
      slug: "cipher-chain-necklace",
      description:
        "316L stainless steel Cuban link. 10mm width, 20-inch drop. Anti-tarnish PVD coating. Urban armor for the everyday grind.",
      price: 1299,
      original_price: 1799,
      images: [
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      ],
      category: "accessories",
      tags: ["chain", "jewelry", "steel", "urban"],
      variants: [
        { id: "s1", label: "Silver", type: "color", stock: 20, colorHex: "#c0c0c0" },
        { id: "s2", label: "Gold", type: "color", stock: 14, colorHex: "#ffd700" },
        { id: "s3", label: "Black", type: "color", stock: 9, colorHex: "#1a1a1a" },
      ],
      stock: 43,
      is_featured: true,
      is_new: false,
      rating: 4.9,
      review_count: 203,
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Ghost Protocol Joggers",
      slug: "ghost-protocol-joggers",
      description:
        "Tapered cargo joggers with utility pockets, YKK zips, and reflective UrbanForge tab. 4-way stretch fabric. Made for movement.",
      price: 1899,
      original_price: 2499,
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4b4e3a?w=800&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
      ],
      category: "streetwear",
      tags: ["joggers", "cargo", "reflective", "utility"],
      variants: [
        { id: "j1", label: "S", type: "size", stock: 7 },
        { id: "j2", label: "M", type: "size", stock: 15 },
        { id: "j3", label: "L", type: "size", stock: 10 },
        { id: "j4", label: "XL", type: "size", stock: 4 },
      ],
      stock: 36,
      is_featured: true,
      is_new: false,
      rating: 4.7,
      review_count: 156,
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Forge Watch X1",
      slug: "forge-watch-x1",
      description:
        "Smart watch with AMOLED display, 7-day battery, health monitoring. Interchangeable straps. Delhi-designed, global quality.",
      price: 8999,
      original_price: 12999,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
      ],
      category: "tech",
      tags: ["smartwatch", "amoled", "fitness", "premium"],
      variants: [
        { id: "w1", label: "Midnight", type: "color", stock: 10, colorHex: "#0d0d1a" },
        { id: "w2", label: "Arctic", type: "color", stock: 6, colorHex: "#e8f4f8" },
      ],
      stock: 16,
      is_featured: true,
      is_new: true,
      rating: 4.5,
      review_count: 67,
      created_at: new Date().toISOString(),
    },
    {
      id: "6",
      name: "Phantom Slide Sandals",
      slug: "phantom-slide-sandals",
      description:
        "EVA foam slides with embossed UrbanForge dragon logo. Anti-slip base, adjustable strap. Summer staple for the urban dweller.",
      price: 799,
      original_price: 1199,
      images: [
        "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80",
        "https://images.unsplash.com/photo-1622782914767-404fb9ab3f57?w=800&q=80",
      ],
      category: "footwear",
      tags: ["slides", "summer", "casual", "logo"],
      variants: [
        { id: "sl1", label: "UK 7", type: "size", stock: 12 },
        { id: "sl2", label: "UK 8", type: "size", stock: 18 },
        { id: "sl3", label: "UK 9", type: "size", stock: 14 },
        { id: "sl4", label: "UK 10", type: "size", stock: 8 },
        { id: "sl5", label: "UK 11", type: "size", stock: 5 },
      ],
      stock: 57,
      is_featured: false,
      is_new: false,
      rating: 4.4,
      review_count: 312,
      created_at: new Date().toISOString(),
    },
    {
      id: "7",
      name: "Signal Cap",
      slug: "signal-cap",
      description:
        "6-panel structured cap with 3M reflective embroidery. One-size adjustable snapback. The finishing touch for every fit.",
      price: 699,
      original_price: 999,
      images: [
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80",
      ],
      category: "accessories",
      tags: ["cap", "snapback", "reflective", "headwear"],
      variants: [
        { id: "cap1", label: "Black", type: "color", stock: 25, colorHex: "#1a1a1a" },
        { id: "cap2", label: "Navy", type: "color", stock: 18, colorHex: "#0a1628" },
        { id: "cap3", label: "Cream", type: "color", stock: 12, colorHex: "#f5f0e8" },
      ],
      stock: 55,
      is_featured: false,
      is_new: true,
      rating: 4.6,
      review_count: 178,
      created_at: new Date().toISOString(),
    },
    {
      id: "8",
      name: "Ultrawide Desk Mat",
      slug: "ultrawide-desk-mat",
      description:
        "900×400mm RGB desk mat with LED edge lighting, splash-resistant surface. Optimize your entire setup for maximum aesthetic.",
      price: 1499,
      original_price: 1999,
      images: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
        "https://images.unsplash.com/photo-1593152167544-085d3b9c4938?w=800&q=80",
      ],
      category: "tech",
      tags: ["desk mat", "rgb", "gaming", "setup"],
      variants: [
        { id: "dm1", label: "Standard", type: "size", stock: 30 },
        { id: "dm2", label: "Extended XL", type: "size", stock: 18 },
      ],
      stock: 48,
      is_featured: false,
      is_new: false,
      rating: 4.8,
      review_count: 95,
      created_at: new Date().toISOString(),
    },
  ];
}
