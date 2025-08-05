import React from 'react'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { MagicalLoader } from './components/MagicalLoader'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Auth } from './pages/Auth'
import { ProductDetail } from './pages/ProductDetail'
import { PaymentRequest } from './pages/PaymentRequest'
import { Chat } from './pages/Chat'
import { Notifications } from './pages/Notifications'
import { Admin } from './pages/Admin'
import { Upload } from './pages/Upload'
import { About } from './pages/About'
import { Terms } from './pages/Terms'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <MagicalLoader />
  }

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/payment-request/:id" element={<PaymentRequest />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App