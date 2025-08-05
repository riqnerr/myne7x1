import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, uploadFile } from '../lib/supabase'
import { 
  Upload, 
  Image, 
  Link, 
  DollarSign, 
  FileText, 
  Save, 
  Loader2,
  Shield,
  Star,
  Tag
} from 'lucide-react'

export function Upload() {
  const { user, isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [productFile, setProductFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    external_link: '',
    external_image_link: '',
    is_paid: false,
    price: 0,
    category: '',
    tags: '',
    is_featured: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !isAdmin) return

    setLoading(true)
    try {
      let imageUrl = ''
      let fileUrl = ''

      // Upload image if provided
      if (imageFile) {
        const imageFileName = `${Date.now()}-${imageFile.name}`
        await uploadFile('imageproduct', imageFileName, imageFile)
        imageUrl = imageFileName
      }

      // Upload product file if provided
      if (productFile) {
        const productFileName = `${Date.now()}-${productFile.name}`
        await uploadFile('products', productFileName, productFile)
        fileUrl = productFileName
      }

      // Process tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const { error } = await supabase
        .from('products')
        .insert([{
          name: formData.name,
          description: formData.description || null,
          image_url: imageUrl || null,
          file_url: fileUrl || null,
          external_link: formData.external_link || null,
          external_image_link: formData.external_image_link || null,
          is_paid: formData.is_paid,
          price: formData.is_paid ? formData.price : 0,
          category: formData.category || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
          is_featured: formData.is_featured,
          file_size: productFile ? productFile.size : null,
          created_by: user.id
        }])

      if (error) throw error

      // Reset form
      setFormData({
        name: '',
        description: '',
        external_link: '',
        external_image_link: '',
        is_paid: false,
        price: 0,
        category: '',
        tags: '',
        is_featured: false
      })
      setImageFile(null)
      setProductFile(null)

      alert('Product uploaded successfully!')
    } catch (error) {
      console.error('Error uploading product:', error)
      alert('Error uploading product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Sign in Required</h2>
        <p className="text-purple-200">Please sign in to upload products.</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Admin Access Required</h2>
        <p className="text-purple-200">Only administrators can upload products.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload Product</h1>
        <p className="text-purple-200">Add a new product to the digital galaxy</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
              <FileText className="w-4 h-4" />
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your product"
            />
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
              <Tag className="w-4 h-4" />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">Select a category</option>
              <option value="software">Software</option>
              <option value="design">Design</option>
              <option value="template">Template</option>
              <option value="ebook">E-book</option>
              <option value="course">Course</option>
              <option value="tool">Tool</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter tags separated by commas (e.g., react, javascript, web)"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
              <Image className="w-4 h-4" />
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all"
            />
          </div>

          {/* External Image Link */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
              <Link className="w-4 h-4" />
              External Image Link (Alternative)
            </label>
            <input
              type="url"
              name="external_image_link"
              value={formData.external_image_link}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Product File Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
              <Upload className="w-4 h-4" />
              Product File
            </label>
            <input
              type="file"
              onChange={(e) => setProductFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all"
            />
          </div>

          {/* External Link */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
              <Link className="w-4 h-4" />
              External Link (Alternative)
            </label>
            <input
              type="url"
              name="external_link"
              value={formData.external_link}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="https://example.com/download"
            />
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_paid"
                id="is_paid"
                checked={formData.is_paid}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-white/20 rounded focus:ring-purple-500 bg-white/10"
              />
              <label htmlFor="is_paid" className="text-sm font-medium text-purple-200">
                This is a paid product
              </label>
            </div>
            
            {formData.is_paid && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Price (USD)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_featured"
              id="is_featured"
              checked={formData.is_featured}
              onChange={handleInputChange}
              className="w-4 h-4 text-yellow-600 border-white/20 rounded focus:ring-yellow-500 bg-white/10"
            />
            <label htmlFor="is_featured" className="flex items-center gap-2 text-sm font-medium text-purple-200">
              <Star className="w-4 h-4 text-yellow-400" />
              Feature this product
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.name.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Upload Product
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}