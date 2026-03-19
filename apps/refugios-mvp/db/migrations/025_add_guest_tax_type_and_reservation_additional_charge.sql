-- Añadir campos de facturación y cobros adicionales
ALTER TABLE guests ADD COLUMN tax_document_type TEXT DEFAULT 'sii' CHECK (tax_document_type IN ('sii', 'factura', 'otro'));
ALTER TABLE reservations ADD COLUMN additional_charge NUMERIC(12,2) DEFAULT 0;
