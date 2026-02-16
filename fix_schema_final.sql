
-- FINAL SCHEMA FIX SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Ensure columns exist and are named correctly in ORDERS
DO $$
BEGIN
    -- Check for 'name' and rename to 'customer_name' if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='name') THEN
        ALTER TABLE orders RENAME COLUMN name TO customer_name;
    END IF;
    
    -- Check for 'customer_name' if 'name' didn't exist, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='customer_name') THEN
        ALTER TABLE orders ADD COLUMN customer_name TEXT;
    END IF;

    -- check for phone -> customer_phone
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='phone') THEN
        ALTER TABLE orders RENAME COLUMN phone TO customer_phone;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='customer_phone') THEN
        ALTER TABLE orders ADD COLUMN customer_phone TEXT;
    END IF;

    -- check for email -> customer_email
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='email') THEN
        ALTER TABLE orders RENAME COLUMN email TO customer_email;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='customer_email') THEN
        ALTER TABLE orders ADD COLUMN customer_email TEXT;
    END IF;
    
    -- Ensure other columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='total') THEN
        ALTER TABLE orders ADD COLUMN total NUMERIC DEFAULT 0;
    END IF;

    -- Ensure 'order_status' exists
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='order_status') THEN
        ALTER TABLE orders ADD COLUMN order_status TEXT DEFAULT 'pending';
    END IF;
    
    -- Ensure 'payment_status' exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payment_status') THEN
        ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'pending';
    END IF;

END $$;

-- 2. Ensure columns exist in ORDER_ITEMS
DO $$
BEGIN
    -- Ensure 'image' exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='image') THEN
        ALTER TABLE order_items ADD COLUMN image TEXT;
    END IF;
END $$;


-- 3. RLS POLICIES (Reset and Re-apply securely)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access" ON orders;
DROP POLICY IF EXISTS "Users own orders" ON orders;
DROP POLICY IF EXISTS "Admin full access items" ON order_items;
DROP POLICY IF EXISTS "Users view own items" ON order_items;

-- Orders
CREATE POLICY "Admin full access" ON orders FOR ALL 
USING (true) WITH CHECK (true); 
-- (Note: In production 'true' makes it public. 
-- The prompt asked for: "Admin full access: FOR ALL USING (true) WITH CHECK (true)"
-- It also asked "Users can view own orders: FOR SELECT USING (auth.uid() = user_id)"
-- Combining them: we likely just want 'true' if we don't have distinct admin roles in auth.users metadata yet, 
-- or we use the Service Role for admins (which bypasses RLS). 
-- If we use Service Role for admin, we don't need a public 'true' policy for ALL.
-- However, for the 'Admin panel' in the prompt, there is no mention of Service Role access for the *frontend* fetching (though server components use it).
-- app/admin/orders/page.tsx calls createClient() (which is the server client). 
-- If getSupabaseServerClient uses ANON key, it respects RLS. 
-- If we want Admins to see ALL data via RLS, they need a role check. 
-- BUT, the code provided in previous checks uses `createClient` from `@/lib/supabase/server` which uses ANON key.
-- To allow Admins to see all orders, we either need an 'is_admin' check OR just allow public read for now.
-- Given the "Production cafe" prompt but without "Roles" setup instructions, 
-- I will stick to the prompt's explicit instruction:
-- "Admin full access: FOR ALL USING (true)..." -> This effectively makes it public.
-- I will apply strictly what is asked.)

-- Re-reading prompt: "Admin full access: FOR ALL USING (true) WITH CHECK (true)"
-- Do strictly this.

CREATE POLICY "Users own orders" ON orders FOR SELECT 
USING (auth.uid() = user_id);

-- Order Items
CREATE POLICY "Admin full access items" ON order_items FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Users view own items" ON order_items FOR SELECT 
USING (
    order_id IN (
        SELECT id FROM orders WHERE user_id = auth.uid()
    )
);

-- 4. FOREIGN KEY CHECKS
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
