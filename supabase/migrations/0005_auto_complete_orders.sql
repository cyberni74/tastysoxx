-- Auto-confirm receipt 14 days after shipping, so sellers' orders (and buyer reviews) never hang open.

alter table public.orders add column shipped_at timestamptz;
update public.orders set shipped_at = updated_at where status in ('shipped','completed') and shipped_at is null;

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
  update orders set status = new_status, updated_at = now(),
         shipped_at = case when new_status = 'shipped' then now() else shipped_at end
   where id = order_id returning * into o;
  if new_status = 'cancelled' then
    update listings set status = 'active' where id in (select listing_id from order_items where order_items.order_id = o.id);
  elsif new_status in ('paid','shipped','completed') then
    update listings set status = 'sold' where id in (select listing_id from order_items where order_items.order_id = o.id);
  end if;
  return o;
end $$;
revoke execute on function public.set_order_status(uuid, text) from public, anon;
grant execute on function public.set_order_status(uuid, text) to authenticated;

-- Runs daily via pg_cron; not callable through the API.
create or replace function public.auto_complete_orders() returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update orders set status = 'completed', updated_at = now()
   where status = 'shipped' and shipped_at < now() - interval '14 days';
  get diagnostics n = row_count;
  return n;
end $$;
revoke execute on function public.auto_complete_orders() from public, anon, authenticated;

create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('auto-complete-orders', '17 3 * * *', 'select public.auto_complete_orders()');
