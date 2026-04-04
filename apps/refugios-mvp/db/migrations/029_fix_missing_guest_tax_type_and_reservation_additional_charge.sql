-- migration-mode: schema
-- Hotfix idempotente: algunas BDs quedaron con schema_migrations marcado pero sin columnas.

-- guests.tax_document_type
ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS tax_document_type TEXT;

ALTER TABLE guests
  ALTER COLUMN tax_document_type SET DEFAULT 'sii';

UPDATE guests
SET tax_document_type = 'sii'
WHERE tax_document_type IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'guests_tax_document_type_check'
  ) THEN
    ALTER TABLE guests
      ADD CONSTRAINT guests_tax_document_type_check
      CHECK (tax_document_type IN ('sii', 'factura', 'otro'));
  END IF;
END $$;

-- reservations.additional_charge
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS additional_charge NUMERIC(12,2);

ALTER TABLE reservations
  ALTER COLUMN additional_charge SET DEFAULT 0;

UPDATE reservations
SET additional_charge = 0
WHERE additional_charge IS NULL;

