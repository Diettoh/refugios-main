-- Migración 036: Corrección definitiva ventas 2025 (columna UTILIDAD del Excel corregido)
-- Reemplaza todas las ventas EXCEL_VENTAS_2025 con los montos correctos.

BEGIN;

-- 1. Eliminar ventas de migraciones 034 y 035
DELETE FROM sales WHERE description LIKE 'EXCEL_VENTAS_2025%';

-- 2. Reinsertar con montos correctos (linked si existe reserva, orphan si no)

-- ENERO
-- Daniel Mclaughlin ($1,390,806)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1390806, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M01 | Daniel Mclaughlin'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Daniel Mclaughlin')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1390806, 'other', '2025-01-15'::date, 'EXCEL_VENTAS_2025 | M01 | Daniel Mclaughlin | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M01 | Daniel Mclaughlin');

-- Rainer Muehlberger ($390,685)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 390685, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M01 | Rainer Muehlberger'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Rainer Muehlberger')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 390685, 'other', '2025-01-15'::date, 'EXCEL_VENTAS_2025 | M01 | Rainer Muehlberger | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M01 | Rainer Muehlberger');

-- Jorge Perez ($552,900)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 552900, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M01 | Jorge Perez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Jorge Perez')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 552900, 'other', '2025-01-15'::date, 'EXCEL_VENTAS_2025 | M01 | Jorge Perez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M01 | Jorge Perez');

-- Fernando Larumbe ($143,393)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 143393, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M01 | Fernando Larumbe'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Fernando Larumbe')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 143393, 'other', '2025-01-15'::date, 'EXCEL_VENTAS_2025 | M01 | Fernando Larumbe | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M01 | Fernando Larumbe');

-- Javiera Pefaur ($354,960)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 354960, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M01 | Javiera Pefaur'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Javiera Pefaur')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 354960, 'other', '2025-01-15'::date, 'EXCEL_VENTAS_2025 | M01 | Javiera Pefaur | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M01 | Javiera Pefaur');

-- Martin Echeverria ($378,300)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 378300, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M01 | Martin Echeverria'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Martin Echeverria')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 378300, 'other', '2025-01-15'::date, 'EXCEL_VENTAS_2025 | M01 | Martin Echeverria | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M01 | Martin Echeverria');

-- Loreto Hofer ($177,480)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 177480, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M01 | Loreto Hofer'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Loreto Hofer')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 177480, 'other', '2025-01-15'::date, 'EXCEL_VENTAS_2025 | M01 | Loreto Hofer | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M01 | Loreto Hofer');

-- Margarita Steff ($552,900)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 552900, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M01 | Margarita Steff'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Margarita Steff')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 552900, 'other', '2025-01-15'::date, 'EXCEL_VENTAS_2025 | M01 | Margarita Steff | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M01 | Margarita Steff');

-- Kara Bermejo ($253,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 253000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M01 | Kara Bermejo'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Kara Bermejo')
  AND EXTRACT(MONTH FROM r.check_in) = 1
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 253000, 'other', '2025-01-15'::date, 'EXCEL_VENTAS_2025 | M01 | Kara Bermejo | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M01 | Kara Bermejo');


-- FEBRERO
-- Paola Romero ($440,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 440000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Paola Romero'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Paola Romero')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 440000, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Paola Romero | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Paola Romero');

-- Julio Quinteros ($540,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 540000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Julio Quinteros'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Julio Quinteros')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 540000, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Julio Quinteros | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Julio Quinteros');

-- Daniel Mora ($406,980)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 406980, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Daniel Mora'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Daniel Mora')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 406980, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Daniel Mora | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Daniel Mora');

-- Natalia Gonzalez ($347,424)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 347424, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Natalia Gonzalez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Natalia Gonzalez')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 347424, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Natalia Gonzalez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Natalia Gonzalez');

-- Marita ($440,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 440000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Marita'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Marita')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 440000, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Marita | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Marita');

-- Daniela Gonzales ($679,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 679000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Daniela Gonzales'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Daniela Gonzales')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 679000, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Daniela Gonzales | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Daniela Gonzales');

-- Nicole Abarca ($443,700)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 443700, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Nicole Abarca'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Nicole Abarca')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 443700, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Nicole Abarca | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Nicole Abarca');

