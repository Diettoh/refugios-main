-- Migración 028: Limpieza de Gastos Duplicados / Históricos
-- Borra todos los gastos sintéticos o importados de manera automática en el pasado
-- para que solo queden los ingresados manualmente y la Carga Masiva de Q1 2026.

DELETE FROM expenses
WHERE description LIKE 'HIST_EXP|%'
   OR description = 'Importado desde PDF Ventas'
   OR description = 'SEED_EXPENSE_DESCRIPTION'
   OR description = 'Importado desde archivo histórico'
   OR description LIKE 'ASSET_PDF%';
