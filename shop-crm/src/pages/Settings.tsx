import React, { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { Store, Mail, Phone, MapPin } from 'lucide-react'

export const Settings: React.FC = () => {
  const { user, signOut } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [shopData, setShopData] = useState({
    name: '',
    owner_name: '',
    email: '',
    phone: '',
    address: '',
    gst_number: '',
    city: '',
    state: ''
  })

  useEffect(() => {
    if (user) {
      loadShopData()
    }
  }, [user])

  const loadShopData = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (data && !error) {
        setShopData({
          name: data.name || '',
          owner_name: data.owner_name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          gst_number: data.gst_number || '',
          city: data.city || '',
          state: data.state || ''
        })
      }
    } catch (error) {
      console.error('Error loading shop data:', error)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('shops')
        .update(shopData)
        .eq('id', user.id)
      
      if (error) throw error
      alert('Settings saved successfully!')
    } catch (error: any) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Please log in to view settings</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your shop profile and preferences</p>
      </div>

      <div className="max-w-2xl">
        {/* Shop Profile */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <Store className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold">Shop Profile</h2>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
              <input
                type="text"
                required
                value={shopData.name}
                onChange={(e) => setShopData({ ...shopData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
              <input
                type="text"
                required
                value={shopData.owner_name}
                onChange={(e) => setShopData({ ...shopData, owner_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Mail className="w-4 h-4 mr-1" /> Email
                </label>
                <input
                  type="email"
                  value={shopData.email}
                  onChange={(e) => setShopData({ ...shopData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Phone className="w-4 h-4 mr-1" /> Phone
                </label>
                <input
                  type="tel"
                  value={shopData.phone}
                  onChange={(e) => setShopData({ ...shopData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> Address
              </label>
              <textarea
                value={shopData.address}
                onChange={(e) => setShopData({ ...shopData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="Shop address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={shopData.city}
                  onChange={(e) => setShopData({ ...shopData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={shopData.state}
                  onChange={(e) => setShopData({ ...shopData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
              <input
                type="text"
                value={shopData.gst_number}
                onChange={(e) => setShopData({ ...shopData, gst_number: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="27XXXXX1234A1Z5"
                maxLength={15}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">User ID:</span>
              <span className="font-mono text-sm">{user?.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Account Created:</span>
              <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <button
              onClick={signOut}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
