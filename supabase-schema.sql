-- ============================================================
-- UrbanForge — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT NOT NULL,
  price         INTEGER NOT NULL,           -- In INR (paise-free, whole rupees)
  original_price INTEGER,                   -- NULL if no discount
  images        TEXT[] NOT NULL DEFAULT '{}',
  category      TEXT NOT NULL CHECK (category IN ('streetwear', 'accessories', 'tech', 'footwear')),
  tags          TEXT[] NOT NULL DEFAULT '{}',
  variants      JSONB NOT NULL DEFAULT '[]',
  stock         INTEGER NOT NULL DEFAULT 0,
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  is_new        BOOLEAN NOT NULL DEFAULT false,
  rating        DECIMAL(3,2) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count  INTEGER NOT NULL DEFAULT 0,
  model_3d_url  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Full text search
CREATE INDEX IF NOT EXISTS idx_products_fts ON products
  USING gin(to_tsvector('english', name || ' ' || description || ' ' || array_to_string(tags, ' ')));

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth needed for product browsing)
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Enable Realtime for stock updates
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- ============================================================
-- Seed Data — 8 sample products
-- ============================================================
INSERT INTO products (name, slug, description, price, original_price, images, category, tags, variants, stock, is_featured, is_new, rating, review_count) VALUES
(
  'Void Runner Hoodie',
  'void-runner-hoodie',
  'Premium heavyweight streetwear hoodie with embroidered chaos sigil. 400GSM fleece, oversized cut, thumb holes. Born in the streets of South Delhi.',
  2499, 3299,
  ARRAY['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'],
  'streetwear',
  ARRAY['hoodie', 'oversized', 'premium', 'new drop'],
  '[{"id":"v1","label":"S","type":"size","stock":5},{"id":"v2","label":"M","type":"size","stock":12},{"id":"v3","label":"L","type":"size","stock":8},{"id":"v4","label":"XL","type":"size","stock":3}]',
  28, true, true, 4.8, 124
),
(
  'Neural Link Earbuds',
  'neural-link-earbuds',
  'True wireless earbuds with 40dB ANC, 36hr battery. Transparent design with LED breathing effect. The ultimate Delhi commuter tech.',
  4999, 6999,
  ARRAY['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', 'https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?w=800&q=80'],
  'tech',
  ARRAY['earbuds', 'anc', 'wireless', 'led'],
  '[{"id":"c1","label":"Phantom Black","type":"color","stock":15,"colorHex":"#1a1a2e"},{"id":"c2","label":"Neon Frost","type":"color","stock":8,"colorHex":"#00f0ff"},{"id":"c3","label":"Violet Haze","type":"color","stock":6,"colorHex":"#c300ff"}]',
  29, true, true, 4.6, 89
),
(
  'Cipher Chain Necklace',
  'cipher-chain-necklace',
  '316L stainless steel Cuban link. 10mm width, 20-inch drop. Anti-tarnish PVD coating. Urban armor for the everyday grind.',
  1299, 1799,
  ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80'],
  'accessories',
  ARRAY['chain', 'jewelry', 'steel', 'urban'],
  '[{"id":"s1","label":"Silver","type":"color","stock":20,"colorHex":"#c0c0c0"},{"id":"s2","label":"Gold","type":"color","stock":14,"colorHex":"#ffd700"},{"id":"s3","label":"Black","type":"color","stock":9,"colorHex":"#1a1a1a"}]',
  43, true, false, 4.9, 203
),
(
  'Ghost Protocol Joggers',
  'ghost-protocol-joggers',
  'Tapered cargo joggers with utility pockets, YKK zips, and reflective UrbanForge tab. 4-way stretch fabric. Made for movement.',
  1899, 2499,
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4b4e3a?w=800&q=80'],
  'streetwear',
  ARRAY['joggers', 'cargo', 'reflective', 'utility'],
  '[{"id":"j1","label":"S","type":"size","stock":7},{"id":"j2","label":"M","type":"size","stock":15},{"id":"j3","label":"L","type":"size","stock":10},{"id":"j4","label":"XL","type":"size","stock":4}]',
  36, true, false, 4.7, 156
),
(
  'Forge Watch X1',
  'forge-watch-x1',
  'Smart watch with AMOLED display, 7-day battery, health monitoring. Interchangeable straps. Delhi-designed, global quality.',
  8999, 12999,
  ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
  'tech',
  ARRAY['smartwatch', 'amoled', 'fitness', 'premium'],
  '[{"id":"w1","label":"Midnight","type":"color","stock":10,"colorHex":"#0d0d1a"},{"id":"w2","label":"Arctic","type":"color","stock":6,"colorHex":"#e8f4f8"}]',
  16, true, true, 4.5, 67
),
(
  'Phantom Slide Sandals',
  'phantom-slide-sandals',
  'EVA foam slides with embossed UrbanForge dragon logo. Anti-slip base, adjustable strap. Summer staple for the urban dweller.',
  799, 1199,
  ARRAY['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80'],
  'footwear',
  ARRAY['slides', 'summer', 'casual', 'logo'],
  '[{"id":"sl1","label":"UK 7","type":"size","stock":12},{"id":"sl2","label":"UK 8","type":"size","stock":18},{"id":"sl3","label":"UK 9","type":"size","stock":14},{"id":"sl4","label":"UK 10","type":"size","stock":8},{"id":"sl5","label":"UK 11","type":"size","stock":5}]',
  57, false, false, 4.4, 312
),
(
  'Signal Cap',
  'signal-cap',
  '6-panel structured cap with 3M reflective embroidery. One-size adjustable snapback. The finishing touch for every fit.',
  699, 999,
  ARRAY['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80'],
  'accessories',
  ARRAY['cap', 'snapback', 'reflective', 'headwear'],
  '[{"id":"cap1","label":"Black","type":"color","stock":25,"colorHex":"#1a1a1a"},{"id":"cap2","label":"Navy","type":"color","stock":18,"colorHex":"#0a1628"},{"id":"cap3","label":"Cream","type":"color","stock":12,"colorHex":"#f5f0e8"}]',
  55, false, true, 4.6, 178
),
(
  'Ultrawide Desk Mat',
  'ultrawide-desk-mat',
  '900×400mm RGB desk mat with LED edge lighting, splash-resistant surface. Optimize your entire setup for maximum aesthetic.',
  1499, 1999,
  ARRAY['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'],
  'tech',
  ARRAY['desk mat', 'rgb', 'gaming', 'setup'],
  '[{"id":"dm1","label":"Standard","type":"size","stock":30},{"id":"dm2","label":"Extended XL","type":"size","stock":18}]',
  48, false, false, 4.8, 95
);
