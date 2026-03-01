// ============================================================
// UrbanForge — Home Page (/)
// ============================================================
import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { getFeaturedProducts } from "@/lib/supabase";

export const revalidate = 60; // ISR: re-fetch every 60 seconds

export const metadata: Metadata = {
  title: "UrbanForge — Streetwear, Gadgets & Accessories",
  description:
    "Shop Delhi's freshest drops. Premium streetwear hoodies, tech earbuds, chains, joggers, and more. UrbanForge — Forged for the Urban.",
  openGraph: {
    title: "UrbanForge — Streetwear & Tech for Delhi Youth",
    description: "Fresh drops, neon vibes, and premium quality. Shop UrbanForge.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

// Category pills for quick browse
const categories = [
  { label: "🔥 All", href: "/products" },
  { label: "👕 Streetwear", href: "/products?category=streetwear" },
  { label: "⚡ Tech", href: "/products?category=tech" },
  { label: "📿 Accessories", href: "/products?category=accessories" },
  { label: "👟 Footwear", href: "/products?category=footwear" },
  { label: "✨ New Drops", href: "/products?filter=new" },
];

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Category quick-links */}
      <ScrollReveal className="py-8 px-4 sm:px-6 lg:px-8 max-w-[var(--max-width)] mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {categories.map((cat) => (
            <a
              key={cat.href}
              href={cat.href}
              className="flex-shrink-0 snap-start glass-card px-4 py-2.5 rounded-full text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[rgba(0,240,255,0.3)] transition-all whitespace-nowrap min-h-[var(--tap-min)] flex items-center"
            >
              {cat.label}
            </a>
          ))}
        </div>
      </ScrollReveal>

      {/* Featured Bento Grid */}
      <BentoGrid
        products={products}
        title="Featured Drops"
        subtitle="New season, new you"
        showViewAll
      />

      {/* New Arrivals section */}
      {products.filter((p) => p.is_new).length > 0 && (
        <BentoGrid
          products={products.filter((p) => p.is_new)}
          title="New Arrivals"
          subtitle="Just dropped"
          showViewAll={false}
        />
      )}

      {/* Delhi Pride Section */}
      <ScrollReveal className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[var(--max-width)] mx-auto">
          <div
            className="glass-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,240,255,0.06) 0%, rgba(195,0,255,0.06) 100%)",
              border: "1px solid rgba(0,240,255,0.15)",
            }}
          >
            {/* Decorative elements */}
            <div
              className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(0,240,255,0.08), transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(195,0,255,0.08), transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">
                🏙️ Made in India
              </p>
              <h2
                className="text-3xl sm:text-5xl font-black mb-4 gradient-text"
                style={{ letterSpacing: "-0.03em" }}
              >
                Delhi Runs This
              </h2>
              <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8 text-base sm:text-lg">
                Born in the streets of South Delhi. Worn by those who refuse to
                be ordinary. UrbanForge is more than a brand — it&rsquo;s a statement.
              </p>

              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto mb-8">
                {[
                  { icon: "🚀", label: "Same-Day Delhi Dispatch" },
                  { icon: "💯", label: "Quality Guaranteed" },
                  { icon: "📱", label: "WhatsApp Support" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs text-[var(--text-muted)] font-medium leading-tight">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/919876543210?text=Hi%20UrbanForge!%20I%20want%20to%20know%20more%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm glass-card hover:border-[rgba(0,240,255,0.3)] text-[var(--text-secondary)] hover:text-[#00f0ff] transition-all"
              >
                <span>💬</span>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </>
  );
}
