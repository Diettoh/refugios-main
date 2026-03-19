-- Fix for check constraint violation: unifies source catalog
-- This is in a new file because 013_c was already applied by Render in a previous run.

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
