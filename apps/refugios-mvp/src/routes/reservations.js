import { Router } from "express";
import { query } from "../db/client.js";
import { notifyReservationCreatedToTrello } from "../utils/trelloBridge.js";

const router = Router();
const DEFAULT_TOTAL_CABINS = 6;
const LEAD_STAGES = new Set(["lead_new", "quoted", "pending_deposit", "confirmed", "completed", "cancelled"]);
const SEASON_TYPES = new Set(["alta", "baja", "temporada", "permanente"]);
const RESERVATION_DOC_TYPES = new Set(["boleta", "factura", "booking", "ninguno"]);
const RESERVATION_SOURCES = new Set(["booking", "airbnb", "web", "direct", "other"]);
const PAYMENT_METHODS = new Set(["cash", "card", "transfer", "mercadopago", "other"]);
const CHANNEL_PAYMENT_MAP = {
  transfer: { source: "direct", payment_method: "transfer" },
  web: { source: "web", payment_method: "other" },
  airbnb: { source: "airbnb", payment_method: "other" },
  booking: { source: "booking", payment_method: "other" }
};

function parseTotalCabins() {
  const value = Number(process.env.TOTAL_CABINS || DEFAULT_TOTAL_CABINS);
  if (!Number.isInteger(value) || value <= 0) return DEFAULT_TOTAL_CABINS;
  return value;
}

function isDateOnly(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "").trim());
}

function nonEmptyString(value) {
  const text = String(value || "").trim();
  return text || null;
}

function isTimeOnly(value) {
  if (value == null || value === "") return true;
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(String(value).trim());
}

function isDateTimeValue(value) {
  if (value == null || value === "") return true;
  const raw = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)?$/.test(raw)) return false;
  return Number.isFinite(Date.parse(raw));
}

function normalizeLeadStage(stage, status) {
  if (stage && LEAD_STAGES.has(stage)) return stage;
  if (status === "cancelled") return "cancelled";
  if (status === "completed") return "completed";
  if (status === "pending") return "pending_deposit";
  if (status === "confirmed") return "confirmed";
  return "lead_new";
}

function statusFromLeadStage(leadStage) {
  if (leadStage === "cancelled") return "cancelled";
  if (leadStage === "completed") return "completed";
  if (leadStage === "confirmed") return "confirmed";
  return "pending";
}

