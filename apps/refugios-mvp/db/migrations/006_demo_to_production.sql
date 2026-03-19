-- Migración: convertir datos demo a datos de producción
-- Reemplaza nombres "Demo Huesped", document_id DEMO-HIST-*, descripciones demo por datos reales

-- Nombres reales (de Ventas/Reservas AvA 2025-2026)
WITH prod_names AS (
  SELECT * FROM (VALUES
    (1, 'Francisco Espinoza'), (2, 'Fernanda Escorza'), (3, 'Barbara'), (4, 'Nicolas Muñoz'),
    (5, 'Alberto Etchegaray'), (6, 'Nicolas Sanchez'), (7, 'Cristobal Muhr'), (8, 'Natalia Ureta'),
    (9, 'Felipe Garcia'), (10, 'Luis Reyes'), (11, 'Eva Piccozzi'), (12, 'Juan Videla'),
    (13, 'Tomas Correa'), (14, 'Camila Muñoz'), (15, 'Rodrigo Espinoza'), (16, 'Paulina Cabezas'),
    (17, 'Marcela Rodriguez'), (18, 'Alejandra Maturana'), (19, 'Ariana Sepulveda'), (20, 'Lourdes Velez'),
    (21, 'Gabriela Soto'), (22, 'Valentina Riquelme'), (23, 'Russel King'), (24, 'Andres Goycolea'),
    (25, 'Javiera Garrido'), (26, 'Daniel Mclaughlin'), (27, 'Rainer Muehlberger'), (28, 'Jorge Perez'),
    (29, 'Fernando Larumbe'), (30, 'Javiera Pefaur'), (31, 'Martín Echeverría'), (32, 'Loreto Hofer'),
    (33, 'Margarita Steff'), (34, 'Kara Bermejo'), (35, 'Paola Romero'), (36, 'Julio Quinteros')
  ) AS t(rn, full_name)
)
UPDATE guests g
SET
  full_name = p.full_name,
  document_id = 'REF-' || LPAD(p.rn::text, 3, '0'),
  notes = NULL
FROM prod_names p
WHERE g.document_id = 'DEMO-HIST-' || LPAD(p.rn::text, 3, '0');

-- Reservas: limpiar notes de marcadores internos
UPDATE reservations
SET notes = 'Reserva histórica'
WHERE notes LIKE 'DEMO_HIST_RES|%' OR notes LIKE 'HIST_RES|%';

-- Ventas: description legible para producción
UPDATE sales
SET description = 'Venta alojamiento'
WHERE description LIKE 'DEMO_HIST_SALE|%' OR description LIKE 'HIST_SALE|%';

-- Gastos: proveedor y description de producción
UPDATE expenses
SET supplier = 'Proveedor', description = 'Gasto operativo'
WHERE description LIKE 'DEMO_HIST_EXP|%' OR description LIKE 'HIST_EXP|%';
