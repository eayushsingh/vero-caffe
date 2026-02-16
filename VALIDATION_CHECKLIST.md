
# Validation Checklist

## 1. Schema Check
- [ ] Run `SUPABASE_PRODUCTION_SCHEMA.sql` in Supabase SQL Editor.
- [ ] Verify `orders` table has columns: `guest_id`, `user_id`, `payment_method`.
- [ ] Verify `order_items` table has columns: `menu_item_id`, `image`.
- [ ] Verify RLS policies allow public insert on both tables.

## 2. Order Creation
- [ ] Go to `/menu` as GUEST.
- [ ] Add items to cart.
- [ ] Go to `/checkout`.
- [ ] Fill name/phone.
- [ ] Click "Pay at Counter".
- [ ] Verify redirect to Success page.
- [ ] Verify in Supabase: Order is created with `guest_id`.

## 3. User Orders
- [ ] Go to `/orders`.
- [ ] As Guest: Ensure url has `?guest_id=...` or logic handles it? 
    - *Correction:* The frontend `orders/page.tsx` was fixed to fetch from `/api/orders/user`. 
    - If logic depends on `guest_id` in localStorage, ensure `orders/page.tsx` reads it and sends as param.
    - *Self-correction:* I updated `checkout/page` to save `guest_id`. Browsing back to orders needs to send this. 
    - **Action Item:** Ensure frontend `/orders/page.tsx` actually sends the `guest_id`.

## 4. Admin Orders
- [ ] Go to `/admin/orders` (Login as admin).
- [ ] Verify list shows the new guest order.
- [ ] Verify status and total.
- [ ] Click "View".
- [ ] Verify `/admin/orders/[id]` page loads with item details.

## 5. Console
- [ ] Check for any red errors during checkout or fetch.
- [ ] Ensure no 404s on API routes.
