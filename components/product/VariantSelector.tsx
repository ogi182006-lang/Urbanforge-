// ============================================================
// UrbanForge — VariantSelector (size/color picker)
// ============================================================
"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  variants,
  selected,
  onSelect,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  const type = variants[0].type;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          {type === "size" ? "Size" : "Color"}
        </span>
        {selected && (
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {selected.label}
            {selected.stock <= 3 && selected.stock > 0 && (
              <span className="ml-2 text-xs text-orange-400 font-medium">
                Only {selected.stock} left!
              </span>
            )}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant) => {
          const isSelected = selected?.id === variant.id;
          const isOOS = variant.stock === 0;

          if (type === "color") {
            return (
              <motion.button
                key={variant.id}
                onClick={() => !isOOS && onSelect(variant)}
                whileTap={!isOOS ? { scale: 0.9 } : {}}
                disabled={isOOS}
                aria-label={variant.label}
                aria-pressed={isSelected}
                className={cn(
                  "relative w-10 h-10 rounded-full transition-all duration-200",
                  "min-h-[var(--tap-min)] min-w-[var(--tap-min)]",
                  isOOS && "opacity-40 cursor-not-allowed",
                  isSelected
                    ? "ring-2 ring-[#00f0ff] ring-offset-2 ring-offset-[var(--bg-primary)] scale-110"
                    : "hover:scale-105"
                )}
                style={{ backgroundColor: variant.colorHex || "#888" }}
              >
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                  >
                    ✓
                  </motion.span>
                )}
                {/* OOS slash */}
                {isOOS && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-white/60 rotate-45" />
                  </span>
                )}
                {/* Tooltip */}
                <span className="sr-only">{variant.label}</span>
              </motion.button>
            );
          }

          // Size variant
          return (
            <motion.button
              key={variant.id}
              onClick={() => !isOOS && onSelect(variant)}
              whileTap={!isOOS ? { scale: 0.9 } : {}}
              disabled={isOOS}
              aria-pressed={isSelected}
              className={cn(
                "relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                "min-h-[var(--tap-min)] min-w-[var(--tap-min)]",
                isOOS
                  ? "opacity-40 cursor-not-allowed glass-card"
                  : isSelected
                  ? "bg-gradient-to-r from-[#00f0ff] to-[#c300ff] text-black shadow-[0_0_16px_rgba(0,240,255,0.4)]"
                  : "glass-card text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[rgba(0,240,255,0.3)]"
              )}
            >
              {variant.label}
              {isOOS && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-px bg-[var(--text-muted)] rotate-[20deg]" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Size guide link for size variants */}
      {type === "size" && (
        <button className="text-xs text-[var(--text-muted)] hover:text-[#00f0ff] transition-colors underline underline-offset-2">
          📏 Size Guide
        </button>
      )}
    </div>
  );
}
