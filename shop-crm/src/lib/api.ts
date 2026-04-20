import { supabase } from '../lib/supabase'
import { Customer, Transaction, Product, Payment } from '../types'

export const customerApi = {
  async getAll(shopId: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Customer[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Customer
  },

  async create(customer: Omit<Customer, 'id' | 'total_due' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
      .single()
    
    if (error) throw error
    return data as Customer
  },

  async update(id: string, updates: Partial<Customer>) {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Customer
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export const transactionApi = {
  async getAll(shopId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        customers (
          name,
          phone,
          whatsapp_number
        )
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getByCustomer(customerId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Transaction[]
  },

  async create(transaction: Omit<Transaction, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single()
    
    if (error) throw error
    return data as Transaction
  },

  async updateStatus(id: string, status: Transaction['status']) {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Transaction
  }
}

export const productApi = {
  async getAll(shopId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .order('name')
    
    if (error) throw error
    return data as Product[]
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    
    if (error) throw error
    return data as Product
  },

  async updateStock(id: string, quantity: number) {
    const { data, error } = await supabase
      .from('products')
      .update({ stock_quantity: quantity })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Product
  }
}

export const paymentApi = {
  async create(payment: Omit<Payment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single()
    
    if (error) throw error
    return data as Payment
  },

  async getByCustomer(customerId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Payment[]
  }
}

export const whatsappApi = {
  generateMessage(customerName: string, amount: number, shopName: string): string {
    return `नमस्ते ${customerName} जी,\n\nआपका ${shopName} में कुल बकाया: ₹${amount}\n\nकृपया जल्द से जल्द भुगतान करें।\n\nधन्यवाद!`
  },

  openWhatsApp(phone: string, message: string) {
    const encodedMessage = encodeURIComponent(message)
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    const url = `https://wa.me/91${cleanPhone}?text=${encodedMessage}`
    window.open(url, '_blank')
  }
}
