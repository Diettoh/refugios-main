-- Elimina duplicados históricos de ventas 2026 importadas por pipeline antiguo.
-- Conserva la fuente canónica nueva: ASSET_PDF_VENTAS_2026 | key=...
-- Idempotente.

DELETE FROM sales
WHERE description LIKE 'ASSET_PDF_VENTAS|2026|%';

-- (Opcional futuro) Si se requiere, limpiar también reservas antiguas huérfanas de ese import.
