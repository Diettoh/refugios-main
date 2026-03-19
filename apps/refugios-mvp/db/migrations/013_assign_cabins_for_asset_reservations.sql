-- Asigna cabañas a reservas importadas desde assets (ASSET_PDF_RESERVAS_*).
-- Reglas:
-- - guests_count <= 4 -> rotación entre cabañas con sort_order 1,2,3
-- - guests_count > 4  -> Casa AvA (sort_order = 4)

WITH small_seed AS (
  SELECT id, row_number() OVER (ORDER BY check_in, id) AS rn
  FROM reservations
  WHERE notes LIKE 'ASSET_PDF_RESERVAS_%'
    AND cabin_id IS NULL
    AND COALESCE(guests_count, 0) <= 4
),
small_target AS (
  SELECT s.id, ((s.rn - 1) % 3) + 1 AS target_sort_order
  FROM small_seed s
)
UPDATE reservations r
SET cabin_id = c.id
FROM small_target t
JOIN cabins c ON c.sort_order = t.target_sort_order
WHERE r.id = t.id;

UPDATE reservations r
SET cabin_id = c.id
FROM cabins c
WHERE r.notes LIKE 'ASSET_PDF_RESERVAS_%'
  AND r.cabin_id IS NULL
  AND COALESCE(r.guests_count, 0) > 4
  AND c.sort_order = 4;
