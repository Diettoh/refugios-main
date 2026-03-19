import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { Client } from "pg";

process.env.JWT_SECRET ||= "dev-secret-change-me";
process.env.DATABASE_URL ||= "postgresql://refugios:refugios_dev@localhost:5433/refugios";

const token = jwt.sign(
  { sub: 1, email: "test@test.com", role: "admin", name: "Test" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

const { default: app } = await import("../src/app.js");
const request = supertest(app);

function authHeader() {
  return { Authorization: `Bearer ${token}` };
}

async function getAnyCabinId() {
  const res = await request.get("/api/cabins").set(authHeader());
  assert.equal(res.status, 200);
  const cabins = Array.isArray(res.body) ? res.body : res.body?.cabins;
  assert.ok(Array.isArray(cabins));
  assert.ok(cabins.length > 0);
  return cabins[0].id;
}

async function createGuest() {
  const id = randomUUID();
  const fullName = `Test Guest ${id}`;
  const res = await request
    .post("/api/guests")
    .set(authHeader())
    .send({ full_name: fullName, email: `guest+${id}@test.com`, phone: "+56900000000" });
  assert.equal(res.status, 201);
  assert.ok(res.body?.id);
  return res.body.id;
}

function toDateOnly(value) {
  const d = new Date(value);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

async function getFreeCabinDates(cabinId, nights = 2) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const r = await client.query(
      `SELECT COALESCE(MAX(check_out), CURRENT_DATE)::date AS max_check_out
       FROM reservations
       WHERE cabin_id = $1`,
      [cabinId]
    );
    const maxCheckOut = r.rows?.[0]?.max_check_out;
    const baseDateOnly = maxCheckOut instanceof Date ? toDateOnly(maxCheckOut) : String(maxCheckOut);
    const base = new Date(`${baseDateOnly}T00:00:00Z`);
    const checkIn = new Date(base.getTime() + 10 * 86400000);
    const checkOut = new Date(checkIn.getTime() + nights * 86400000);
    return { check_in: toDateOnly(checkIn), check_out: toDateOnly(checkOut) };
  } finally {
    await client.end();
  }
}

test("POST /api/reservations persists Phase 2 commercial fields", async () => {
  const cabinId = await getAnyCabinId();
  const guestId = await createGuest();
  const { check_in, check_out } = await getFreeCabinDates(cabinId, 2);

  const payload = {
    guest_id: guestId,
    cabin_id: cabinId,
    source: "direct",
    payment_method: "cash",
    check_in,
    check_out,
    nightly_rate: 10000,
    nights: 2,
    cleaning_supplement: 15000,
    season_type: "alta",
    reservation_document_type: "boleta",
    notes: "test"
  };

  const res = await request.post("/api/reservations").set(authHeader()).send(payload);
  assert.equal(res.status, 201);
  assert.equal(res.body.source, "direct");
  assert.equal(res.body.season_type, "alta");
  assert.equal(res.body.reservation_document_type, "boleta");
  assert.equal(Number(res.body.cleaning_supplement), 15000);
  assert.equal(Number(res.body.nightly_rate), 10000);
  assert.equal(Number(res.body.nights), 2);
});

test("POST /api/reservations rejects source=phone (legacy value)", async () => {
  const cabinId = await getAnyCabinId();
  const guestId = await createGuest();
  const { check_in, check_out } = await getFreeCabinDates(cabinId, 2);

  const res = await request.post("/api/reservations").set(authHeader()).send({
    guest_id: guestId,
    cabin_id: cabinId,
    source: "phone",
    payment_method: "cash",
    check_in,
    check_out
  });

  assert.equal(res.status, 400);
});

test("PATCH /api/reservations/:id updates Phase 2 commercial fields", async () => {
  const cabinId = await getAnyCabinId();
  const guestId = await createGuest();
  const { check_in, check_out } = await getFreeCabinDates(cabinId, 2);

  const created = await request.post("/api/reservations").set(authHeader()).send({
    guest_id: guestId,
    cabin_id: cabinId,
    source: "booking",
    payment_method: "transfer",
    check_in,
    check_out,
    nightly_rate: 12000,
    nights: 2
  });
  assert.equal(created.status, 201);
  const reservationId = created.body.id;

  const patched = await request
    .patch(`/api/reservations/${reservationId}`)
    .set(authHeader())
    .send({
      cleaning_supplement: 5000,
      season_type: "baja",
      reservation_document_type: "factura",
      source: "airbnb"
    });

  assert.equal(patched.status, 200);
  assert.equal(patched.body.source, "airbnb");
  assert.equal(patched.body.season_type, "baja");
  assert.equal(patched.body.reservation_document_type, "factura");
  assert.equal(Number(patched.body.cleaning_supplement), 5000);
});

test("PATCH /api/reservations/:id returns 400 for non-integer id", async () => {
  const res = await request.patch("/api/reservations/nope").set(authHeader()).send({ source: "direct" });
  assert.equal(res.status, 400);
});

test("PATCH /api/reservations/:id returns 404 when reservation does not exist", async () => {
  const res = await request.patch("/api/reservations/99999999").set(authHeader()).send({ source: "direct" });
  assert.equal(res.status, 404);
});
