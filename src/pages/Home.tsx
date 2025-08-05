import React, { useState, useEffect } from 'react'
import { supabase, type Product } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'
import { Search, Filter, Sparkles, Rocket, Star } from 'lucide-react'

export function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPaidOnly, setShowPaidOnly] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !showPaidOnly || product.is_paid
    return matchesSearch && matchesFilter
  })

  const featuredProducts = filteredProducts.filter(product => product.is_featured)
  const regularProducts = filteredProducts.filter(product => !product.is_featured)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin mb-4 mx-auto">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-purple-200">Loading amazing products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Digital Galaxy
          </h1>
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-20 blur-lg animate-pulse" />
        </div>
        
        <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed mb-8">
          Explore the universe of digital creativity. Discover amazing products, tools, and resources 
          crafted by talented creators from across the galaxy.
        </p>

        {/* Stats */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{products.length}</div>
            <div className="text-purple-300 text-sm">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{products.filter(p => !p.is_paid).length}</div>
            <div className="text-purple-300 text-sm">Free</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{featuredProducts.length}</div>
            <div className="text-purple-300 text-sm">Featured</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search the galaxy for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/80 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={() => setShowPaidOnly(!showPaidOnly)}
            className={`flex items-center gap-2 px-6 py-4 rounded-xl transition-all transform hover:scale-105 ${
              showPaidOnly
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                : 'bg-white/10 backdrop-blur-md text-purple-200 border border-white/20 hover:border-purple-400/50'
            }`}
          >
            <Filter className="w-5 h-5" />
            {showPaidOnly ? 'Show All' : 'Paid Only'}
          </button>
        </div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Featured Products</h2>
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} featured={true} />
            ))}
          </div>
        </div>
      )}

      {/* Regular Products */}
      {regularProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <Rocket className="w-6 h-6 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">All Products</h2>
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* No Products Found */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No products found</h3>
          <p className="text-purple-300 mb-6">
            {searchTerm 
              ? `No products match "${searchTerm}". Try a different search term.`
              : showPaidOnly 
                ? "No paid products available. Try showing all products."
                : "No products available yet. Check back soon!"
            }
          </p>
          {(searchTerm || showPaidOnly) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setShowPaidOnly(false)
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Call to Action */}
      {products.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Welcome to MYNE7X!</h3>
          <p className="text-purple-200 text-lg mb-8 max-w-2xl mx-auto">
            The digital galaxy is just getting started. Amazing products will be added soon. 
            Sign up to be notified when new products arrive!
          </p>
        </div>
      )}
    </div>
  )
}