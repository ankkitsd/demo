import React, { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { CustomerList } from '../components/CustomerList'
import { CustomerModal } from '../components/CustomerModal'
import { customerApi } from '../lib/api'
import { Customer } from '../types'
import { Plus } from 'lucide-react'

const DEMO_SHOP_ID = 'demo-shop-1'
const DEMO_SHOP_NAME = 'My Shop'

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const data = await customerApi.getAll(DEMO_SHOP_ID)
      setCustomers(data)
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomer = async (customerData: Partial<Customer>) => {
    try {
      await customerApi.create({
        ...customerData,
        shop_id: DEMO_SHOP_ID,
        total_due: 0
      } as any)
      loadCustomers()
    } catch (error) {
      console.error('Error creating customer:', error)
      alert('Failed to add customer')
    }
  }

  const handleEditCustomer = async (customerData: Partial<Customer>) => {
    if (!editingCustomer) return
    try {
      await customerApi.update(editingCustomer.id, customerData)
      loadCustomers()
      setEditingCustomer(null)
    } catch (error) {
      console.error('Error updating customer:', error)
      alert('Failed to update customer')
    }
  }

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return
    try {
      await customerApi.delete(id)
      loadCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Failed to delete customer')
    }
  }

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsModalOpen(true)
  }

  const openAddModal = () => {
    setEditingCustomer(null)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading customers...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer database and udhaar tracking</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Customer
        </button>
      </div>

      <CustomerList
        customers={customers}
        onEdit={openEditModal}
        onDelete={handleDeleteCustomer}
        shopName={DEMO_SHOP_NAME}
      />

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCustomer(null)
        }}
        onSubmit={editingCustomer ? handleEditCustomer : handleAddCustomer}
        initialData={editingCustomer}
      />
    </Layout>
  )
}
