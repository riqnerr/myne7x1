import React from 'react'
import { Rocket, Shield, Users, Zap, Heart, Star } from 'lucide-react'

export function About() {
  const features = [
    {
      icon: Rocket,
      title: 'Space-Age Technology',
      description: 'Built with cutting-edge React, TypeScript, and Supabase for lightning-fast performance.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with row-level security policies and encrypted data storage.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with creators and users through our live chat and notification system.'
    },
    {
      icon: Zap,
      title: 'Instant Downloads',
      description: 'Free products download instantly, paid products processed through secure approval system.'
    }
  ]

  const stats = [
    { label: 'Products Available', value: '∞' },
    { label: 'Happy Users', value: '1K+' },
    { label: 'Downloads', value: '10K+' },
    { label: 'Admin Response Time', value: '<24h' }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="relative inline-block mb-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            About MYNE7X
          </h1>
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-20 blur-lg animate-pulse" />
        </div>
        
        <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
          Welcome to the universe of digital creativity. MYNE7X is your gateway to exploring, 
          discovering, and downloading the best digital products from across the galaxy.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-purple-300 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Why Choose MYNE7X?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 hover:border-purple-400/50 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-purple-200 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          How MYNE7X Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Browse & Discover</h3>
            <p className="text-purple-300">Explore our galaxy of digital products and find exactly what you need.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sign Up & Request</h3>
            <p className="text-purple-300">Create your account and request access to paid products or download free ones instantly.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Download & Enjoy</h3>
            <p className="text-purple-300">Get notified when approved and enjoy your digital products!</p>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Complete Feature Set</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">For Users</h3>
            <ul className="space-y-2 text-purple-200">
              <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-400" /> Browse unlimited products</li>
              <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-400" /> Instant free downloads</li>
              <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-400" /> Secure payment request system</li>
              <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-400" /> Live chat with admin</li>
              <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-400" /> Real-time notifications</li>
              <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-400" /> Mobile-friendly interface</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-300 mb-3">For Admin</h3>
            <ul className="space-y-2 text-purple-200">
              <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-orange-400" /> User management dashboard</li>
              <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-orange-400" /> Product upload system</li>
              <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-orange-400" /> Payment request approval</li>
              <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-orange-400" /> Broadcast notifications</li>
              <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-orange-400" /> Live chat responses</li>
              <li className="flex items-center"><Star className="w-4 h-4 mr-2 text-orange-400" /> User block/unblock controls</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-12 border border-purple-500/30">
        <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
        <p className="text-purple-200 text-lg max-w-3xl mx-auto leading-relaxed">
          To create a seamless, secure, and beautiful platform where creators can share their digital products 
          and users can discover amazing content. We believe in connecting people through technology and 
          making digital products accessible to everyone in the universe.
        </p>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl animate-pulse pointer-events-none" />
    </div>
  )
}