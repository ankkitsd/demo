export interface Customer {
  id: string
  shop_id: string
  name: string
  phone: string
  whatsapp_number?: string
  address?: string
  total_due: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  shop_id: string
  customer_id: string
  type: 'purchase' | 'payment'
  amount: number
  description?: string
  due_date?: string
  status: 'pending' | 'paid' | 'overdue'
  created_at: string
}

export interface Product {
  id: string
  shop_id: string
  name: string
  sku?: string
  price: number
  cost?: number
  stock_quantity: number
  min_stock?: number
  description?: string
  unit?: string
  category?: string
  created_at: string
  updated_at: string
}

export interface Shop {
  id: string
  name: string
  owner_name: string
  phone: string
  address?: string
  gst_number?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  shop_id: string
  customer_id: string
  transaction_id: string
  amount: number
  payment_method: 'cash' | 'upi' | 'card' | 'other'
  reference_number?: string
  notes?: string
  created_at: string
}
