// ============================================================
// UrbanForge — Hero Section (Scrollytelling + Parallax)
// ============================================================
"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load heavy canvas component
const ParticleField = dynamic(() => import("@/components/animations/ParticleField"), {
  ssr: false,
});

const heroTaglines = ["Forged in the City.", "Worn by the Bold.", "Delhi Runs This."];

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Products" },
  { value: "4.8★", label: "Avg Rating" },
  { value: "48h", label: "Delhi Delivery" },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const springY1 = useSpring(y1, { stiffness: 60, damping: 20 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]" />

      {/* Animated gradient blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,240,255,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [-20, 20, -20],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(195,0,255,0.10) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [20, -20, 20],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      {/* Particle field */}
      <ParticleField />

      {/* Hero content */}
      <motion.div
        style={{ y: springY1, opacity: springOpacity, scale }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-24"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6 border border-[rgba(0,240,255,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-sm font-semibold text-[var(--text-secondary)]">
            New Season Drop — Now Live
          </span>
          <TrendingUp className="w-4 h-4 text-[#c300ff]" />
        </motion.div>

        {/* Main heading */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            className="text-[clamp(3rem,10vw,8rem)] font-black leading-[0.9] tracking-tight"
            style={{ letterSpacing: "-0.05em" }}
          >
            {"FORGE YOUR".split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.2 + i * 0.03,
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-8">
          <motion.h1
            className="text-[clamp(3rem,10vw,8rem)] font-black leading-[0.9] tracking-tight gradient-text"
            style={{ letterSpacing: "-0.05em" }}
          >
            {"IDENTITY".split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.5 + i * 0.04,
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Rotating taglines */}
        <motion.div
          className="h-8 mb-8 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.div
            animate={{ y: [-32, -64, -96, -32] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.33, 0.66, 1],
            }}
            className="space-y-2"
          >
            {[...heroTaglines, heroTaglines[0]].map((tagline, i) => (
              <p
                key={i}
                className="h-8 flex items-center justify-center text-sm sm:text-base font-medium text-[var(--text-secondary)] tracking-wide uppercase"
              >
                {tagline}
              </p>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/products"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-black overflow-hidden btn-ripple min-h-[var(--tap-min)] min-w-[180px] justify-center"
          >
            {/* Gradient background */}
            <span className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] to-[#c300ff] transition-all duration-300" />
            <span className="absolute inset-0 bg-gradient-to-r from-[#c300ff] to-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Glow */}
            <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(0,240,255,0.5)]" />
            <span className="relative flex items-center gap-2">
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Link>

          <Link
            href="/products?filter=new"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base glass-card hover:border-[rgba(0,240,255,0.3)] transition-all min-h-[var(--tap-min)] min-w-[180px] justify-center text-[var(--text-primary)] hover:text-[#00f0ff]"
          >
            <Sparkles className="w-4 h-4" />
            New Drops
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{ y: y2 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + i * 0.1 }}
              className="glass-card rounded-2xl p-4 text-center"
            >
              <div className="text-2xl font-black gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--text-muted)] font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ opacity: springOpacity }}
      >
        <span className="text-xs text-[var(--text-muted)] font-medium tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-[#00f0ff] to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
