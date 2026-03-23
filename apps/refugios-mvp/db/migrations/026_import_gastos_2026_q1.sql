-- Importación de gastos Enero, Febrero, Marzo 2026
-- Evita duplicados comparando fecha, categoría y monto.

WITH seed(expense_date, category, supplier, amount, payment_method) AS (
  VALUES
    -- ENERO 2026
    ('2026-01-01'::date, 'gas', 'Gas', 89300, 'transfer'),
    ('2026-01-01'::date, 'limpieza', 'Aseo Caro', 40000, 'transfer'),
    ('2026-01-01'::date, 'comision', 'Booking', 34500, 'transfer'),
    ('2026-01-01'::date, 'limpieza', 'Aseo Cathy', 45000, 'transfer'),
    ('2026-01-01'::date, 'equipamiento', 'Hamacas', 70000, 'transfer'),
    ('2026-01-01'::date, 'mantenimiento', 'Piso Gym', 460790, 'transfer'),
    ('2026-01-01'::date, 'mantenimiento', 'Pintura Gym', 97000, 'transfer'),
    ('2026-01-01'::date, 'mantenimiento', 'Pintada gym', 50000, 'transfer'),
    ('2026-01-01'::date, 'mantenimiento', 'Espejos Gym', 320000, 'transfer'),
    ('2026-01-01'::date, 'mantenimiento', 'Reparacion refri', 40000, 'transfer'),
    ('2026-01-01'::date, 'servicios', 'etico turismo', 15000, 'transfer'),
    ('2026-01-01'::date, 'utilities', 'Frontel', 476600, 'transfer'),
    ('2026-01-01'::date, 'impuestos', 'Imposiciones', 779067, 'transfer'),
    ('2026-01-01'::date, 'impuestos', 'contribuciones', 156073, 'transfer'),
    ('2026-01-01'::date, 'limpieza', 'aseo Dani', 50000, 'transfer'),
    ('2026-01-01'::date, 'mantenimiento', 'Pago Proyecto sanitario', 111400, 'transfer'),
    ('2026-01-01'::date, 'sueldo', 'Sueldo GD', 2000000, 'transfer'),

    -- FEBRERO 2026
    ('2026-02-01'::date, 'gas', 'Gas', 89800, 'transfer'),
    ('2026-02-01'::date, 'insumos', 'Pelets', 379199, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani', 35000, 'transfer'),
    ('2026-02-01'::date, 'insumos', 'Guardado Pelets', 25000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Lavado Sabanas', 57274, 'transfer'),
    ('2026-02-01'::date, 'mantenimiento', 'Materiales estacionamiento', 176800, 'transfer'),
    ('2026-02-01'::date, 'mantenimiento', 'Ripio', 84000, 'transfer'),
    ('2026-02-01'::date, 'otros', 'Arriendo bolo', 10000, 'transfer'),
    ('2026-02-01'::date, 'mantenimiento', 'Carlos Mella estacionamiento', 100000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (2)', 25000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (3)', 50000, 'transfer'),
    ('2026-02-01'::date, 'mantenimiento', 'Carlos Mella estacionamiento (2)', 180000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (4)', 35000, 'transfer'),
    ('2026-02-01'::date, 'comision', 'Comision Cta Cte', 35424, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (5)', 45000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (6)', 50000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (7)', 35000, 'transfer'),
    ('2026-02-01'::date, 'impuestos', 'Previred', 794996, 'transfer'),
    ('2026-02-01'::date, 'sueldo', 'Sueldo GD', 2000000, 'transfer'),
    ('2026-02-01'::date, 'servicios', 'Nueva app', 225000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (8)', 25000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (9)', 25000, 'transfer'),
    ('2026-02-01'::date, 'gas', 'Gas (2)', 179000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (10)', 50000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (11)', 35000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (12)', 25000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (13)', 25000, 'transfer'),
    ('2026-02-01'::date, 'mantenimiento', 'Mantencion generador', 30000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (14)', 50000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Lavado Sabanas (2)', 87000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Lavado Sabanas (3)', 30000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (15)', 25000, 'transfer'),
    ('2026-02-01'::date, 'limpieza', 'Aseo Dani (16)', 55000, 'transfer'),

    -- MARZO 2026
    ('2026-03-01'::date, 'utilities', 'Frontel', 236700, 'transfer'),
    ('2026-03-01'::date, 'otros', 'Varios', 90600, 'transfer'),
    ('2026-03-01'::date, 'limpieza', 'Aseo Dani', 55000, 'transfer'),
    ('2026-03-01'::date, 'limpieza', 'Lavado Sabanas', 82480, 'transfer'),
    ('2026-03-01'::date, 'gas', 'Gas', 89500, 'transfer'),
    ('2026-03-01'::date, 'otros', 'Carlos Mella', 40000, 'transfer'),
    ('2026-03-01'::date, 'servicios', 'Etico Turismo', 40000, 'transfer'),
    ('2026-03-01'::date, 'otros', 'Gonzalo Balmaceda', 40000, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Retro chaca Estacionamiento', 890000, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Ripio Estacionamiento', 890000, 'transfer'),
    ('2026-03-01'::date, 'transporte', 'Fletes Ripio', 360000, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Retro Pato Estacionamiento', 200000, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'carlos mella entrada', 350000, 'transfer'),
    ('2026-03-01'::date, 'limpieza', 'Aseo Dani (2)', 50000, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Limpia Fosa', 120000, 'transfer'),
    ('2026-03-01'::date, 'otros', 'Tramites Regularizacion Fda Campos', 54000, 'transfer'),
    ('2026-03-01'::date, 'impuestos', 'Imposiciones', 863317, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Materiales ferreteria entrada', 277550, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Materiales Ferreteria Estacionamiento', 1064930, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Ferretería (1)', 33999, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Ferretería (2)', 16000, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Ferretería (3)', 24000, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Ferretería (4)', 4800, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Ferretería (5)', 9600, 'transfer'),
    ('2026-03-01'::date, 'comision', 'Booking', 345570, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Materiales Ferreteria Estacionamiento (2)', 50000, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Materiales Ferreteria Estacionamiento (3)', 76000, 'transfer'),
    ('2026-03-01'::date, 'mantenimiento', 'Materiales Ferreteria Estacionamiento (4)', 90500, 'transfer'),
    ('2026-03-01'::date, 'sueldo', 'Sueldo GD', 2500000, 'transfer')
),
ins_expenses AS (
  INSERT INTO expenses (expense_date, category, supplier, amount, payment_method, description)
  SELECT s.expense_date, s.category, s.supplier, s.amount, s.payment_method, 'Carga masiva Q1 2026'
  FROM seed s
  WHERE NOT EXISTS (
    SELECT 1 FROM expenses e 
    WHERE e.expense_date = s.expense_date 
      AND e.amount = s.amount 
      AND (e.supplier = s.supplier OR e.category = s.category)
  )
  RETURNING id
)
SELECT COUNT(*) as inserted_count FROM ins_expenses;
