-- Self-service account deletion, part 1: schema (applied).
-- Orders/reviews survive for the counterparty (pseudonymised: user reference becomes NULL, the buyer's
-- shipping address is scrubbed). Everything else (profile, listings, chats) is deleted via cascade.

-- orders: keep rows when a participant is deleted
alter table public.orders alter column buyer_id drop not null;
alter table public.orders alter column seller_id drop not null;
alter table public.orders drop constraint orders_buyer_id_fkey;
alter table public.orders drop constraint orders_seller_id_fkey;
alter table public.orders add constraint orders_buyer_id_fkey foreign key (buyer_id) references public.profiles(id) on delete set null;
alter table public.orders add constraint orders_seller_id_fkey foreign key (seller_id) references public.profiles(id) on delete set null;

-- order_items: snapshot columns (title, price) stay; the listing link may disappear
alter table public.order_items drop constraint order_items_pkey;
alter table public.order_items add column id uuid not null default gen_random_uuid();
alter table public.order_items add primary key (id);
alter table public.order_items alter column listing_id drop not null;
alter table public.order_items drop constraint order_items_listing_id_fkey;
alter table public.order_items add constraint order_items_listing_id_fkey foreign key (listing_id) references public.listings(id) on delete set null;
create unique index order_items_order_listing_uq on public.order_items (order_id, listing_id);

-- reviews: a review by a deleted buyer stays (anonymous); reviews about a deleted seller go with the seller
alter table public.reviews alter column buyer_id drop not null;
alter table public.reviews drop constraint reviews_buyer_id_fkey;
alter table public.reviews drop constraint reviews_seller_id_fkey;
alter table public.reviews add constraint reviews_buyer_id_fkey foreign key (buyer_id) references public.profiles(id) on delete set null;
alter table public.reviews add constraint reviews_seller_id_fkey foreign key (seller_id) references public.profiles(id) on delete cascade;
