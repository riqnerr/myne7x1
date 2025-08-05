import React from 'react'
import { Link } from 'react-router-dom'
import { Download, DollarSign, ExternalLink, Star, Eye, Calendar, Tag } from 'lucide-react'
import { type Product, getFileUrl } from '../lib/supabase'

interface ProductCardProps {
  product: Product
  featured?: boolean
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const imageUrl = product.image_url 
    ? getFileUrl('imageproduct', product.image_url)
    : product.external_image_link || 'https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg'

  return (
    <div className={`group relative bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border transition-all duration-500 hover:shadow-2xl transform hover:scale-105 ${
      featured 
        ? 'border-yellow-400/50 hover:border-yellow-400 shadow-lg shadow-yellow-500/20' 
        : 'border-white/20 hover:border-purple-400/50 hover:shadow-purple-500/20'
    }`}>
      {/* Image */}
      <div className="aspect-video relative overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center animate-pulse">
            <Star className="w-4 h-4 mr-1" />
            Featured
          </div>
        )}
        
        {/* Price Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium flex items-center backdrop-blur-sm ${
          product.is_paid 
            ? 'bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white' 
            : 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white'
        }`}>
          {product.is_paid ? (
            <>
            <DollarSign className="w-4 h-4 mr-1" />
            ${product.price || 'Paid'}
            </>
          ) : (
            FREE
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Stats */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {product.download_count && product.download_count > 0 && (
            <div className="flex items-center text-white text-xs bg-black/50 rounded-full px-2 py-1">
              <Download className="w-3 h-3 mr-1" />
              {product.download_count}
            </div>
          )}
          <div className="flex items-center text-white text-xs bg-black/50 rounded-full px-2 py-1">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(product.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors flex-1">
            {product.name}
          </h3>
          {product.category && (
            <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full ml-2">
              {product.category}
            </span>
          )}
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs text-purple-300 bg-purple-600/20 px-2 py-1 rounded-full flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="text-xs text-purple-400">+{product.tags.length - 3} more</span>
            )}
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-purple-200 text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* File Size */}
        {product.file_size && (
          <p className="text-purple-400 text-xs mb-3">
            📁 Size: {(product.file_size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}

        {/* Action Button */}
        <Link
          to={`/product/${product.id}`}
          className={`inline-flex items-center px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 group w-full justify-center ${
            featured
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
          }`}
        >
          {product.is_paid ? (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Request Access
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Now
            </>
          )}
          <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Magical Glow Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute inset-0 rounded-xl blur-sm ${
          featured 
            ? 'bg-gradient-to-r from-yellow-600/30 to-orange-600/30' 
            : 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30'
        }`} />
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute inset-0 rounded-xl ${
          featured 
            ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400' 
            : 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400'
        } p-[1px]`}>
          <div className="w-full h-full bg-transparent rounded-xl" />
        </div>
      </div>
    </div>
  )
}