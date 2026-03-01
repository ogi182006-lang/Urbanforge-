// ============================================================
// UrbanForge — Cart Page (/cart)
// ============================================================
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice, generateWhatsAppMessage, openWhatsApp } from "@/lib/utils";
import SpinWheel from "@/components/cart/SpinWheel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { SpinResult } from "@/types";

interface CheckoutForm {
  name: string;
  phone: string;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [form, setForm] = useState<CheckoutForm>({ name: "", phone: "" });
  const [formErrors, setFormErrors] = useState<Partial<CheckoutForm>>({});
  const [checkoutSubmitted, setCheckoutSubmitted] = useState(false);

  const discountedTotal = spinResult?.discount
    ? total * (1 - spinResult.discount / 100)
    : total;

  function handleSpinResult(result: SpinResult) {
    setSpinResult(result);
    setShowSpinWheel(false);
  }

  function validateForm(): boolean {
    const errors: Partial<CheckoutForm> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errors.name = "Please enter your full name";
    }
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 10) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleCheckout() {
    if (!validateForm()) return;

    const message = generateWhatsAppMessage(
      items,
      total,
      form.name.trim(),
      form.phone.trim(),
      spinResult?.discount
    );

    openWhatsApp(message);
    setCheckoutSubmitted(true);
  }

  // Empty cart state
  if (items.length === 0 && !checkoutSubmitted) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-black mb-3 gradient-text" style={{ letterSpacing: "-0.03em" }}>
            Your Cart is Empty
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Looks like you haven&rsquo;t added anything yet. Let&rsquo;s fix that — Delhi&rsquo;s freshest drops are waiting.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#c300ff] text-black font-bold hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all"
          >
            Shop Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // Post-checkout success state
  if (checkoutSubmitted) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          <h1 className="text-3xl font-black mb-3 gradient-text" style={{ letterSpacing: "-0.03em" }}>
            Order Sent to WhatsApp!
          </h1>
          <p className="text-[var(--text-secondary)] mb-4">
            Your order summary has been sent to UrbanForge on WhatsApp. Our team will confirm within minutes!
          </p>
          <p className="text-sm text-[var(--text-muted)] mb-8">
            💬 Check your WhatsApp — the chat should have opened automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass-card text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <button
              onClick={() => {
                clearCart();
                setCheckoutSubmitted(false);
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#c300ff] text-black font-bold"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-[var(--max-width)] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <ScrollReveal className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black gradient-text" style={{ letterSpacing: "-0.03em" }}>
              Your Cart
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"} — ready to forge
            </p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:text-red-400 glass-card transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="glass-card rounded-2xl p-4 flex items-center gap-4"
                >
                  {/* Image */}
                  <Link href={`/products/${item.product_id}`} className="flex-shrink-0">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[rgba(255,255,255,0.04)]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product_id}`}>
                      <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] hover:text-[#00f0ff] transition-colors truncate">
                        {item.name}
                      </h3>
                    </Link>
                    {item.variant_label && (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {item.variant_label}
                      </p>
                    )}
                    <p className="text-sm font-black gradient-text mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-all min-h-[var(--tap-min)] min-w-[var(--tap-min)]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.max_stock}
                      aria-label="Increase quantity"
                      className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-all disabled:opacity-40 min-h-[var(--tap-min)] min-w-[var(--tap-min)]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="font-black text-sm sm:text-base">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue shopping */}
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order summary + checkout */}
          <div className="space-y-4">

            {/* Order summary card */}
            <ScrollReveal direction="right" className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-black">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Delivery</span>
                  <span className="text-green-400 font-semibold">
                    {total >= 999 ? "FREE" : formatPrice(99)}
                  </span>
                </div>
                {spinResult?.discount ? (
                  <div className="flex justify-between text-[#00f0ff]">
                    <span>🎰 Spin Discount ({spinResult.discount}% OFF)</span>
                    <span className="font-semibold">
                      -{formatPrice(total * (spinResult.discount / 100))}
                    </span>
                  </div>
                ) : null}
                <div className="border-t border-white/10 pt-2 flex justify-between font-black text-base">
                  <span>Total</span>
                  <span className="gradient-text text-lg">
                    {formatPrice(discountedTotal + (total < 999 ? 99 : 0))}
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Spin Wheel section */}
            <ScrollReveal direction="right" delay={0.1} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#c300ff]" />
                <h3 className="font-bold">Lucky Spin</h3>
                {spinResult?.discount ? (
                  <span className="ml-auto text-xs font-bold text-[#00f0ff] bg-[rgba(0,240,255,0.1)] px-2 py-0.5 rounded-full">
                    {spinResult.discount}% WON!
                  </span>
                ) : null}
              </div>

              {!spinResult && !showSpinWheel ? (
                <div className="text-center">
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Spin the wheel for a random 5–20% discount on your order!
                  </p>
                  <button
                    onClick={() => setShowSpinWheel(true)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7b00ff] to-[#c300ff] text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(195,0,255,0.4)] transition-all"
                  >
                    🎰 Try Your Luck
                  </button>
                </div>
              ) : showSpinWheel ? (
                <SpinWheel onResult={handleSpinResult} />
              ) : (
                <p className="text-sm text-[var(--text-secondary)] text-center">
                  {spinResult!.discount > 0
                    ? `🎉 ${spinResult!.label} applied to your order!`
                    : "No discount this time. Order anyway — you deserve it!"}
                </p>
              )}
            </ScrollReveal>

            {/* Checkout form */}
            <ScrollReveal direction="right" delay={0.15} className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-lg">Your Details</h3>
              <p className="text-xs text-[var(--text-muted)]">
                We need your name and phone to complete the WhatsApp order.
              </p>

              <div className="space-y-3">
                {/* Name */}
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, name: e.target.value }));
                      if (formErrors.name) setFormErrors((fe) => ({ ...fe, name: undefined }));
                    }}
                    placeholder="e.g. Rahul Sharma"
                    autoComplete="name"
                    className={`
                      w-full px-4 py-3 rounded-xl text-sm font-medium
                      bg-white/5 border transition-all
                      placeholder:text-[var(--text-muted)] text-[var(--text-primary)]
                      focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/50
                      ${formErrors.name
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-white/10 hover:border-white/20"
                      }
                    `}
                  />
                  {formErrors.name && (
                    <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5"
                  >
                    Phone Number *
                  </label>
                  <div className="flex items-center">
                    <span className="flex-shrink-0 px-3 py-3 rounded-l-xl bg-white/8 border border-r-0 border-white/10 text-sm font-semibold text-[var(--text-muted)]">
                      🇮🇳 +91
                    </span>
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setForm((f) => ({ ...f, phone: val }));
                        if (formErrors.phone) setFormErrors((fe) => ({ ...fe, phone: undefined }));
                      }}
                      placeholder="98765 43210"
                      autoComplete="tel"
                      inputMode="numeric"
                      className={`
                        flex-1 px-4 py-3 rounded-r-xl text-sm font-medium
                        bg-white/5 border transition-all
                        placeholder:text-[var(--text-muted)] text-[var(--text-primary)]
                        focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/50
                        ${formErrors.phone
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-white/10 hover:border-white/20"
                        }
                      `}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkout button */}
              <motion.button
                onClick={handleCheckout}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-base bg-gradient-to-r from-[#00f0ff] to-[#c300ff] text-black hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all btn-ripple min-h-[var(--tap-min)]"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </motion.button>

              <p className="text-[10px] text-[var(--text-muted)] text-center leading-relaxed">
                This will open WhatsApp with your order summary pre-filled.
                Our team will confirm and collect payment details. 🔒 Safe & Simple.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
