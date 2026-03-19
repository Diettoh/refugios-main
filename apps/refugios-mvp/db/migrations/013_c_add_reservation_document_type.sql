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
