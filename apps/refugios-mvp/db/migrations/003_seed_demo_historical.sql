-- Seed historico 2024-2026 para ocupacion y comparativos (datos de produccion).
-- Idempotente: usa claves de control en notes/description para no duplicar.

WITH hist_names AS (
  SELECT * FROM (VALUES
    ('Francisco Espinoza'), ('Fernanda Escorza'), ('Barbara'), ('Nicolas Muñoz'),
    ('Alberto Etchegaray'), ('Nicolas Sanchez'), ('Cristobal Muhr'), ('Natalia Ureta'),
    ('Felipe Garcia'), ('Luis Reyes'), ('Eva Piccozzi'), ('Juan Videla'),
    ('Tomas Correa'), ('Camila Muñoz'), ('Rodrigo Espinoza'), ('Paulina Cabezas'),
    ('Marcela Rodriguez'), ('Alejandra Maturana'), ('Ariana Sepulveda'), ('Lourdes Velez'),
    ('Gabriela Soto'), ('Valentina Riquelme'), ('Russel King'), ('Andres Goycolea'),
    ('Javiera Garrido'), ('Daniel Mclaughlin'), ('Rainer Muehlberger'), ('Jorge Perez'),
    ('Fernando Larumbe'), ('Javiera Pefaur'), ('Martín Echeverría'), ('Loreto Hofer'),
    ('Margarita Steff'), ('Kara Bermejo'), ('Paola Romero'), ('Julio Quinteros')
  ) AS t(full_name)
),
hist_names_numbered AS (
  SELECT full_name, ROW_NUMBER() OVER (ORDER BY full_name) AS rn FROM hist_names
)
INSERT INTO guests (full_name, email, phone, document_id, notes)
SELECT n.full_name, NULL, NULL, 'REF-' || LPAD(n.rn::text, 3, '0'), NULL
FROM hist_names_numbered n
WHERE NOT EXISTS (SELECT 1 FROM guests g WHERE g.document_id = 'REF-' || LPAD(n.rn::text, 3, '0'));

WITH hist_guest_map AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
  FROM guests
  WHERE document_id LIKE 'REF-%'
),
weeks AS (
  SELECT generate_series(date '2024-01-01', date '2026-12-22', interval '7 day')::date AS week_start
),
weekly_slots AS (
  SELECT
    w.week_start,
    EXTRACT(YEAR FROM w.week_start)::int AS yy,
    EXTRACT(WEEK FROM w.week_start)::int AS ww,
    s.slot
  FROM weeks w
  CROSS JOIN LATERAL generate_series(
    1,
    CASE
      WHEN EXTRACT(YEAR FROM w.week_start) = 2024 THEN 6
      WHEN EXTRACT(YEAR FROM w.week_start) = 2025 THEN 8
      ELSE 9
    END
  ) AS s(slot)
),
generated_reservations AS (
  SELECT
    gm.id AS guest_id,
    CASE (ws.slot % 6)
      WHEN 0 THEN 'web'
      WHEN 1 THEN 'airbnb'
      WHEN 2 THEN 'booking'
      WHEN 3 THEN 'phone'
      WHEN 4 THEN 'walkin'
      ELSE 'other'
    END AS source,
    CASE (ws.slot % 5)
      WHEN 0 THEN 'transfer'
      WHEN 1 THEN 'card'
      WHEN 2 THEN 'cash'
      WHEN 3 THEN 'mercadopago'
      ELSE 'other'
    END AS payment_method,
    CASE
      WHEN ws.week_start + (((ws.slot + ws.ww) % 4) + 2) < CURRENT_DATE THEN 'completed'
      ELSE 'confirmed'
    END AS status,
    (ws.week_start + ((ws.slot - 1) % 3))::date AS check_in,
    (ws.week_start + ((ws.slot - 1) % 3) + (((ws.slot + ws.ww) % 4) + 2))::date AS check_out,
    ((ws.slot % 4) + 1) AS guests_count,
    (
      95000
      + ((ws.slot % 4) * 22000)
      + CASE
          WHEN ws.yy = 2024 THEN 0
          WHEN ws.yy = 2025 THEN 18000
          ELSE 26000
        END
    )::numeric(12,2) AS total_amount,
    ('HIST_RES|' || ws.yy || '|' || ws.week_start || '|' || ws.slot) AS notes
  FROM weekly_slots ws
  JOIN hist_guest_map gm
    ON gm.rn = (((ws.yy * 100 + ws.ww + ws.slot) % 36) + 1)
)
INSERT INTO reservations (
  guest_id,
  source,
  payment_method,
  status,
  check_in,
  check_out,
  guests_count,
  total_amount,
  notes
)
SELECT
  gr.guest_id,
  gr.source,
  gr.payment_method,
  gr.status,
  gr.check_in,
  gr.check_out,
  gr.guests_count,
  gr.total_amount,
  gr.notes
FROM generated_reservations gr
WHERE NOT EXISTS (
  SELECT 1 FROM reservations r WHERE r.notes = gr.notes
);

WITH hist_reservations AS (
  SELECT id, total_amount, check_in, status FROM reservations WHERE notes LIKE 'HIST_RES|%'
)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging',
  CASE WHEN r.status = 'completed' THEN r.total_amount ELSE ROUND((r.total_amount * 0.35)::numeric, 2) END,
  'transfer', r.check_in, 'HIST_SALE|' || r.id
FROM hist_reservations r
WHERE NOT EXISTS (SELECT 1 FROM sales s WHERE s.description = 'HIST_SALE|' || r.id);

WITH months AS (
  SELECT generate_series(date '2024-01-01', date '2026-12-01', interval '1 month')::date AS month_start
),
expense_rows AS (
  SELECT month_start, 'limpieza'::text AS category, 380000::numeric AS base_amount, 1 AS ord FROM months
  UNION ALL
  SELECT month_start, 'mantenimiento', 240000::numeric, 2 FROM months
  UNION ALL
  SELECT month_start, 'insumos', 160000::numeric, 3 FROM months
)
INSERT INTO expenses (category, amount, payment_method, expense_date, supplier, description)
SELECT
  e.category,
  ROUND(
    (
      e.base_amount
      + CASE
          WHEN EXTRACT(YEAR FROM e.month_start) = 2024 THEN 0
          WHEN EXTRACT(YEAR FROM e.month_start) = 2025 THEN 45000
          ELSE 72000
        END
      + ((EXTRACT(MONTH FROM e.month_start)::int % 4) * 11000)
    )::numeric,
    2
  ),
  'transfer',
  e.month_start + interval '2 day',
  'Proveedor',
  'HIST_EXP|' || to_char(e.month_start, 'YYYY-MM') || '|' || e.category || '|' || e.ord
FROM expense_rows e
WHERE NOT EXISTS (
  SELECT 1 FROM expenses x
  WHERE x.description = 'HIST_EXP|' || to_char(e.month_start, 'YYYY-MM') || '|' || e.category || '|' || e.ord
);
