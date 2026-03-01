// ============================================================
// UrbanForge — Product Detail Page (/products/[id])
// ============================================================
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import {
  getProductById,
  getRelatedProducts,
  getAllProductIds,
  getMockProducts,
} from "@/lib/supabase";
import { formatPrice, discountPercent, categoryColors, cn } from "@/lib/utils";
import ProductDetailClient from "./ProductDetailClient";
import StockBadge from "@/components/product/StockBadge";
import BentoGrid from "@/components/home/BentoGrid";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, Shield, Truck, RotateCcw } from "lucide-react";

export const revalidate = 30;

// ── Static params for ISG ─────────────────────────────────
export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return ids.map((id) => ({ id }));
}

// ── Dynamic metadata ──────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product Not Found | UrbanForge" };
  }

  const discount = product.original_price
    ? discountPercent(product.original_price, product.price)
    : 0;

  return {
    title: `${product.name} — ${formatPrice(product.price)} | UrbanForge`,
    description: `${product.description} ${discount > 0 ? `Save ${discount}% today.` : ""} Shop at UrbanForge — Delhi's premium urban store.`,
    openGraph: {
      title: `${product.name} | UrbanForge`,
      description: product.description,
      images: [
        {
          url: product.images[0] ?? "/og-image.png",
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    alternates: {
      canonical: `https://urbanforge.in/products/${product.id}`,
    },
  };
}

// ── Page ──────────────────────────────────────────────────
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.category, product.id);

  const discount = product.original_price
    ? discountPercent(product.original_price, product.price)
    : 0;

  // JSON-LD Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: "UrbanForge",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "UrbanForge",
      },
    },
    aggregateRating:
      product.review_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.review_count,
            bestRating: 5,
          }
        : undefined,
    category: product.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="pt-20 min-h-screen">
        <div className="max-w-[var(--max-width)] mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-[var(--text-primary)] transition-colors capitalize"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[var(--text-secondary)] truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          {/* Main product section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">

            {/* LEFT: Images + 3D Viewer */}
            <div className="space-y-4">
              {/* Main image */}
              <ScrollReveal direction="left">
                <div className="relative aspect-square rounded-2xl overflow-hidden glass-card">
                  <Image
                    src={product.images[0] ?? "/images/placeholder.webp"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {discount > 0 && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#c300ff] text-white font-black text-sm px-3 py-1 rounded-full">
                        -{discount}% OFF
                      </span>
                    </div>
                  )}
                  {product.is_new && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#00f0ff] text-black font-black text-sm px-3 py-1 rounded-full">
                        NEW DROP
                      </span>
                    </div>
                  )}
                </div>
              </ScrollReveal>

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden glass-card cursor-pointer hover:border-[rgba(0,240,255,0.4)] transition-all"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 3D Viewer — client component, lazy */}
              <ProductDetailClient product={product} section="3d" />
            </div>

            {/* RIGHT: Product details */}
            <ScrollReveal direction="right" className="space-y-6">

              {/* Category + tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    categoryColors[product.category]
                  )}
                >
                  {product.category}
                </Badge>
                {product.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[var(--text-muted)] border-white/10 text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Name */}
              <h1 className="text-3xl sm:text-4xl font-black leading-tight" style={{ letterSpacing: "-0.03em" }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-[var(--text-muted)]"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-[var(--text-secondary)]">
                  {product.rating.toFixed(1)} ({product.review_count} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black gradient-text">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <>
                    <span className="text-xl text-[var(--text-muted)] line-through">
                      {formatPrice(product.original_price)}
                    </span>
                    <span className="text-sm font-bold text-[#00f0ff]">
                      Save {formatPrice(product.original_price - product.price)}
                    </span>
                  </>
                )}
              </div>

              {/* Stock badge */}
              <StockBadge productId={product.id} initialStock={product.stock} />

              {/* Description */}
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {product.description}
              </p>

              {/* Variants + Add to Cart — Client side */}
              <ProductDetailClient product={product} section="cart" />

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/8">
                {[
                  { icon: Truck, label: "Free Delhi Delivery", sub: "Orders ₹999+" },
                  { icon: Shield, label: "Quality Guarantee", sub: "7-day returns" },
                  { icon: RotateCcw, label: "Easy Returns", sub: "Hassle-free" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="text-center">
                    <Icon className="w-5 h-5 mx-auto mb-1 text-[#00f0ff]" />
                    <p className="text-xs font-semibold text-[var(--text-secondary)] leading-tight">{label}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{sub}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-white/8 pt-16">
              <BentoGrid
                products={relatedProducts}
                title="You Might Also Like"
                subtitle="Related picks"
                showViewAll={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
