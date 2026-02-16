
-- FINAL PRODUCTION DATABASE SCHEMA
-- This script ensures the required columns exist without dropping data.

-- 1. ORDERS TABLE
ALTER TABLE IF EXISTS public.orders 
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS customer_phone text;

-- Ensure default values if needed, though they are usually set on insert.
-- We can also backfill if needed, but 'customer_name' might be missing for old orders if they used 'name'.
-- Safely migrate old data if it exists.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='name') THEN
        UPDATE orders SET customer_name = name WHERE customer_name IS NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='phone') THEN
        UPDATE orders SET customer_phone = phone WHERE customer_phone IS NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='email') THEN
        UPDATE orders SET customer_email = email WHERE customer_email IS NULL;
    END IF;
END $$;


-- 2. ORDER_ITEMS TABLE
ALTER TABLE IF EXISTS public.order_items 
ADD COLUMN IF NOT EXISTS image text;

-- 3. RLS POLICIES
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Clear old policies to avoid conflicts
DROP POLICY IF EXISTS "Admin full access orders" ON orders;
DROP POLICY IF EXISTS "Admin full access order_items" ON order_items;

-- Re-create policies for Admin Access
CREATE POLICY "Admin full access orders"
ON orders
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin full access order_items"
ON order_items
FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure Foreign Key
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_order_id_fkey') THEN
        ALTER TABLE order_items 
        ADD CONSTRAINT order_items_order_id_fkey 
        FOREIGN KEY (order_id) 
        REFERENCES orders(id) 
        ON DELETE CASCADE;
    END IF;
END $$;
