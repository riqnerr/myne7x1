import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Home, 
  MessageCircle, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Upload,
  Shield,
  Info,
  FileText
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, isAdmin, signOut } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Terms', href: '/terms', icon: FileText },
  ]

  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin', icon: Shield },
    { name: 'Upload Product', href: '/upload', icon: Upload },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/6 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Navigation Header */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform animate-glow">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-white font-bold text-xl gradient-text">MYNE7X</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all transform hover:scale-105 ${
                      location.pathname === item.href
                        ? 'bg-purple-600/50 text-white shadow-lg'
                        : 'text-purple-200 hover:text-white hover:bg-purple-600/30 hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-4 h-4 inline mr-2" />
                    {item.name}
                  </Link>
                )
              })}
              
              {isAdmin && adminNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all transform hover:scale-105 ${
                      location.pathname === item.href
                        ? 'bg-orange-600/50 text-white shadow-lg animate-glow'
                        : 'text-orange-200 hover:text-white hover:bg-orange-600/30 hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-4 h-4 inline mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-purple-200 text-sm block">{user.email}</span>
                  {isAdmin && (
                      <span className="text-orange-400 text-xs">Admin</span>
                    )}
                  </div>
                  {isAdmin && (
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30 animate-pulse">
                      Admin
                    </span>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-purple-200 hover:text-white hover:bg-purple-600/30 rounded-md transition-all transform hover:scale-110"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md border-t border-white/10 z-50">
          <div className="flex justify-around py-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center p-2 rounded-md transition-all transform hover:scale-105 ${
                    location.pathname === item.href
                      ? 'text-purple-300 bg-purple-600/20'
                      : 'text-purple-400 hover:text-purple-200 hover:bg-purple-600/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              )
            })}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex flex-col items-center p-2 rounded-md transition-all transform hover:scale-105 ${
                  location.pathname === '/admin'
                    ? 'text-orange-300 bg-orange-600/20'
                    : 'text-orange-400 hover:text-orange-200 hover:bg-orange-600/10'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="text-xs mt-1">Admin</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Footer Spacer for Mobile */}
      {user && <div className="md:hidden h-16" />}
    </div>
  )
}