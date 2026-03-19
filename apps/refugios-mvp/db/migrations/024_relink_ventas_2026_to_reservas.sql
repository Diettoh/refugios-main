-- Relink: Ventas 2026 (ASSET_PDF_VENTAS_2026) -> Reservas reales (ASSET_PDF_RESERVAS_2026)
--
-- Contexto:
-- - La migración 014_seed_ventas_2026_from_staging.sql crea reservas sintéticas por mes para poder registrar ventas.
-- - La migración 021_import_reservas_2026_from_pdf.sql importa reservas reales (check_in/check_out correctos) desde el PDF.
--
-- Objetivo:
-- - Mantener las ventas, pero asociarlas a la reserva real del mes por "primer nombre" cuando exista.
-- - Esto permite que la vista de Huéspedes/Reservas muestre pagos (sales) en la reserva real.

WITH ventas AS (
  SELECT
    s.id AS sale_id,
    s.reservation_id AS ventas_reservation_id,
    s.sale_date,
    g.full_name AS ventas_guest_full_name,
    upper(regexp_replace(g.full_name, '\s+.*$', '')) AS guest_first_norm,
    date_trunc('month', s.sale_date)::date AS month_date
  FROM sales s
  JOIN reservations r ON r.id = s.reservation_id
  JOIN guests g ON g.id = r.guest_id
  WHERE r.notes LIKE 'ASSET_PDF_VENTAS_2026%'
),
targets AS (
  SELECT
    v.sale_id,
    (
      SELECT rr.id
      FROM reservations rr
      JOIN guests gg ON gg.id = rr.guest_id
      WHERE rr.notes LIKE 'ASSET_PDF_RESERVAS_2026%'
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

