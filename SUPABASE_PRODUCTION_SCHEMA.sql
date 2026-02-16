
-- SUPABASE_PRODUCTION_SCHEMA.sql

-- 1. DROP EXISTING TABLES TO ENSURE CLEAN SLATE
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- 2. CREATE ORDERS TABLE
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id TEXT NULL,
  user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
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
  menu_item_id INT8,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ENABLE RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- 5. DROP EXISTING POLICIES
DROP POLICY IF EXISTS "Allow insert orders public" ON orders;
DROP POLICY IF EXISTS "Allow select orders public" ON orders;
DROP POLICY IF EXISTS "Allow update orders public" ON orders;
DROP POLICY IF EXISTS "Allow insert order_items public" ON order_items;
DROP POLICY IF EXISTS "Allow select order_items public" ON order_items;
DROP POLICY IF EXISTS "Allow select menu_items public" ON menu_items;

-- 6. CREATE POLICIES (GUEST + ADMIN)

-- Orders
CREATE POLICY "Allow insert orders public" ON orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow select orders public" ON orders FOR SELECT TO public USING (true);
CREATE POLICY "Allow update orders public" ON orders FOR UPDATE TO public USING (true);

-- Order Items
CREATE POLICY "Allow insert order_items public" ON order_items FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow select order_items public" ON order_items FOR SELECT TO public USING (true);

-- Menu Items
CREATE POLICY "Allow select menu_items public" ON menu_items FOR SELECT TO public USING (true);

-- 7. GRANT PERMISSIONS
GRANT ALL ON orders TO anon, authenticated, service_role;
GRANT ALL ON order_items TO anon, authenticated, service_role;
GRANT ALL ON menu_items TO anon, authenticated, service_role;
