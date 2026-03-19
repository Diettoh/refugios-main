-- Elimina duplicados dejados por ejecutar seed.mjs varias veces.
-- Ejecutar una sola vez: psql $DATABASE_URL -f scripts/dedupe-seed.sql
-- o desde Node: node -e "require('pg').Client(...).query(require('fs').readFileSync('scripts/dedupe-seed.sql','utf8'))"

BEGIN;

-- 1. Documentos de reservas "Reserva inicial" duplicadas (dejar solo la de la reserva que conservamos)
DELETE FROM documents
WHERE reservation_id IN (
  SELECT id FROM reservations
  WHERE notes = 'Reserva inicial'
  AND id != (SELECT MIN(id) FROM reservations WHERE notes = 'Reserva inicial')
);

-- 2. Ventas ligadas a esas reservas duplicadas
DELETE FROM sales
WHERE reservation_id IN (
  SELECT id FROM reservations
  WHERE notes = 'Reserva inicial'
  AND id != (SELECT MIN(id) FROM reservations WHERE notes = 'Reserva inicial')
);

-- 3. Ventas "Venta alojamiento" duplicadas (dejar la de menor id)
DELETE FROM sales
WHERE description = 'Venta alojamiento'
AND id NOT IN (SELECT MIN(id) FROM sales WHERE description = 'Venta alojamiento');

-- 4. Gastos "Gasto operativo" duplicados
DELETE FROM expenses
WHERE description = 'Gasto operativo'
AND id NOT IN (SELECT MIN(id) FROM expenses WHERE description = 'Gasto operativo');

-- 5. Reservas "Reserva inicial" duplicadas (dejar una)
DELETE FROM reservations
WHERE notes = 'Reserva inicial'
AND id != (SELECT MIN(id) FROM reservations WHERE notes = 'Reserva inicial');

-- 6. Unificar guest_id de la reserva que queda al primer huésped "Cliente Inicial"
UPDATE reservations
SET guest_id = (SELECT MIN(id) FROM guests WHERE email = 'contacto@refugios.cl')
WHERE notes = 'Reserva inicial';

-- 7. Huéspedes "Cliente Inicial" duplicados (dejar uno)
DELETE FROM guests
WHERE email = 'contacto@refugios.cl'
AND id != (SELECT MIN(id) FROM guests WHERE email = 'contacto@refugios.cl');

COMMIT;
