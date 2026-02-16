
-- 1. Ensure foreign key exists for relational queries
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
