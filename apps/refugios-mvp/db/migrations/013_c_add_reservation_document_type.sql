-- Fix for migration 014 dependency: Adds reservation_document_type, nightly_rate, nights, cleaning_supplement and season_type early.

-- Phase 1 persistence (UI already exposes these)
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS nightly_rate NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS nights INT;

-- RES-03: Cleaning supplement
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS cleaning_supplement NUMERIC(12,2);

-- RES-05: Season type
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS season_type TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'reservations'::regclass
      AND conname = 'reservations_season_type_check'
  ) THEN
    ALTER TABLE reservations
      ADD CONSTRAINT reservations_season_type_check
      CHECK (season_type IS NULL OR season_type IN ('alta', 'baja', 'temporada', 'permanente'));
  END IF;
END $$;

-- RES-04: Booking source / channel catalog (source column)
-- Target values: booking, airbnb, web, direct, other
DO $$
DECLARE
  v_old_constraint TEXT;
BEGIN
  -- Drop any existing CHECK constraint referencing "source"
  FOR v_old_constraint IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'reservations'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%source%'
  LOOP
    EXECUTE 'ALTER TABLE reservations DROP CONSTRAINT ' || quote_ident(v_old_constraint);
  END LOOP;

  -- Backfill legacy values to new vocabulary
  UPDATE reservations SET source = 'direct' WHERE source IN ('phone', 'walkin');

  -- Add new constraint
  ALTER TABLE reservations
    ADD CONSTRAINT reservations_source_new_check
    CHECK (source IN ('booking', 'airbnb', 'web', 'direct', 'other'));
END $$;

-- RES-06: Document type on reservation
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS reservation_document_type TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'reservations'::regclass
      AND conname = 'reservations_reservation_document_type_check'
  ) THEN
    ALTER TABLE reservations
      ADD CONSTRAINT reservations_reservation_document_type_check
      CHECK (
        reservation_document_type IS NULL
        OR reservation_document_type IN ('boleta', 'factura', 'booking', 'ninguno')
      );
  END IF;
END $$;
