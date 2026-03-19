import { Router } from "express";
import { query } from "../db/client.js";

const router = Router();

const NAME_ACCENTS_FROM = "\u00C1\u00C0\u00C2\u00C4\u00C3\u00E1\u00E0\u00E2\u00E4\u00E3\u00C9\u00C8\u00CA\u00CB\u00E9\u00E8\u00EA\u00EB\u00CD\u00CC\u00CE\u00CF\u00ED\u00EC\u00EE\u00EF\u00D3\u00D2\u00D4\u00D6\u00D5\u00F3\u00F2\u00F4\u00F6\u00F5\u00DA\u00D9\u00DB\u00DC\u00FA\u00F9\u00FB\u00FC\u00D1\u00F1\u00C7\u00E7";
const NAME_ACCENTS_TO = "AAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuNnCc";

function sqlNameKey(alias = "g") {
  return `lower(regexp_replace(translate(coalesce(${alias}.full_name, ''), '${NAME_ACCENTS_FROM}', '${NAME_ACCENTS_TO}'), '[^a-z0-9]+', '', 'g'))`;
}

function normalizeDocumentId(value) {
  return String(value || "")
    .replace(/[.\s-]/g, "")
    .toUpperCase()
    .trim();
}

function normalizeNameKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

router.get("/", async (_req, res, next) => {
  try {
    const result = await query(
      `WITH guest_norm AS (
         SELECT
           g.*,
           ${sqlNameKey("g")} AS name_key
         FROM guests g
       ),
       grouped AS (
         SELECT
           gn.name_key,
           array_agg(gn.id ORDER BY gn.id) AS guest_ids,
           COUNT(*)::int AS alias_count,
           (array_agg(
             gn.id
             ORDER BY
               CASE WHEN NULLIF(gn.document_id, '') IS NOT NULL THEN 0 ELSE 1 END,
               CASE WHEN NULLIF(gn.email, '') IS NOT NULL OR NULLIF(gn.phone, '') IS NOT NULL THEN 0 ELSE 1 END,
               gn.created_at ASC,
               gn.id ASC
           ))[1] AS canonical_id
         FROM guest_norm gn
         GROUP BY gn.name_key
       ),
       canonical AS (
         SELECT
           gn.*,
           grp.guest_ids,
           grp.alias_count
         FROM grouped grp
         JOIN guest_norm gn ON gn.id = grp.canonical_id
       ),
       all_reservations AS (
         SELECT
           c.name_key,
           r.*,
           cab.name AS cabin_name
         FROM canonical c
         JOIN reservations r ON r.guest_id = ANY(c.guest_ids)
         LEFT JOIN cabins cab ON cab.id = r.cabin_id
       ),
       latest_reservation AS (
         SELECT *
         FROM (
           SELECT
             ar.name_key,
             ar.id,
             ar.source,
             ar.payment_method,
             ar.check_in,
             ar.check_out,
             ar.total_amount,
             ar.cabin_name,
             GREATEST(0, (ar.check_out - ar.check_in))::int AS nights,
             ROW_NUMBER() OVER (PARTITION BY ar.name_key ORDER BY ar.check_in DESC, ar.id DESC) AS rn
           FROM all_reservations ar
         ) ranked
         WHERE ranked.rn = 1
       ),
       sales_by_reservation AS (
         SELECT
           s.reservation_id,
           SUM(s.amount)::numeric(12,2) AS paid_amount
         FROM sales s
         WHERE s.reservation_id IS NOT NULL
         GROUP BY s.reservation_id
       ),
       guest_total_paid AS (
         SELECT
           ar.name_key,
           COALESCE(SUM(s.amount), 0)::numeric(12,2) AS total_paid
         FROM all_reservations ar
         LEFT JOIN sales s ON s.reservation_id = ar.id
         GROUP BY ar.name_key
       ),
       guest_total_nights AS (
         SELECT
           ar.name_key,
           COALESCE(SUM(GREATEST(0, (ar.check_out - ar.check_in))), 0)::int AS total_nights
         FROM all_reservations ar
         GROUP BY ar.name_key
       ),
       paid_before_latest AS (
         SELECT
           lr.name_key,
           COALESCE(SUM(s.amount), 0)::numeric(12,2) AS paid_amount
         FROM latest_reservation lr
         LEFT JOIN all_reservations ar ON ar.name_key = lr.name_key AND ar.check_out < lr.check_in
         LEFT JOIN sales s ON s.reservation_id = ar.id
         GROUP BY lr.name_key
       )
       SELECT
         c.id,
         c.full_name,
         c.email,
         c.phone,
         c.document_id,
         c.tax_document_type,
         c.notes,
         c.created_at,
         c.alias_count AS guest_alias_count,
         c.guest_ids AS guest_alias_ids,
         lr.id AS reservation_id,
         lr.source AS reservation_source,
         lr.payment_method AS reservation_payment_method,
         lr.check_in AS reservation_check_in,
         lr.check_out AS reservation_check_out,
         lr.total_amount AS reservation_total_amount,
         lr.nights AS reservation_nights,
         COALESCE(sbr.paid_amount, 0)::numeric(12,2) AS reservation_paid_amount,
         GREATEST(COALESCE(lr.total_amount, 0) - COALESCE(sbr.paid_amount, 0), 0)::numeric(12,2) AS reservation_amount_due,
         COALESCE(pbl.paid_amount, 0)::numeric(12,2) AS guest_paid_before_latest,
         COALESCE(gtn.total_nights, 0)::int AS guest_total_nights,
         COALESCE(gtp.total_paid, 0)::numeric(12,2) AS guest_total_paid_amount,
         CASE
           WHEN lr.id IS NULL THEN NULL
           WHEN COALESCE(sbr.paid_amount, 0) >= COALESCE(lr.total_amount, 0) THEN 'paid'
           WHEN COALESCE(sbr.paid_amount, 0) > 0 THEN 'partial'
           ELSE 'pending'
         END AS reservation_debt_status
       FROM canonical c
       LEFT JOIN latest_reservation lr ON lr.name_key = c.name_key
       LEFT JOIN sales_by_reservation sbr ON sbr.reservation_id = lr.id
       LEFT JOIN paid_before_latest pbl ON pbl.name_key = c.name_key
       LEFT JOIN guest_total_nights gtn ON gtn.name_key = c.name_key
       LEFT JOIN guest_total_paid gtp ON gtp.name_key = c.name_key
       ORDER BY c.created_at DESC, c.id DESC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/by-document/:documentId", async (req, res, next) => {
  try {
    const documentId = normalizeDocumentId(req.params.documentId);
    if (!documentId) return res.status(400).json({ error: "documentId invalido" });

    const result = await query(
      `WITH guest_norm AS (
         SELECT
           g.*,
           ${sqlNameKey("g")} AS name_key,
           translate(upper(coalesce(g.document_id, '')), '.- ', '') AS document_key
         FROM guests g
       ),
       grouped AS (
         SELECT
           gn.name_key,
           (array_agg(
             gn.id
             ORDER BY
               CASE WHEN NULLIF(gn.document_id, '') IS NOT NULL THEN 0 ELSE 1 END,
               CASE WHEN NULLIF(gn.email, '') IS NOT NULL OR NULLIF(gn.phone, '') IS NOT NULL THEN 0 ELSE 1 END,
               gn.created_at ASC,
               gn.id ASC
           ))[1] AS canonical_id
         FROM guest_norm gn
         GROUP BY gn.name_key
       )
       SELECT canonical.*
       FROM guest_norm doc_guest
       JOIN grouped grp ON grp.name_key = doc_guest.name_key
       JOIN guest_norm canonical ON canonical.id = grp.canonical_id
       WHERE doc_guest.document_key = $1
       ORDER BY canonical.created_at DESC, canonical.id DESC
       LIMIT 1`,
      [documentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Huesped no encontrado para ese RUT" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { full_name, email = null, phone = null, document_id = null, notes = null, tax_document_type = 'sii' } = req.body;
    if (!full_name) return res.status(400).json({ error: "full_name es requerido" });

    const normalizedDocumentId = document_id ? normalizeDocumentId(document_id) : null;
    const normalizedName = normalizeNameKey(full_name);

    if (normalizedDocumentId) {
      const existingByDocument = await query(
        `SELECT *
         FROM guests
         WHERE translate(upper(coalesce(document_id, '')), '.- ', '') = $1
         ORDER BY created_at DESC, id DESC
         LIMIT 1`,
        [normalizedDocumentId]
      );

      if (existingByDocument.rowCount > 0) {
        const existing = existingByDocument.rows[0];
        const merged = await query(
          `UPDATE guests
           SET
             full_name = COALESCE(NULLIF($2, ''), full_name),
             email = COALESCE(NULLIF($3, ''), email),
             phone = COALESCE(NULLIF($4, ''), phone),
             notes = COALESCE(NULLIF($5, ''), notes),
             tax_document_type = COALESCE(NULLIF($6, ''), tax_document_type)
           WHERE id = $1
           RETURNING *`,
          [existing.id, full_name, email, phone, notes, tax_document_type]
        );
        return res.status(200).json({ ...merged.rows[0], merged: true });
      }
    }

    if (normalizedName) {
      const existingByName = await query(
        `SELECT *
         FROM guests g
         WHERE ${sqlNameKey("g")} = $1
         ORDER BY
           CASE WHEN NULLIF(g.document_id, '') IS NOT NULL THEN 0 ELSE 1 END,
           CASE WHEN NULLIF(g.email, '') IS NOT NULL OR NULLIF(g.phone, '') IS NOT NULL THEN 0 ELSE 1 END,
           g.created_at ASC,
           g.id ASC
         LIMIT 1`,
        [normalizedName]
      );

      if (existingByName.rowCount > 0) {
        const existing = existingByName.rows[0];
        const merged = await query(
          `UPDATE guests
           SET
             document_id = COALESCE(NULLIF($2, ''), document_id),
             email = COALESCE(NULLIF($3, ''), email),
             phone = COALESCE(NULLIF($4, ''), phone),
             notes = COALESCE(NULLIF($5, ''), notes),
             tax_document_type = COALESCE(NULLIF($6, ''), tax_document_type)
           WHERE id = $1
           RETURNING *`,
          [existing.id, normalizedDocumentId, email, phone, notes, tax_document_type]
        );
        return res.status(200).json({ ...merged.rows[0], merged: true });
      }
    }

    const result = await query(
      `INSERT INTO guests (full_name, email, phone, document_id, notes, tax_document_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [full_name, email, phone, normalizedDocumentId, notes, tax_document_type]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id invalido" });
  }

  const updates = [];
  const params = [];
  let i = 1;

  const { full_name, email, phone, document_id, notes, tax_document_type } = req.body || {};

  if (full_name !== undefined) {
    const value = String(full_name || "").trim();
    if (!value) return res.status(400).json({ error: "full_name no puede estar vacio" });
    updates.push(`full_name = $${i++}`);
    params.push(value);
  }
  if (email !== undefined) {
    updates.push(`email = $${i++}`);
    params.push(email === null || email === "" ? null : String(email).trim());
  }
  if (phone !== undefined) {
    updates.push(`phone = $${i++}`);
    params.push(phone === null || phone === "" ? null : String(phone).trim());
  }
  if (document_id !== undefined) {
    updates.push(`document_id = $${i++}`);
    params.push(document_id ? normalizeDocumentId(document_id) : null);
  }
  if (tax_document_type !== undefined) {
    updates.push(`tax_document_type = $${i++}`);
    params.push(tax_document_type || 'sii');
  }
  if (notes !== undefined) {
    updates.push(`notes = $${i++}`);
    params.push(notes === null || notes === "" ? null : String(notes));
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No hay campos para actualizar" });
  }

  try {
    params.push(id);
    const result = await query(
      `UPDATE guests
       SET ${updates.join(", ")}
       WHERE id = $${i}
       RETURNING *`,
      params
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Huesped no encontrado" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id invalido" });
  }

  try {
    const result = await query("DELETE FROM guests WHERE id = $1 RETURNING id", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Huesped no encontrado" });
    }
    return res.json({ ok: true, id });
  } catch (error) {
    if (error?.code === "23503") {
      return res.status(409).json({ error: "No se puede eliminar el huesped porque tiene reservas asociadas" });
    }
    return next(error);
  }
});

export default router;
