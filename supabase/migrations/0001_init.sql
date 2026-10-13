-- TastySoxx schema: profiles, listings, orders, chat, reviews + RLS + storage

create extension if not exists pgcrypto;

-- PROFILES -------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[A-Za-z0-9_.-]{3,24}$'),
  role text not null default 'buyer' check (role in ('buyer','seller')),
  bio text not null default '' check (char_length(bio) <= 600),
  country text not null default 'DE' check (char_length(country) = 2),
  age_range text check (age_range in ('18–24','25–29','30–34','35–39','40+')),
  build text check (build in ('schlank','sportlich','normal','kurvig')),
  shoe_size text check (char_length(shoe_size) <= 5),
  avatar_url text,
  verified boolean not null default false,
  is_admin boolean not null default false,
  adult_confirmed_at timestamptz not null,
  last_active timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles readable" on public.profiles for select using (true);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- users cannot grant themselves verified/admin
create or replace function public.guard_profile_flags() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin) then
    new.verified := old.verified;
    new.is_admin := old.is_admin;
  end if;
  new.adult_confirmed_at := old.adult_confirmed_at;
  return new;
end $$;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_flags();

-- admins may update any profile (verification)
create policy "admins update profiles" on public.profiles for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- create profile on signup from metadata (username, role, adult_confirmed)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce((new.raw_user_meta_data->>'adult_confirmed')::boolean, false) is not true then
    raise exception 'Altersbestätigung (18+) fehlt';
  end if;
  insert into public.profiles (id, username, role, adult_confirmed_at)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    case when new.raw_user_meta_data->>'role' = 'seller' then 'seller' else 'buyer' end,
    now()
  );
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- LISTINGS -------------------------------------------------------------
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 80),
  description text not null default '' check (char_length(description) <= 2000),
  category text not null check (category in ('sneaker','sport','knie','nylon')),
  material text not null check (material in ('Baumwolle','Wolle','Nylon','Synthetik')),
  wear_days int not null check (wear_days between 1 and 30),
  price_cents int not null check (price_cents between 500 and 50000),
  images text[] not null default '{}' check (cardinality(images) <= 6),
  status text not null default 'active' check (status in ('active','reserved','sold','hidden')),
  created_at timestamptz not null default now()
);
create index listings_active_idx on public.listings (status, created_at desc);
create index listings_seller_idx on public.listings (seller_id);
alter table public.listings enable row level security;
create policy "listings public read" on public.listings for select
  using (status in ('active','reserved','sold') or seller_id = auth.uid());
create policy "sellers insert own" on public.listings for insert
  with check (seller_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'seller'));
create policy "sellers update own" on public.listings for update
  using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "sellers delete own" on public.listings for delete
  using (seller_id = auth.uid() and status in ('active','hidden'));

-- ORDERS (one order per seller) ---------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number text unique not null default ('TS-' || upper(substr(md5(gen_random_uuid()::text), 1, 8))),
  buyer_id uuid not null references public.profiles(id),
  seller_id uuid not null references public.profiles(id),
  status text not null default 'pending_payment'
    check (status in ('pending_payment','paid','shipped','completed','cancelled')),
  subtotal_cents int not null,
  shipping_cents int not null,
  ship_name text not null,
  ship_street text not null,
  ship_zip text not null,
  ship_city text not null,
  ship_country text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.order_items (
  order_id uuid not null references public.orders(id) on delete cascade,
  listing_id uuid not null references public.listings(id),
  title text not null,
  price_cents int not null,
  primary key (order_id, listing_id)
);
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
create policy "order parties read" on public.orders for select
  using (auth.uid() in (buyer_id, seller_id));
create policy "order items parties read" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and auth.uid() in (o.buyer_id, o.seller_id)));

-- create orders atomically; prices come from the DB, never the client
create or replace function public.create_orders(
  listing_ids uuid[], ship_name text, ship_street text, ship_zip text, ship_city text, ship_country text
) returns setof public.orders
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  s uuid;
  o public.orders;
  shipping int := 490;
