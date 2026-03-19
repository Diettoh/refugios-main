-- Migration to ensure columns exist before 023 seed
-- This fixes the error: column "additional_charge" of relation "reservations" does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='guests' AND column_name='tax_document_type') THEN
        ALTER TABLE guests ADD COLUMN tax_document_type TEXT DEFAULT 'sii' CHECK (tax_document_type IN ('sii', 'factura', 'otro'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='additional_charge') THEN
        ALTER TABLE reservations ADD COLUMN additional_charge NUMERIC(12,2) DEFAULT 0;
    END IF;
END $$;