-- Felipe Hernandez ($600,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 600000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Felipe Hernandez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Felipe Hernandez')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 600000, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Felipe Hernandez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Felipe Hernandez');

-- Javier Maldonado ($291,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 291000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Javier Maldonado'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Javier Maldonado')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 291000, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Javier Maldonado | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Javier Maldonado');

-- Susana Montesino ($241,900)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 241900, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Susana Montesino'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Susana Montesino')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 241900, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Susana Montesino | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Susana Montesino');

-- Patricia bustamante ($203,700)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 203700, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Patricia bustamante'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Patricia bustamante')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 203700, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Patricia bustamante | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Patricia bustamante');

-- Alejandra Stay ($1,281,800)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1281800, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Alejandra Stay'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Alejandra Stay')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1281800, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Alejandra Stay | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Alejandra Stay');

-- Mariella Offmann ($600,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 600000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Mariella Offmann'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Mariella Offmann')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 600000, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Mariella Offmann | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Mariella Offmann');

-- Bastian Perez ($210,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 210000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Bastian Perez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Bastian Perez')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 210000, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Bastian Perez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Bastian Perez');

-- Esteban Contreras ($291,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 291000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Esteban Contreras'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Esteban Contreras')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 291000, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Esteban Contreras | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Esteban Contreras');

-- Enrique Araos ($165,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 165000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Enrique Araos'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Enrique Araos')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 165000, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Enrique Araos | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Enrique Araos');

-- Javiera hernandez ($345,374)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 345374, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Javiera hernandez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Javiera hernandez')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 345374, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Javiera hernandez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Javiera hernandez');

-- Bruno Cres ($291,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 291000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Bruno Cres'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Bruno Cres')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 291000, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Bruno Cres | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Bruno Cres');

-- Pablo Morande ($220,461)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 220461, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M02 | Pablo Morande'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Pablo Morande')
  AND EXTRACT(MONTH FROM r.check_in) = 2
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 220461, 'other', '2025-02-15'::date, 'EXCEL_VENTAS_2025 | M02 | Pablo Morande | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M02 | Pablo Morande');


-- MARZO
-- Andres Larrain ($270,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 270000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M03 | Andres Larrain'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Andres Larrain')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 270000, 'other', '2025-03-15'::date, 'EXCEL_VENTAS_2025 | M03 | Andres Larrain | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M03 | Andres Larrain');

-- Christian gardiol ($420,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 420000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M03 | Christian gardiol'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Christian gardiol')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 420000, 'other', '2025-03-15'::date, 'EXCEL_VENTAS_2025 | M03 | Christian gardiol | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M03 | Christian gardiol');

-- Jorge Lichtscheidl ($650,760)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 650760, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M03 | Jorge Lichtscheidl'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Jorge Lichtscheidl')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 650760, 'other', '2025-03-15'::date, 'EXCEL_VENTAS_2025 | M03 | Jorge Lichtscheidl | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M03 | Jorge Lichtscheidl');

-- Felipe Prado ($207,060)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 207060, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M03 | Felipe Prado'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Felipe Prado')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 207060, 'other', '2025-03-15'::date, 'EXCEL_VENTAS_2025 | M03 | Felipe Prado | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M03 | Felipe Prado');

-- Carolina bustos ($203,700)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 203700, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M03 | Carolina bustos'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Carolina bustos')
  AND EXTRACT(MONTH FROM r.check_in) = 3
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 203700, 'other', '2025-03-15'::date, 'EXCEL_VENTAS_2025 | M03 | Carolina bustos | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M03 | Carolina bustos');


-- ABRIL
-- Javier y Camila ($378,300)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 378300, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M04 | Javier y Camila'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Javier y Camila')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 378300, 'other', '2025-04-15'::date, 'EXCEL_VENTAS_2025 | M04 | Javier y Camila | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M04 | Javier y Camila');

-- Claire Wood ($453,560)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 453560, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M04 | Claire Wood'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Claire Wood')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 453560, 'other', '2025-04-15'::date, 'EXCEL_VENTAS_2025 | M04 | Claire Wood | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M04 | Claire Wood');

