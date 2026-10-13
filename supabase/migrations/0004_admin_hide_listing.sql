-- Admins may hide any listing (e.g. after a report). RLS only lets sellers update their own rows,
-- so this runs as SECURITY DEFINER and checks is_admin itself.
create or replace function public.admin_hide_listing(listing_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin) then
    raise exception 'Nicht erlaubt';
  end if;
  update public.listings l set status = 'hidden' where l.id = admin_hide_listing.listing_id;
  if not found then
    raise exception 'Angebot nicht gefunden';
  end if;
end $$;

revoke execute on function public.admin_hide_listing(uuid) from public, anon;
grant execute on function public.admin_hide_listing(uuid) to authenticated;

-- Let admins still see hidden listings (report queue shows title/status after hiding).
create policy "admins read listings" on public.listings for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
