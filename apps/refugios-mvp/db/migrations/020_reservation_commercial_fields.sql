-- Phase 2: Campos de Reserva (and Phase 1 persistence)
-- Adds commercial fields to reservations and aligns `source` with business channels.
--
-- References:
-- - .planning/phases/02-campos-de-reserva/02-DISCUSSION.md
-- - .planning/phases/02-campos-de-reserva/02-RESEARCH.md

-- NOTE: nightly_rate, nights, cleaning_supplement, season_type and reservation_document_type 
-- were moved to 013_c_add_reservation_document_type.sql to support early seeding in 014.

-- RES-04: Booking source / channel catalog (source column)
-- Target values: booking, airbnb, web, direct, other
DO $$
DECLARE
  v_old_constraint TEXT;
BEGIN
  -- Skip if already migrated
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'reservations'::regclass
      AND conname = 'reservations_source_new_check'
  ) THEN
    RETURN;
  END IF;

  -- Drop any existing CHECK constraint referencing "source"
  SELECT conname INTO v_old_constraint
  FROM pg_constraint
  WHERE conrelid = 'reservations'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%source%';

  IF v_old_constraint IS NOT NULL THEN
    EXECUTE 'ALTER TABLE reservations DROP CONSTRAINT ' || quote_ident(v_old_constraint);
  END IF;

  -- Backfill legacy values to new vocabulary
  UPDATE reservations SET source = 'direct' WHERE source IN ('phone', 'walkin');

  -- Add new constraint
  ALTER TABLE reservations
    ADD CONSTRAINT reservations_source_new_check
    CHECK (source IN ('booking', 'airbnb', 'web', 'direct', 'other'));
END $$;