-- Sebastian Perez ($867,680)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 867680, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M04 | Sebastian Perez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Sebastian Perez')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 867680, 'other', '2025-04-15'::date, 'EXCEL_VENTAS_2025 | M04 | Sebastian Perez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M04 | Sebastian Perez');

-- Cesar Soto ($291,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 291000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M04 | Cesar Soto'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Cesar Soto')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 291000, 'other', '2025-04-15'::date, 'EXCEL_VENTAS_2025 | M04 | Cesar Soto | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M04 | Cesar Soto');

-- Rodrigo Fernandez ($223,149)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 223149, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M04 | Rodrigo Fernandez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Rodrigo Fernandez')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 223149, 'other', '2025-04-15'::date, 'EXCEL_VENTAS_2025 | M04 | Rodrigo Fernandez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M04 | Rodrigo Fernandez');

-- Lucas Gomez ($266,220)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 266220, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M04 | Lucas Gomez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Lucas Gomez')
  AND EXTRACT(MONTH FROM r.check_in) = 4
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 266220, 'other', '2025-04-15'::date, 'EXCEL_VENTAS_2025 | M04 | Lucas Gomez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M04 | Lucas Gomez');


-- MAYO
-- pAMELA eSPINOZA ($279,410)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 279410, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M05 | pAMELA eSPINOZA'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('pAMELA eSPINOZA')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 279410, 'other', '2025-05-15'::date, 'EXCEL_VENTAS_2025 | M05 | pAMELA eSPINOZA | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M05 | pAMELA eSPINOZA');

-- MARCELA pEREZ ($249,999)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 249999, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M05 | MARCELA pEREZ'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('MARCELA pEREZ')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 249999, 'other', '2025-05-15'::date, 'EXCEL_VENTAS_2025 | M05 | MARCELA pEREZ | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M05 | MARCELA pEREZ');

-- cAROLINA aLVAREZ ($183,701)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 183701, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M05 | cAROLINA aLVAREZ'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('cAROLINA aLVAREZ')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 183701, 'other', '2025-05-15'::date, 'EXCEL_VENTAS_2025 | M05 | cAROLINA aLVAREZ | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M05 | cAROLINA aLVAREZ');

-- Rodrigo ibañez ($90,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 90000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M05 | Rodrigo ibañez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Rodrigo ibañez')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 90000, 'other', '2025-05-15'::date, 'EXCEL_VENTAS_2025 | M05 | Rodrigo ibañez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M05 | Rodrigo ibañez');

-- Paulina Vergara ($453,560)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 453560, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M05 | Paulina Vergara'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Paulina Vergara')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 453560, 'other', '2025-05-15'::date, 'EXCEL_VENTAS_2025 | M05 | Paulina Vergara | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M05 | Paulina Vergara');

-- Vanina Martinez ($460,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 460000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M05 | Vanina Martinez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Vanina Martinez')
  AND EXTRACT(MONTH FROM r.check_in) = 5
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 460000, 'other', '2025-05-15'::date, 'EXCEL_VENTAS_2025 | M05 | Vanina Martinez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M05 | Vanina Martinez');


-- JUNIO
-- Hernan Wunderlich ($1,220,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1220000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Hernan Wunderlich'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Hernan Wunderlich')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1220000, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Hernan Wunderlich | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Hernan Wunderlich');

-- Horacio Rojas ($1,782,472)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1782472, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Horacio Rojas'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Horacio Rojas')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1782472, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Horacio Rojas | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Horacio Rojas');

-- Paulina Muñoz ($325,380)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 325380, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Paulina Muñoz #1'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Paulina Muñoz')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 325380, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Paulina Muñoz #1 | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Paulina Muñoz #1');

-- Paulina Muñoz ($325,380)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 325380, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Paulina Muñoz #2'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Paulina Muñoz')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1 OFFSET 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 325380, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Paulina Muñoz #2 | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Paulina Muñoz #2');

-- Oscar Contreras ($538,919)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 538919, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Oscar Contreras'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Oscar Contreras')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 538919, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Oscar Contreras | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Oscar Contreras');

-- Debora Castillo ($715,886)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 715886, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Debora Castillo'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Debora Castillo')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 715886, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Debora Castillo | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Debora Castillo');

