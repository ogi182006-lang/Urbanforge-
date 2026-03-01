// ============================================================
// UrbanForge — Shared TypeScript Types
// ============================================================

export interface ProductVariant {
  id: string;
  label: string;         // "S", "M", "L" or "Black", "White"
  type: "size" | "color";
  stock: number;
  colorHex?: string;     // Only for color variants
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;          // In INR
  original_price?: number; // For showing discounts
  images: string[];       // URLs, first is primary
  category: "streetwear" | "accessories" | "tech" | "footwear";
  tags: string[];
  variants: ProductVariant[];
  stock: number;          // Total stock
  is_featured: boolean;
  is_new: boolean;
  rating: number;         // 0–5
  review_count: number;
  model_3d_url?: string;  // Optional .glb/.gltf URL for 3D viewer
  created_at: string;
}

export interface CartItem {
  id: string;             // product.id + variantLabel (composite key)
  product_id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant_label?: string;
  max_stock: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export interface SpinResult {
  discount: number;       // 5, 10, 15, or 20
  label: string;          // "5% OFF", etc.
  color: string;          // Neon color for the segment
}

export interface CheckoutForm {
  name: string;
  phone: string;
}

export interface VoiceSearchState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Supabase DB row types (matches table schema)
export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  images: string[];
  category: string;
  tags: string[];
  variants: ProductVariant[];
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  rating: number;
  review_count: number;
  model_3d_url: string | null;
  created_at: string;
}
