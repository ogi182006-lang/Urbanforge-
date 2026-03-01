// ============================================================
// UrbanForge — Navbar (Glassmorphism Sticky)
// ============================================================
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ShoppingCart,
  Sun,
  Moon,
  Search,
  Mic,
  MicOff,
  X,
  Menu,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/lib/cart";
import { useSpeechSearch } from "@/lib/voice";

const navLinks = [
  { href: "/products?category=streetwear", label: "Streetwear" },
  { href: "/products?category=tech", label: "Tech" },
  { href: "/products?category=accessories", label: "Accessories" },
  { href: "/products?category=footwear", label: "Footwear" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = useCartCount();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleVoiceResult = (transcript: string) => {
    setSearchQuery(transcript);
    handleSearch(transcript);
  };

  const { isListening, startListening, stopListening, isSupported } =
    useSpeechSearch(handleVoiceResult);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  function handleSearch(query: string = searchQuery) {
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-[var(--max-width)] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff] to-[#c300ff] rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                <Zap
                  className="relative z-10 w-5 h-5 text-black m-1.5"
                  strokeWidth={3}
                />
              </div>
              <span
                className="text-xl font-black tracking-tight gradient-text"
                style={{ letterSpacing: "-0.04em" }}
              >
                UrbanForge
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 group rounded-lg hover:bg-white/5"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-[#00f0ff] to-[#c300ff] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/8 transition-all min-h-[var(--tap-min)] min-w-[var(--tap-min)]"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Voice hint */}
              {isSupported && (
                <button
                  onClick={() => {
                    setSearchOpen(true);
                    setTimeout(() => startListening(), 200);
                  }}
                  aria-label="Voice search"
                  className={cn(
                    "hidden sm:flex items-center justify-center w-10 h-10 rounded-xl transition-all min-h-[var(--tap-min)] min-w-[var(--tap-min)]",
                    isListening
                      ? "text-[#00f0ff] bg-[rgba(0,240,255,0.1)] animate-pulse-glow"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/8"
                  )}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/8 transition-all min-h-[var(--tap-min)] min-w-[var(--tap-min)]"
                >
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "dark" ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </motion.div>
                </button>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                aria-label={`Cart — ${cartCount} items`}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/8 transition-all min-h-[var(--tap-min)] min-w-[var(--tap-min)]"
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="cart-badge"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle mobile menu"
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/8 transition-all min-h-[var(--tap-min)] min-w-[var(--tap-min)]"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden overflow-hidden glass border-t border-white/10"
            >
              <nav className="px-4 py-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/8 font-semibold transition-all"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Search box */}
            <motion.div
              initial={{ scale: 0.95, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl"
            >
              <div className="glass-card rounded-2xl p-2 shadow-2xl border border-[rgba(0,240,255,0.2)]">
                <div className="flex items-center gap-3 px-3">
                  <Search className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={transcript || searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder={
                      isListening ? "Listening…" : "Search products…"
                    }
                    className={cn(
                      "flex-1 bg-transparent py-4 text-base font-medium placeholder:text-[var(--text-muted)] focus:outline-none",
                      isListening && "text-[#00f0ff]"
                    )}
                  />
                  {isSupported && (
                    <button
                      onClick={isListening ? stopListening : startListening}
                      aria-label={isListening ? "Stop voice search" : "Start voice search"}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        isListening
                          ? "bg-[rgba(0,240,255,0.15)] text-[#00f0ff] animate-pulse"
                          : "text-[var(--text-secondary)] hover:bg-white/8"
                      )}
                    >
                      {isListening ? (
                        <MicOff className="w-5 h-5" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-white/8 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-center mt-3 text-xs text-[var(--text-muted)]">
                Press Enter to search · {isSupported ? "Tap mic for voice" : "Voice not supported"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