async function syncReservationSales({
  reservationId,
  lodgingAmount,
  additionalCharge,
  paymentMethod,
  saleDate,
  cabinName,
  guestName,
  nights,
  notes
}) {
  const normalizedLodgingAmount = Math.max(0, Math.round(Number(lodgingAmount || 0)));
  const normalizedAdditionalCharge = Math.max(0, Math.round(Number(additionalCharge || 0)));
  const normalizedPaymentMethod = nonEmptyString(paymentMethod) || "other";
  const normalizedSaleDate = nonEmptyString(saleDate);
  const normalizedCabinName = nonEmptyString(cabinName) || "Alojamiento";
  const normalizedGuestName = nonEmptyString(guestName) || `Reserva #${reservationId}`;
  const normalizedNights = Math.max(0, Math.round(Number(nights || 0)));
  const normalizedNotes = nonEmptyString(notes);

  const lodgingDescription = `Arriendo ${normalizedCabinName} | ${normalizedGuestName} | ${normalizedNights} noches`;
  const supplementDescription = normalizedNotes
    ? `Ajuste monto pactado / adicional: ${normalizedNotes}`
    : `Ajuste monto pactado reserva #${reservationId}`;

  const upsertSale = async ({ category, amount, description }) => {
    const existing = await query(
      `SELECT id
       FROM sales
       WHERE reservation_id = $1
         AND category = $2
       ORDER BY id ASC
       LIMIT 1`,
      [reservationId, category]
    );

    if (amount <= 0) {
      if (existing.rowCount > 0) {
        await query("DELETE FROM sales WHERE id = $1", [existing.rows[0].id]);
      }
      return;
    }

    if (existing.rowCount > 0) {
      await query(
        `UPDATE sales
         SET amount = $2,
             payment_method = $3,
             sale_date = $4,
             description = $5
         WHERE id = $1`,
        [existing.rows[0].id, amount, normalizedPaymentMethod, normalizedSaleDate, description]
      );
      return;
    }

    await query(
      `INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [reservationId, category, amount, normalizedPaymentMethod, normalizedSaleDate, description]
    );
  };

  await upsertSale({
    category: "lodging",
    amount: normalizedLodgingAmount,
    description: lodgingDescription
  });

  await upsertSale({
    category: "suplemento",
    amount: normalizedAdditionalCharge,
    description: supplementDescription
  });
}

router.get("/", async (req, res, next) => {
  try {
    const from = isDateOnly(req.query.from) ? req.query.from : null;
    const to = isDateOnly(req.query.to) ? req.query.to : null;

    const where = [];
    const params = [];
    const addParam = (value) => {
      params.push(value);
      return `$${params.length}`;
    };

    // Rango principal por traslape (solo si se recibe período).
    if (from && to) {
      where.push(`r.check_in <= ${addParam(to)}::date AND r.check_out >= ${addParam(from)}::date`);
    } else if (from) {
      where.push(`r.check_out >= ${addParam(from)}::date`);
    } else if (to) {
      where.push(`r.check_in <= ${addParam(to)}::date`);
    }

    const checkInFrom = isDateOnly(req.query.check_in_from) ? req.query.check_in_from : null;
    const checkInTo = isDateOnly(req.query.check_in_to) ? req.query.check_in_to : null;
    const checkOutFrom = isDateOnly(req.query.check_out_from) ? req.query.check_out_from : null;
    const checkOutTo = isDateOnly(req.query.check_out_to) ? req.query.check_out_to : null;

    if (checkInFrom) where.push(`r.check_in >= ${addParam(checkInFrom)}::date`);
    if (checkInTo) where.push(`r.check_in <= ${addParam(checkInTo)}::date`);
    if (checkOutFrom) where.push(`r.check_out >= ${addParam(checkOutFrom)}::date`);
    if (checkOutTo) where.push(`r.check_out <= ${addParam(checkOutTo)}::date`);

    const source = nonEmptyString(req.query.source);
    if (source) where.push(`r.source = ${addParam(source)}`);

    const status = nonEmptyString(req.query.status);
    if (status) where.push(`r.status = ${addParam(status)}`);

    const leadStage = nonEmptyString(req.query.lead_stage);
    if (leadStage) where.push(`r.lead_stage = ${addParam(leadStage)}`);

    const guestId = Number(req.query.guest_id);
    if (Number.isInteger(guestId) && guestId > 0) {
      where.push(`r.guest_id = ${addParam(guestId)}`);
    }

    const reservationDocType = nonEmptyString(req.query.reservation_document_type);
    if (reservationDocType) where.push(`r.reservation_document_type = ${addParam(reservationDocType)}`);

    const guestName = nonEmptyString(req.query.guest_name || req.query.guest || req.query.q);
    if (guestName) where.push(`g.full_name ILIKE ${addParam(`%${guestName}%`)}`);

    const minNights = Number(req.query.min_nights);
    if (Number.isInteger(minNights) && minNights >= 0) {
      where.push(`GREATEST(0, (r.check_out - r.check_in))::int >= ${addParam(minNights)}`);
    }
    const maxNights = Number(req.query.max_nights);
    if (Number.isInteger(maxNights) && maxNights >= 0) {
      where.push(`GREATEST(0, (r.check_out - r.check_in))::int <= ${addParam(maxNights)}`);
    }

    const debtStatus = nonEmptyString(req.query.debt_status);
    if (debtStatus && ["pending", "partial", "paid"].includes(debtStatus)) {
      where.push(
        `(CASE
           WHEN COALESCE(sales_totals.paid_amount, 0) >= r.total_amount THEN 'paid'
           WHEN COALESCE(sales_totals.paid_amount, 0) > 0 THEN 'partial'
           ELSE 'pending'
         END) = ${addParam(debtStatus)}`
      );
    }

    const result = await query(
      `SELECT
         r.*,
         g.full_name AS guest_name,
         g.document_id AS guest_document,
         c.name AS cabin_name,
         c.nightly_rate AS cabin_nightly_rate,
         GREATEST(0, (r.check_out - r.check_in))::int AS nights,
         COALESCE(sales_totals.paid_amount, 0)::numeric(12,2) AS paid_amount,
         GREATEST(r.total_amount - COALESCE(sales_totals.paid_amount, 0), 0)::numeric(12,2) AS amount_due,
         CASE
           WHEN COALESCE(sales_totals.paid_amount, 0) >= r.total_amount THEN 'paid'
           WHEN COALESCE(sales_totals.paid_amount, 0) > 0 THEN 'partial'
           ELSE 'pending'
         END AS debt_status
       FROM reservations r
       JOIN guests g ON g.id = r.guest_id
       LEFT JOIN cabins c ON c.id = r.cabin_id
       LEFT JOIN (
         SELECT reservation_id, SUM(amount) AS paid_amount
         FROM sales
         WHERE reservation_id IS NOT NULL
         GROUP BY reservation_id
       ) sales_totals ON sales_totals.reservation_id = r.id
       ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
       ORDER BY r.check_in DESC, r.id DESC`,
      params
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/funnel", async (_req, res, next) => {
  try {
    const [byStage, bySource, dueSummary] = await Promise.all([
      query(
        `SELECT lead_stage, COUNT(*)::int AS count
         FROM reservations
         GROUP BY lead_stage`
      ),
      query(
        `SELECT source, COUNT(*)::int AS count
         FROM reservations
         WHERE lead_stage IN ('lead_new', 'quoted', 'pending_deposit', 'confirmed')
         GROUP BY source`
      ),
      query(
        `SELECT
           COUNT(*) FILTER (WHERE lead_stage IN ('lead_new', 'quoted', 'pending_deposit')
                            AND follow_up_at IS NOT NULL
                            AND follow_up_at < NOW())::int AS overdue,
           COUNT(*) FILTER (WHERE lead_stage IN ('lead_new', 'quoted', 'pending_deposit')
                            AND follow_up_at IS NOT NULL
                            AND follow_up_at >= NOW())::int AS scheduled,
           COUNT(*) FILTER (WHERE lead_stage IN ('lead_new', 'quoted', 'pending_deposit')
                            AND follow_up_at IS NULL)::int AS without_follow_up,
           COUNT(*) FILTER (WHERE lead_stage IN ('lead_new', 'quoted', 'pending_deposit', 'confirmed'))::int AS open_total
         FROM reservations`
      )
    ]);

    return res.json({
      by_stage: byStage.rows,
      by_source: bySource.rows,
      follow_up: dueSummary.rows[0] || { overdue: 0, scheduled: 0, without_follow_up: 0, open_total: 0 }
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let {
      guest_id,
      guest_name,       // Nuevo: para crear huésped al vuelo
      guest_document,   // Nuevo: para crear huésped al vuelo
      guest_email,      // Nuevo: opcional
      guest_phone,      // Nuevo: opcional
      source: rawSource = null,
      payment_method: rawPaymentMethod = null,
      channel_payment = null,
      status = "confirmed",
      lead_stage = null,
      check_in,
      check_out,
      check_in_time = null,
      checkout_time = null,
      follow_up_at = null,
      guests_count = 1,
      total_amount,
      nightly_rate = null,
      nights: nights_override = null,
      cleaning_supplement = null,
      season_type = null,
      reservation_document_type = null,
      notes = null,
      additional_charge = 0, // Nuevo: Cobro adicional
      cabin_id
    } = req.body;

    const parsedAdditionalCharge = additional_charge ? Number(additional_charge) : 0;
    if (parsedAdditionalCharge > 0 && (!notes || String(notes).trim().length === 0)) {
      return res.status(400).json({ error: "Debe dejar una nota explicando el cobro adicional." });
    }

    if (!check_in || !check_out || !cabin_id) {
      return res.status(400).json({ error: "Campos requeridos faltantes (fechas y cabaña)" });
    }

    // Lógica para obtener o crear el huésped
    let parsedGuestId = guest_id ? Number(guest_id) : null;
    const normalizedGuestName = nonEmptyString(guest_name);
    const normalizedGuestDocument = nonEmptyString(guest_document);
    
    if (!parsedGuestId) {
      if (!normalizedGuestName) {
        return res.status(400).json({
          error: "Debe proporcionar un guest_id existente o el nombre del nuevo huesped"
        });
      }

      const doc = normalizedGuestDocument;
      
      let existingGuest = { rowCount: 0 };
      if (doc) {
        existingGuest = await query("SELECT id FROM guests WHERE document_id = $1 LIMIT 1", [doc]);
      }
      
      if (existingGuest.rowCount > 0) {
        parsedGuestId = existingGuest.rows[0].id;
      } else {
        // Crear nuevo huésped
        const newGuest = await query(
          "INSERT INTO guests (full_name, document_id, email, phone) VALUES ($1, $2, $3, $4) RETURNING id",
          [normalizedGuestName, doc, guest_email || null, guest_phone || null]
        );
        parsedGuestId = newGuest.rows[0].id;
      }
    }

    const normalizedChannelPayment = nonEmptyString(channel_payment)?.toLowerCase() || null;
    const mappedChannel = normalizedChannelPayment ? CHANNEL_PAYMENT_MAP[normalizedChannelPayment] : null;
    const source = mappedChannel?.source || nonEmptyString(rawSource)?.toLowerCase() || null;
    const payment_method =
      mappedChannel?.payment_method || nonEmptyString(rawPaymentMethod)?.toLowerCase() || null;

    if (!source || !payment_method) {
      return res.status(400).json({ error: "source y payment_method son requeridos" });
    }
    if (!RESERVATION_SOURCES.has(source)) {
      return res.status(400).json({ error: "source invalido" });
    }
    if (!PAYMENT_METHODS.has(payment_method)) {
      return res.status(400).json({ error: "payment_method invalido" });
    }

    const parsedGuestsCount = Number(guests_count);
    const parsedCabinId = Number(cabin_id);

    if (parsedGuestId !== null && (!Number.isInteger(parsedGuestId) || parsedGuestId <= 0)) {
      return res.status(400).json({ error: "guest_id invalido" });
    }
    if (!Number.isInteger(parsedGuestsCount) || parsedGuestsCount <= 0) {
      return res.status(400).json({ error: "guests_count invalido" });
    }
    if (!Number.isInteger(parsedCabinId) || parsedCabinId <= 0) {
      return res.status(400).json({ error: "cabin_id invalido" });
    }
    if (!isDateOnly(check_in) || !isDateOnly(check_out)) {
      return res.status(400).json({ error: "check_in y check_out deben tener formato YYYY-MM-DD" });
    }
    if (!isTimeOnly(check_in_time)) {
      return res.status(400).json({ error: "check_in_time invalido. Usa formato HH:MM" });
    }
    if (!isTimeOnly(checkout_time)) {
      return res.status(400).json({ error: "checkout_time invalido. Usa formato HH:MM" });
    }
    if (!isDateTimeValue(follow_up_at)) {
      return res.status(400).json({ error: "follow_up_at invalido. Usa formato YYYY-MM-DDTHH:MM" });
    }
    if (check_in >= check_out) {
      return res.status(400).json({ error: "check_out debe ser posterior a check_in" });
    }
    const normalizedLeadStage = normalizeLeadStage(lead_stage, status);
    if (!LEAD_STAGES.has(normalizedLeadStage)) {
      return res.status(400).json({ error: "lead_stage invalido" });
    }
    const normalizedStatus = statusFromLeadStage(normalizedLeadStage);

    const overlap = await query(
      `SELECT id
       FROM reservations
       WHERE guest_id = $1
         AND status IN ('pending', 'confirmed')
         AND daterange(check_in, check_out, '[)') && daterange($2::date, $3::date, '[)')
       LIMIT 1`,
      [parsedGuestId, check_in, check_out]
    );
    if (overlap.rowCount > 0) {
      return res.status(409).json({ error: "Ya existe una reserva activa de este huésped en ese período" });
    }

    const totalCabins = parseTotalCabins();
    const occupancyConflict = await query(
      `SELECT night, taken
       FROM (
         SELECT requested.night::date AS night, COUNT(r.id)::int AS taken
         FROM generate_series($1::date, ($2::date - INTERVAL '1 day'), INTERVAL '1 day') AS requested(night)
         LEFT JOIN reservations r
           ON r.status IN ('pending', 'confirmed')
          AND daterange(r.check_in, r.check_out, '[)') @> requested.night::date
         GROUP BY requested.night
       ) per_night
       WHERE taken >= $3
       ORDER BY night
       LIMIT 1`,
      [check_in, check_out, totalCabins]
    );
    if (occupancyConflict.rowCount > 0) {
      const blockedNight = occupancyConflict.rows[0].night;
      return res.status(409).json({
        error: `Sin disponibilidad para la noche ${blockedNight} (capacidad ${totalCabins} cabañas).`
      });
    }

    const guestResult = await query(
      `SELECT full_name
       FROM guests
       WHERE id = $1
       LIMIT 1`,
      [parsedGuestId]
    );
    const guestName = String(guestResult.rows?.[0]?.full_name || `Huésped #${parsedGuestId}`);

    // Validar cabaña y calcular monto dinámico por noches
    const cabinResult = await query(
      `SELECT name, nightly_rate
       FROM cabins
       WHERE id = $1
       LIMIT 1`,
      [parsedCabinId]
    );
    if (cabinResult.rowCount === 0) {
      return res.status(400).json({ error: "Cabaña no encontrada" });
    }
    const cabinNightlyRate = Number(cabinResult.rows[0].nightly_rate);

    const nightsMs = new Date(check_out).getTime() - new Date(check_in).getTime();
    const stayNights = Math.round(nightsMs / (24 * 60 * 60 * 1000));
    if (!Number.isInteger(stayNights) || stayNights <= 0) {
      return res.status(400).json({ error: "Rango de fechas invalido para calcular noches" });
    }

    const providedNightlyRate = nightly_rate != null && nightly_rate !== "" ? Number(nightly_rate) : NaN;
    const hasExplicitNightlyRate = Number.isFinite(providedNightlyRate) && providedNightlyRate >= 0;
    const hasCabinNightlyRate = Number.isFinite(cabinNightlyRate) && cabinNightlyRate > 0;
    const finalNightlyRate = hasExplicitNightlyRate
      ? providedNightlyRate
      : hasCabinNightlyRate
        ? cabinNightlyRate
        : NaN;

    if (!Number.isFinite(finalNightlyRate) || finalNightlyRate < 0) {
      return res.status(400).json({
        error: "Falta tarifa por noche. Configúrala en Cabañas o ingrésala en la reserva."
      });
    }

    const providedNights = nights_override != null && nights_override !== "" ? Number(nights_override) : NaN;
    const finalNights =
      Number.isFinite(providedNights) && providedNights > 0 ? Math.round(providedNights) : stayNights;

    const computedTotalAmount = Math.round(finalNightlyRate * finalNights);
    let finalTotalAmount = computedTotalAmount + parsedAdditionalCharge;
    if (total_amount != null && total_amount !== "") {
      const providedTotal = Number(total_amount);
      if (Number.isFinite(providedTotal) && providedTotal > 0) {
        finalTotalAmount = Math.round(providedTotal) + parsedAdditionalCharge;
      }
    }

    // Evitar doble reserva en la misma cabaña
    const cabinConflict = await query(
      `SELECT id
       FROM reservations
       WHERE status IN ('pending', 'confirmed')
         AND cabin_id = $1
         AND daterange(check_in, check_out, '[)') && daterange($2::date, $3::date, '[)')
       LIMIT 1`,
      [parsedCabinId, check_in, check_out]
    );
    if (cabinConflict.rowCount > 0) {
      return res.status(409).json({ error: "La cabaña seleccionada ya esta reservada en esas fechas" });
    }

    const parsedCleaningSupplement =
      cleaning_supplement == null || cleaning_supplement === "" ? null : Number(cleaning_supplement);
    if (parsedCleaningSupplement != null) {
      if (!Number.isFinite(parsedCleaningSupplement) || parsedCleaningSupplement < 0) {
        return res.status(400).json({ error: "cleaning_supplement invalido" });
      }
    }

    const normalizedSeasonType = season_type == null || season_type === "" ? null : String(season_type).trim();
    if (normalizedSeasonType && !SEASON_TYPES.has(normalizedSeasonType)) {
      return res.status(400).json({ error: "season_type invalido" });
    }

    const normalizedReservationDocType =
      reservation_document_type == null || reservation_document_type === ""
        ? null
        : String(reservation_document_type).trim();
    if (normalizedReservationDocType && !RESERVATION_DOC_TYPES.has(normalizedReservationDocType)) {
      return res.status(400).json({ error: "reservation_document_type invalido" });
    }

    const result = await query(
      `INSERT INTO reservations (
         guest_id,
         cabin_id,
         source,
         payment_method,
         status,
         lead_stage,
         check_in,
         check_out,
         check_in_time,
         checkout_time,
         follow_up_at,
         guests_count,
         total_amount,
         nightly_rate,
         nights,
         cleaning_supplement,
         season_type,
         reservation_document_type,
         notes,
         additional_charge
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
       RETURNING *`,
      [
        parsedGuestId,
        parsedCabinId,
        source,
        payment_method,
        normalizedStatus,
        normalizedLeadStage,
        check_in,
        check_out,
        check_in_time || null,
        checkout_time || null,
        follow_up_at || null,
        parsedGuestsCount,
        finalTotalAmount,
        finalNightlyRate,
        finalNights,
        parsedCleaningSupplement,
        normalizedSeasonType,
        normalizedReservationDocType,
        notes,
        parsedAdditionalCharge
      ]
    );

    const newReservation = result.rows[0];

    // Auto-crear ventas asociadas a la reserva
    try {
      // 1. Venta por Alojamiento Base
      await query(
        `INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
         VALUES ($1, 'lodging', $2, $3, $4, $5)`,
        [
          newReservation.id,
          Math.max(finalTotalAmount - parsedAdditionalCharge, 0), // Respeta el monto pactado base
          payment_method,
          check_in,
          `Arriendo ${cabinResult.rows[0].name} | ${guestName} | ${finalNights} noches`
        ]
      );

      // 2. Venta por Cobro Adicional (si aplica)
      if (parsedAdditionalCharge > 0) {
        await query(
          `INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
           VALUES ($1, 'suplemento', $2, $3, $4, $5)`,
          [
            newReservation.id,
            parsedAdditionalCharge,
            payment_method,
            check_in,
            `Cobro Adicional: ${notes}` // Aquí guardamos la nota obligatoria
          ]
        );
      }
    } catch (saleErr) {
      console.error(`[reservations] Error al desglosar ventas para reserva #${newReservation.id}: ${saleErr.message}`);
    }

    try {
      await notifyReservationCreatedToTrello({
        reservation: newReservation,
        guestName
      });
    } catch (bridgeError) {
      console.error(`[trello-bridge] No se pudo sincronizar la reserva #${newReservation.id}: ${bridgeError.message}`);
    }

    res.status(201).json(newReservation);
  } catch (error) {
    console.error("[reservations] Error en POST /api/reservations:", {
      message: error.message,
      guest_id: req.body?.guest_id ?? null,
      guest_name: req.body?.guest_name ?? null,
      guest_document: req.body?.guest_document ?? null,
      cabin_id: req.body?.cabin_id ?? null,
      check_in: req.body?.check_in ?? null,
      check_out: req.body?.check_out ?? null
    });
    next(error);
  }
});

