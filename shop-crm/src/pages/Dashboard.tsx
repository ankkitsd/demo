import React, { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { DashboardStats } from '../components/DashboardStats'
import { customerApi, transactionApi, productApi } from '../lib/api'

const DEMO_SHOP_ID = 'demo-shop-1'

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalDue: 0,
    pendingTransactions: 0,
    lowStockProducts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [customers, transactions, products] = await Promise.all([
        customerApi.getAll(DEMO_SHOP_ID).catch(() => []),
        transactionApi.getAll(DEMO_SHOP_ID).catch(() => []),
        productApi.getAll(DEMO_SHOP_ID).catch(() => [])
      ])

      const totalDue = customers.reduce((sum, c) => sum + c.total_due, 0)
      const pendingCount = transactions?.filter(t => t.status === 'pending').length || 0
      const lowStockCount = products.filter(p => p.stock_quantity < 10).length

      setStats({
        totalCustomers: customers.length,
        totalDue,
        pendingTransactions: pendingCount,
        lowStockProducts: lowStockCount
      })
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your shop management system</p>
      </div>

      <DashboardStats
        totalCustomers={stats.totalCustomers}
        totalDue={stats.totalDue}
        pendingTransactions={stats.pendingTransactions}
        lowStockProducts={stats.lowStockProducts}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <p className="text-gray-500">No recent transactions</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
          <p className="text-gray-500">No customer data yet</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Tips</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Add customers to start tracking udhaar</li>
            <li>• Send WhatsApp reminders for payments</li>
            <li>• Keep inventory updated for better tracking</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
