-- Migración 030: Fix colores de cabañas + importación manual reservas 2026
-- Fuente: assets/Reservas AvA Refugios 2026 (1).xlsx
-- Color PDF → cabin_id: azul=1, rojo=2, verde=3, negro=4 (Casa AvA)

-- 1. COLORES DE CABAÑAS
UPDATE cabins SET color_hex = '#EF4444' WHERE id = 2; -- C2 Roja
UPDATE cabins SET color_hex = '#10B981' WHERE id = 3; -- C3 Verde
UPDATE cabins SET color_hex = '#1e293b' WHERE id = 4; -- Casa AvA

-- 2. LIMPIAR ASSET_CORRECTED_2026 mal asignadas (cabin_id por rotación aleatoria)
DELETE FROM reservations
WHERE notes = 'ASSET_CORRECTED_2026'
  AND check_in >= '2026-01-01' AND check_in < '2026-03-01';

-- También reemplazar Joao (fechas/cabañas incorrectas)
DELETE FROM reservations
WHERE notes = 'ASSET_CORRECTED_2026'
  AND check_in = '2026-08-24';

-- 3. INSERCIÓN COMPLETA 2026 (fuente: Excel verificado por cliente)
INSERT INTO reservations (guest_id, cabin_id, check_in, check_out, guests_count, total_amount, source, payment_method, status, lead_stage, notes) VALUES

-- ENERO
(27,  4, '2026-01-01', '2026-01-03', 7, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Camila Muñoz, Casa AvA
(11,  2, '2026-01-14', '2026-01-17', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Fernanda Escorza
(20,  2, '2026-01-17', '2026-01-18', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Barbara
(15,  2, '2026-01-20', '2026-01-22', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Nicolas Muñoz
(3,   3, '2026-01-22', '2026-01-26', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Francisco Espinoza
(133, 2, '2026-01-23', '2026-01-25', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Juan Carlos
(33,  4, '2026-01-30', '2026-02-02', 5, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Alberto Etchegaray, Casa AvA

-- FEBRERO
(18,  1, '2026-02-04', '2026-02-06', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Paulina Cabezas
(21,  2, '2026-02-05', '2026-02-10', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Rodrigo Espinoza
(198, 3, '2026-02-05', '2026-02-07', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Marcela Rodrigues
(235, 4, '2026-02-06', '2026-02-09', 4, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Felipe Garin, Casa AvA
(12,  1, '2026-02-06', '2026-02-08', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Gabriela Soto
(8,   3, '2026-02-08', '2026-02-12', 3, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Nicolas Sanchez
(9,   4, '2026-02-09', '2026-02-12', 4, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Russel King, Casa AvA
(7,   1, '2026-02-09', '2026-02-12', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Alejandra Maturana
(6,   2, '2026-02-10', '2026-02-13', 3, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Cristobal Muhr
(24,  3, '2026-02-13', '2026-02-15', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Valentina Riquelme
(32,  1, '2026-02-13', '2026-02-19', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Ariana Sepulveda
(10,  4, '2026-02-14', '2026-02-19', 5, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Andres Goycolea, Casa AvA
(25,  2, '2026-02-15', '2026-02-18', 3, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Javiera Garrido
(252, 3, '2026-02-16', '2026-02-18', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Juan Vidria
(19,  2, '2026-02-18', '2026-02-21', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Luis Reyes
(223, 3, '2026-02-19', '2026-02-24', 3, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Eva Piccars
(30,  1, '2026-02-19', '2026-02-22', 4, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Natalia Ureta
(27,  2, '2026-02-21', '2026-02-27', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Camila Muñoz
(1,   1, '2026-02-27', '2026-03-03', 2, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Lourdes Velez (→ Marzo)

-- AGOSTO
(164, 4, '2026-08-26', '2026-08-29', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Joao Viana, Casa AvA
(164, 1, '2026-08-26', '2026-08-29', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Joao Viana, C1
(164, 2, '2026-08-26', '2026-08-29', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Joao Viana, C2
(177, 4, '2026-08-31', '2026-09-01', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Javier, Casa AvA
(200, 3, '2026-08-31', '2026-09-05', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Sebastian Perez
(236, 2, '2026-08-31', '2026-09-03', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Martin Basilio
(263, 1, '2026-08-31', '2026-09-05', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Gaspar Aunfraric
(174, 4, '2026-08-31', '2026-09-04', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Maria, Casa AvA

-- SEPTIEMBRE
(125, 2, '2026-09-04', '2026-09-06', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Tomas
(215, 3, '2026-09-05', '2026-09-06', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Exequeil
(142, 2, '2026-09-06', '2026-09-07', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Oscar
(134, 4, '2026-09-07', '2026-09-08', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Juan, Casa AvA
(114, 1, '2026-09-08', '2026-09-29', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Andraz
(205, 2, '2026-09-10', '2026-09-13', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Rodrigo Salinas
(192, 4, '2026-09-12', '2026-09-16', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Leonel Muñoz, Casa AvA
(206, 3, '2026-09-12', '2026-09-17', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Ximena Moraga
(296, 2, '2026-09-13', '2026-09-17', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Bibiana Rubini
(1,   4, '2026-09-16', '2026-09-21', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Lourdes Velez, Casa AvA
(146, 3, '2026-09-17', '2026-09-19', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Jaime
(286, 2, '2026-09-17', '2026-09-19', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Rene Valdenegro
(257, 3, '2026-09-19', '2026-09-23', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Marta Martu
(245, 2, '2026-09-19', '2026-09-29', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Ignacio Mellado
(213, 3, '2026-09-25', '2026-09-29', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Bosnia Refugio 1
(226, 4, '2026-09-26', '2026-09-29', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Andorra Casa, Casa AvA

-- OCTUBRE
(114, 1, '2026-10-01', '2026-10-12', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Andraz
(226, 4, '2026-10-01', '2026-10-15', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Andorra Casa, Casa AvA
(213, 2, '2026-10-01', '2026-10-15', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Bosnia, C2
(213, 3, '2026-10-01', '2026-10-15', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Bosnia, C3
(48,  4, '2026-10-15', '2026-10-20', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Agustin, Casa AvA
(24,  4, '2026-10-27', '2026-10-31', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'), -- Valentina, Casa AvA

-- DICIEMBRE
(27,  4, '2026-12-26', '2026-12-30', 0, 0, 'direct', 'transfer', 'confirmed', 'confirmed', 'ASSET_CORRECTED_2026'); -- Camila Muñoz, Casa AvA
