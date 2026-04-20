import React from 'react'
import { Users, Package, IndianRupee, Clock } from 'lucide-react'

interface DashboardStatsProps {
  totalCustomers: number
  totalDue: number
  pendingTransactions: number
  lowStockProducts: number
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalCustomers,
  totalDue,
  pendingTransactions,
  lowStockProducts
}) => {
  const stats = [
    {
      name: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      name: 'Total Due (₹)',
      value: totalDue.toLocaleString('en-IN'),
      icon: IndianRupee,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      name: 'Pending Payments',
      value: pendingTransactions,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Low Stock Items',
      value: lowStockProducts,
      icon: Package,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-lg shadow p-4 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.name}</p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
