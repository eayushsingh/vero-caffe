
-- SAFE PERMANENT DATABASE FIX
-- DO NOT delete existing columns, only add missing ones

-- 1. Ensure columns exist in ORDERS
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone text;

-- 2. Ensure columns exist in ORDER_ITEMS
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS image text;

-- 3. MIGRATE DATA (If 'name' exists but 'customer_name' is null)
-- This ensures existing data is not lost if the column names were different
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
