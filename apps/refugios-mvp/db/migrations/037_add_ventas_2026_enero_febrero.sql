-- Migración 037: Insertar ventas 2026 (Enero y Febrero) desde Excel columna UTILIDAD
-- SIN borrar ventas manuales existentes. Solo agrega lo del Excel.

BEGIN;

-- ENERO 2026
-- Francisco Espinoza ($378,300)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 378300, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M01 | Francisco Espinoza'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Francisco Espinoza')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 378300, 'other', '2026-01-15'::date, 'EXCEL_VENTAS_2026 | M01 | Francisco Espinoza | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M01 | Francisco Espinoza');

-- Fermamda Escorza ($295,800)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 295800, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M01 | Fermamda Escorza'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Fermamda Escorza')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 295800, 'other', '2026-01-15'::date, 'EXCEL_VENTAS_2026 | M01 | Fermamda Escorza | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M01 | Fermamda Escorza');

-- Barbara ($120,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 120000, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M01 | Barbara'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Barbara')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 120000, 'other', '2026-01-15'::date, 'EXCEL_VENTAS_2026 | M01 | Barbara | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M01 | Barbara');

-- Nicolas Muñoz ($174,600)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 174600, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M01 | Nicolas Muñoz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Nicolas Muñoz')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 174600, 'other', '2026-01-15'::date, 'EXCEL_VENTAS_2026 | M01 | Nicolas Muñoz | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M01 | Nicolas Muñoz');

-- Albelto Etchegaray ($213,400)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 213400, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M01 | Albelto Etchegaray'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Albelto Etchegaray')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 213400, 'other', '2026-01-15'::date, 'EXCEL_VENTAS_2026 | M01 | Albelto Etchegaray | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M01 | Albelto Etchegaray');

-- ,,,, ($504,400)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 504400, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M01 | ,,,,'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER(',,,,')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 504400, 'other', '2026-01-15'::date, 'EXCEL_VENTAS_2026 | M01 | ,,,, | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M01 | ,,,,');


-- FEBRERO 2026
-- nICOLAS Sanchez ($384,540)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 384540, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | nICOLAS Sanchez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('nICOLAS Sanchez')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 384540, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | nICOLAS Sanchez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | nICOLAS Sanchez');

-- Cristobal Muhr ($180,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 180000, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Cristobal Muhr'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Cristobal Muhr')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 180000, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Cristobal Muhr | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Cristobal Muhr');

-- Natalia Ureta ($330,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 330000, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Natalia Ureta'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Natalia Ureta')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 330000, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Natalia Ureta | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Natalia Ureta');

-- Felipe Garcia ($720,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 720000, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Felipe Garcia'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Felipe Garcia')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 720000, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Felipe Garcia | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Felipe Garcia');

-- Luis Reyes ($270,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 270000, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Luis Reyes'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Luis Reyes')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 270000, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Luis Reyes | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Luis Reyes');

-- Eva Piccozzi ($621,180)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 621180, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Eva Piccozzi'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Eva Piccozzi')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 621180, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Eva Piccozzi | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Eva Piccozzi');

-- Juan Videla ($174,600)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 174600, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Juan Videla'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Juan Videla')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 174600, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Juan Videla | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Juan Videla');

-- Tomas Correa ($174,600)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 174600, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Tomas Correa'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Tomas Correa')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 174600, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Tomas Correa | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Tomas Correa');

-- Camila Muñoz ($600,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 600000, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Camila Muñoz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Camila Muñoz')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 600000, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Camila Muñoz | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Camila Muñoz');

-- Rodrigo Espinoza ($450,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 450000, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Rodrigo Espinoza'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Rodrigo Espinoza')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 450000, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Rodrigo Espinoza | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Rodrigo Espinoza');

-- Paulina Cabezas ($145,800)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 145800, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Paulina Cabezas'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Paulina Cabezas')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 145800, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Paulina Cabezas | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Paulina Cabezas');

-- Marcela Rodriguez ($180,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 180000, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Marcela Rodriguez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Marcela Rodriguez')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 180000, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Marcela Rodriguez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Marcela Rodriguez');

-- alejandra maturana ($270,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 270000, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | alejandra maturana'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('alejandra maturana')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 270000, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | alejandra maturana | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | alejandra maturana');

-- Ariana Sepulveda ($441,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 441000, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Ariana Sepulveda'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Ariana Sepulveda')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 441000, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Ariana Sepulveda | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Ariana Sepulveda');

-- Lourdes Velez ($288,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 288000, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Lourdes Velez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Lourdes Velez')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 288000, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Lourdes Velez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Lourdes Velez');

-- Gabriela Soto ($174,600)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 174600, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Gabriela Soto'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Gabriela Soto')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 174600, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Gabriela Soto | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Gabriela Soto');

-- Valentina Riquelme ($174,600)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 174600, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Valentina Riquelme'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Valentina Riquelme')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 174600, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Valentina Riquelme | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Valentina Riquelme');

-- Russel King ($649,900)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 649900, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Russel King'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Russel King')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 649900, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Russel King | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Russel King');

-- Andres Goyonechea ($1,057,300)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1057300, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Andres Goyonechea'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Andres Goyonechea')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1057300, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Andres Goyonechea | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Andres Goyonechea');

-- Javiera Garrido ($261,900)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 261900, 'other', r.check_in, 'EXCEL_VENTAS_2026 | M02 | Javiera Garrido'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Javiera Garrido')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2026
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 261900, 'other', '2026-02-15'::date, 'EXCEL_VENTAS_2026 | M02 | Javiera Garrido | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2026 | M02 | Javiera Garrido');

COMMIT;