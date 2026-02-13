-- Create a table for orders
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  items jsonb,
  subtotal integer,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table orders enable row level security;

create policy "Users can view their own orders"
  on orders for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own orders"
  on orders for insert
  with check ( auth.uid() = user_id );