-- Maria Francisca Valenzuela ($207,060)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 207060, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Maria Francisca Valenzuela'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Maria Francisca Valenzuela')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 207060, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Maria Francisca Valenzuela | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Maria Francisca Valenzuela');

-- Gabriela Verdugo ($1,050,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1050000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Gabriela Verdugo'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Gabriela Verdugo')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1050000, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Gabriela Verdugo | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Gabriela Verdugo');

-- Carolina Andrea Peña ($290,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 290000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Carolina Andrea Peña'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Carolina Andrea Peña')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 290000, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Carolina Andrea Peña | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Carolina Andrea Peña');

-- Lourdes Velasquez ($1,125,200)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1125200, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Lourdes Velasquez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Lourdes Velasquez')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1125200, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Lourdes Velasquez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Lourdes Velasquez');

-- Gisela Ceballos ($495,419)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 495419, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Gisela Ceballos'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Gisela Ceballos')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 495419, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Gisela Ceballos | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Gisela Ceballos');

-- Carlos Delgado ($355,894)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 355894, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Carlos Delgado'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Carlos Delgado')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 355894, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Carlos Delgado | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Carlos Delgado');

-- Ingrid Mellado ($450,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 450000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Ingrid Mellado'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Ingrid Mellado')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 450000, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Ingrid Mellado | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Ingrid Mellado');

-- Romina Sanhueza ($485,569)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 485569, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Romina Sanhueza'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Romina Sanhueza')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 485569, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Romina Sanhueza | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Romina Sanhueza');

-- Gustavo Canales ($110,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 110000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Gustavo Canales'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Gustavo Canales')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 110000, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Gustavo Canales | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Gustavo Canales');

-- Jose Vargas ($390,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 390000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Jose Vargas'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Jose Vargas')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 390000, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Jose Vargas | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Jose Vargas');

-- Atiglio ($566,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 566000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Atiglio'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Atiglio')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 566000, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Atiglio | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Atiglio');

-- Margorie Henrriquez ($390,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 390000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Margorie Henrriquez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Margorie Henrriquez')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 390000, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Margorie Henrriquez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Margorie Henrriquez');

-- Carolina Serin ($260,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 260000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M06 | Carolina Serin'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Carolina Serin')
  AND EXTRACT(MONTH FROM r.check_in) = 6
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 260000, 'other', '2025-06-15'::date, 'EXCEL_VENTAS_2025 | M06 | Carolina Serin | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M06 | Carolina Serin');


-- JULIO
-- aLEXANDRA gARCIA ($916,553)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 916553, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | aLEXANDRA gARCIA'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('aLEXANDRA gARCIA')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 916553, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | aLEXANDRA gARCIA | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | aLEXANDRA gARCIA');

-- gREG bULL ($467,637)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 467637, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | gREG bULL'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('gREG bULL')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 467637, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | gREG bULL | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | gREG bULL');

-- mARCIO zANETTI ($2,140,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 2140000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | mARCIO zANETTI'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('mARCIO zANETTI')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 2140000, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | mARCIO zANETTI | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | mARCIO zANETTI');

-- vINICIUS Cruz ($2,073,084)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 2073084, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | vINICIUS Cruz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('vINICIUS Cruz')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 2073084, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | vINICIUS Cruz | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | vINICIUS Cruz');

-- Felipe Castañia ($935,906)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 935906, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Felipe Castañia'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Felipe Castañia')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 935906, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Felipe Castañia | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Felipe Castañia');

-- Cesar Gomez ($926,840)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 926840, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Cesar Gomez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Cesar Gomez')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 926840, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Cesar Gomez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Cesar Gomez');

-- Gloria Noguera ($900,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 900000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Gloria Noguera'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Gloria Noguera')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 900000, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Gloria Noguera | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Gloria Noguera');

-- Michel Angelo Lapadula ($680,340)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 680340, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Michel Angelo Lapadula'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Michel Angelo Lapadula')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 680340, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Michel Angelo Lapadula | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Michel Angelo Lapadula');

-- brandyn Phillips ($673,374)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 673374, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | brandyn Phillips'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('brandyn Phillips')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 673374, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | brandyn Phillips | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | brandyn Phillips');

