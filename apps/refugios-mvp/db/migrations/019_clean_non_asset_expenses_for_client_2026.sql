-- Limpieza de gastos no trazables a assets del cliente (dataset 2026)
-- Idempotente.

-- 1) Elimina gastos 2026 que no provienen del Excel de cliente.
DELETE FROM expenses
WHERE expense_date >= DATE '2026-01-01'
  AND expense_date < DATE '2027-01-01'
  AND COALESCE(description, '') NOT LIKE 'ASSET_XLSX_GASTOS|2026|%';

-- 2) Elimina registros con fecha inválida histórica (carga defectuosa previa).
DELETE FROM expenses
WHERE expense_date < DATE '2000-01-01';
