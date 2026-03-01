// ============================================================
// UrbanForge — ProductDetailClient (Client-side interactions)
// Handles: variant selection, add-to-cart, 3D viewer toggle
// ============================================================
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import VariantSelector from "@/components/product/VariantSelector";
import AddToCartButton from "@/components/product/AddToCartButton";
import type { Product, ProductVariant } from "@/types";

// Lazy load 3D viewer (heavy dep)
const ProductViewer3D = dynamic(
  () => import("@/components/product/ProductViewer3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] sm:h-[440px] glass-card rounded-2xl animate-pulse" />
    ),
  }
);

interface Props {
  product: Product;
  section: "cart" | "3d";
}

export default function ProductDetailClient({ product, section }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] ?? null
  );

  if (section === "3d") {
    // Get color from selected variant for 3D model accent
    const productColor =
      selectedVariant?.colorHex ??
      (product.category === "tech"
        ? "#00f0ff"
        : product.category === "accessories"
        ? "#c300ff"
        : "#7b00ff");

    return (
      <ProductViewer3D
        productColor={productColor}
        productName={product.name}
        modelUrl={product.model_3d_url}
      />
    );
  }

  // section === "cart"
  return (
    <div className="space-y-6">
      {product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selected={selectedVariant}
          onSelect={setSelectedVariant}
        />
      )}

      <AddToCartButton
        product={product}
        selectedVariant={selectedVariant}
      />
    </div>
  );
}
