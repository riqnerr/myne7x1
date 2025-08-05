/*
  # Add increment download count function

  1. Function
    - `increment_download_count` - Safely increment download count
*/

-- Create function to safely increment download count
CREATE OR REPLACE FUNCTION increment_download_count(product_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET download_count = COALESCE(download_count, 0) + 1,
      updated_at = now()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;