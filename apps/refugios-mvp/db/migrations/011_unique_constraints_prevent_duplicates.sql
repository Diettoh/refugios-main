-- Validaciones a nivel BD para evitar duplicados (seed y datos clave).
-- 1) Limpia duplicados existentes.
-- 2) Añade UNIQUE / índices únicos parciales.
-- (La transacción la gestiona el script de migración.)

-- ─── Limpieza de duplicados (permite aplicar las restricciones) ───

-- 1. Documentos de reservas "Reserva inicial" duplicadas
DELETE FROM documents
WHERE reservation_id IN (
  SELECT id FROM reservations
  WHERE notes = 'Reserva inicial'
  AND id != (SELECT MIN(id) FROM reservations WHERE notes = 'Reserva inicial')
);

-- 2. Ventas ligadas a reservas "Reserva inicial" duplicadas
DELETE FROM sales
WHERE reservation_id IN (
  SELECT id FROM reservations
  WHERE notes = 'Reserva inicial'
  AND id != (SELECT MIN(id) FROM reservations WHERE notes = 'Reserva inicial')
);

-- 3. Ventas "Venta alojamiento" duplicadas
DELETE FROM sales
WHERE description = 'Venta alojamiento'
AND id NOT IN (SELECT MIN(id) FROM sales WHERE description = 'Venta alojamiento');

-- 4. Gastos "Gasto operativo" duplicados
DELETE FROM expenses
WHERE description = 'Gasto operativo'
AND id NOT IN (SELECT MIN(id) FROM expenses WHERE description = 'Gasto operativo');

-- 5. Reservas "Reserva inicial" duplicadas
DELETE FROM reservations
WHERE notes = 'Reserva inicial'
AND id != (SELECT MIN(id) FROM reservations WHERE notes = 'Reserva inicial');

-- 6. Unificar guest_id de la reserva "Reserva inicial" al primer huésped con ese email
UPDATE reservations
SET guest_id = (SELECT MIN(id) FROM guests WHERE email = 'contacto@refugios.cl')
WHERE notes = 'Reserva inicial'
AND EXISTS (SELECT 1 FROM guests WHERE email = 'contacto@refugios.cl');

-- 7. Huéspedes duplicados por email: reasignar reservas al huésped que se conserva (min id) y borrar el resto
WITH dup_emails AS (
  SELECT email, MIN(id) AS keep_id
  FROM guests
  WHERE email IS NOT NULL
  GROUP BY email
  HAVING COUNT(*) > 1
),
bad_guests AS (
  SELECT g.id
  FROM guests g
  JOIN dup_emails d ON d.email = g.email AND g.id != d.keep_id
)
UPDATE reservations r
SET guest_id = d.keep_id
FROM guests g
JOIN dup_emails d ON d.email = g.email
WHERE r.guest_id = g.id AND g.id IN (SELECT id FROM bad_guests);

WITH dup_emails AS (
  SELECT email, MIN(id) AS keep_id FROM guests WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1
),
bad_guests AS (
  SELECT g.id FROM guests g JOIN dup_emails d ON d.email = g.email AND g.id != d.keep_id
)
DELETE FROM guests WHERE id IN (SELECT id FROM bad_guests);

-- 8. Documentos duplicados por (document_type, document_number) cuando document_number no es nulo
WITH dup_docs AS (
  SELECT document_type, document_number, MIN(id) AS keep_id
  FROM documents
  WHERE document_number IS NOT NULL AND document_number != ''
  GROUP BY document_type, document_number
  HAVING COUNT(*) > 1
),
bad_docs AS (
  SELECT d.id
  FROM documents d
  JOIN dup_docs dd ON dd.document_type = d.document_type AND dd.document_number = d.document_number AND d.id != dd.keep_id
)
DELETE FROM documents WHERE id IN (SELECT id FROM bad_docs);

-- ─── Restricciones e índices únicos ───

-- Huéspedes: un solo registro por email (varios NULL permitidos)
CREATE UNIQUE INDEX IF NOT EXISTS uq_guests_email
  ON guests (email)
  WHERE email IS NOT NULL AND email != '';

-- Documentos: un solo número por tipo (ej. una sola boleta B-001)
CREATE UNIQUE INDEX IF NOT EXISTS uq_documents_type_number
  ON documents (document_type, document_number)
  WHERE document_number IS NOT NULL AND document_number != '';

-- Seed: a lo sumo una reserva con notes = 'Reserva inicial'
CREATE UNIQUE INDEX IF NOT EXISTS uq_reservations_seed_notes
  ON reservations (notes)
  WHERE notes = 'Reserva inicial';

-- Seed: a lo sumo una venta con description = 'Venta alojamiento'
CREATE UNIQUE INDEX IF NOT EXISTS uq_sales_seed_description
  ON sales (description)
  WHERE description = 'Venta alojamiento';

-- Seed: a lo sumo un gasto con description = 'Gasto operativo'
CREATE UNIQUE INDEX IF NOT EXISTS uq_expenses_seed_description
  ON expenses (description)
  WHERE description = 'Gasto operativo';