begin
  if uid is null then raise exception 'Nicht angemeldet'; end if;
  if coalesce(cardinality(listing_ids), 0) = 0 then raise exception 'Warenkorb ist leer'; end if;
  if exists (select 1 from unnest(listing_ids) i where not exists
      (select 1 from listings l where l.id = i and l.status = 'active' and l.seller_id <> uid)) then
    raise exception 'Mindestens ein Artikel ist nicht mehr verfügbar';
  end if;
  perform 1 from listings where id = any(listing_ids) for update;
  for s in select distinct seller_id from listings where id = any(listing_ids) loop
    insert into orders (buyer_id, seller_id, subtotal_cents, shipping_cents, ship_name, ship_street, ship_zip, ship_city, ship_country)
    select uid, s, sum(price_cents), shipping, ship_name, ship_street, ship_zip, ship_city, ship_country
    from listings where id = any(listing_ids) and seller_id = s
    returning * into o;
    insert into order_items (order_id, listing_id, title, price_cents)
      select o.id, id, title, price_cents from listings where id = any(listing_ids) and seller_id = s;
    update listings set status = 'reserved' where id = any(listing_ids) and seller_id = s;
    return next o;
  end loop;
end $$;

-- status transitions: seller -> paid/shipped/cancelled, buyer -> completed/cancelled (while unpaid)
create or replace function public.set_order_status(order_id uuid, new_status text) returns public.orders
language plpgsql security definer set search_path = public as $$
declare o public.orders; uid uuid := auth.uid();
begin
  select * into o from orders where id = order_id for update;
  if not found then raise exception 'Bestellung nicht gefunden'; end if;
  if uid = o.seller_id and (
       (o.status = 'pending_payment' and new_status in ('paid','cancelled')) or
       (o.status = 'paid' and new_status = 'shipped')) then null;
  elsif uid = o.buyer_id and (
       (o.status = 'shipped' and new_status = 'completed') or
       (o.status = 'pending_payment' and new_status = 'cancelled')) then null;
  else raise exception 'Statuswechsel nicht erlaubt';
  end if;
  update orders set status = new_status, updated_at = now() where id = order_id returning * into o;
  if new_status = 'cancelled' then
    update listings set status = 'active' where id in (select listing_id from order_items where order_items.order_id = o.id);
  elsif new_status in ('paid','shipped','completed') then
    update listings set status = 'sold' where id in (select listing_id from order_items where order_items.order_id = o.id);
  end if;
  return o;
end $$;

-- REVIEWS --------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique not null references public.orders(id),
  buyer_id uuid not null references public.profiles(id),
  seller_id uuid not null references public.profiles(id),
  rating int not null check (rating between 1 and 5),
  body text not null default '' check (char_length(body) <= 1000),
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
create policy "reviews public read" on public.reviews for select using (true);
create policy "buyer reviews completed order" on public.reviews for insert with check (
  buyer_id = auth.uid() and exists (
    select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid()
      and o.seller_id = reviews.seller_id and o.status = 'completed'));

create view public.seller_stats with (security_invoker = true) as
  select p.id as seller_id,
         coalesce(round(avg(r.rating)::numeric, 1), 0) as rating,
         count(r.id)::int as review_count
  from public.profiles p left join public.reviews r on r.seller_id = p.id
  where p.role = 'seller'
  group by p.id;

-- CHAT -----------------------------------------------------------------
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (buyer_id, seller_id),
  check (buyer_id <> seller_id)
);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index messages_conv_idx on public.messages (conversation_id, created_at);
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
create policy "conv parties read" on public.conversations for select using (auth.uid() in (buyer_id, seller_id));
create policy "buyer starts conv" on public.conversations for insert with check (
  buyer_id = auth.uid() and exists (select 1 from public.profiles where id = seller_id and role = 'seller'));
create policy "msg parties read" on public.messages for select using (
  exists (select 1 from public.conversations c where c.id = conversation_id and auth.uid() in (c.buyer_id, c.seller_id)));
create policy "msg parties send" on public.messages for insert with check (
  sender_id = auth.uid() and exists (select 1 from public.conversations c where c.id = conversation_id and auth.uid() in (c.buyer_id, c.seller_id)));

create or replace function public.touch_conversation() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update conversations set last_message_at = new.created_at where id = new.conversation_id;
  update profiles set last_active = now() where id = new.sender_id;
  return new;
end $$;
create trigger messages_touch after insert on public.messages for each row execute function public.touch_conversation();

alter publication supabase_realtime add table public.messages;

-- STORAGE --------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 5242880, array['image/jpeg','image/png','image/webp']),
       ('avatars', 'avatars', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "own folder upload" on storage.objects for insert to authenticated
  with check (bucket_id in ('listing-images','avatars') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own folder update" on storage.objects for update to authenticated
  using (bucket_id in ('listing-images','avatars') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own folder delete" on storage.objects for delete to authenticated
  using (bucket_id in ('listing-images','avatars') and (storage.foldername(name))[1] = auth.uid()::text);
