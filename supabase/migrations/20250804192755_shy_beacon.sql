/*
# Initial Database Schema for MYNE7X

## Overview
Complete database setup for MYNE7X platform with products, chat, notifications, and payment systems.

## Tables Created
1. **products** - Store product information with files/images
2. **chats** - Live chat between users and admin
3. **notifications** - Admin notifications to users
4. **payment_requests** - Payment approval system
5. **user_profiles** - Extended user information

## Storage Buckets
- products/data - Product files
- imageproduct/data - Product images

## Security
- RLS enabled on all tables
- Policies for authenticated users and admin access
- Admin restricted to myne7x@gmail.com
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('products', 'products', true),
  ('imageproduct', 'imageproduct', true)
ON CONFLICT (id) DO NOTHING;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  file_url text,
  external_link text,
  external_image_link text,
  is_paid boolean DEFAULT false,
  price decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  is_blocked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES auth.users(id),
  message text NOT NULL,
  is_from_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Payment requests table
CREATE TABLE IF NOT EXISTS payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  description text NOT NULL,
  payment_method text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (auth.email() = 'myne7x@gmail.com');

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON user_profiles FOR SELECT USING (auth.email() = 'myne7x@gmail.com');
CREATE POLICY "Admin can update profiles" ON user_profiles FOR UPDATE USING (auth.email() = 'myne7x@gmail.com');
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Chats policies
CREATE POLICY "Users can view own chats" ON chats FOR SELECT USING (from_user_id = auth.uid() OR auth.email() = 'myne7x@gmail.com');
CREATE POLICY "Authenticated users can send messages" ON chats FOR INSERT WITH CHECK (auth.uid() = from_user_id OR auth.email() = 'myne7x@gmail.com');

-- Notifications policies
CREATE POLICY "Anyone can view notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Admin can manage notifications" ON notifications FOR ALL USING (auth.email() = 'myne7x@gmail.com');

-- Payment requests policies
CREATE POLICY "Users can view own requests" ON payment_requests FOR SELECT USING (user_id = auth.uid() OR auth.email() = 'myne7x@gmail.com');
CREATE POLICY "Authenticated users can create requests" ON payment_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can update requests" ON payment_requests FOR UPDATE USING (auth.email() = 'myne7x@gmail.com');

-- Storage policies
CREATE POLICY "Anyone can view product files" ON storage.objects FOR SELECT USING (bucket_id IN ('products', 'imageproduct'));
CREATE POLICY "Admin can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('products', 'imageproduct') AND auth.email() = 'myne7x@gmail.com');
CREATE POLICY "Admin can update files" ON storage.objects FOR UPDATE USING (bucket_id IN ('products', 'imageproduct') AND auth.email() = 'myne7x@gmail.com');
CREATE POLICY "Admin can delete files" ON storage.objects FOR DELETE USING (bucket_id IN ('products', 'imageproduct') AND auth.email() = 'myne7x@gmail.com');

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();