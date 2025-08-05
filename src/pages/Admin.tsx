import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, type UserProfile, type PaymentRequest } from '../lib/supabase'
import { 
  Users, 
  DollarSign, 
  Bell, 
  Shield, 
  Check, 
  X, 
  UserX, 
  UserCheck,
  Loader2,
  Send
} from 'lucide-react'

export function Admin() {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState<UserProfile[]>([])
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  const fetchData = async () => {
    try {
      const [usersResult, requestsResult] = await Promise.all([
        supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('payment_requests').select('*').order('created_at', { ascending: false })
      ])

      if (usersResult.data) setUsers(usersResult.data)
      if (requestsResult.data) setPaymentRequests(requestsResult.data)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserBlock = async (userId: string, isBlocked: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_blocked: !isBlocked })
        .eq('id', userId)

      if (error) throw error
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_blocked: !isBlocked } : user
      ))
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const updatePaymentRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('payment_requests')
        .update({ status })
        .eq('id', requestId)

      if (error) throw error
      
      setPaymentRequests(prev => prev.map(request => 
        request.id === requestId ? { ...request, status } : request
      ))
    } catch (error) {
      console.error('Error updating payment request:', error)
    }
  }

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notificationTitle.trim() || !notificationMessage.trim()) return

    setSending(true)

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          title: notificationTitle.trim(),
          message: notificationMessage.trim(),
        })

      if (error) throw error
      
      setNotificationTitle('')
      setNotificationMessage('')
      alert('Notification sent successfully!')
    } catch (error) {
      console.error('Error sending notification:', error)
    } finally {
      setSending(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-purple-200">You don't have permission to access this page.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    )
  }

  const tabs = [
    { id: 'users', name: 'Users', icon: Users, count: users.length },
    { id: 'requests', name: 'Payment Requests', icon: DollarSign, count: paymentRequests.filter(r => r.status === 'pending').length },
    { id: 'notifications', name: 'Send Notification', icon: Bell, count: 0 },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-purple-200">Manage users, requests, and notifications</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-white/10 backdrop-blur-md rounded-xl p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.name}</span>
              {tab.count > 0 && (
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">User Management</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20"
                >
                  <div>
                    <p className="text-white font-medium">{user.email}</p>
                    <p className="text-purple-300 text-sm">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.is_blocked ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                    }`}>
                      {user.is_blocked ? 'Blocked' : 'Active'}
                    </span>
                    <button
                      onClick={() => toggleUserBlock(user.id, user.is_blocked)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.is_blocked
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {user.is_blocked ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Payment Requests</h2>
            <div className="space-y-4">
              {paymentRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 bg-white/10 rounded-xl border border-white/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium">{request.product_name}</h3>
                      <p className="text-purple-300 text-sm">
                        Request ID: {request.id.slice(0, 8)}...
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      request.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <p className="text-purple-200 text-sm mb-3">{request.description}</p>
                  
                  {request.payment_method && (
                    <p className="text-purple-300 text-sm mb-3">
                      <strong>Payment Method:</strong> {request.payment_method}
                    </p>
                  )}
                  
                  <p className="text-purple-400 text-xs mb-3">
                    {new Date(request.created_at).toLocaleString()}
                  </p>

                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updatePaymentRequest(request.id, 'approved')}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => updatePaymentRequest(request.id, 'rejected')}
                        className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Send Notification</h2>
            <form onSubmit={sendNotification} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-purple-200 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Notification title..."
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-purple-200 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Notification message..."
                />
              </div>

              <button
                type="submit"
                disabled={sending || !notificationTitle.trim() || !notificationMessage.trim()}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {sending ? 'Sending...' : 'Send Notification'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}