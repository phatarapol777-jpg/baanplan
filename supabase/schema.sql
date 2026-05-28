-- =============================================
-- BaanPlan - Supabase Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE categories (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL,
  name_th     TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  icon        TEXT,
  image_url   TEXT,
  plan_count  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed categories
INSERT INTO categories (name, name_th, slug) VALUES
  ('Modern',          'โมเดิร์น',       'modern'),
  ('Tropical',        'ทรอปิคอล',       'tropical'),
  ('Contemporary',    'คอนเทมโพรารี',   'contemporary'),
  ('Traditional Thai','ไทยประยุกต์',    'thai'),
  ('Loft',            'ลอฟต์',          'loft'),
  ('Minimalist',      'มินิมอล',        'minimalist');

-- =============================================
-- HOUSE PLANS
-- =============================================
CREATE TABLE house_plans (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  description       TEXT,
  category_id       UUID REFERENCES categories(id),

  -- Room specifications
  floors            INTEGER NOT NULL DEFAULT 1,
  bedrooms          INTEGER NOT NULL DEFAULT 2,
  bathrooms         INTEGER NOT NULL DEFAULT 1,
  kitchens          INTEGER NOT NULL DEFAULT 1,
  living_rooms      INTEGER NOT NULL DEFAULT 1,
  garages           INTEGER NOT NULL DEFAULT 0,

  -- Area (square meters)
  total_area_sqm    DECIMAL(8, 2),

  -- Bunny.net CDN URL for cover image
  cover_image_url   TEXT,

  -- Flags
  is_featured       BOOLEAN DEFAULT FALSE,
  is_available      BOOLEAN DEFAULT TRUE,
  view_count        INTEGER DEFAULT 0,

  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_house_plans_updated_at
  BEFORE UPDATE ON house_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update category plan_count
CREATE OR REPLACE FUNCTION update_category_plan_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.category_id IS NOT NULL THEN
    UPDATE categories SET plan_count = plan_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' AND OLD.category_id IS NOT NULL THEN
    UPDATE categories SET plan_count = GREATEST(plan_count - 1, 0) WHERE id = OLD.category_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_plan_count
  AFTER INSERT OR DELETE ON house_plans
  FOR EACH ROW EXECUTE FUNCTION update_category_plan_count();

-- =============================================
-- PLAN IMAGES
-- =============================================
CREATE TABLE plan_images (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_id     UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  image_type  TEXT NOT NULL DEFAULT 'exterior'
              CHECK (image_type IN ('exterior', 'interior', 'floor_plan', '3d')),
  sort_order  INTEGER DEFAULT 0,
  alt_text    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_plans  ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_images  ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Public read available plans"
  ON house_plans FOR SELECT USING (is_available = true);

CREATE POLICY "Public read plan images"
  ON plan_images FOR SELECT USING (true);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_house_plans_category ON house_plans(category_id);
CREATE INDEX idx_house_plans_featured ON house_plans(is_featured) WHERE is_featured = true;
CREATE INDEX idx_house_plans_slug     ON house_plans(slug);
CREATE INDEX idx_plan_images_plan     ON plan_images(plan_id, sort_order);
