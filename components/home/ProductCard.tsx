// ============================================================
// UrbanForge — ProductCard (Bento item with micro-animations)
// ============================================================
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, Zap, Heart } from "lucide-react";
import { cn, formatPrice, discountPercent, categoryColors } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  size?: "small" | "medium" | "large" | "wide" | "tall";
  className?: string;
  priority?: boolean;
}

export default function ProductCard({
  product,
  size = "medium",
  className,
  priority = false,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [flyParticles, setFlyParticles] = useState(false);

  const discount = product.original_price
    ? discountPercent(product.original_price, product.price)
    : 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = product.variants[0];
    addItem({
      id: `${product.id}-${defaultVariant?.id ?? "default"}`,
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "/images/placeholder.webp",
      variant_label: defaultVariant?.label,
      max_stock: product.stock,
    });

    setIsAdded(true);
    setFlyParticles(true);
    setTimeout(() => setIsAdded(false), 2000);
    setTimeout(() => setFlyParticles(false), 800);
  }

  const isLarge = size === "large" || size === "wide" || size === "tall";

  return (
    <Link href={`/products/${product.id}`} className={cn("block group", className)}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="glass-card relative overflow-hidden h-full flex flex-col cursor-pointer"
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* Hover glow border */}
        <div className="absolute inset-0 rounded-[var(--radius)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(0,240,255,0.08), rgba(195,0,255,0.05))",
            border: "1px solid rgba(0,240,255,0.2)",
          }}
        />

        {/* Image */}
        <div
          className={cn(
            "relative overflow-hidden rounded-t-[var(--radius)] bg-[rgba(255,255,255,0.03)]",
            isLarge ? "aspect-[4/3]" : "aspect-square"
          )}
        >
          <Image
            src={product.images[0] ?? "/images/placeholder.webp"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new && (
              <span className="flex items-center gap-1 bg-[#00f0ff] text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                <Zap className="w-2.5 h-2.5" strokeWidth={3} />
                New
              </span>
            )}
            {discount > 0 && (
              <span className="bg-[#c300ff] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                -{discount}%
              </span>
            )}
          </div>

          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                categoryColors[product.category] || "bg-white/10 text-white/60"
              )}
            >
              {product.category}
            </span>
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            aria-label="Add to wishlist"
            className="absolute bottom-3 right-3 w-8 h-8 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                isWishlisted ? "fill-[#ff0090] text-[#ff0090]" : "text-white"
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-3 sm:p-4">
          {/* Name */}
          <h3
            className={cn(
              "font-bold text-[var(--text-primary)] leading-tight mb-1 group-hover:text-[#00f0ff] transition-colors",
              isLarge ? "text-base sm:text-lg" : "text-sm sm:text-base"
            )}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              ({product.review_count})
            </span>
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between mt-auto gap-2">
            <div className="flex items-baseline gap-2">
              <span className={cn("font-black gradient-text", isLarge ? "text-xl" : "text-base")}>
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-xs text-[var(--text-muted)] line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {/* Add to cart button */}
            <motion.button
              onClick={handleAddToCart}
              aria-label="Add to cart"
              whileTap={{ scale: 0.9 }}
              className={cn(
                "relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 btn-ripple flex-shrink-0",
                isAdded
                  ? "bg-[#00f0ff] text-black shadow-[0_0_16px_rgba(0,240,255,0.6)]"
                  : "bg-white/8 hover:bg-gradient-to-r hover:from-[#00f0ff]/20 hover:to-[#c300ff]/20 text-[var(--text-secondary)] hover:text-[#00f0ff]"
              )}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="font-bold text-sm"
                  >
                    ✓
                  </motion.span>
                ) : (
                  <motion.span key="cart" initial={{ scale: 1 }} exit={{ scale: 0 }}>
                    <ShoppingCart className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Fly particles on add */}
              <AnimatePresence>
                {flyParticles &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full"
                      style={{
                        background: i % 2 === 0 ? "#00f0ff" : "#c300ff",
                      }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos((i * 60 * Math.PI) / 180) * 30,
                        y: Math.sin((i * 60 * Math.PI) / 180) * 30,
                        opacity: 0,
                        scale: 0,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ))}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
