-- STEP 1: FIX DATABASE SCHEMA (Run in Supabase SQL Editor)

-- Ensure orders table has correct columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS name TEXT;

-- STEP 2: CREATE ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  item_id UUID, -- References menu_items(id) loosely or strictly
  name TEXT,
  price NUMERIC,
  quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OPTIONAL: Add RLS policies if needed
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy for Users to see their own orders
-- CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for Admin (Service Role handles this usually, but for client-side fetches if any)
-- CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (auth.jwt() ->> 'email' = 'admin@verocafe.com');

