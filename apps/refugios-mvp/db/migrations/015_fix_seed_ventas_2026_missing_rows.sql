-- Reparación de seed ventas 2026 desde staging.
-- Completa filas faltantes tras 014, manteniendo idempotencia.

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
  quality_flags
) AS (
  VALUES
    ('ASSET_PDF_VENTAS_2026_M1_P1_R1', 'Ventas AvA 2026.pdf', 2026, 1, 1, 1, 'Francisco Espinoza', 'R', 'A', 2, 0, 4, 90000, 30000, 90000, 390000, 378300, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R2', 'Ventas AvA 2026.pdf', 2026, 1, 1, 2, 'Fernanda Escorza', 'R', 'P', 2, 0, 3, 90000, 30000, 90000, 300000, 295800, NULL, NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R3', 'Ventas AvA 2026.pdf', 2026, 1, 1, 3, 'Barbara', 'R', 'T', 2, 0, 1, 120000, NULL, 120000, 120000, 120000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R4', 'Ventas AvA 2026.pdf', 2026, 1, 1, 4, 'Nicolas Muñoz', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R5', 'Ventas AvA 2026.pdf', 2026, 1, 1, 5, 'Alberto Etchegaray', 'C', 'A', 5, 0, 1, 220000, NULL, 220000, 220000, 213400, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R6', 'Ventas AvA 2026.pdf', 2026, 1, 1, 6, '...', 'C', 'A', 5, 0, 2, 240000, 40000, 240000, 520000, 504400, '...', 'name_placeholder'),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R1', 'Ventas AvA 2026.pdf', 2026, 2, 2, 1, 'Nicolas Sanchez', 'R', 'P', 3, 0, 4, 90000, 30000, 90000, 390000, 384540, 'X', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R2', 'Ventas AvA 2026.pdf', 2026, 2, 2, 2, 'Cristobal Muhr', 'R', 'T', 3, 0, 3, 60000, NULL, 60000, 180000, 180000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R4', 'Ventas AvA 2026.pdf', 2026, 2, 2, 4, 'Natalia Ureta', 'R', 'T', 4, 0, 3, 110000, NULL, 110000, 330000, 330000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R5', 'Ventas AvA 2026.pdf', 2026, 2, 2, 5, 'Felipe Garcia', 'C', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 720000, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility'),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R6', 'Ventas AvA 2026.pdf', 2026, 2, 2, 6, 'Luis Reyes', 'R', 'T', 2, 0, 3, 90000, NULL, 90000, 270000, 270000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R7', 'Ventas AvA 2026.pdf', 2026, 2, 2, 7, 'Eva Piccozzi', 'R', 'P', 3, 0, 5, 120000, 30000, 120000, 630000, 621180, 'X', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R8', 'Ventas AvA 2026.pdf', 2026, 2, 2, 8, 'Juan Videla', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R9', 'Ventas AvA 2026.pdf', 2026, 2, 2, 9, 'Tomas Correa', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R10', 'Ventas AvA 2026.pdf', 2026, 2, 2, 10, 'Camila Muñoz', 'R', 'T', 3, 0, 6, 100000, NULL, 100000, 600000, 600000, 'factura', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R11', 'Ventas AvA 2026.pdf', 2026, 2, 2, 11, 'Rodrigo Espinoza', 'R', 'T', 2, 0, 5, 90000, NULL, 90000, 450000, 450000, 'factura', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R12', 'Ventas AvA 2026.pdf', 2026, 2, 2, 12, 'Paulina Cabezas', 'R', 'T', 2, 0, 2, 72900, NULL, 72900, 145800, 145800, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R13', 'Ventas AvA 2026.pdf', 2026, 2, 2, 13, 'Marcela Rodriguez', 'R', 'T', 2, 0, 2, 90000, NULL, 90000, 180000, 180000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R14', 'Ventas AvA 2026.pdf', 2026, 2, 2, 14, 'Alejandra Maturana', 'R', 'T', 2, 0, 3, 90000, NULL, 90000, 270000, 270000, 'X', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R15', 'Ventas AvA 2026.pdf', 2026, 2, 2, 15, 'Ariana Sepulveda', 'R', 'T', 2, 0, 6, 73500, NULL, 73500, 441000, 441000, 'booking SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R16', 'Ventas AvA 2026.pdf', 2026, 2, 2, 16, 'Lourdes Velez', 'R', 'T', 2, 0, 4, 72000, NULL, 72000, 288000, 288000, 'booking', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R17', 'Ventas AvA 2026.pdf', 2026, 2, 2, 17, 'Gabriela Soto', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R18', 'Ventas AvA 2026.pdf', 2026, 2, 2, 18, 'Valentina Riquelme', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R19', 'Ventas AvA 2026.pdf', 2026, 2, 2, 19, 'Russel King', 'C', 'A', 4, 0, 3, 210000, 40000, 210000, 670000, 649900, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R20', 'Ventas AvA 2026.pdf', 2026, 2, 2, 20, 'Andres Goycolea', 'C', 'A', 5, 0, 5, 210000, 40000, 210000, 1090000, 1057300, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R21', 'Ventas AvA 2026.pdf', 2026, 2, 2, 21, 'Javiera Garrido', 'R', 'A', 2, 0, 3, 90000, NULL, 90000, 270000, 261900, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R22', 'Ventas AvA 2026.pdf', 2026, 2, 2, 22, 'Mathias Olivares', 'R', 'T', 2, 0, 2, 81000, NULL, 81000, 162000, 162000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R23', 'Ventas AvA 2026.pdf', 2026, 2, 2, 23, 'Joselo', 'R', 'T', 2, 0, 6, 50000, NULL, 50000, 300000, 300000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R24', 'Ventas AvA 2026.pdf', 2026, 2, 2, 24, 'Fabiola Campos', 'R', 'T', NULL, NULL, NULL, NULL, NULL, NULL, 0, 180000, 'SII', 'insufficient_numeric_columns;missing_total_stay_uses_utility'),
    ('ASSET_PDF_VENTAS_2026_M4_P4_R1', 'Ventas AvA 2026.pdf', 2026, 4, 4, 1, 'Tomas Burgos', 'R', 'T', 2, 0, 3, 72000, NULL, 72000, 216000, 216000, 'booking', NULL),
    ('ASSET_PDF_VENTAS_2026_M7_P7_R1', 'Ventas AvA 2026.pdf', 2026, 7, 7, 1, 'Rodrigo Diaz', 'R', 'T', 3, 0, 4, 165000, NULL, 165000, 660000, 660000, 'booking', NULL),
    ('ASSET_PDF_VENTAS_2026_M8_P8_R1', 'Ventas AvA 2026.pdf', 2026, 8, 8, 1, 'Joao Viana', 'C', NULL, 8, 0, 3, 320000, NULL, 320000, 960000, NULL, NULL, 'missing_product_code'),
    ('ASSET_PDF_VENTAS_2026_M8_P8_R2', 'Ventas AvA 2026.pdf', 2026, 8, 8, 2, 'Joao Viana', 'R', NULL, 4, 0, 3, 150000, NULL, 150000, 450000, NULL, NULL, 'missing_product_code'),
    ('ASSET_PDF_VENTAS_2026_M8_P8_R3', 'Ventas AvA 2026.pdf', 2026, 8, 8, 3, 'Joao Viana', 'R', NULL, 4, 0, 3, 1500000, NULL, 1500000, 4500000, NULL, NULL, 'missing_product_code;potential_outlier_high_nightly_price')
),
normalized AS (
  SELECT
    s.*,
    CASE
      WHEN s.guest_name = '...' THEN 'PENDIENTE PDF VENTAS 2026 P' || s.page || '-R' || s.row_no
      ELSE s.guest_name
    END AS guest_name_resolved,
    make_date(s.year, s.month, 1) AS check_in_date,
    (
      make_date(s.year, s.month, 1)
      + make_interval(days => GREATEST(COALESCE(NULLIF(s.nights, 0), 2), 1)::INT)
    )::date AS check_out_date,
    GREATEST(COALESCE(NULLIF(s.pax, 0), 2), 1)::INT AS guests_count_resolved,
    COALESCE(NULLIF(s.total_stay, 0), s.utility, 0)::numeric(12,2) AS amount_resolved,
    (
      'ASSET_PDF_VENTAS_2026'
      || ' | key=' || s.seed_key
      || ' | src=' || COALESCE(s.r_or_c, '?')
      || ' | prod=' || COALESCE(s.product_code, '?')
      || CASE WHEN s.notes IS NOT NULL THEN ' | notes=' || s.notes ELSE '' END
      || CASE WHEN s.quality_flags IS NOT NULL THEN ' | qf=' || s.quality_flags ELSE '' END
    ) AS reservation_note,
    (
      'ASSET_PDF_VENTAS_2026'
      || ' | key=' || s.seed_key
      || ' | ' || CASE WHEN s.guest_name = '...' THEN 'PENDIENTE' ELSE s.guest_name END
    ) AS sale_description
  FROM seed s
)
INSERT INTO guests (full_name, notes)
SELECT DISTINCT n.guest_name_resolved, 'ASSET_PDF_VENTAS_2026'
FROM normalized n
WHERE NOT EXISTS (
  SELECT 1 FROM guests g WHERE LOWER(g.full_name) = LOWER(n.guest_name_resolved)
);

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
  quality_flags
) AS (
  VALUES
    ('ASSET_PDF_VENTAS_2026_M1_P1_R1', 'Ventas AvA 2026.pdf', 2026, 1, 1, 1, 'Francisco Espinoza', 'R', 'A', 2, 0, 4, 90000, 30000, 90000, 390000, 378300, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R2', 'Ventas AvA 2026.pdf', 2026, 1, 1, 2, 'Fernanda Escorza', 'R', 'P', 2, 0, 3, 90000, 30000, 90000, 300000, 295800, NULL, NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R3', 'Ventas AvA 2026.pdf', 2026, 1, 1, 3, 'Barbara', 'R', 'T', 2, 0, 1, 120000, NULL, 120000, 120000, 120000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R4', 'Ventas AvA 2026.pdf', 2026, 1, 1, 4, 'Nicolas Muñoz', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R5', 'Ventas AvA 2026.pdf', 2026, 1, 1, 5, 'Alberto Etchegaray', 'C', 'A', 5, 0, 1, 220000, NULL, 220000, 220000, 213400, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R6', 'Ventas AvA 2026.pdf', 2026, 1, 1, 6, '...', 'C', 'A', 5, 0, 2, 240000, 40000, 240000, 520000, 504400, '...', 'name_placeholder'),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R1', 'Ventas AvA 2026.pdf', 2026, 2, 2, 1, 'Nicolas Sanchez', 'R', 'P', 3, 0, 4, 90000, 30000, 90000, 390000, 384540, 'X', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R2', 'Ventas AvA 2026.pdf', 2026, 2, 2, 2, 'Cristobal Muhr', 'R', 'T', 3, 0, 3, 60000, NULL, 60000, 180000, 180000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R4', 'Ventas AvA 2026.pdf', 2026, 2, 2, 4, 'Natalia Ureta', 'R', 'T', 4, 0, 3, 110000, NULL, 110000, 330000, 330000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R5', 'Ventas AvA 2026.pdf', 2026, 2, 2, 5, 'Felipe Garcia', 'C', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 720000, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility'),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R6', 'Ventas AvA 2026.pdf', 2026, 2, 2, 6, 'Luis Reyes', 'R', 'T', 2, 0, 3, 90000, NULL, 90000, 270000, 270000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R7', 'Ventas AvA 2026.pdf', 2026, 2, 2, 7, 'Eva Piccozzi', 'R', 'P', 3, 0, 5, 120000, 30000, 120000, 630000, 621180, 'X', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R8', 'Ventas AvA 2026.pdf', 2026, 2, 2, 8, 'Juan Videla', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R9', 'Ventas AvA 2026.pdf', 2026, 2, 2, 9, 'Tomas Correa', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R10', 'Ventas AvA 2026.pdf', 2026, 2, 2, 10, 'Camila Muñoz', 'R', 'T', 3, 0, 6, 100000, NULL, 100000, 600000, 600000, 'factura', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R11', 'Ventas AvA 2026.pdf', 2026, 2, 2, 11, 'Rodrigo Espinoza', 'R', 'T', 2, 0, 5, 90000, NULL, 90000, 450000, 450000, 'factura', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R12', 'Ventas AvA 2026.pdf', 2026, 2, 2, 12, 'Paulina Cabezas', 'R', 'T', 2, 0, 2, 72900, NULL, 72900, 145800, 145800, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R13', 'Ventas AvA 2026.pdf', 2026, 2, 2, 13, 'Marcela Rodriguez', 'R', 'T', 2, 0, 2, 90000, NULL, 90000, 180000, 180000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R14', 'Ventas AvA 2026.pdf', 2026, 2, 2, 14, 'Alejandra Maturana', 'R', 'T', 2, 0, 3, 90000, NULL, 90000, 270000, 270000, 'X', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R15', 'Ventas AvA 2026.pdf', 2026, 2, 2, 15, 'Ariana Sepulveda', 'R', 'T', 2, 0, 6, 73500, NULL, 73500, 441000, 441000, 'booking SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R16', 'Ventas AvA 2026.pdf', 2026, 2, 2, 16, 'Lourdes Velez', 'R', 'T', 2, 0, 4, 72000, NULL, 72000, 288000, 288000, 'booking', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R17', 'Ventas AvA 2026.pdf', 2026, 2, 2, 17, 'Gabriela Soto', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R18', 'Ventas AvA 2026.pdf', 2026, 2, 2, 18, 'Valentina Riquelme', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R19', 'Ventas AvA 2026.pdf', 2026, 2, 2, 19, 'Russel King', 'C', 'A', 4, 0, 3, 210000, 40000, 210000, 670000, 649900, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R20', 'Ventas AvA 2026.pdf', 2026, 2, 2, 20, 'Andres Goycolea', 'C', 'A', 5, 0, 5, 210000, 40000, 210000, 1090000, 1057300, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R21', 'Ventas AvA 2026.pdf', 2026, 2, 2, 21, 'Javiera Garrido', 'R', 'A', 2, 0, 3, 90000, NULL, 90000, 270000, 261900, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R22', 'Ventas AvA 2026.pdf', 2026, 2, 2, 22, 'Mathias Olivares', 'R', 'T', 2, 0, 2, 81000, NULL, 81000, 162000, 162000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R23', 'Ventas AvA 2026.pdf', 2026, 2, 2, 23, 'Joselo', 'R', 'T', 2, 0, 6, 50000, NULL, 50000, 300000, 300000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R24', 'Ventas AvA 2026.pdf', 2026, 2, 2, 24, 'Fabiola Campos', 'R', 'T', NULL, NULL, NULL, NULL, NULL, NULL, 0, 180000, 'SII', 'insufficient_numeric_columns;missing_total_stay_uses_utility'),
    ('ASSET_PDF_VENTAS_2026_M4_P4_R1', 'Ventas AvA 2026.pdf', 2026, 4, 4, 1, 'Tomas Burgos', 'R', 'T', 2, 0, 3, 72000, NULL, 72000, 216000, 216000, 'booking', NULL),
    ('ASSET_PDF_VENTAS_2026_M7_P7_R1', 'Ventas AvA 2026.pdf', 2026, 7, 7, 1, 'Rodrigo Diaz', 'R', 'T', 3, 0, 4, 165000, NULL, 165000, 660000, 660000, 'booking', NULL),
    ('ASSET_PDF_VENTAS_2026_M8_P8_R1', 'Ventas AvA 2026.pdf', 2026, 8, 8, 1, 'Joao Viana', 'C', NULL, 8, 0, 3, 320000, NULL, 320000, 960000, NULL, NULL, 'missing_product_code'),
    ('ASSET_PDF_VENTAS_2026_M8_P8_R2', 'Ventas AvA 2026.pdf', 2026, 8, 8, 2, 'Joao Viana', 'R', NULL, 4, 0, 3, 150000, NULL, 150000, 450000, NULL, NULL, 'missing_product_code'),
    ('ASSET_PDF_VENTAS_2026_M8_P8_R3', 'Ventas AvA 2026.pdf', 2026, 8, 8, 3, 'Joao Viana', 'R', NULL, 4, 0, 3, 1500000, NULL, 1500000, 4500000, NULL, NULL, 'missing_product_code;potential_outlier_high_nightly_price')
),
normalized AS (
  SELECT
    s.*,
    CASE
      WHEN s.guest_name = '...' THEN 'PENDIENTE PDF VENTAS 2026 P' || s.page || '-R' || s.row_no
      ELSE s.guest_name
    END AS guest_name_resolved,
    make_date(s.year, s.month, 1) AS check_in_date,
    (
      make_date(s.year, s.month, 1)
      + make_interval(days => GREATEST(COALESCE(NULLIF(s.nights, 0), 2), 1)::INT)
    )::date AS check_out_date,
    GREATEST(COALESCE(NULLIF(s.pax, 0), 2), 1)::INT AS guests_count_resolved,
    COALESCE(NULLIF(s.total_stay, 0), s.utility, 0)::numeric(12,2) AS amount_resolved,
    (
      'ASSET_PDF_VENTAS_2026'
      || ' | key=' || s.seed_key
      || ' | src=' || COALESCE(s.r_or_c, '?')
      || ' | prod=' || COALESCE(s.product_code, '?')
      || CASE WHEN s.notes IS NOT NULL THEN ' | notes=' || s.notes ELSE '' END
      || CASE WHEN s.quality_flags IS NOT NULL THEN ' | qf=' || s.quality_flags ELSE '' END
    ) AS reservation_note,
    (
      'ASSET_PDF_VENTAS_2026'
      || ' | key=' || s.seed_key
      || ' | ' || CASE WHEN s.guest_name = '...' THEN 'PENDIENTE' ELSE s.guest_name END
    ) AS sale_description
  FROM seed s
),
resolved AS (
  SELECT
    n.*,
    (
      SELECT g.id
      FROM guests g
      WHERE LOWER(g.full_name) = LOWER(n.guest_name_resolved)
      ORDER BY g.id
      LIMIT 1
    ) AS guest_id
  FROM normalized n
)
INSERT INTO reservations (
  guest_id,
  cabin_id,
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
  r.guest_id,
  NULL,
  'other',
  'transfer',
  'completed',
  r.check_in_date,
  r.check_out_date,
  r.guests_count_resolved,
  r.amount_resolved,
  r.reservation_note
FROM resolved r
WHERE r.guest_id IS NOT NULL
  AND r.amount_resolved > 0
  AND NOT EXISTS (
    SELECT 1
    FROM reservations existing
    WHERE existing.guest_id = r.guest_id
      AND existing.check_in = r.check_in_date
      AND existing.check_out = r.check_out_date
      AND COALESCE(existing.notes, '') = r.reservation_note
  );

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
  quality_flags
) AS (
  VALUES
    ('ASSET_PDF_VENTAS_2026_M1_P1_R1', 'Ventas AvA 2026.pdf', 2026, 1, 1, 1, 'Francisco Espinoza', 'R', 'A', 2, 0, 4, 90000, 30000, 90000, 390000, 378300, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R2', 'Ventas AvA 2026.pdf', 2026, 1, 1, 2, 'Fernanda Escorza', 'R', 'P', 2, 0, 3, 90000, 30000, 90000, 300000, 295800, NULL, NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R3', 'Ventas AvA 2026.pdf', 2026, 1, 1, 3, 'Barbara', 'R', 'T', 2, 0, 1, 120000, NULL, 120000, 120000, 120000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R4', 'Ventas AvA 2026.pdf', 2026, 1, 1, 4, 'Nicolas Muñoz', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R5', 'Ventas AvA 2026.pdf', 2026, 1, 1, 5, 'Alberto Etchegaray', 'C', 'A', 5, 0, 1, 220000, NULL, 220000, 220000, 213400, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M1_P1_R6', 'Ventas AvA 2026.pdf', 2026, 1, 1, 6, '...', 'C', 'A', 5, 0, 2, 240000, 40000, 240000, 520000, 504400, '...', 'name_placeholder'),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R1', 'Ventas AvA 2026.pdf', 2026, 2, 2, 1, 'Nicolas Sanchez', 'R', 'P', 3, 0, 4, 90000, 30000, 90000, 390000, 384540, 'X', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R2', 'Ventas AvA 2026.pdf', 2026, 2, 2, 2, 'Cristobal Muhr', 'R', 'T', 3, 0, 3, 60000, NULL, 60000, 180000, 180000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R4', 'Ventas AvA 2026.pdf', 2026, 2, 2, 4, 'Natalia Ureta', 'R', 'T', 4, 0, 3, 110000, NULL, 110000, 330000, 330000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R5', 'Ventas AvA 2026.pdf', 2026, 2, 2, 5, 'Felipe Garcia', 'C', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 720000, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility'),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R6', 'Ventas AvA 2026.pdf', 2026, 2, 2, 6, 'Luis Reyes', 'R', 'T', 2, 0, 3, 90000, NULL, 90000, 270000, 270000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R7', 'Ventas AvA 2026.pdf', 2026, 2, 2, 7, 'Eva Piccozzi', 'R', 'P', 3, 0, 5, 120000, 30000, 120000, 630000, 621180, 'X', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R8', 'Ventas AvA 2026.pdf', 2026, 2, 2, 8, 'Juan Videla', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R9', 'Ventas AvA 2026.pdf', 2026, 2, 2, 9, 'Tomas Correa', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R10', 'Ventas AvA 2026.pdf', 2026, 2, 2, 10, 'Camila Muñoz', 'R', 'T', 3, 0, 6, 100000, NULL, 100000, 600000, 600000, 'factura', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R11', 'Ventas AvA 2026.pdf', 2026, 2, 2, 11, 'Rodrigo Espinoza', 'R', 'T', 2, 0, 5, 90000, NULL, 90000, 450000, 450000, 'factura', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R12', 'Ventas AvA 2026.pdf', 2026, 2, 2, 12, 'Paulina Cabezas', 'R', 'T', 2, 0, 2, 72900, NULL, 72900, 145800, 145800, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R13', 'Ventas AvA 2026.pdf', 2026, 2, 2, 13, 'Marcela Rodriguez', 'R', 'T', 2, 0, 2, 90000, NULL, 90000, 180000, 180000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R14', 'Ventas AvA 2026.pdf', 2026, 2, 2, 14, 'Alejandra Maturana', 'R', 'T', 2, 0, 3, 90000, NULL, 90000, 270000, 270000, 'X', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R15', 'Ventas AvA 2026.pdf', 2026, 2, 2, 15, 'Ariana Sepulveda', 'R', 'T', 2, 0, 6, 73500, NULL, 73500, 441000, 441000, 'booking SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R16', 'Ventas AvA 2026.pdf', 2026, 2, 2, 16, 'Lourdes Velez', 'R', 'T', 2, 0, 4, 72000, NULL, 72000, 288000, 288000, 'booking', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R17', 'Ventas AvA 2026.pdf', 2026, 2, 2, 17, 'Gabriela Soto', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R18', 'Ventas AvA 2026.pdf', 2026, 2, 2, 18, 'Valentina Riquelme', 'R', 'A', 2, 0, 2, 90000, NULL, 90000, 180000, 174600, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R19', 'Ventas AvA 2026.pdf', 2026, 2, 2, 19, 'Russel King', 'C', 'A', 4, 0, 3, 210000, 40000, 210000, 670000, 649900, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R20', 'Ventas AvA 2026.pdf', 2026, 2, 2, 20, 'Andres Goycolea', 'C', 'A', 5, 0, 5, 210000, 40000, 210000, 1090000, 1057300, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R21', 'Ventas AvA 2026.pdf', 2026, 2, 2, 21, 'Javiera Garrido', 'R', 'A', 2, 0, 3, 90000, NULL, 90000, 270000, 261900, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R22', 'Ventas AvA 2026.pdf', 2026, 2, 2, 22, 'Mathias Olivares', 'R', 'T', 2, 0, 2, 81000, NULL, 81000, 162000, 162000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R23', 'Ventas AvA 2026.pdf', 2026, 2, 2, 23, 'Joselo', 'R', 'T', 2, 0, 6, 50000, NULL, 50000, 300000, 300000, 'SII', NULL),
    ('ASSET_PDF_VENTAS_2026_M2_P2_R24', 'Ventas AvA 2026.pdf', 2026, 2, 2, 24, 'Fabiola Campos', 'R', 'T', NULL, NULL, NULL, NULL, NULL, NULL, 0, 180000, 'SII', 'insufficient_numeric_columns;missing_total_stay_uses_utility'),
    ('ASSET_PDF_VENTAS_2026_M4_P4_R1', 'Ventas AvA 2026.pdf', 2026, 4, 4, 1, 'Tomas Burgos', 'R', 'T', 2, 0, 3, 72000, NULL, 72000, 216000, 216000, 'booking', NULL),
    ('ASSET_PDF_VENTAS_2026_M7_P7_R1', 'Ventas AvA 2026.pdf', 2026, 7, 7, 1, 'Rodrigo Diaz', 'R', 'T', 3, 0, 4, 165000, NULL, 165000, 660000, 660000, 'booking', NULL),
    ('ASSET_PDF_VENTAS_2026_M8_P8_R1', 'Ventas AvA 2026.pdf', 2026, 8, 8, 1, 'Joao Viana', 'C', NULL, 8, 0, 3, 320000, NULL, 320000, 960000, NULL, NULL, 'missing_product_code'),
    ('ASSET_PDF_VENTAS_2026_M8_P8_R2', 'Ventas AvA 2026.pdf', 2026, 8, 8, 2, 'Joao Viana', 'R', NULL, 4, 0, 3, 150000, NULL, 150000, 450000, NULL, NULL, 'missing_product_code'),
    ('ASSET_PDF_VENTAS_2026_M8_P8_R3', 'Ventas AvA 2026.pdf', 2026, 8, 8, 3, 'Joao Viana', 'R', NULL, 4, 0, 3, 1500000, NULL, 1500000, 4500000, NULL, NULL, 'missing_product_code;potential_outlier_high_nightly_price')
),
normalized AS (
  SELECT
    s.*,
    CASE
      WHEN s.guest_name = '...' THEN 'PENDIENTE PDF VENTAS 2026 P' || s.page || '-R' || s.row_no
      ELSE s.guest_name
    END AS guest_name_resolved,
    make_date(s.year, s.month, 1) AS check_in_date,
    (
      make_date(s.year, s.month, 1)
      + make_interval(days => GREATEST(COALESCE(NULLIF(s.nights, 0), 2), 1)::INT)
    )::date AS check_out_date,
    GREATEST(COALESCE(NULLIF(s.pax, 0), 2), 1)::INT AS guests_count_resolved,
    COALESCE(NULLIF(s.total_stay, 0), s.utility, 0)::numeric(12,2) AS amount_resolved,
    (
      'ASSET_PDF_VENTAS_2026'
      || ' | key=' || s.seed_key
      || ' | src=' || COALESCE(s.r_or_c, '?')
      || ' | prod=' || COALESCE(s.product_code, '?')
      || CASE WHEN s.notes IS NOT NULL THEN ' | notes=' || s.notes ELSE '' END
      || CASE WHEN s.quality_flags IS NOT NULL THEN ' | qf=' || s.quality_flags ELSE '' END
    ) AS reservation_note,
    (
      'ASSET_PDF_VENTAS_2026'
      || ' | key=' || s.seed_key
      || ' | ' || CASE WHEN s.guest_name = '...' THEN 'PENDIENTE' ELSE s.guest_name END
    ) AS sale_description
  FROM seed s
),
resolved AS (
  SELECT
    n.*,
    (
      SELECT g.id
      FROM guests g
      WHERE LOWER(g.full_name) = LOWER(n.guest_name_resolved)
      ORDER BY g.id
      LIMIT 1
    ) AS guest_id
  FROM normalized n
),
resolved_reservations AS (
  SELECT
    r.seed_key,
    rr.id AS reservation_id,
    r.amount_resolved,
    r.sale_description,
    r.check_in_date
  FROM resolved r
  JOIN reservations rr
    ON rr.guest_id = r.guest_id
   AND rr.check_in = r.check_in_date
   AND rr.check_out = r.check_out_date
   AND COALESCE(rr.notes, '') = r.reservation_note
  WHERE r.amount_resolved > 0
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
  rr.reservation_id,
  'lodging',
  rr.amount_resolved,
  'transfer',
  rr.check_in_date,
  rr.sale_description
FROM resolved_reservations rr
WHERE NOT EXISTS (
  SELECT 1 FROM sales s WHERE COALESCE(s.description, '') = rr.sale_description
);