-- Catalina Riveros ($885,920)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 885920, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Catalina Riveros'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Catalina Riveros')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 885920, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Catalina Riveros | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Catalina Riveros');

-- Valeska Arias ($409,437)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 409437, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Valeska Arias'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Valeska Arias')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 409437, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Valeska Arias | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Valeska Arias');

-- Carlos valenzuela Paola V ($940,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 940000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Carlos valenzuela Paola V'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Carlos valenzuela Paola V')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 940000, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Carlos valenzuela Paola V | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Carlos valenzuela Paola V');

-- Carolina Diaz Yaeger ($523,902)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 523902, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Carolina Diaz Yaeger'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Carolina Diaz Yaeger')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 523902, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Carolina Diaz Yaeger | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Carolina Diaz Yaeger');

-- Diego Coelho ($2,000,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 2000000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Diego Coelho'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Diego Coelho')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 2000000, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Diego Coelho | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Diego Coelho');

-- Hernan Ferrera ($542,300)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 542300, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Hernan Ferrera'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Hernan Ferrera')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 542300, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Hernan Ferrera | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Hernan Ferrera');

-- Cristian garces ($145,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 145000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Cristian garces'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Cristian garces')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 145000, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Cristian garces | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Cristian garces');

-- Poala Gorriateguy ($955,245)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 955245, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Poala Gorriateguy'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Poala Gorriateguy')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 955245, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Poala Gorriateguy | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Poala Gorriateguy');

-- Pamela Medina ($362,070)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 362070, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Pamela Medina'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Pamela Medina')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 362070, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Pamela Medina | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Pamela Medina');

-- Geraldine Saez ($315,468)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 315468, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Geraldine Saez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Geraldine Saez')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 315468, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Geraldine Saez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Geraldine Saez');

-- Falipe Villa Vicencio ($110,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 110000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Falipe Villa Vicencio'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Falipe Villa Vicencio')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 110000, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Falipe Villa Vicencio | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Falipe Villa Vicencio');

-- Paulo Unzueta ($473,280)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 473280, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Paulo Unzueta'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Paulo Unzueta')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 473280, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Paulo Unzueta | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Paulo Unzueta');

-- Andres Eltit Silva ($326,132)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 326132, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Andres Eltit Silva'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Andres Eltit Silva')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 326132, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Andres Eltit Silva | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Andres Eltit Silva');

-- Matias Lomboy ($270,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 270000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Matias Lomboy'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Matias Lomboy')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 270000, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Matias Lomboy | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Matias Lomboy');

-- Evelyn Malgarejo ($493,772)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 493772, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Evelyn Malgarejo'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Evelyn Malgarejo')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 493772, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Evelyn Malgarejo | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Evelyn Malgarejo');

-- Jorge Erlwein ($320,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 320000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M07 | Jorge Erlwein'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Jorge Erlwein')
  AND EXTRACT(MONTH FROM r.check_in) = 7
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 320000, 'other', '2025-07-15'::date, 'EXCEL_VENTAS_2025 | M07 | Jorge Erlwein | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M07 | Jorge Erlwein');


-- AGOSTO
-- rENE tAPIA ($2,295,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 2295000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | rENE tAPIA'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('rENE tAPIA')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 2295000, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | rENE tAPIA | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | rENE tAPIA');

-- Claudia cortes ($1,214,414)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1214414, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Claudia cortes'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Claudia cortes')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1214414, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Claudia cortes | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Claudia cortes');

-- yamyl Jarufe ($867,680)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 867680, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | yamyl Jarufe'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('yamyl Jarufe')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 867680, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | yamyl Jarufe | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | yamyl Jarufe');

-- maria Constanza Moraga ($840,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 840000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | maria Constanza Moraga'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('maria Constanza Moraga')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 840000, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | maria Constanza Moraga | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | maria Constanza Moraga');

-- Andres Vasquez ($322,428)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 322428, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Andres Vasquez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Andres Vasquez')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 322428, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Andres Vasquez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Andres Vasquez');

-- Javier Poroz ($560,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 560000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Javier Poroz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Javier Poroz')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 560000, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Javier Poroz | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Javier Poroz');

