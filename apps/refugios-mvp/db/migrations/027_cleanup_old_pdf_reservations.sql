-- Migración 027: Limpiar duplicados originados por las importaciones en PDF previas.

-- 1. Relinkear ventas a las reservas correctas (ASSET_CORRECTED)
WITH ventas AS (
  SELECT
    s.id AS sale_id,
    r.check_in AS old_check_in,
    upper(regexp_replace(g.full_name, '\s+.*$', '')) AS guest_first_norm,
    date_trunc('month', COALESCE(r.check_in, s.sale_date))::date AS month_date
  FROM sales s
  JOIN reservations r ON r.id = s.reservation_id
  JOIN guests g ON g.id = r.guest_id
  WHERE r.notes LIKE 'ASSET_PDF_RESERVAS_2025%'
     OR r.notes LIKE 'ASSET_PDF_RESERVAS_2026%'
     OR r.notes LIKE 'ASSET_PDF_VENTAS%'
     OR r.notes = 'Importado desde PDF Ventas'
     OR r.notes = 'Importado desde PDF Reservas'
     OR r.notes = 'Auto-creado para enlazar venta huerfana'
),
targets AS (
  SELECT
    v.sale_id,
    (
      SELECT rr.id
      FROM reservations rr
      JOIN guests gg ON gg.id = rr.guest_id
      WHERE rr.notes LIKE 'ASSET_CORRECTED_%'
        AND date_trunc('month', rr.check_in)::date = v.month_date
        AND upper(gg.full_name) = v.guest_first_norm
      ORDER BY rr.check_in, rr.id
      LIMIT 1
    ) AS real_reservation_id
  FROM ventas v
)
UPDATE sales s
SET reservation_id = t.real_reservation_id
FROM targets t
WHERE s.id = t.sale_id
  AND t.real_reservation_id IS NOT NULL
  AND s.reservation_id IS DISTINCT FROM t.real_reservation_id;

-- 2. Eliminar las reservas duplicadas antiguas
DELETE FROM reservations 
WHERE notes LIKE 'ASSET_PDF_RESERVAS_2025%'
   OR notes LIKE 'ASSET_PDF_RESERVAS_2026%'
   OR notes LIKE 'ASSET_PDF_VENTAS%'
   OR notes = 'Importado desde PDF Ventas'
   OR notes = 'Importado desde PDF Reservas'
   OR notes = 'Auto-creado para enlazar venta huerfana';
