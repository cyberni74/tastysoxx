-- Trigger functions are never called via the API
revoke execute on function public.guard_profile_flags() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.touch_conversation() from public, anon, authenticated;
-- Order RPCs: signed-in users only (functions check auth.uid() themselves)
revoke execute on function public.create_orders(uuid[], text, text, text, text, text) from public, anon;
revoke execute on function public.set_order_status(uuid, text) from public, anon;
grant execute on function public.create_orders(uuid[], text, text, text, text, text) to authenticated;
grant execute on function public.set_order_status(uuid, text) to authenticated;
