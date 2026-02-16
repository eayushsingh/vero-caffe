
# Final Verification Checklist

## 1. Files Updated
- [x] app/api/orders/create/route.ts
- [x] app/admin/orders/[id]/page.tsx
- [x] app/admin/orders/page.tsx
- [x] fix_schema_final.sql

## 2. Schema Changes (Run SQL Script)
- [ ] Renamed `name` -> `customer_name`
- [ ] Renamed `phone` -> `customer_phone`
- [ ] Renamed `email` -> `customer_email`
- [ ] Added `image` to `order_items`
- [ ] Applied RLS policies

## 3. Verification Steps
1. Run `fix_schema_final.sql` in Supabase.
2. Restart dev server.
3. Place a new order as guest -> Verify `orders` table has `customer_name`.
4. Check Admin List -> Should show customer name.
5. Check Admin Detail -> Should show items with images.
