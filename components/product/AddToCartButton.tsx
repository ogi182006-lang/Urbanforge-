// ============================================================
// UrbanForge — AddToCartButton (fly-in animation)
// ============================================================
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product, ProductVariant } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
  className?: string;
}

type ButtonState = "idle" | "loading" | "added";

export default function AddToCartButton({
  product,
  selectedVariant,
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [buttonState, setButtonState] = useState<ButtonState>("idle");

  const isOutOfStock =
    selectedVariant ? selectedVariant.stock === 0 : product.stock === 0;

  async function handleAddToCart() {
    if (isOutOfStock || buttonState !== "idle") return;

    setButtonState("loading");

    // Simulate brief async (for UX)
    await new Promise((r) => setTimeout(r, 300));

    const cartItemId = selectedVariant
      ? `${product.id}-${selectedVariant.id}`
      : `${product.id}-default`;

    addItem({
      id: cartItemId,
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "/images/placeholder.webp",
      variant_label: selectedVariant?.label,
      max_stock: selectedVariant?.stock ?? product.stock,
    });

    setButtonState("added");
    setTimeout(() => setButtonState("idle"), 2500);
  }

  return (
    <motion.button
      onClick={handleAddToCart}
      disabled={isOutOfStock || buttonState === "loading"}
      whileTap={!isOutOfStock ? { scale: 0.97 } : {}}
      className={`
        relative w-full flex items-center justify-center gap-3
        px-8 py-4 rounded-2xl font-bold text-base
        min-h-[var(--tap-min)] overflow-hidden btn-ripple
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isOutOfStock
          ? "bg-white/5 text-[var(--text-muted)] border border-white/10"
          : buttonState === "added"
          ? "bg-[#00f0ff] text-black shadow-[0_0_30px_rgba(0,240,255,0.5)]"
          : "bg-gradient-to-r from-[#00f0ff] to-[#c300ff] text-black hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
        }
        ${className}
      `}
      aria-label={
        isOutOfStock
          ? "Out of stock"
          : buttonState === "added"
          ? "Added to cart"
          : "Add to cart"
      }
    >
      {/* Shimmer overlay */}
      {buttonState === "idle" && !isOutOfStock && (
        <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-r from-white/10 to-transparent" />
      )}

      <AnimatePresence mode="wait">
        {buttonState === "loading" ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            Adding…
          </motion.span>
        ) : buttonState === "added" ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex items-center gap-2"
          >
            <Check className="w-5 h-5" strokeWidth={3} />
            Added to Cart!
          </motion.span>
        ) : isOutOfStock ? (
          <motion.span key="oos" className="flex items-center gap-2">
            Out of Stock
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </motion.span>
        )}
      </AnimatePresence>

      {/* Success burst particles */}
      <AnimatePresence>
        {buttonState === "added" &&
          Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-2 h-2 rounded-full pointer-events-none"
              style={{
                background: i % 2 === 0 ? "#00f0ff" : "#c300ff",
                left: "50%",
                top: "50%",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i * 45 * Math.PI) / 180) * 50,
                y: Math.sin((i * 45 * Math.PI) / 180) * 50,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            />
          ))}
      </AnimatePresence>
    </motion.button>
  );
}
