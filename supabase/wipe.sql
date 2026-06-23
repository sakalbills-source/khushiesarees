-- ============================================================================
-- KSarees — WIPE CATALOGUE DATA (data only, schema preserved)
-- Run this in the Supabase SQL editor to clear all catalogue rows.
--
-- This NEVER drops tables or alters schema. It only deletes row data from the
-- catalogue tables. Optional tables (product_images, variants, inventory,
-- reviews, review_images, ratings, …) are truncated ONLY if they exist, so
-- this script is safe whether or not those tables were ever created.
--
-- `orders` is intentionally LEFT INTACT (historical sales are not catalogue
-- data). Remove it from the keep-list below if you also want to clear orders.
-- ============================================================================

-- Truncate any optional catalogue/review/inventory tables that happen to exist.
-- TRUNCATE … RESTART IDENTITY CASCADE clears rows + dependent FK rows without
-- touching table structure.
do $$
declare
  t text;
  optional_tables text[] := array[
    'review_images',
    'reviews',
    'ratings',
    'product_ratings',
    'rating_aggregates',
    'product_rating_aggregates',
    'inventory',
    'variants',
    'product_variants',
    'product_images',
    'cart_items'
  ];
begin
  foreach t in array optional_tables loop
    if exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = t
    ) then
      execute format('truncate table public.%I restart identity cascade;', t);
      raise notice 'Truncated %', t;
    end if;
  end loop;
end $$;

-- Products is the canonical catalogue table and always exists. CASCADE clears
-- any remaining FK-dependent rows (cart_items, images, variants, reviews, …).
truncate table public.products restart identity cascade;

-- ============================================================================
-- After running: every catalogue table is empty, schema is unchanged, and the
-- storefront renders its "Coming soon" empty state until new products are added
-- via the admin panel (/admin/products) against a configured Supabase project.
-- ============================================================================
