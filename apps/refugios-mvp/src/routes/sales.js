import { Router } from "express";
import { query } from "../db/client.js";

const router = Router();

function isDateOnly(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "").trim());
}

function nonEmptyString(value) {
  const text = String(value || "").trim();
  return text || null;
}

function parseInteger(value, { min = null, max = null } = {}) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) return null;
  if (min != null && parsed < min) return null;
  if (max != null && parsed > max) return null;
  return parsed;
}

function parseBoolean(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (["1", "true", "yes", "si"].includes(normalized)) return true;
  if (["0", "false", "no"].includes(normalized)) return false;
  return null;
}

router.get("/meta", async (_req, res, next) => {
  try {
    const [categories, paymentMethods, sources] = await Promise.all([
      query(
        `SELECT DISTINCT lower(trim(category)) AS value
         FROM sales
         WHERE category IS NOT NULL AND trim(category) <> ''
         ORDER BY value`
      ),
      query(
        `SELECT DISTINCT payment_method AS value
         FROM sales
         WHERE payment_method IS NOT NULL AND trim(payment_method) <> ''
         ORDER BY value`
      ),
      query(
        `SELECT DISTINCT source AS value
         FROM reservations
         WHERE source IS NOT NULL AND trim(source) <> ''
         ORDER BY value`
      )
    ]);

    return res.json({
      categories: categories.rows.map((row) => row.value),
      payment_methods: paymentMethods.rows.map((row) => row.value),
      reservation_sources: sources.rows.map((row) => row.value)
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const where = [];
    const params = [];
    const addParam = (value) => {
      params.push(value);
      return `$${params.length}`;
    };

    const from = isDateOnly(req.query.from) ? req.query.from : null;
    const to = isDateOnly(req.query.to) ? req.query.to : null;
    if (from && to) {
      const fromParam = addParam(from);
      const toParam = addParam(to);
      where.push(`(
        (r.id IS NOT NULL AND r.check_in <= ${toParam}::date AND r.check_out >= ${fromParam}::date)
        OR
        (r.id IS NULL AND s.sale_date >= ${fromParam}::date AND s.sale_date <= ${toParam}::date)
      )`);
    } else if (from) {
      const fromParam = addParam(from);
      where.push(`(
        (r.id IS NOT NULL AND r.check_out >= ${fromParam}::date)
        OR
        (r.id IS NULL AND s.sale_date >= ${fromParam}::date)
      )`);
    } else if (to) {
      const toParam = addParam(to);
      where.push(`(
        (r.id IS NOT NULL AND r.check_in <= ${toParam}::date)
        OR
        (r.id IS NULL AND s.sale_date <= ${toParam}::date)
      )`);
    }

    const category = nonEmptyString(req.query.category);
    if (category) where.push(`lower(s.category) = lower(${addParam(category)})`);

    const paymentMethod = nonEmptyString(req.query.payment_method);
    if (paymentMethod) where.push(`s.payment_method = ${addParam(paymentMethod)}`);

    const reservationId = parseInteger(req.query.reservation_id, { min: 1 });
    if (reservationId) where.push(`s.reservation_id = ${addParam(reservationId)}`);

    const source = nonEmptyString(req.query.source);
    if (source) where.push(`r.source = ${addParam(source)}`);

    const reservationDocType = nonEmptyString(req.query.reservation_document_type);
    if (reservationDocType) where.push(`r.reservation_document_type = ${addParam(reservationDocType)}`);

    const checkInFrom = isDateOnly(req.query.check_in_from) ? req.query.check_in_from : null;
    const checkInTo = isDateOnly(req.query.check_in_to) ? req.query.check_in_to : null;
    const checkOutFrom = isDateOnly(req.query.check_out_from) ? req.query.check_out_from : null;
    const checkOutTo = isDateOnly(req.query.check_out_to) ? req.query.check_out_to : null;
    if (checkInFrom) where.push(`r.check_in >= ${addParam(checkInFrom)}::date`);
    if (checkInTo) where.push(`r.check_in <= ${addParam(checkInTo)}::date`);
    if (checkOutFrom) where.push(`r.check_out >= ${addParam(checkOutFrom)}::date`);
    if (checkOutTo) where.push(`r.check_out <= ${addParam(checkOutTo)}::date`);

    const minNights = parseInteger(req.query.min_nights, { min: 0 });
    if (minNights != null) where.push(`GREATEST(0, (r.check_out - r.check_in))::int >= ${addParam(minNights)}`);
    const maxNights = parseInteger(req.query.max_nights, { min: 0 });
    if (maxNights != null) where.push(`GREATEST(0, (r.check_out - r.check_in))::int <= ${addParam(maxNights)}`);

    const hasReservation = parseBoolean(req.query.has_reservation);
    if (hasReservation === true) where.push("s.reservation_id IS NOT NULL");
    if (hasReservation === false) where.push("s.reservation_id IS NULL");

    const cabinId = parseInteger(req.query.cabin_id, { min: 1 });
    if (cabinId) where.push(`r.cabin_id = ${addParam(cabinId)}`);

    const guestDocumentId = nonEmptyString(req.query.guest_document_id);
    if (guestDocumentId) where.push(`g.document_id = ${addParam(guestDocumentId)}`);

    const guestName = nonEmptyString(req.query.guest_name || req.query.guest || req.query.q);
    if (guestName) {
      const pattern = addParam(`%${guestName}%`);
      where.push(`(g.full_name ILIKE ${pattern} OR COALESCE(s.description, '') ILIKE ${pattern})`);
    }

    const result = await query(
      `SELECT
         s.id,
         s.reservation_id,
         s.category,
         CASE
           WHEN lower(coalesce(s.category, '')) = 'lodging' AND r.id IS NOT NULL
             THEN GREATEST(COALESCE(r.total_amount, 0) - COALESCE(r.additional_charge, 0), 0)::numeric(12,2)
           WHEN lower(coalesce(s.category, '')) = 'suplemento' AND r.id IS NOT NULL AND COALESCE(r.additional_charge, 0) > 0
             THEN COALESCE(r.additional_charge, 0)::numeric(12,2)
           ELSE s.amount
         END AS amount,
         s.amount AS raw_amount,
         s.payment_method,
         s.sale_date,
         s.description,
         g.full_name AS guest_name,
         g.document_id AS guest_document,
         g.tax_document_type AS guest_tax_type,
         r.cabin_id,
         c.name AS cabin_name,
         r.source AS reservation_source,
         r.check_in AS reservation_check_in,
         r.check_out AS reservation_check_out,
         r.status AS reservation_status,
         r.reservation_document_type,
         r.additional_charge AS reservation_additional_charge,
         r.nightly_rate AS reservation_nightly_rate,
         r.total_amount AS reservation_total,
         r.notes AS reservation_notes,
         GREATEST(0, (r.check_out - r.check_in))::int AS reservation_nights
       FROM sales s
       LEFT JOIN reservations r ON r.id = s.reservation_id
       LEFT JOIN guests g ON g.id = r.guest_id
       LEFT JOIN cabins c ON c.id = r.cabin_id
       ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
       ORDER BY s.sale_date DESC, s.id DESC`,
      params
    );
    return res.json(result.rows);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { reservation_id = null, category = "lodging", amount, payment_method, sale_date, description = null } = req.body;
    if (amount == null || !payment_method || !sale_date) {
      return res.status(400).json({ error: "amount, payment_method y sale_date son requeridos" });
    }

    const result = await query(
      `INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [reservation_id, category, amount, payment_method, sale_date, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id invalido" });
  }

  try {
    const result = await query("DELETE FROM sales WHERE id = $1 RETURNING id", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    return res.json({ ok: true, id });
  } catch (error) {
    return next(error);
  }
});

export default router;
