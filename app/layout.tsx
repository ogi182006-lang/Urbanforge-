// ============================================================
// UrbanForge — Root Layout
// ============================================================
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css";

// ── Metadata ──────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://urbanforge.in"),
  title: {
    default: "UrbanForge — Streetwear, Gadgets & Accessories for Delhi Youth",
    template: "%s | UrbanForge",
  },
  description:
    "UrbanForge is Delhi's premium streetwear and tech accessories brand. Shop hoodies, earbuds, chains, joggers, and more — crafted for urban youth who refuse to be ordinary.",
  keywords: [
    "streetwear Delhi",
    "urban fashion India",
    "tech accessories",
    "premium hoodies",
    "Delhi youth fashion",
    "gadgets online India",
    "UrbanForge",
  ],
  authors: [{ name: "UrbanForge", url: "https://urbanforge.in" }],
  creator: "UrbanForge",
  publisher: "UrbanForge",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://urbanforge.in",
    siteName: "UrbanForge",
    title: "UrbanForge — Streetwear & Tech for Delhi Youth",
    description:
      "Premium streetwear, accessories, and gadgets crafted for Delhi's urban culture. Shop the latest drops.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UrbanForge — Urban Fashion & Tech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UrbanForge — Streetwear & Tech",
    description: "Delhi's premium urban fashion & gadgets brand.",
    images: ["/og-image.png"],
    creator: "@urbanforgeIN",
  },
  alternates: {
    canonical: "https://urbanforge.in",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050508" },
    { media: "(prefers-color-scheme: light)", color: "#f0f0f8" },
  ],
};

// ── JSON-LD Organization Schema ───────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UrbanForge",
  url: "https://urbanforge.in",
  logo: "https://urbanforge.in/logo.svg",
  description:
    "Delhi-based premium streetwear, tech accessories, and gadgets brand for urban youth.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-98765-43210",
    contactType: "customer service",
    availableLanguage: ["en", "hi"],
  },
  sameAs: [
    "https://instagram.com/urbanforgeIN",
    "https://twitter.com/urbanforgeIN",
  ],
};

// ── Root Layout ──────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />

        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Background grid effect */}
          <div className="fixed inset-0 bg-grid pointer-events-none opacity-40 z-0" />

          {/* Radial gradient ambient light */}
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 240, 255, 0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(195, 0, 255, 0.06) 0%, transparent 50%)",
            }}
          />

          {/* Main app */}
          <div className="relative z-10 flex flex-col min-h-dvh">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
