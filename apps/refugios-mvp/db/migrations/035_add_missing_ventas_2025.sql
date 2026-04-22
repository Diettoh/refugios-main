-- Migración 035: Insertar ventas 2025 que no pudieron vincularse a reservas en migración 034
-- Se insertan como ventas simples (sin reservation_id) con sale_date en el mes correcto.
-- Con period_by=check_in, COALESCE(r.check_in, s.sale_date) = s.sale_date → mes correcto.

BEGIN;

-- ENERO
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 390000, 'other', '2025-01-15', 'EXCEL_VENTAS_2025 | M01 | Martin Echeverria | orphan');

-- FEBRERO
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 210000, 'other', '2025-02-15', 'EXCEL_VENTAS_2025 | M02 | Bastian Perez | orphan');

-- MARZO
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 660000, 'other', '2025-03-15', 'EXCEL_VENTAS_2025 | M03 | Jorge Lichtscheidl | orphan');

-- ABRIL
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 270000, 'other', '2025-04-15', 'EXCEL_VENTAS_2025 | M04 | Lucas Gomez | orphan');

-- MAYO
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 279410, 'other', '2025-05-15', 'EXCEL_VENTAS_2025 | M05 | Pamela Espinoza | orphan');

-- JULIO
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 422100, 'other', '2025-07-15', 'EXCEL_VENTAS_2025 | M07 | Valeska Arias | orphan');

INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 145000, 'other', '2025-07-15', 'EXCEL_VENTAS_2025 | M07 | Cristian Garces | orphan');

INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 362070, 'other', '2025-07-15', 'EXCEL_VENTAS_2025 | M07 | Pamela Medina | orphan');

INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 326132, 'other', '2025-07-15', 'EXCEL_VENTAS_2025 | M07 | Andres Eltit Silva | orphan');

-- AGOSTO
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 634800, 'other', '2025-08-15', 'EXCEL_VENTAS_2025 | M08 | Gaspar Aunfranc | orphan');

-- SEPTIEMBRE
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 1440000, 'other', '2025-09-15', 'EXCEL_VENTAS_2025 | M09 | Bosnia Refugio 2 | orphan');

INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 1580000, 'other', '2025-09-15', 'EXCEL_VENTAS_2025 | M09 | Lourdes Velasquez | orphan');

INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 1160000, 'other', '2025-09-15', 'EXCEL_VENTAS_2025 | M09 | Maria Victoria Gonzalez | orphan');

INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 533200, 'other', '2025-09-15', 'EXCEL_VENTAS_2025 | M09 | Martu Martu | orphan');

-- DICIEMBRE
INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 1867000, 'other', '2025-12-15', 'EXCEL_VENTAS_2025 | M12 | Camila Larrain | orphan');

INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
VALUES (NULL, 'lodging', 300000, 'other', '2025-12-15', 'EXCEL_VENTAS_2025 | M12 | Victor Collinao | orphan');

COMMIT;
