import { query } from "../src/db/client.js";
import "dotenv/config";

// Marcadores para identificar registros del seed (evitar duplicados)
const SEED_GUEST_EMAIL = "contacto@refugios.cl";
const SEED_RESERVATION_NOTES = "Reserva inicial";
const SEED_SALE_DESCRIPTION = "Venta alojamiento";
const SEED_EXPENSE_DESCRIPTION = "Gasto operativo";

// 1. Huésped: insertar solo si no existe
let guestId;
const existingGuest = await query(
  `SELECT id FROM guests WHERE email = $1 LIMIT 1`,
  [SEED_GUEST_EMAIL]
);
if (existingGuest.rows.length > 0) {
  guestId = existingGuest.rows[0].id;
  console.log("Huésped inicial ya existe, omitiendo.");
} else {
  const guest = await query(
    `INSERT INTO guests (full_name, email, phone) VALUES ($1, $2, $3) RETURNING id`,
    ["Cliente Inicial", SEED_GUEST_EMAIL, "+56911111111"]
  );
  guestId = guest.rows[0].id;
  console.log("Huésped inicial insertado.");
}

// 2. Reserva: insertar solo si no existe
let reservationId;
const existingRes = await query(
  `SELECT id FROM reservations WHERE notes = $1 LIMIT 1`,
  [SEED_RESERVATION_NOTES]
);
if (existingRes.rows.length > 0) {
  reservationId = existingRes.rows[0].id;
  console.log("Reserva inicial ya existe, omitiendo.");
} else {
  const reservation = await query(
    `INSERT INTO reservations (guest_id, source, payment_method, status, check_in, check_out, guests_count, total_amount, notes)
     VALUES ($1, 'web', 'transfer', 'confirmed', CURRENT_DATE, CURRENT_DATE + INTERVAL '2 day', 2, 180000, $2)
     RETURNING id`,
    [guestId, SEED_RESERVATION_NOTES]
  );
  reservationId = reservation.rows[0].id;
  console.log("Reserva inicial insertada.");
}

// 3. Venta: una por reserva inicial
const existingSale = await query(
  `SELECT 1 FROM sales WHERE description = $1 LIMIT 1`,
  [SEED_SALE_DESCRIPTION]
);
if (existingSale.rows.length === 0) {
  await query(
    `INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
     VALUES ($1, 'lodging', 180000, 'transfer', CURRENT_DATE, $2)`,
    [reservationId, SEED_SALE_DESCRIPTION]
  );
  console.log("Venta alojamiento insertada.");
}

// 4. Gasto operativo: solo uno
const existingExp = await query(
  `SELECT 1 FROM expenses WHERE description = $1 LIMIT 1`,
  [SEED_EXPENSE_DESCRIPTION]
);
if (existingExp.rows.length === 0) {
  await query(
    `INSERT INTO expenses (category, amount, payment_method, expense_date, supplier, description)
     VALUES ('limpieza', 25000, 'cash', CURRENT_DATE, 'Proveedor', $1)`,
    [SEED_EXPENSE_DESCRIPTION]
  );
  console.log("Gasto operativo insertado.");
}

// 5. Documento: uno B-001 para la reserva inicial
const existingDoc = await query(
  `SELECT 1 FROM documents WHERE document_number = 'B-001' AND reservation_id = $1 LIMIT 1`,
  [reservationId]
);
if (existingDoc.rows.length === 0) {
  await query(
    `INSERT INTO documents (reservation_id, document_type, document_number, issue_date, amount, status)
     VALUES ($1, 'boleta', 'B-001', CURRENT_DATE, 180000, 'issued')`,
    [reservationId]
  );
  console.log("Documento B-001 insertado.");
}

console.log("Seed completado (sin duplicar).");
process.exit(0);