-- Pablo Rodriguez Carrasco ($370,264)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 370264, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Pablo Rodriguez Carrasco'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Pablo Rodriguez Carrasco')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 370264, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Pablo Rodriguez Carrasco | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Pablo Rodriguez Carrasco');

-- Gerardo Ramos ($322,428)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 322428, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Gerardo Ramos'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Gerardo Ramos')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 322428, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Gerardo Ramos | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Gerardo Ramos');

-- Bogoña Astura ($493,772)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 493772, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Bogoña Astura'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Bogoña Astura')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 493772, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Bogoña Astura | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Bogoña Astura');

-- Daniela herrera ($560,400)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 560400, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Daniela herrera'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Daniela herrera')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 560400, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Daniela herrera | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Daniela herrera');

-- Andrea Romeny ($600,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 600000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Andrea Romeny #1'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Andrea Romeny')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 600000, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Andrea Romeny #1 | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Andrea Romeny #1');

-- Andrea Romeny ($600,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 600000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Andrea Romeny #2'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Andrea Romeny')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1 OFFSET 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 600000, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Andrea Romeny #2 | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Andrea Romeny #2');

-- Borja ($713,532)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 713532, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Borja'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Borja')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 713532, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Borja | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Borja');

-- Ramiro Quiroga ($438,828)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 438828, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Ramiro Quiroga'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Ramiro Quiroga')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 438828, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Ramiro Quiroga | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Ramiro Quiroga');

-- Javier Diaz ($700,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 700000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Javier Diaz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Javier Diaz')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 700000, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Javier Diaz | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Javier Diaz');

-- Javier Lescano ($150,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 150000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Javier Lescano'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Javier Lescano')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 150000, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Javier Lescano | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Javier Lescano');

-- Sebastian Gianfagma ($713,532)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 713532, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Sebastian Gianfagma'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Sebastian Gianfagma')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 713532, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Sebastian Gianfagma | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Sebastian Gianfagma');

-- Diego Cid ($224,652)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 224652, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Diego Cid'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Diego Cid')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 224652, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Diego Cid | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Diego Cid');

-- Pamela Vera ($220,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 220000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Pamela Vera'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Pamela Vera')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 220000, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Pamela Vera | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Pamela Vera');

-- Victor Santos ($224,652)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 224652, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Victor Santos'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Victor Santos')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 224652, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Victor Santos | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Victor Santos');

-- Agus ($220,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 220000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Agus'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Agus')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 220000, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Agus | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Agus');

-- Tamara Zarza ($246,500)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 246500, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Tamara Zarza'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Tamara Zarza')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 246500, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Tamara Zarza | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Tamara Zarza');

-- martin Basilio ($658,581)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 658581, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | martin Basilio'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('martin Basilio')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 658581, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | martin Basilio | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | martin Basilio');

-- Gaspar Aunfranc ($615,756)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 615756, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M08 | Gaspar Aunfranc'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Gaspar Aunfranc')
  AND EXTRACT(MONTH FROM r.check_in) = 8
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 615756, 'other', '2025-08-15'::date, 'EXCEL_VENTAS_2025 | M08 | Gaspar Aunfranc | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M08 | Gaspar Aunfranc');


-- SEPTIEMBRE
-- bibiana Rubini ($690,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 690000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | bibiana Rubini'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('bibiana Rubini')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 690000, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | bibiana Rubini | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | bibiana Rubini');

-- Leonel Muñoz ($1,125,200)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1125200, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Leonel Muñoz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Leonel Muñoz')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1125200, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Leonel Muñoz | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Leonel Muñoz');

-- Rene Valdenegro ($321,458)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 321458, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Rene Valdenegro'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Rene Valdenegro')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 321458, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Rene Valdenegro | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Rene Valdenegro');

-- Ximena Moraga ($517,980)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 517980, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Ximena Moraga'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Ximena Moraga')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 517980, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Ximena Moraga | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Ximena Moraga');

-- Andraz ($4,413,200)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 4413200, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Andraz'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Andraz')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 4413200, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Andraz | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Andraz');

-- Andorra Casa ($5,510,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 5510000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Andorra Casa'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Andorra Casa')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 5510000, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Andorra Casa | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Andorra Casa');

