-- Migración 034: Limpiar ventas 2025 duplicadas/huérfanas e insertar montos correctos del Excel
-- Generada automáticamente desde 'Ventas AvA Refugios 2025.xlsx'

BEGIN;

-- 1. Eliminar ventas 2025 anteriores (migración 023, huérfanas y vinculadas)
DELETE FROM sales WHERE description LIKE 'ASSET_PDF_VENTAS_2025%';

-- 2. Actualizar total_amount e insertar ventas correctas

-- ENERO
-- Daniel Mclaughlin ($1,390,806)
UPDATE reservations r SET total_amount = 1390806
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('daniel mclaughlin')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1390806, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M01 | Daniel Mclaughlin'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('daniel mclaughlin')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Rainer Muehlberger ($390,685)
UPDATE reservations r SET total_amount = 390685
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rainer muehlberger')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 390685, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M01 | Rainer Muehlberger'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rainer muehlberger')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Jorge Perez ($570,000)
UPDATE reservations r SET total_amount = 570000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('jorge perez')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 570000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M01 | Jorge Perez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('jorge perez')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Fernando Larumbe ($143,393)
UPDATE reservations r SET total_amount = 143393
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('fernando larumbe')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 143393, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M01 | Fernando Larumbe'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('fernando larumbe')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Javiera Pefaur ($360,000)
UPDATE reservations r SET total_amount = 360000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javiera pefaur')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 360000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M01 | Javiera Pefaur'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javiera pefaur')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Martin Echeverria ($390,000)
UPDATE reservations r SET total_amount = 390000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('martin echeverria')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 390000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M01 | Martin Echeverria'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('martin echeverria')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Loreto Hofer ($180,000)
UPDATE reservations r SET total_amount = 180000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('loreto hofer')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 180000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M01 | Loreto Hofer'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('loreto hofer')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Margarita Steff ($570,000)
UPDATE reservations r SET total_amount = 570000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('margarita steff')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 570000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M01 | Margarita Steff'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('margarita steff')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- FEBRERO
-- Paola Romero ($440,000)
UPDATE reservations r SET total_amount = 440000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('paola romero')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 440000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Paola Romero'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('paola romero')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Julio Quinteros ($540,000)
UPDATE reservations r SET total_amount = 540000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('julia quinteros (julio en reservas)')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 540000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Julio Quinteros'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('julia quinteros (julio en reservas)')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Roberto Necochea ($270,000)
UPDATE reservations r SET total_amount = 270000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('roberto necochea')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 270000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Roberto Necochea'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('roberto necochea')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Daniel Mora ($406,980)
UPDATE reservations r SET total_amount = 406980
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('daniel mora')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 406980, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Daniel Mora'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('daniel mora')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Natalia Gonzalez ($347,424)
UPDATE reservations r SET total_amount = 347424
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('natalia gonzáles')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 347424, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Natalia Gonzalez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('natalia gonzáles')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Marita ($440,000)
UPDATE reservations r SET total_amount = 440000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('marita')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 440000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Marita'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('marita')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Daniela Gonzales ($700,000)
UPDATE reservations r SET total_amount = 700000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('daniela gonzales')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 700000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Daniela Gonzales'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('daniela gonzales')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Nicole Abarca ($450,000)
UPDATE reservations r SET total_amount = 450000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('nicole abarca')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 450000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Nicole Abarca'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('nicole abarca')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Felipe Hernandez ($600,000)
UPDATE reservations r SET total_amount = 600000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('filipe hernandez')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 600000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Felipe Hernandez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('filipe hernandez')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Javier Maldonado ($300,000)
UPDATE reservations r SET total_amount = 300000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javier maldonado')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 300000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Javier Maldonado'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javier maldonado')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Susana Montesino ($241,900)
UPDATE reservations r SET total_amount = 241900
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('susana montesino')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 241900, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Susana Montesino'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('susana montesino')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Patricia bustamante ($210,000)
UPDATE reservations r SET total_amount = 210000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('patricia bustamante')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 210000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Patricia bustamante'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('patricia bustamante')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Alejandra Stay ($1,300,000)
UPDATE reservations r SET total_amount = 1300000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('alejandra stay')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1300000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Alejandra Stay'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('alejandra stay')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Mariella Offmann ($600,000)
UPDATE reservations r SET total_amount = 600000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('mariela offmann')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 600000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Mariella Offmann'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('mariela offmann')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Bastian Perez ($210,000)
UPDATE reservations r SET total_amount = 210000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('bastian perez')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 210000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Bastian Perez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('bastian perez')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Esteban Contreras ($300,000)
UPDATE reservations r SET total_amount = 300000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('esteban contreras')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 300000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Esteban Contreras'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('esteban contreras')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Enrique Araos ($165,000)
UPDATE reservations r SET total_amount = 165000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('enrique araos')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 165000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Enrique Araos'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('enrique araos')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Javiera hernandez ($345,374)
UPDATE reservations r SET total_amount = 345374
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javiera garrido')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 345374, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Javiera hernandez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javiera garrido')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Bruno Cres ($300,000)
UPDATE reservations r SET total_amount = 300000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('bruno cres')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 300000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Bruno Cres'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('bruno cres')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Pablo Morande ($120,000)
UPDATE reservations r SET total_amount = 120000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('pablo morande')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 120000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M02 | Pablo Morande'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('pablo morande')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- MARZO
-- Andres Larrain ($270,000)
UPDATE reservations r SET total_amount = 270000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andres larrain')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 270000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M03 | Andres Larrain'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andres larrain')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Christian gardiol ($420,000)
UPDATE reservations r SET total_amount = 420000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('christian gardiol')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 420000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M03 | Christian gardiol'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('christian gardiol')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Jorge Lichtscheidl ($660,000)
UPDATE reservations r SET total_amount = 660000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('jorge lichtscheidl')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 660000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M03 | Jorge Lichtscheidl'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('jorge lichtscheidl')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Felipe Prado ($210,000)
UPDATE reservations r SET total_amount = 210000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('felipe prado')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 210000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M03 | Felipe Prado'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('felipe prado')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Carolina bustos ($210,000)
UPDATE reservations r SET total_amount = 210000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carolina bustos')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 210000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M03 | Carolina bustos'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carolina bustos')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- ABRIL
-- Javier y Camila ($390,000)
UPDATE reservations r SET total_amount = 390000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javier y camila')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 390000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M04 | Javier y Camila'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javier y camila')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Claire Wood ($460,000)
UPDATE reservations r SET total_amount = 460000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('claire wood')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 460000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M04 | Claire Wood'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('claire wood')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Sebastian Perez ($880,000)
UPDATE reservations r SET total_amount = 880000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('sebastian perez')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 880000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M04 | Sebastian Perez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('sebastian perez')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Cesar Soto ($300,000)
UPDATE reservations r SET total_amount = 300000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('cesar soto')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 300000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M04 | Cesar Soto'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('cesar soto')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Rodrigo Fernandez ($223,149)
UPDATE reservations r SET total_amount = 223149
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rodrigo fernandez')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 223149, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M04 | Rodrigo Fernandez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rodrigo fernandez')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Lucas Gomez ($270,000)
UPDATE reservations r SET total_amount = 270000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('lucas gomez')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 270000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M04 | Lucas Gomez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('lucas gomez')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- MAYO
-- pAMELA eSPINOZA ($279,410)
UPDATE reservations r SET total_amount = 279410
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('pamela espinoza')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 279410, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M05 | pAMELA eSPINOZA'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('pamela espinoza')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- MARCELA pEREZ ($249,999)
UPDATE reservations r SET total_amount = 249999
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('marcela perez')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 249999, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M05 | MARCELA pEREZ'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('marcela perez')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- cAROLINA aLVAREZ ($183,701)
UPDATE reservations r SET total_amount = 183701
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carolina alvarez')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 183701, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M05 | cAROLINA aLVAREZ'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carolina alvarez')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Rodrigo ibañez ($90,000)
UPDATE reservations r SET total_amount = 90000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rodrigo ibañez')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 90000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M05 | Rodrigo ibañez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rodrigo ibañez')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Paulina Vergara ($460,000)
UPDATE reservations r SET total_amount = 460000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('paulina vergara')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 460000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M05 | Paulina Vergara'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('paulina vergara')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Vanina Martinez ($460,000)
UPDATE reservations r SET total_amount = 460000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('vanina martinez')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 460000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M05 | Vanina Martinez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('vanina martinez')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- JUNIO
-- Hernan Wunderlich ($1,220,000)
UPDATE reservations r SET total_amount = 1220000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('hernan wunderlich')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1220000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Hernan Wunderlich'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('hernan wunderlich')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Horacio Rojas ($1,837,600)
UPDATE reservations r SET total_amount = 1837600
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('horacio rojas')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1837600, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Horacio Rojas'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('horacio rojas')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Paulina Muñoz ($330,000)
UPDATE reservations r SET total_amount = 330000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('paulina muñoz')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 330000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Paulina Muñoz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('paulina muñoz')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Paulina Muñoz ($330,000)
UPDATE reservations r SET total_amount = 330000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('paulina muñoz')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 330000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Paulina Muñoz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('paulina muñoz')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Oscar Contreras ($538,919)
UPDATE reservations r SET total_amount = 538919
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('oscar contreras')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 538919, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Oscar Contreras'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('oscar contreras')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Debora Castillo ($715,886)
UPDATE reservations r SET total_amount = 715886
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('debora castillo')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 715886, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Debora Castillo'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('debora castillo')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Maria Francisca Valenzuela ($210,000)
UPDATE reservations r SET total_amount = 210000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('maria francisca valenzuela')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 210000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Maria Francisca Valenzuela'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('maria francisca valenzuela')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Gabriela Verdugo ($1,050,000)
UPDATE reservations r SET total_amount = 1050000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gabriela verdugo')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1050000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Gabriela Verdugo'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gabriela verdugo')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Carolina Andrea Peña ($290,000)
UPDATE reservations r SET total_amount = 290000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carolina andrea peña')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 290000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Carolina Andrea Peña'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carolina andrea peña')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Lourdes Velasquez ($1,160,000)
UPDATE reservations r SET total_amount = 1160000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('lourdes velasquez')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1160000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Lourdes Velasquez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('lourdes velasquez')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Gisela Ceballos ($495,419)
UPDATE reservations r SET total_amount = 495419
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gisela ceballos')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 495419, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Gisela Ceballos'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gisela ceballos')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Carlos Delgado ($355,894)
UPDATE reservations r SET total_amount = 355894
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carlos delgado')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 355894, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Carlos Delgado'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carlos delgado')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Ingrid Mellado ($450,000)
UPDATE reservations r SET total_amount = 450000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('ingrid mellado')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 450000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Ingrid Mellado'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('ingrid mellado')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Romina Sanhueza ($485,569)
UPDATE reservations r SET total_amount = 485569
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('romina sanhueza')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 485569, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Romina Sanhueza'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('romina sanhueza')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Gustavo Canales ($110,000)
UPDATE reservations r SET total_amount = 110000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gustavo canales')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 110000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Gustavo Canales'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gustavo canales')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Jose Vargas ($390,000)
UPDATE reservations r SET total_amount = 390000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('jose vargas')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 390000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Jose Vargas'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('jose vargas')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Atiglio ($556,000)
UPDATE reservations r SET total_amount = 556000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('atigilio')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 556000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Atiglio'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('atigilio')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Margorie Henrriquez ($390,000)
UPDATE reservations r SET total_amount = 390000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('margorie henriquez')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 390000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Margorie Henrriquez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('margorie henriquez')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Carolina Serin ($260,000)
UPDATE reservations r SET total_amount = 260000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carolina senn')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 260000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M06 | Carolina Serin'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carolina senn')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- JULIO
-- aLEXANDRA gARCIA ($944,900)
UPDATE reservations r SET total_amount = 944900
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('alexandra garcia')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 944900, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | aLEXANDRA gARCIA'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('alexandra garcia')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- gREG bULL ($482,100)
UPDATE reservations r SET total_amount = 482100
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('greg bull')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 482100, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | gREG bULL'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('greg bull')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- mARCIO zANETTI ($2,140,000)
UPDATE reservations r SET total_amount = 2140000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('marcio zanetti')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 2140000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | mARCIO zANETTI'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('marcio zanetti')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- vINICIUS Cruz ($2,137,200)
UPDATE reservations r SET total_amount = 2137200
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('vinicius cruz')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 2137200, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | vINICIUS Cruz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('vinicius cruz')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Felipe Castañia ($935,906)
UPDATE reservations r SET total_amount = 935906
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('felipe castaña')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 935906, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Felipe Castañia'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('felipe castaña')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Cesar Gomez ($940,000)
UPDATE reservations r SET total_amount = 940000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('cesar gomez')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 940000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Cesar Gomez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('cesar gomez')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Gloria Noguera ($900,000)
UPDATE reservations r SET total_amount = 900000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gloria noguera')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 900000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Gloria Noguera'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gloria noguera')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Michel Angelo Lapadula ($690,000)
UPDATE reservations r SET total_amount = 690000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('michel angelo lapadula')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 690000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Michel Angelo Lapadula'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('michel angelo lapadula')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- brandyn Phillips ($694,200)
UPDATE reservations r SET total_amount = 694200
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('brandyn phillips')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 694200, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | brandyn Phillips'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('brandyn phillips')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Catalina Riveros ($885,920)
UPDATE reservations r SET total_amount = 885920
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('catalina riveros')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 885920, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Catalina Riveros'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('catalina riveros')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Valeska Arias ($422,100)
UPDATE reservations r SET total_amount = 422100
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('valeska arias')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 422100, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Valeska Arias'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('valeska arias')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Carlos valenzuela Paola V ($940,000)
UPDATE reservations r SET total_amount = 940000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carlos valenzuela')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 940000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Carlos valenzuela Paola V'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carlos valenzuela')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Carolina Diaz Yaeger ($523,902)
UPDATE reservations r SET total_amount = 523902
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carolina diaz yaeger')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 523902, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Carolina Diaz Yaeger'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('carolina diaz yaeger')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Diego Coelho ($2,000,000)
UPDATE reservations r SET total_amount = 2000000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('diego coelho')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 2000000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Diego Coelho'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('diego coelho')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Hernan Ferrera ($550,000)
UPDATE reservations r SET total_amount = 550000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('hernan ferrera')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 550000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Hernan Ferrera'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('hernan ferrera')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Cristian garces ($145,000)
UPDATE reservations r SET total_amount = 145000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('cristian garces')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 145000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Cristian garces'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('cristian garces')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Poala Gorriateguy ($955,245)
UPDATE reservations r SET total_amount = 955245
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('paola romero')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 955245, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Poala Gorriateguy'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('paola romero')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Pamela Medina ($362,070)
UPDATE reservations r SET total_amount = 362070
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('pamela medina')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 362070, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Pamela Medina'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('pamela medina')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Geraldine Saez ($315,468)
UPDATE reservations r SET total_amount = 315468
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('geraldine saez')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 315468, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Geraldine Saez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('geraldine saez')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Falipe Villa Vicencio ($110,000)
UPDATE reservations r SET total_amount = 110000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('felipe villa vicencio')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 110000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Falipe Villa Vicencio'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('felipe villa vicencio')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Paulo Unzueta ($480,000)
UPDATE reservations r SET total_amount = 480000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('paulo unzueta')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 480000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Paulo Unzueta'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('paulo unzueta')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Andres Eltit Silva ($326,132)
UPDATE reservations r SET total_amount = 326132
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andres eltit silva')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 326132, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Andres Eltit Silva'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andres eltit silva')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Matias Lomboy ($270,000)
UPDATE reservations r SET total_amount = 270000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('matias lomboy')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 270000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Matias Lomboy'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('matias lomboy')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Evelyn Malgarejo ($493,772)
UPDATE reservations r SET total_amount = 493772
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('evelyn malgarejo')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 493772, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Evelyn Malgarejo'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('evelyn malgarejo')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Jorge Erlwein ($320,000)
UPDATE reservations r SET total_amount = 320000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('jorge erlwein')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 320000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M07 | Jorge Erlwein'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('jorge erlwein')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- AGOSTO
-- rENE tAPIA ($2,000,000)
UPDATE reservations r SET total_amount = 2000000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rene tapia')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 2000000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | rENE tAPIA'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rene tapia')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Claudia cortes ($1,214,414)
UPDATE reservations r SET total_amount = 1214414
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('claudia cortes')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1214414, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Claudia cortes'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('claudia cortes')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- yamyl Jarufe ($880,000)
UPDATE reservations r SET total_amount = 880000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('yamyl jarufe')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 880000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | yamyl Jarufe'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('yamyl jarufe')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- maria Constanza Moraga ($840,000)
UPDATE reservations r SET total_amount = 840000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('maria constanza moraga')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 840000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | maria Constanza Moraga'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('maria constanza moraga')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Andres Vasquez ($332,400)
UPDATE reservations r SET total_amount = 332400
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andres vasquez')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 332400, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Andres Vasquez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andres vasquez')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Javier Poroz ($560,000)
UPDATE reservations r SET total_amount = 560000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javier lescano')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 560000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Javier Poroz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javier lescano')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Pablo Rodriguez Carrasco ($370,264)
UPDATE reservations r SET total_amount = 370264
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('pablo rodriguez carrasco')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 370264, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Pablo Rodriguez Carrasco'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('pablo rodriguez carrasco')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Gerardo Ramos ($332,400)
UPDATE reservations r SET total_amount = 332400
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gerardo ramos')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 332400, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Gerardo Ramos'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gerardo ramos')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Bogoña Astura ($493,772)
UPDATE reservations r SET total_amount = 493772
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('begoña asfura')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 493772, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Bogoña Astura'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('begoña asfura')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Daniela herrera ($560,400)
UPDATE reservations r SET total_amount = 560400
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('daniela herrera')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 560400, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Daniela herrera'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('daniela herrera')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Andrea Romeny ($600,000)
UPDATE reservations r SET total_amount = 600000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andrea romeny')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 600000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Andrea Romeny'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andrea romeny')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Andrea Romeny ($600,000)
UPDATE reservations r SET total_amount = 600000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andrea romeny')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 600000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Andrea Romeny'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andrea romeny')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Borja ($735,600)
UPDATE reservations r SET total_amount = 735600
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('borja')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 735600, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Borja'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('borja')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Ramiro Quiroga ($452,400)
UPDATE reservations r SET total_amount = 452400
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('ramiro quiroga')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 452400, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Ramiro Quiroga'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('ramiro quiroga')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Javier Diaz ($700,000)
UPDATE reservations r SET total_amount = 700000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javier diaz')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 700000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Javier Diaz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javier diaz')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Javier Lescano ($150,000)
UPDATE reservations r SET total_amount = 150000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javier lescano')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 150000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Javier Lescano'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('javier lescano')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Sebastian Gianfagma ($735,600)
UPDATE reservations r SET total_amount = 735600
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('sebastian gianfagma')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 735600, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Sebastian Gianfagma'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('sebastian gianfagma')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Diego Cid ($231,600)
UPDATE reservations r SET total_amount = 231600
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('diego cid')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 231600, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Diego Cid'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('diego cid')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Pamela Vera ($220,000)
UPDATE reservations r SET total_amount = 220000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('pamela vera')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 220000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Pamela Vera'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('pamela vera')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Victor Santos ($231,600)
UPDATE reservations r SET total_amount = 231600
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('victor santos')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 231600, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Victor Santos'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('victor santos')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Agus ($220,000)
UPDATE reservations r SET total_amount = 220000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('agus')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 220000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Agus'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('agus')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Tamara Zarza ($250,000)
UPDATE reservations r SET total_amount = 250000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('tamara zarza')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 250000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Tamara Zarza'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('tamara zarza')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- martin Basilio ($658,581)
UPDATE reservations r SET total_amount = 658581
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('martin basilio')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 658581, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | martin Basilio'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('martin basilio')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Gaspar Aunfranc ($634,800)
UPDATE reservations r SET total_amount = 634800
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gaspar aunfranc')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 634800, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M08 | Gaspar Aunfranc'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gaspar aunfranc')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- SEPTIEMBRE
-- bibiana Rubini ($690,000)
UPDATE reservations r SET total_amount = 690000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('bibiana rubini')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 690000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | bibiana Rubini'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('bibiana rubini')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Leonel Muñoz ($1,160,000)
UPDATE reservations r SET total_amount = 1160000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('leonel muñoz')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1160000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Leonel Muñoz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('leonel muñoz')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Rene Valdenegro ($331,400)
UPDATE reservations r SET total_amount = 331400
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rene valdenegro')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 331400, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Rene Valdenegro'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rene valdenegro')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Ximena Moraga ($534,000)
UPDATE reservations r SET total_amount = 534000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('ximena moraga')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 534000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Ximena Moraga'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('ximena moraga')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Andraz ($4,413,200)
UPDATE reservations r SET total_amount = 4413200
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andraz')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 4413200, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Andraz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andraz')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Andorra Casa ($5,510,000)
UPDATE reservations r SET total_amount = 5510000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andorra casa')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 5510000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Andorra Casa'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('andorra casa')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Bosnia Refugio 1 ($2,725,800)
UPDATE reservations r SET total_amount = 2725800
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('bosnia refugio 1')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 2725800, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Bosnia Refugio 1'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('bosnia refugio 1')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Bosnia Refugio 2 ($1,440,000)
UPDATE reservations r SET total_amount = 1440000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('bosnia refugio 2')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1440000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Bosnia Refugio 2'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('bosnia refugio 2')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Ignacio mellado ($1,427,800)
UPDATE reservations r SET total_amount = 1427800
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('ignacio mellado')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1427800, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Ignacio mellado'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('ignacio mellado')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Lourdes velasquez ($1,580,000)
UPDATE reservations r SET total_amount = 1580000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('lourdes velasquez')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1580000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Lourdes velasquez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('lourdes velasquez')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Rodrigo Salinas ($360,000)
UPDATE reservations r SET total_amount = 360000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rodrigo salinas')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 360000, 'card', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Rodrigo Salinas'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rodrigo salinas')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Thomas Joel ($371,067)
UPDATE reservations r SET total_amount = 371067
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('thomas hoel')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 371067, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Thomas Joel'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('thomas hoel')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Maria Victoria Gonzalez ($1,160,000)
UPDATE reservations r SET total_amount = 1160000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('maria victoria gozalvez')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1160000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Maria Victoria Gonzalez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('maria victoria gozalvez')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Martu Martu ($533,200)
UPDATE reservations r SET total_amount = 533200
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('martu martu')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 533200, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Martu Martu'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('martu martu')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Exequeil ($150,000)
UPDATE reservations r SET total_amount = 150000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('exequeil')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 150000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Exequeil'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('exequeil')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Oscar ($130,000)
UPDATE reservations r SET total_amount = 130000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('oscar')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 130000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Oscar'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('oscar')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Juan ($280,000)
UPDATE reservations r SET total_amount = 280000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('juan')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 280000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Juan'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('juan')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Jaime R ($271,600)
UPDATE reservations r SET total_amount = 271600
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('jaime')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 271600, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M09 | Jaime R'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('jaime')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- OCTUBRE
-- Endemiko ($880,000)
UPDATE reservations r SET total_amount = 880000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('endemiko')
  AND EXTRACT(MONTH FROM r.check_in) = 10
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 880000, 'transfer', r.check_in,
  'EXCEL_VENTAS_2025 | M10 | Endemiko'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('endemiko')
  AND EXTRACT(MONTH FROM r.check_in) = 10
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Marisol Navarro ($333,764)
UPDATE reservations r SET total_amount = 333764
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('marisol navarro')
  AND EXTRACT(MONTH FROM r.check_in) = 10
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 333764, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M10 | Marisol Navarro'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('marisol navarro')
  AND EXTRACT(MONTH FROM r.check_in) = 10
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- DICIEMBRE
-- Camila Larrain ($1,867,000)
UPDATE reservations r SET total_amount = 1867000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('camila larrain')
  AND EXTRACT(MONTH FROM r.check_in) = 12
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1867000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M12 | Camila Larrain'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('camila larrain')
  AND EXTRACT(MONTH FROM r.check_in) = 12
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

-- Victor Collinao ($300,000)
UPDATE reservations r SET total_amount = 300000
FROM guests g
WHERE r.guest_id = g.id
  AND r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('victor collinao')
  AND EXTRACT(MONTH FROM r.check_in) = 12
  AND EXTRACT(YEAR FROM r.check_in) = 2025;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 300000, 'other', r.check_in,
  'EXCEL_VENTAS_2025 | M12 | Victor Collinao'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('victor collinao')
  AND EXTRACT(MONTH FROM r.check_in) = 12
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;

COMMIT;