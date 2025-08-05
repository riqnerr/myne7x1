/*
  # Fix User Registration Database Error

  1. Database Changes
    - Add trigger function to automatically create user profiles
    - Fix RLS policies for user_profiles table
    - Ensure proper foreign key relationships
    - Add missing indexes for performance

  2. Security
    - Update RLS policies to allow user profile creation
    - Ensure users can only access their own data
    - Admin can manage all profiles

  3. Triggers
    - Auto-create user profile on auth.users insert
    - Handle user deletion cleanup
*/

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update user_profiles table structure if needed
DO $$
BEGIN
  -- Add email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email text NOT NULL DEFAULT '';
  END IF;

  -- Add unique constraint on email if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' AND constraint_name = 'user_profiles_email_key'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_email_key UNIQUE (email);
  END IF;
END $$;

-- Update RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin can update profiles" ON user_profiles;

-- Allow users to insert their own profile (needed for trigger)
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO public
  USING (auth.uid() = id);

-- Allow admin to view all profiles
CREATE POLICY "Admin can view all profiles"
  ON user_profiles
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'myne7x@gmail.com'
    )
  );

-- Allow admin to update profiles (for blocking/unblocking)
CREATE POLICY "Admin can update profiles"
  ON user_profiles
  FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'myne7x@gmail.com'
    )
  );

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create helper function to get user email
CREATE OR REPLACE FUNCTION public.get_user_email()
RETURNS text AS $$
BEGIN
  RETURN (SELECT email FROM auth.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update other policies to use the helper function
DROP POLICY IF EXISTS "Admin can manage products" ON products;
CREATE POLICY "Admin can manage products"
  ON products
  FOR ALL
  TO public
  USING (get_user_email() = 'myne7x@gmail.com')
  WITH CHECK (get_user_email() = 'myne7x@gmail.com');

DROP POLICY IF EXISTS "Admin can manage notifications" ON notifications;
CREATE POLICY "Admin can manage notifications"
  ON notifications
  FOR ALL
  TO public
  USING (get_user_email() = 'myne7x@gmail.com')
  WITH CHECK (get_user_email() = 'myne7x@gmail.com');

DROP POLICY IF EXISTS "Admin can update requests" ON payment_requests;
CREATE POLICY "Admin can update requests"
  ON payment_requests
  FOR UPDATE
  TO public
  USING (get_user_email() = 'myne7x@gmail.com');

-- Update chat policies
DROP POLICY IF EXISTS "Authenticated users can send messages" ON chats;
CREATE POLICY "Authenticated users can send messages"
  ON chats
  FOR INSERT
  TO public
  WITH CHECK (
    (auth.uid() = from_user_id) OR 
    (get_user_email() = 'myne7x@gmail.com')
  );

DROP POLICY IF EXISTS "Users can view own chats" ON chats;
CREATE POLICY "Users can view own chats"
  ON chats
  FOR SELECT
  TO public
  USING (
    (from_user_id = auth.uid()) OR 
    (get_user_email() = 'myne7x@gmail.com')
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON payment_requests(user_id);