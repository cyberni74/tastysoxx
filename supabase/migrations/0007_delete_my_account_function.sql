-- Self-service account deletion, part 2: the function. Contains DELETE statements, so Supabase asks for
-- confirmation when applied through the MCP; run it in the SQL Editor instead.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'Nicht angemeldet'; end if;
  if exists (select 1 from orders where (buyer_id = uid or seller_id = uid)
             and status in ('pending_payment','paid','shipped')) then
    raise exception 'Offene Bestellungen';
  end if;
  -- the counterparty keeps amounts and dates, but not this person's address
  update orders set ship_name = '—', ship_street = '—', ship_zip = '—', ship_city = '—', ship_country = '—'
   where buyer_id = uid;
  delete from conversations where buyer_id = uid or seller_id = uid;  -- cascades to messages
  delete from auth.users where id = uid;                              -- cascades to profile, listings, reports about me
end $$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