-- Bosnia Refugio 1 ($2,725,800)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 2725800, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Bosnia Refugio 1'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Bosnia Refugio 1')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 2725800, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Bosnia Refugio 1 | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Bosnia Refugio 1');

-- Bosnia Refugio 2 ($1,440,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1440000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Bosnia Refugio 2'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Bosnia Refugio 2')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1440000, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Bosnia Refugio 2 | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Bosnia Refugio 2');

-- Ignacio mellado ($1,427,800)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1427800, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Ignacio mellado'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Ignacio mellado')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1427800, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Ignacio mellado | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Ignacio mellado');

-- Lourdes velasquez ($1,532,600)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1532600, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Lourdes velasquez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Lourdes velasquez')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1532600, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Lourdes velasquez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Lourdes velasquez');

-- Rodrigo Salinas ($354,960)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 354960, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Rodrigo Salinas'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Rodrigo Salinas')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 354960, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Rodrigo Salinas | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Rodrigo Salinas');

-- Thomas Joel ($371,067)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 371067, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Thomas Joel'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Thomas Joel')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 371067, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Thomas Joel | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Thomas Joel');

-- Maria Victoria Gonzalez ($1,125,200)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1125200, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Maria Victoria Gonzalez'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Maria Victoria Gonzalez')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1125200, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Maria Victoria Gonzalez | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Maria Victoria Gonzalez');

-- Martu Martu ($517,204)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 517204, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Martu Martu'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Martu Martu')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 517204, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Martu Martu | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Martu Martu');

-- Exequeil ($150,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 150000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Exequeil'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Exequeil')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 150000, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Exequeil | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Exequeil');

-- Oscar ($130,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 130000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Oscar'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Oscar')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 130000, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Oscar | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Oscar');

-- Juan ($280,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 280000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Juan'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Juan')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 280000, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Juan | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Juan');

-- Jaime R ($263,452)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 263452, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M09 | Jaime R'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Jaime R')
  AND EXTRACT(MONTH FROM r.check_in) = 9
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 263452, 'other', '2025-09-15'::date, 'EXCEL_VENTAS_2025 | M09 | Jaime R | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M09 | Jaime R');


-- OCTUBRE
-- Endemiko ($880,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 880000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M10 | Endemiko'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Endemiko')
  AND EXTRACT(MONTH FROM r.check_in) = 10
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 880000, 'other', '2025-10-15'::date, 'EXCEL_VENTAS_2025 | M10 | Endemiko | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M10 | Endemiko');

-- Marisol Navarro ($333,764)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 333764, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M10 | Marisol Navarro'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Marisol Navarro')
  AND EXTRACT(MONTH FROM r.check_in) = 10
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 333764, 'other', '2025-10-15'::date, 'EXCEL_VENTAS_2025 | M10 | Marisol Navarro | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M10 | Marisol Navarro');


-- DICIEMBRE
-- Camila Larrain ($1,810,990)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 1810990, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M12 | Camila Larrain'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Camila Larrain')
  AND EXTRACT(MONTH FROM r.check_in) = 12
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 1810990, 'other', '2025-12-15'::date, 'EXCEL_VENTAS_2025 | M12 | Camila Larrain | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M12 | Camila Larrain');

-- Victor Collinao ($291,000)
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT r.id, 'lodging', 291000, 'other', r.check_in, 'EXCEL_VENTAS_2025 | M12 | Victor Collinao'
FROM reservations r JOIN guests g ON g.id = r.guest_id
WHERE r.notes = 'ASSET_CORRECTED_2025_2026'
  AND LOWER(g.full_name) = LOWER('Victor Collinao')
  AND EXTRACT(MONTH FROM r.check_in) = 12
  AND EXTRACT(YEAR FROM r.check_in) = 2025
ORDER BY r.check_in, r.id LIMIT 1;
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
SELECT NULL, 'lodging', 291000, 'other', '2025-12-15'::date, 'EXCEL_VENTAS_2025 | M12 | Victor Collinao | orphan'
WHERE NOT EXISTS (SELECT 1 FROM sales WHERE description = 'EXCEL_VENTAS_2025 | M12 | Victor Collinao');

COMMIT;