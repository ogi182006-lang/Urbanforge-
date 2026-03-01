// ============================================================
// UrbanForge — StockBadge (Realtime Supabase stock indicator)
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface StockBadgeProps {
  productId: string;
  initialStock: number;
}

export default function StockBadge({ productId, initialStock }: StockBadgeProps) {
  const [stock, setStock] = useState(initialStock);
  const [justUpdated, setJustUpdated] = useState(false);

  // Realtime Supabase subscription for stock changes
  useEffect(() => {
    const channel = supabase
      .channel(`stock-${productId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
          filter: `id=eq.${productId}`,
        },
        (payload) => {
          const newStock = (payload.new as { stock: number }).stock;
          if (typeof newStock === "number") {
            setStock(newStock);
            setJustUpdated(true);
            setTimeout(() => setJustUpdated(false), 2000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);

  const getStockStatus = () => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-400 bg-red-500/10 border-red-500/20" };
    if (stock <= 3) return { label: `Only ${stock} left!`, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
    if (stock <= 10) return { label: `${stock} in stock`, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" };
    return { label: "In Stock", color: "text-green-400 bg-green-500/10 border-green-500/20" };
  };

  const { label, color } = getStockStatus();

  return (
    <motion.div
      animate={justUpdated ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
          color
        )}
      >
        {/* Pulsing dot */}
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            stock === 0 ? "bg-red-400" : stock <= 3 ? "bg-orange-400 animate-pulse" : "bg-green-400 animate-pulse"
          )}
        />
        {label}
      </span>

      {/* "Updated" flash when Supabase pushes a change */}
      {justUpdated && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="text-xs text-[#00f0ff] font-semibold"
        >
          ↻ Live
        </motion.span>
      )}
    </motion.div>
  );
}
