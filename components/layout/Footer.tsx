// ============================================================
// UrbanForge — Footer
// ============================================================
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "Streetwear", href: "/products?category=streetwear" },
    { label: "Tech & Gadgets", href: "/products?category=tech" },
    { label: "Accessories", href: "/products?category=accessories" },
    { label: "Footwear", href: "/products?category=footwear" },
    { label: "New Arrivals", href: "/products?filter=new" },
  ],
  Support: [
    { label: "Track Order", href: "/track" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Returns & Exchange", href: "/returns" },
    { label: "FAQ", href: "/faq" },
    { label: "WhatsApp Us", href: "https://wa.me/919876543210" },
  ],
  Brand: [
    { label: "About UrbanForge", href: "/about" },
    { label: "Our Story", href: "/story" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/urbanforgeIN", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com/urbanforgeIN", label: "Twitter/X" },
  { icon: Youtube, href: "https://youtube.com/@urbanforgeIN", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/8">
      {/* Gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50" />

      <div className="max-w-[var(--max-width)] mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff] to-[#c300ff] rounded-lg opacity-80" />
                <Zap className="relative z-10 w-5 h-5 text-black m-1.5" strokeWidth={3} />
              </div>
              <span className="text-xl font-black gradient-text" style={{ letterSpacing: "-0.04em" }}>
                UrbanForge
              </span>
            </Link>

            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 max-w-xs">
              Born in Delhi&rsquo;s streets. Worn across the country. Premium streetwear,
              tech accessories, and attitude — all forged for those who refuse to blend in.
            </p>

            {/* Contact */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <MapPin className="w-4 h-4 text-[#00f0ff] flex-shrink-0" />
                <span>South Delhi, New Delhi — 110017</span>
              </div>
              <a
                href="https://wa.me/919876543210"
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#00f0ff] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#00f0ff] flex-shrink-0" />
                <span>+91 98765 43210 (WhatsApp)</span>
              </a>
              <a
                href="mailto:hello@urbanforge.in"
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#00f0ff] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#00f0ff] flex-shrink-0" />
                <span>hello@urbanforge.in</span>
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[#00f0ff] hover:border-[rgba(0,240,255,0.3)] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hover:translate-x-0.5 inline-block duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} UrbanForge. All rights reserved. Made with ⚡ in Delhi.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
