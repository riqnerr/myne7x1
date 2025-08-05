import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, type Product, getFileUrl, incrementDownloadCount } from '../lib/supabase'
import { 
  Download, 
  DollarSign, 
  ExternalLink, 
  Loader2, 
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Eye,
  Star,
  FileText
} from 'lucide-react'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!user) {
      navigate('/auth')
      return
    }

    if (!product) return

    if (product.is_paid) {
      navigate(`/payment-request/${product.id}`)
      return
    }

    setDownloading(true)
    
    try {
      // Increment download count
      await incrementDownloadCount(product.id)
      
      if (product.file_url) {
        // Download from Supabase storage
        const { data, error } = await supabase.storage
          .from('products')
          .download(product.file_url)
        
        if (error) throw error
        
        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = product.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else if (product.external_link) {
        // Open external link
        window.open(product.external_link, '_blank')
      }
      
      // Update local state
      setProduct(prev => prev ? { ...prev, download_count: (prev.download_count || 0) + 1 } : null)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>
      </div>
    )
  }

  const imageUrl = product.image_url 
    ? getFileUrl('imageproduct', product.image_url)
    : product.external_image_link || 'https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg'

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center px-4 py-2 text-purple-200 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </button>

      {/* Product Details */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2">
            <div className="aspect-video relative group overflow-hidden">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Featured Badge */}
              {product.is_featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-medium flex items-center animate-pulse">
                  <Star className="w-5 h-5 mr-1" />
                  Featured
                </div>
              )}

              {/* Price Badge */}
              <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-medium flex items-center backdrop-blur-sm ${
                product.is_paid 
                  ? 'bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white' 
                  : 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white'
              }`}>
                {product.is_paid ? (
                  <>
                  <DollarSign className="w-5 h-5 mr-1" />
                  ${product.price || 'Paid'}
                  </>
                ) : (
                  FREE
                )}
              </div>

              {/* Stats Overlay */}
              <div className="absolute bottom-4 left-4 flex items-center space-x-4 text-white">
                {product.download_count && product.download_count > 0 && (
                  <div className="flex items-center bg-black/50 rounded-full px-3 py-1 backdrop-blur-sm">
                    <Download className="w-4 h-4 mr-1" />
                    {product.download_count} downloads
                  </div>
                )}
                <div className="flex items-center bg-black/50 rounded-full px-3 py-1 backdrop-blur-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(product.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:w-1/2 p-8">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h1 className="text-3xl font-bold text-white flex-1">{product.name}</h1>
                  {product.category && (
                    <span className="text-sm text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full ml-4">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="text-sm text-purple-300 bg-purple-600/20 px-3 py-1 rounded-full flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* File Info */}
              {product.file_size && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center text-purple-200">
                    <FileText className="w-5 h-5 mr-2" />
                    <span>File Size: {(product.file_size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-purple-200 leading-relaxed">{product.description}</p>
                  </div>
                </div>
              )}

              {/* Download Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  {product.is_paid ? 'Request Access' : 'Download'}
                </h3>
                
                {!user ? (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-yellow-400 mr-2" />
                      <p className="text-yellow-200 font-medium">Authentication Required</p>
                    </div>
                    <p className="text-yellow-200 mb-4">Please sign in to download this product.</p>
                    <button
                      onClick={() => navigate('/auth')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
                    >
                      Sign In
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className={`w-full py-4 font-semibold rounded-xl focus:outline-none focus:ring-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center ${
                        product.is_paid
                          ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 focus:ring-orange-500 text-white'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:ring-green-500 text-white'
                      }`}
                    >
                      {downloading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : product.is_paid ? (
                        <>
                          <DollarSign className="w-5 h-5 mr-2" />
                          Request Access
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Download Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                    
                    {product.is_paid && (
                      <div className="text-center">
                        <p className="text-purple-300 text-sm">
                          💳 Payment required • Admin approval needed
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="fixed bottom-8 right-8 space-y-3 z-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 flex items-center justify-center"
        >
          ↑
        </button>
      </div>
    </div>
  )
}