-- migration-mode: data
-- Eliminates 3 incorrect migration abonos created accidentally by the
-- "Migrar pago" button on future 2026 reservations. These abonos caused
-- reservations #2191 (Eric Bartel), #2196 (Ana Paula Vera), and #2197
-- (Eric Schlor) to appear as fully paid when no payment had been received.
--
-- Verified: all 3 IDs are category='abono' and
-- description='[MIGRACION] Pago asumido previo al sistema de abonos'
-- Do NOT delete any other records.

DELETE FROM sales
WHERE id IN (1970, 2025, 2037)
  AND category = 'abono'
  AND description LIKE '[MIGRACI%';
