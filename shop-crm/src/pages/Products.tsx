import React, { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { productApi } from '../lib/api'
import { Product } from '../types'
import { Plus, Package } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export const Products: React.FC = () => {
  const { user } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    min_stock: '10'
  })

  useEffect(() => {
    if (user) {
      loadProducts(user.id)
    }
  }, [user])

  const loadProducts = async (shopId: string) => {
    try {
      const data = await productApi.getAll(shopId)
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    try {
      await productApi.create({
        shop_id: user.id,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        min_stock: parseInt(formData.min_stock)
      } as any)
      
      setFormData({ name: '', description: '', price: '', stock_quantity: '', min_stock: '10' })
      setIsModalOpen(false)
      loadProducts(user.id)
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Failed to add product')
    }
  }

  const handleDeleteProduct = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return
    alert('Delete functionality coming soon')
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Please log in to view products</div>
        </div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading products...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products / Inventory</h1>
          <p className="text-gray-600 mt-1">Manage your shop inventory and stock levels</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
            <p className="text-gray-500 mt-1">Add your first product to start tracking inventory</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.stock_quantity <= (product.min_stock || 10)
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.stock_quantity <= (product.min_stock || 10) ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
              
              {product.description && (
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Price:</span>
                  <span className="font-medium">₹{product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Stock:</span>
                  <span className="font-medium">{product.stock_quantity} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Min Stock:</span>
                  <span className="font-medium">{product.min_stock || 10} units</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t flex gap-2">
                <button
                  onClick={handleDeleteProduct}
                  className="flex-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Rice 5kg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={2}
                  placeholder="Product description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock Level</label>
                <input
                  type="number"
                  value={formData.min_stock}
                  onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="10"
                />
                <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this level</p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
