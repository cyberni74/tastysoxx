-- Users must be able to list (and thereby remove) their own files; needed by account deletion.
-- Files stay publicly readable by URL because the buckets are public; this only affects the list/select API.
create policy "own folder list" on storage.objects for select to authenticated
  using (bucket_id in ('listing-images','avatars') and (storage.foldername(name))[1] = auth.uid()::text);
