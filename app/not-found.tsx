// ============================================================
// app/not-found.tsx — 404 page
// ============================================================
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div
          className="text-8xl sm:text-9xl font-black gradient-text mb-4 select-none"
          style={{ letterSpacing: "-0.05em" }}
        >
          404
        </div>
        <h1 className="text-2xl font-black mb-3">Page Not Found</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          This page got lost somewhere between Delhi&rsquo;s lanes. Let&rsquo;s get you back to the good stuff.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#c300ff] text-black font-bold transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            🏠 Go Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl glass-card text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold transition-all"
          >
            🛍️ Shop Products
          </Link>
        </div>
      </div>
    </div>
  );
}
