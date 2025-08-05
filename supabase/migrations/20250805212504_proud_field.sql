/*
  # Add missing columns to products table

  1. New Columns
    - `category` (text, nullable) - Product category
    - `tags` (text[], nullable) - Product tags array
    - `download_count` (integer, default 0) - Track downloads
    - `is_featured` (boolean, default false) - Featured products
    - `file_size` (bigint, nullable) - File size in bytes
    - `updated_at` (timestamptz, default now()) - Last update timestamp

  2. Indexes
    - Add index on category for filtering
    - Add index on is_featured for featured products query
    - Add index on download_count for popular products

  3. Security
    - Existing RLS policies will apply to new columns
*/

-- Add missing columns to products table
DO $$
BEGIN
  -- Add category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category'
  ) THEN
    ALTER TABLE products ADD COLUMN category text;
  END IF;

  -- Add tags column (array of text)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'tags'
  ) THEN
    ALTER TABLE products ADD COLUMN tags text[];
  END IF;

  -- Add download_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'download_count'
  ) THEN
    ALTER TABLE products ADD COLUMN download_count integer DEFAULT 0;
  END IF;

  -- Add is_featured column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE products ADD COLUMN is_featured boolean DEFAULT false;
  END IF;

  -- Add file_size column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE products ADD COLUMN file_size bigint;
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE products ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_download_count ON products(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();