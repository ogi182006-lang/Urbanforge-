// ============================================================
// UrbanForge — BentoGrid (Asymmetric product layout)
// ============================================================
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { Product } from "@/types";

interface BentoGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

// Bento layout map: each entry defines grid column/row span
// For 12-column desktop grid
const BENTO_LAYOUT = [
  { colSpan: "lg:col-span-5", rowSpan: "lg:row-span-2", size: "large" as const },   // Hero card
  { colSpan: "lg:col-span-3", rowSpan: "lg:row-span-1", size: "small" as const },   // Small
  { colSpan: "lg:col-span-4", rowSpan: "lg:row-span-1", size: "medium" as const },  // Medium
  { colSpan: "lg:col-span-3", rowSpan: "lg:row-span-1", size: "small" as const },   // Small
  { colSpan: "lg:col-span-4", rowSpan: "lg:row-span-1", size: "medium" as const },  // Medium
  { colSpan: "lg:col-span-4", rowSpan: "lg:row-span-1", size: "medium" as const },  // Medium
  { colSpan: "lg:col-span-4", rowSpan: "lg:row-span-1", size: "medium" as const },  // Medium
  { colSpan: "lg:col-span-4", rowSpan: "lg:row-span-1", size: "medium" as const },  // Medium
];

// Skeleton card for loading state
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <div className="skeleton aspect-square sm:aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="flex items-center justify-between">
          <div className="skeleton h-5 w-1/3 rounded" />
          <div className="skeleton w-9 h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function BentoGrid({
  products,
  title = "Featured Drops",
  subtitle = "Handpicked for the streets",
  showViewAll = true,
}: BentoGridProps) {
  const isLoading = products.length === 0;
  const displayProducts = products.slice(0, 8);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[var(--max-width)] mx-auto">

      {/* Section header */}
      <ScrollReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-1 bg-gradient-to-r from-[#00f0ff] to-[#c300ff] rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
              {subtitle}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black gradient-text tracking-tight" style={{ letterSpacing: "-0.03em" }}>
            {title}
          </h2>
        </div>

        {showViewAll && (
          <Link
            href="/products"
            className="group flex items-center gap-2 px-5 py-2.5 glass-card rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[#00f0ff] hover:border-[rgba(0,240,255,0.3)] transition-all"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </ScrollReveal>

      {/* Bento Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 auto-rows-[220px] sm:auto-rows-[260px] lg:auto-rows-[280px]"
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard
                key={i}
                className={BENTO_LAYOUT[i % BENTO_LAYOUT.length].colSpan}
              />
            ))
          : displayProducts.map((product, i) => {
              const layout = BENTO_LAYOUT[i % BENTO_LAYOUT.length];
              return (
                <motion.div
                  key={product.id}
                  className={`${layout.colSpan} ${layout.rowSpan}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    delay: (i % 4) * 0.08,
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <ProductCard
                    product={product}
                    size={layout.size}
                    className="h-full"
                    priority={i < 2}
                  />
                </motion.div>
              );
            })}
      </div>

      {/* Mobile: load more suggestion */}
      {!isLoading && products.length > 8 && (
        <ScrollReveal className="mt-8 text-center" delay={0.2}>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 glass-card rounded-2xl font-bold text-[var(--text-secondary)] hover:text-[#00f0ff] hover:border-[rgba(0,240,255,0.3)] transition-all"
          >
            Browse All {products.length}+ Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>
      )}
    </section>
  );
}
