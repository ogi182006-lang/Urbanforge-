// ============================================================
// UrbanForge — Utility Functions
// ============================================================
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price to Indian Rupee format */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Calculate discount percentage */
export function discountPercent(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

/** Truncate text to max length */
export function truncate(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Generate WhatsApp checkout message */
export function generateWhatsAppMessage(
  items: Array<{ name: string; quantity: number; price: number; variant_label?: string }>,
  total: number,
  customerName: string,
  customerPhone: string,
  discount?: number
): string {
  const itemLines = items
    .map(
      (item) =>
        `• ${item.name}${item.variant_label ? ` (${item.variant_label})` : ""} ×${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");

  const discountLine =
    discount && discount > 0
      ? `\n🎰 Spin Discount: ${discount}% OFF applied!\nDiscounted Total: ${formatPrice(total * (1 - discount / 100))}`
      : "";

  return `🛍️ *UrbanForge Order Request*\n\nHey UrbanForge! I'd like to place an order:\n\n${itemLines}\n\n*Order Total: ${formatPrice(total)}*${discountLine}\n\n👤 *Name:* ${customerName}\n📱 *Phone:* ${customerPhone}\n\n_Sent from UrbanForge website_`;
}

/** Open WhatsApp with pre-filled message */
export function openWhatsApp(
  message: string,
  waNumber: string = process.env.NEXT_PUBLIC_WA_NUMBER || "+919876543210"
): void {
  const url = `https://wa.me/${waNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/** Slugify product name */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

/** Check if we're on the client */
export const isClient = typeof window !== "undefined";

/** Safe localStorage getter */
export function getLocalStorage<T>(key: string, fallback: T): T {
  if (!isClient) return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Safe localStorage setter */
export function setLocalStorage<T>(key: string, value: T): void {
  if (!isClient) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("localStorage write failed:", key);
    }
  }
}

/** Debounce helper */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/** Random item from array */
export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Category badge color map */
export const categoryColors: Record<string, string> = {
  streetwear: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  accessories: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  tech: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  footwear: "bg-pink-500/20 text-pink-300 border-pink-500/30",
};
