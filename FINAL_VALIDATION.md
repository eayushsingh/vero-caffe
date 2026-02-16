
# Validations

## 1. Database Schema
- [ ] Run `fix_schema_production.sql`.
- [ ] Columns for `menu_items`: id, name, price, image, category, created_at.
- [ ] Columns for `orders`: id, user_id, guest_id, name, phone, email, total, payment_method, payment_status, order_status, notes.
- [ ] Columns for `order_items`: id, order_id, menu_item_id, name, price, quantity, image.

## 2. API Routes
- [ ] `app/api/orders/create/route.ts` - Correctly handles insert with `guest_id`, `image`.
- [ ] `app/api/orders/update-status/route.ts` - Correctly updates status.
- [ ] `app/admin/orders/[id]/page.tsx` - Uses `await params`, fetches nested `order_items`.

## 3. Frontend
- [ ] `ProfileMenu.tsx` - Fixed JSX error.
- [ ] `NavbarAvatar.tsx` - Working reactive avatar.
- [ ] `admin/orders/[id]/page.tsx` - Shows items list.

## 4. Supabase Client
- [ ] `lib/supabaseClient.ts` - Browser client exists.
- [ ] `lib/supabase/server.ts` - Server client exists.
- [ ] `lib/supabase/client.ts` - Browser client (used in hooks) exists.

## 5. Verification
- [ ] Guest checkout -> Order created.
- [ ] Admin panel -> Order listed -> Status updated -> Items visible.
- [ ] User panel -> Order listed -> Status updated.
