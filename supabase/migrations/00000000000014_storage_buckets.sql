insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('listing-photos', 'listing-photos', true),
  ('review-photos', 'review-photos', true),
  ('identity-documents', 'identity-documents', false)
on conflict (id) do nothing;

create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "avatars_owner_write" on storage.objects
  for insert with check (bucket_id = 'avatars' and owner = auth.uid());
create policy "avatars_owner_update" on storage.objects
  for update using (bucket_id = 'avatars' and owner = auth.uid());
create policy "avatars_owner_delete" on storage.objects
  for delete using (bucket_id = 'avatars' and owner = auth.uid());

create policy "listing_photos_public_read" on storage.objects
  for select using (bucket_id = 'listing-photos');
create policy "listing_photos_owner_write" on storage.objects
  for insert with check (bucket_id = 'listing-photos' and owner = auth.uid());
create policy "listing_photos_owner_update" on storage.objects
  for update using (bucket_id = 'listing-photos' and owner = auth.uid());
create policy "listing_photos_owner_delete" on storage.objects
  for delete using (bucket_id = 'listing-photos' and owner = auth.uid());

create policy "review_photos_public_read" on storage.objects
  for select using (bucket_id = 'review-photos');
create policy "review_photos_owner_write" on storage.objects
  for insert with check (bucket_id = 'review-photos' and owner = auth.uid());

-- identity-documents: no public read policy at all — access only via
-- signed URLs generated server-side with the service-role client.
create policy "identity_documents_owner_write" on storage.objects
  for insert with check (bucket_id = 'identity-documents' and owner = auth.uid());
create policy "identity_documents_owner_read" on storage.objects
  for select using (bucket_id = 'identity-documents' and owner = auth.uid());
