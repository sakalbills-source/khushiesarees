-- ============================================================================
-- KSarees — additive migration: lock FX details onto each order.
--
-- ADDITIVE ONLY. This adds nullable columns to `orders` so each order can
-- record the AUD base total, the currency actually charged, the charged
-- amount, and the exact FX rate applied at payment time. It does NOT drop,
-- rename, or alter existing columns or data.
--
-- The checkout route writes these when present and silently degrades if this
-- migration has not been run, so applying it is safe at any time.
-- ============================================================================

alter table orders add column if not exists currency text;        -- charged currency code (e.g. USD)
alter table orders add column if not exists amount_charged numeric; -- total charged in `currency`
alter table orders add column if not exists fx_rate numeric;        -- AUD -> currency rate locked at payment
alter table orders add column if not exists aud_total numeric;      -- canonical AUD base total

-- `total` continues to hold the AUD base total (source of truth). `aud_total`
-- mirrors it explicitly for clarity alongside the charged figures.
