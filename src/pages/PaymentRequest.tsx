import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, type Product } from '../lib/supabase'
import { ArrowLeft, Send, Loader2, CreditCard } from 'lucide-react'

export function PaymentRequest() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [description, setDescription] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    if (id) {
      fetchProduct(id)
    }
  }, [id, user])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !product || description.length < 15) return

    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('payment_requests')
        .insert({
          user_id: user.id,
          product_id: product.id,
          product_name: product.name,
          description,
          payment_method: paymentMethod || null,
        })

      if (error) throw error
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting request:', error)
    } finally {
      setSubmitting(false)
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

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Request Submitted!</h2>
          <p className="text-purple-200 mb-6">
            Your payment request for <strong>{product.name}</strong> has been submitted successfully. 
            You'll receive a notification once it\'s reviewed by the admin.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/product/${product.id}`)}
        className="inline-flex items-center px-4 py-2 text-purple-200 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Product
      </button>

      {/* Payment Request Form */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Request</h1>
          <p className="text-purple-200">Request access to <strong>{product.name}</strong></p>
        </div>

        {/* Payment Info */}
        <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Payment Information</h3>
          <div className="space-y-2 text-purple-200">
            <p><strong>NayaPay Number:</strong> 03184712251</p>
            <p><strong>Product:</strong> {product.name}</p>
            <p><strong>Price:</strong> ${product.price || 'Contact Admin'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method */}
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-purple-200 mb-2">
              Payment Method (Optional)
            </label>
            <input
              id="paymentMethod"
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., WhatsApp: +92XXXXXXXXX"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-purple-200 mb-2">
              Description or Payment Details <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Please provide payment proof, transaction ID, or reason for request (minimum 15 words)..."
            />
            <p className="text-sm text-purple-300 mt-2">
              {description.length}/15 words minimum
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || description.length < 15}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Send className="w-5 h-5 mr-2" />
            )}
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}