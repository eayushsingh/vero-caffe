
-- 1. DROP EXISTING CONSTRAINTS AND TABLES
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- 2. CREATE ORDERS TABLE
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_id TEXT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NULL,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE ORDER_ITEMS TABLE
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INT, 
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  image TEXT, -- Added image as requested, although it might be redundant if joined from menu_items. Keeping for snapshot potential.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ENABLE RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 5. PERMISSIVE POLICIES
CREATE POLICY "Allow all orders" ON orders FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all order_items" ON order_items FOR ALL TO public USING (true) WITH CHECK (true);

-- 6. GRANT PERMISSIONS
GRANT ALL ON orders TO anon, authenticated, service_role;
GRANT ALL ON order_items TO anon, authenticated, service_role;
