-- Seed de ventas 2026 desde staging normalizado (Ventas AvA 2026.pdf)
-- Inserta en sales y actualiza reservations.

WITH seed(
  seed_key,
  source_file,
  year,
  month,
  page,
  row_no,
  guest_name,
  r_or_c,
  product_code,
  pax,
  pax_ad,
  nights,
  nightly_price,
  cleaning_supplement,
  total_per_night,
  total_stay,
  utility,
  notes,
  quality_flags,
  guest_name_resolved,
  guest_first_norm,
  amount_resolved
) AS (
  VALUES
    ('ASSET_PDF_VENTAS_2026_M1_P1_R1', 'Ventas AvA 2026.pdf', 2026, 1, 1, 1, 'Francisco Espinoza', 'R', 'A', 2, 0, 4, 90000, 30000, 90000, 390000, 378300, 'SII', NULL, 'Francisco Espinoza', 'FRANCISCO', 390000),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R2', 'Ventas AvA 2026.pdf', 2026, 1, 1, 2, 'Fernanda Escorza', 'R', 'P', 2, 0, 3, 90000, 30000, 90000, 300000, 295800, NULL, NULL, 'Fernanda Escorza', 'FERNANDA', 300000),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R3', 'Ventas AvA 2026.pdf', 2026, 1, 1, 3, 'Barbara', 'R', 'T', 2, 0, 1, 120000, NULL, 120000, 120000, 120000, 'SII', NULL, 'Barbara', 'BARBARA', 120000),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R4', 'Ventas AvA 2026.pdf', 2026, 1, 1, 4, 'Nicolas Muñoz', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL, 'Nicolas Muñoz', 'NICOLAS', 180000),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R5', 'Ventas AvA 2026.pdf', 2026, 1, 1, 5, 'Alberto Etchegaray', 'C', 'A', 5, 0, 1, 220000, NULL, 220000, 220000, 213400, 'SII', NULL, 'Alberto Etchegaray', 'ALBERTO', 220000),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R6', 'Ventas AvA 2026.pdf', 2026, 1, 1, 6, '...', 'C', 'A', 5, 0, 2, 240000, 40000, 240000, 520000, 504400, '...', 'name_placeholder', 'PENDIENTE PDF VENTAS 2026 P1-R6', 'PENDIENTE', 520000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R1', 'Ventas AvA 2026.pdf', 2026, 2, 2, 1, 'Nicolas Sanchez', 'R', 'P', 3, 0, 4, 90000, 30000, 90000, 390000, 384540, 'X', NULL, 'Nicolas Sanchez', 'NICOLAS', 390000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R2', 'Ventas AvA 2026.pdf', 2026, 2, 2, 2, 'Cristobal Muhr', 'R', 'T', 3, 0, 3, 60000, NULL, 60000, 180000, 180000, 'abono 120.000 SII debe 60.000', NULL, 'Cristobal Muhr', 'CRISTOBAL', 180000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R4', 'Ventas AvA 2026.pdf', 2026, 2, 2, 4, 'Natalia Ureta', 'R', 'T', 4, 0, 3, 110000, NULL, 110000, 330000, 330000, 'abono 165.000 SII', NULL, 'Natalia Ureta', 'NATALIA', 330000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R5', 'Ventas AvA 2026.pdf', 2026, 2, 2, 5, 'Felipe Garcia', 'C', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 720000, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Felipe Garcia', 'FELIPE', 720000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R6', 'Ventas AvA 2026.pdf', 2026, 2, 2, 6, 'Luis Reyes', 'R', 'T', 2, 0, 3, 90000, NULL, 90000, 270000, 270000, 'abono 135.000 SII', NULL, 'Luis Reyes', 'LUIS', 270000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R7', 'Ventas AvA 2026.pdf', 2026, 2, 2, 7, 'Eva Piccozzi', 'R', 'P', 3, 0, 5, 120000, 30000, 120000, 630000, 621180, 'X', NULL, 'Eva Piccozzi', 'EVA', 630000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R8', 'Ventas AvA 2026.pdf', 2026, 2, 2, 8, 'Juan Videla', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL, 'Juan Videla', 'JUAN', 180000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R9', 'Ventas AvA 2026.pdf', 2026, 2, 2, 9, 'Tomas Correa', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, NULL, NULL, 'Tomas Correa', 'TOMAS', 180000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R10', 'Ventas AvA 2026.pdf', 2026, 2, 2, 10, 'Camila Muñoz', 'R', 'T', 3, 0, 6, 100000, NULL, 100000, 600000, 600000, 'abono 300.000 factura', NULL, 'Camila Muñoz', 'CAMILA', 600000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R11', 'Ventas AvA 2026.pdf', 2026, 2, 2, 11, 'Rodrigo Espinoza', 'R', 'T', 2, 0, 5, 90000, NULL, 90000, 450000, 450000, 'factura', NULL, 'Rodrigo Espinoza', 'RODRIGO', 450000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R12', 'Ventas AvA 2026.pdf', 2026, 2, 2, 12, 'Paulina Cabezas', 'R', 'T', 2, 0, 2, 72900, NULL, 72900, 145800, 145800, 'SII', NULL, 'Paulina Cabezas', 'PAULINA', 145800),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R13', 'Ventas AvA 2026.pdf', 2026, 2, 2, 13, 'Marcela Rodriguez', 'R', 'T', 2, 0, 2, 90000, NULL, 90000, 180000, 180000, 'SII', NULL, 'Marcela Rodriguez', 'MARCELA', 180000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R14', 'Ventas AvA 2026.pdf', 2026, 2, 2, 14, 'Alejandra Maturana', 'R', 'T', 2, 0, 3, 90000, NULL, 90000, 270000, 270000, 'X', NULL, 'Alejandra Maturana', 'ALEJANDRA', 270000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R15', 'Ventas AvA 2026.pdf', 2026, 2, 2, 15, 'Ariana Sepulveda', 'R', 'T', 2, 0, 6, 73500, NULL, 73500, 441000, 441000, 'booking', NULL, 'Ariana Sepulveda', 'ARIANA', 441000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R16', 'Ventas AvA 2026.pdf', 2026, 2, 2, 16, 'Lourdes Velez', 'R', 'T', 2, 0, 4, 72000, NULL, 72000, 288000, 288000, 'booking', NULL, 'Lourdes Velez', 'LOURDES', 288000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R17', 'Ventas AvA 2026.pdf', 2026, 2, 2, 17, 'Gabriela Soto', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL, 'Gabriela Soto', 'GABRIELA', 180000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R18', 'Ventas AvA 2026.pdf', 2026, 2, 2, 18, 'Valentina Riquelme', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL, 'Valentina Riquelme', 'VALENTINA', 180000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R19', 'Ventas AvA 2026.pdf', 2026, 2, 2, 19, 'Russel King', 'C', 'A', 4, 0, 3, 210000, 40000, 210000, 670000, 649900, 'SII', NULL, 'Russel King', 'RUSSEL', 670000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R20', 'Ventas AvA 2026.pdf', 2026, 2, 2, 20, 'Andres Goycolea', 'C', 'A', 5, 0, 5, 210000, 40000, 210000, 1090000, 1057300, 'SII', NULL, 'Andres Goycolea', 'ANDRES', 1090000),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R21', 'Ventas AvA 2026.pdf', 2026, 2, 2, 21, 'Javiera Garrido', 'R', 'A', 2, 0, 3, 90000, NULL, 90000, 270000, 261900, 'SII', NULL, 'Javiera Garrido', 'JAVIERA', 270000),
    ('ASSET_PDF_VENTAS_2026_M4_P4_R1', 'Ventas AvA 2026.pdf', 2026, 4, 4, 1, 'Tomas Burgos', 'R', 'T', 2, 0, 3, 72000, NULL, 72000, 216000, 216000, 'booking', NULL, 'Tomas Burgos', 'TOMAS', 216000),
    ('ASSET_PDF_VENTAS_2026_M8_P8_R1', 'Ventas AvA 2026.pdf', 2026, 8, 8, 1, 'Joao Viana', 'C', NULL, 8, 0, 3, 320000, NULL, 320000, 960000, NULL, NULL, 'missing_product_code', 'Joao Viana', 'JOAO', 960000),
    ('ASSET_PDF_VENTAS_2026_M8_P8_R2', 'Ventas AvA 2026.pdf', 2026, 8, 8, 2, 'Joao Viana', 'R', NULL, 4, 0, 3, 150000, NULL, 150000, 450000, NULL, NULL, 'missing_product_code', 'Joao Viana', 'JOAO', 450000),
    ('ASSET_PDF_VENTAS_2026_M8_P8_R3', 'Ventas AvA 2026.pdf', 2026, 8, 8, 3, 'Joao Viana', 'R', NULL, 4, 0, 3, 1500000, NULL, 1500000, 4500000, NULL, NULL, 'missing_product_code;potential_outlier_high_nightly_price', 'Joao Viana', 'JOAO', 4500000)
),
resolved AS (
  SELECT
    s.*,
    make_date(s.year, s.month, 1) AS month_date,
    (
      SELECT r.id
      FROM reservations r
      JOIN guests g ON g.id = r.guest_id
      WHERE r.notes LIKE 'ASSET_PDF_RESERVAS_2026%'
        AND date_trunc('month', r.check_in) = date_trunc('month', make_date(s.year, s.month, 1))
        AND upper(regexp_replace(g.full_name, '\s+.*$', '')) = s.guest_first_norm
      ORDER BY r.check_in, r.id
      LIMIT 1
    ) AS reservation_id
  FROM seed s
  WHERE COALESCE(s.amount_resolved, 0) > 0
),
updated_reservations AS (
  UPDATE reservations r
  SET 
    source = CASE 
      WHEN res.product_code = 'T' THEN 'direct'
      WHEN res.product_code = 'P' THEN 'web'
      WHEN res.product_code = 'A' THEN 'airbnb'
      WHEN res.product_code = 'B' THEN 'booking'
      ELSE r.source
    END,
    payment_method = CASE
      WHEN res.product_code = 'T' THEN 'transfer'
      WHEN res.product_code = 'P' THEN 'card'
      WHEN res.product_code IN ('A', 'B') THEN 'other'
      ELSE r.payment_method
    END,
    cabin_id = CASE
      WHEN res.r_or_c = 'C' THEN 4
      WHEN res.r_or_c = 'R' AND r.cabin_id IS NULL THEN (SELECT id FROM cabins WHERE sort_order IN (1,2,3) ORDER BY random() LIMIT 1)
      ELSE r.cabin_id
    END,
    additional_charge = COALESCE(res.cleaning_supplement, 0),
    reservation_document_type = CASE
      WHEN res.notes ILIKE '%sii%' OR res.notes ILIKE '%boleta%' THEN 'boleta'
      WHEN res.notes ILIKE '%factura%' THEN 'factura'
      ELSE NULL
    END,
    total_amount = res.amount_resolved
  FROM resolved res
  WHERE r.id = res.reservation_id
  RETURNING r.id
)
INSERT INTO sales (
  reservation_id,
  category,
  amount,
  payment_method,
  sale_date,
  description
)
SELECT
  r.reservation_id,
  CASE WHEN r.cleaning_supplement > 0 THEN 'lodging' ELSE 'lodging' END,
  r.amount_resolved::numeric(12,2),
  CASE
    WHEN r.product_code = 'T' THEN 'transfer'
    WHEN r.product_code = 'P' THEN 'card'
    ELSE 'other'
  END,
  COALESCE((SELECT rr.check_in FROM reservations rr WHERE rr.id = r.reservation_id), r.month_date),
  ('ASSET_PDF_VENTAS_2026' || ' | key=' || r.seed_key || ' | ' || r.guest_name_resolved
    || CASE WHEN r.notes IS NOT NULL THEN ' | notes=' || r.notes ELSE '' END
  )
FROM resolved r
WHERE NOT EXISTS (
  SELECT 1 FROM sales s WHERE s.description = ('ASSET_PDF_VENTAS_2026' || ' | key=' || r.seed_key || ' | ' || r.guest_name_resolved
    || CASE WHEN r.notes IS NOT NULL THEN ' | notes=' || r.notes ELSE '' END
  )
);
