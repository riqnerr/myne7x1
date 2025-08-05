import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

// Database types
export interface Product {
  id: string
  name: string
  description?: string
  image_url?: string
  file_url?: string
  external_link?: string
  external_image_link?: string
  is_paid: boolean
  price?: number
  category?: string
  tags?: string[]
  download_count?: number
  is_featured?: boolean
  file_size?: number
  created_at: string
  updated_at?: string
  created_by?: string
}

// Helper function to get file URL from Supabase storage
export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// Helper function to upload file to Supabase storage
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    })
  
  if (error) throw error
  return data
}

// Helper function to delete file from Supabase storage
export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) throw error
}

// Helper function to increment download count
export const incrementDownloadCount = async (productId: string) => {
  const { error } = await supabase.rpc('increment_download_count', {
    product_id: productId
  })
  
  if (error) throw error
}
export interface UserProfile {
  id: string
  email: string
  is_blocked: boolean
  created_at: string
}

export interface Chat {
  id: string
  from_user_id: string
  message: string
  is_from_admin: boolean
  created_at: string
}

export interface Notification {
  id: string
  title: string
  message: string
  created_at: string
}

export interface PaymentRequest {
  id: string
  user_id: string
  product_id: string
  product_name: string
  description: string
  payment_method?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}