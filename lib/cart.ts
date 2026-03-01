// ============================================================
// UrbanForge — useCart Hook (localStorage + event-driven)
// ============================================================
"use client";

import { useState, useEffect, useCallback } from "react";
import type { CartItem, CartState } from "@/types";
import { getLocalStorage, setLocalStorage } from "./utils";

const CART_KEY = "urbanforge_cart";
const CART_EVENT = "cart:updated";

function emitCartUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_EVENT));
  }
}

export function useCart(): CartState {
  const [items, setItems] = useState<CartItem[]>(() =>
    getLocalStorage<CartItem[]>(CART_KEY, [])
  );

  // Sync from localStorage on mount + listen for cross-tab updates
  useEffect(() => {
    const handleUpdate = () => {
      setItems(getLocalStorage<CartItem[]>(CART_KEY, []));
    };
    window.addEventListener(CART_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(CART_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    setLocalStorage(CART_KEY, items);
  }, [items]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === newItem.id);
        let updated: CartItem[];
        if (existing) {
          updated = prev.map((i) =>
            i.id === newItem.id
              ? {
                  ...i,
                  quantity: Math.min(i.quantity + (newItem.quantity ?? 1), i.max_stock),
                }
              : i
          );
        } else {
          updated = [
            ...prev,
            { ...newItem, quantity: newItem.quantity ?? 1 },
          ];
        }
        setLocalStorage(CART_KEY, updated);
        emitCartUpdate();
        return updated;
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      setLocalStorage(CART_KEY, updated);
      emitCartUpdate();
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) => {
      const updated =
        quantity <= 0
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) =>
              i.id === id
                ? { ...i, quantity: Math.min(quantity, i.max_stock) }
                : i
            );
      setLocalStorage(CART_KEY, updated);
      emitCartUpdate();
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setLocalStorage(CART_KEY, []);
    emitCartUpdate();
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount };
}

/** Lightweight hook for just the cart count (for Navbar badge) */
export function useCartCount(): number {
  const [count, setCount] = useState<number>(() => {
    const items = getLocalStorage<CartItem[]>(CART_KEY, []);
    return items.reduce((sum, i) => sum + i.quantity, 0);
  });

  useEffect(() => {
    const update = () => {
      const items = getLocalStorage<CartItem[]>(CART_KEY, []);
      setCount(items.reduce((sum, i) => sum + i.quantity, 0));
    };
    window.addEventListener(CART_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CART_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return count;
}