router.patch("/:id/stage", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id invalido" });
  }

  const { lead_stage, follow_up_at = null } = req.body || {};
  if (!LEAD_STAGES.has(lead_stage)) {
    return res.status(400).json({ error: "lead_stage invalido" });
  }
  if (!isDateTimeValue(follow_up_at)) {
    return res.status(400).json({ error: "follow_up_at invalido. Usa formato YYYY-MM-DDTHH:MM" });
  }

  try {
    const result = await query(
      `UPDATE reservations
       SET
         lead_stage = $2,
         status = $3,
         follow_up_at = $4
       WHERE id = $1
       RETURNING id, lead_stage, status, follow_up_at`,
      [id, lead_stage, statusFromLeadStage(lead_stage), follow_up_at || null]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    return res.json({ ok: true, reservation: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/release", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id invalido" });
  }

  try {
    const result = await query(
      `WITH released AS (
         UPDATE reservations
         SET
           lead_stage = 'completed',
           status = 'completed',
           check_out = CURRENT_DATE
         WHERE id = $1
           AND status IN ('pending', 'confirmed')
         RETURNING id, guest_id, check_in, check_out, status
       ),
       pending_checkout_expense AS (
         INSERT INTO expenses (category, amount, payment_method, expense_date, supplier, description)
         SELECT
           'Limpieza Checkout',
           0,
           'other',
           CURRENT_DATE,
           g.full_name,
           'Checkout reserva #' || r.id || ' pendiente: registrar limpieza y otros costos.'
         FROM released r
         LEFT JOIN guests g ON g.id = r.guest_id
         WHERE NOT EXISTS (
           SELECT 1
           FROM expenses e
           WHERE e.description = 'Checkout reserva #' || r.id || ' pendiente: registrar limpieza y otros costos.'
         )
         RETURNING id
       )
       SELECT
         r.*,
         (SELECT id FROM pending_checkout_expense LIMIT 1) AS checkout_expense_id
       FROM released r`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Reserva activa no encontrada para liberar" });
    }

    const row = result.rows[0];
    return res.json({
      ok: true,
      reservation: {
        id: row.id,
        guest_id: row.guest_id,
        check_in: row.check_in,
        check_out: row.check_out,
        status: row.status
      },
      checkout_expense_id: row.checkout_expense_id || null
    });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id invalido" });
  }

  const allowedFields = [
    "source",
    "payment_method",
    "lead_stage",
    "status",
    "check_in",
    "check_out",
    "check_in_time",
    "checkout_time",
    "follow_up_at",
    "guests_count",
    "total_amount",
    "nightly_rate",
    "nights",
    "cleaning_supplement",
    "season_type",
    "reservation_document_type",
    "notes",
    "additional_charge",
    "cabin_id"
  ];

  const updates = [];
  const params = [];

  try {
    for (const field of allowedFields) {
      if (!(field in (req.body || {}))) continue;

      let value = req.body[field];

      if (field === "guests_count" || field === "cabin_id" || field === "nights") {
        if (value === "" || value === null) value = null;
        if (value !== null) {
          const n = Number(value);
          if (!Number.isInteger(n) || n <= 0) {
            return res.status(400).json({ error: `${field} invalido` });
          }
          value = n;
        }
      }

      if (field === "total_amount" || field === "nightly_rate" || field === "cleaning_supplement" || field === "additional_charge") {
        if (value === "" || value === null) value = null;
        if (value !== null) {
          const n = Number(value);
          if (!Number.isFinite(n) || n < 0) {
            return res.status(400).json({ error: `${field} invalido` });
          }
          value = n;
        }
      }

      if (field === "check_in" || field === "check_out") {
        if (value === "" || value === null) value = null;
        if (value !== null && !isDateOnly(value)) {
          return res.status(400).json({ error: `${field} invalido. Usa formato YYYY-MM-DD` });
        }
      }

      if (field === "check_in_time" || field === "checkout_time") {
        if (value === "") value = null;
        if (!isTimeOnly(value)) {
          return res.status(400).json({ error: `${field} invalido. Usa formato HH:MM` });
        }
      }

      if (field === "follow_up_at") {
        if (value === "") value = null;
        if (!isDateTimeValue(value)) {
          return res.status(400).json({ error: "follow_up_at invalido. Usa formato YYYY-MM-DDTHH:MM" });
        }
      }

      if (field === "season_type") {
        if (value === "") value = null;
        if (value != null && !SEASON_TYPES.has(String(value))) {
          return res.status(400).json({ error: "season_type invalido" });
        }
      }

      if (field === "reservation_document_type") {
        if (value === "") value = null;
        if (value != null && !RESERVATION_DOC_TYPES.has(String(value))) {
          return res.status(400).json({ error: "reservation_document_type invalido" });
        }
      }

      if (field === "lead_stage") {
        if (value === "") value = null;
        if (value !== null && !LEAD_STAGES.has(String(value))) {
          return res.status(400).json({ error: "lead_stage invalido" });
        }
      }

      params.push(value);
      updates.push(`${field} = $${params.length}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "no hay campos para actualizar" });
    }

    const body = req.body || {};
    if ((body.check_in != null && body.check_in !== "") || (body.check_out != null && body.check_out !== "")) {
      const fromDb = await query(`SELECT check_in, check_out FROM reservations WHERE id = $1`, [id]);
      if (fromDb.rowCount === 0) return res.status(404).json({ error: "reserva no encontrada" });
      const nextCheckIn = body.check_in == null || body.check_in === "" ? fromDb.rows[0].check_in : body.check_in;
      const nextCheckOut = body.check_out == null || body.check_out === "" ? fromDb.rows[0].check_out : body.check_out;
      if (String(nextCheckIn) >= String(nextCheckOut)) {
        return res.status(400).json({ error: "check_out debe ser posterior a check_in" });
      }
    }

    params.push(id);
    const result = await query(
      `UPDATE reservations
       SET ${updates.join(", ")}
       WHERE id = $${params.length}
       RETURNING *`,
      params
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "reserva no encontrada" });
    }

    const updatedReservation = result.rows[0];
    try {
      const saleContext = await query(
        `SELECT
           r.id,
           r.check_in,
           r.total_amount,
           r.additional_charge,
           r.payment_method,
           GREATEST(0, (r.check_out - r.check_in))::int AS nights,
           r.notes,
           g.full_name AS guest_name,
           c.name AS cabin_name
         FROM reservations r
         LEFT JOIN guests g ON g.id = r.guest_id
         LEFT JOIN cabins c ON c.id = r.cabin_id
         WHERE r.id = $1
         LIMIT 1`,
        [id]
      );

      if (saleContext.rowCount > 0) {
        const saleRow = saleContext.rows[0];
        await syncReservationSales({
          reservationId: saleRow.id,
          lodgingAmount: Number(saleRow.total_amount || 0) - Number(saleRow.additional_charge || 0),
          additionalCharge: saleRow.additional_charge,
          paymentMethod: saleRow.payment_method,
          saleDate: saleRow.check_in,
          cabinName: saleRow.cabin_name,
          guestName: saleRow.guest_name,
          nights: saleRow.nights,
          notes: saleRow.notes
        });
      }
    } catch (saleErr) {
      console.error(`[reservations] Error al sincronizar ventas de la reserva #${id}: ${saleErr.message}`);
    }
    return res.json(updatedReservation);
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
    const result = await query("DELETE FROM reservations WHERE id = $1 RETURNING id", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    return res.json({ ok: true, id });
  } catch (error) {
    return next(error);
  }
});

export default router;
