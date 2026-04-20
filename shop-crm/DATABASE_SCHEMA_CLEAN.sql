-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS shops CASCADE;

-- Shops table (linked to auth.users)
CREATE TABLE shops (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  gst_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  whatsapp_number VARCHAR(20),
  address TEXT,
  total_due DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products/Inventory table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  price DECIMAL(12, 2) NOT NULL,
  cost DECIMAL(12, 2),
  stock_quantity INTEGER DEFAULT 0,
  unit VARCHAR(50),
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table (for udhaar/purchases/payments)
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'payment')),
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'upi', 'card', 'other')),
  reference_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_customers_shop_id ON customers(shop_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_transactions_shop_id ON transactions(shop_id);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS policies - Users can only access their own shop data
CREATE POLICY "Users can view own shop" ON shops
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own shop" ON shops
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage customers for own shop" ON customers
  FOR ALL USING (shop_id IN (SELECT id FROM shops WHERE id = auth.uid()));

CREATE POLICY "Users can manage products for own shop" ON products
  FOR ALL USING (shop_id IN (SELECT id FROM shops WHERE id = auth.uid()));

CREATE POLICY "Users can manage transactions for own shop" ON transactions
  FOR ALL USING (shop_id IN (SELECT id FROM shops WHERE id = auth.uid()));

CREATE POLICY "Users can manage payments for own shop" ON payments
  FOR ALL USING (shop_id IN (SELECT id FROM shops WHERE id = auth.uid()));
