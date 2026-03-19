import { Router } from "express";
import { query } from "../db/client.js";
import { buildVentasMonthlyPdfBuffer } from "../utils/pdf/ventasMonthlyPdf.js";
import { buildReservasMonthlyPdfBuffer } from "../utils/pdf/reservasMonthlyPdf.js";
import {
  loadReservasMonthlyFromStaging,
  loadReservasMonthlyNotes,
  loadVentasMonthlyStructuredData
} from "../utils/pdf/stagingData.js";

const router = Router();

function isDateOnly(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "").trim());
}

function getDateRange(req) {
  const today = new Date().toISOString().slice(0, 10);
  const from = isDateOnly(req.query.from) ? req.query.from : "2024-01-01";
  const to = isDateOnly(req.query.to) ? req.query.to : today;
  return [from, to];
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[\";\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function sendCsv(res, filename, header, rows) {
  const lines = [];
  lines.push(header.map(csvEscape).join(";"));
  for (const row of rows) {
    lines.push(row.map(csvEscape).join(";"));
  }
  const csv = lines.join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csv);
}

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const SOURCE_MAP = {
  web: "R",
  phone: "C",
  walkin: "C",
  booking: "booking",
  airbnb: "airbnb",
  other: "other"
};

function mapReservationEstado(leadStage, status) {
  const stage = String(leadStage || "").trim();
  if (stage === "lead_new" || stage === "quoted") return "draft";
  if (stage === "pending_deposit") return "pending_deposit";
  if (stage === "confirmed") return "confirmed";
  if (stage === "completed") return "completed";
  if (stage === "cancelled") return "cancelled";
  const st = String(status || "").trim();
  if (st === "pending") return "pending_deposit";
  if (st === "confirmed") return "confirmed";
  if (st === "completed") return "completed";
  if (st === "cancelled") return "cancelled";
  return st || stage || "";
}

router.get("/sales", async (req, res, next) => {
  try {
    const [from, to] = getDateRange(req);
    const result = await query(
      `SELECT id, sale_date, category, amount, payment_method, reservation_id, description
       FROM sales
       WHERE sale_date >= $1 AND sale_date <= $2
       ORDER BY sale_date DESC, id DESC`,
      [from, to]
    );
    const rows = result.rows.map((r) => [
      r.id,
      r.sale_date?.toISOString?.().slice(0, 10) || r.sale_date,
      r.category,
      r.amount,
      r.payment_method,
      r.reservation_id,
      r.description
    ]);
    sendCsv(res, "ventas.csv", ["id", "fecha", "categoria", "monto", "medio_pago", "reserva_id", "descripcion"], rows);
  } catch (error) {
    next(error);
  }
});

router.get("/expenses", async (req, res, next) => {
  try {
    const [from, to] = getDateRange(req);
    const result = await query(
      `SELECT id, expense_date, category, amount, payment_method, supplier, description
       FROM expenses
       WHERE expense_date >= $1 AND expense_date <= $2
       ORDER BY expense_date DESC, id DESC`,
      [from, to]
    );
    const rows = result.rows.map((r) => [
      r.id,
      r.expense_date?.toISOString?.().slice(0, 10) || r.expense_date,
      r.category,
      r.amount,
      r.payment_method,
      r.supplier,
      r.description
    ]);
    sendCsv(
      res,
      "gastos.csv",
      ["id", "fecha", "categoria", "monto", "medio_pago", "proveedor", "descripcion"],
      rows
    );
  } catch (error) {
    next(error);
  }
});

router.get("/guests", async (req, res, next) => {
  try {
    const result = await query(
      `SELECT
         g.id,
         g.full_name,
         g.document_id,
         g.email,
         g.phone,
         g.created_at,
         latest_reservation.check_in,
         latest_reservation.check_out,
         latest_reservation.status AS reservation_status,
         latest_reservation.total_amount AS reservation_total_amount
       FROM guests g
       LEFT JOIN LATERAL (
         SELECT r.*
         FROM reservations r
         WHERE r.guest_id = g.id
         ORDER BY r.check_in DESC, r.id DESC
         LIMIT 1
       ) latest_reservation ON TRUE
       ORDER BY g.created_at DESC`
    );
    const rows = result.rows.map((r) => [
      r.id,
      r.full_name,
      r.document_id,
      r.email,
      r.phone,
      r.created_at?.toISOString?.() || r.created_at,
      r.check_in?.toISOString?.().slice(0, 10) || r.check_in,
      r.check_out?.toISOString?.().slice(0, 10) || r.check_out,
      r.reservation_status,
      r.reservation_total_amount
    ]);
    sendCsv(
      res,
      "huespedes.csv",
      [
        "id",
        "nombre_completo",
        "documento",
        "email",
        "telefono",
        "creado_en",
        "ultima_reserva_check_in",
        "ultima_reserva_check_out",
        "ultima_reserva_estado",
        "ultima_reserva_monto"
      ],
      rows
    );
  } catch (error) {
    next(error);
  }
});

router.get("/reservations-upcoming", async (req, res, next) => {
  try {
    const daysParam = Number(req.query.days);
    const days = Number.isInteger(daysParam) && daysParam > 0 && daysParam <= 60 ? daysParam : 14;
    const result = await query(
      `SELECT
         r.id,
         g.full_name AS guest_name,
         r.check_in,
         r.check_out,
         r.guests_count,
         r.total_amount,
         c.name AS cabin_name
       FROM reservations r
       JOIN guests g ON g.id = r.guest_id
       LEFT JOIN cabins c ON c.id = r.cabin_id
       WHERE r.status IN ('pending', 'confirmed')
         AND (r.check_in BETWEEN CURRENT_DATE AND CURRENT_DATE + $1 * INTERVAL '1 day'
              OR r.check_out BETWEEN CURRENT_DATE AND CURRENT_DATE + $1 * INTERVAL '1 day')
       ORDER BY r.check_in, r.check_out, r.id`,
      [days]
    );
    const rows = result.rows.map((r) => {
      const checkIn = r.check_in;
      const checkOut = r.check_out;
      const nights =
        checkIn && checkOut
          ? Math.round((checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000))
          : null;
      return [
        r.id,
        r.guest_name,
        r.cabin_name,
        checkIn?.toISOString?.().slice(0, 10) || checkIn,
        checkOut?.toISOString?.().slice(0, 10) || checkOut,
        nights,
        r.guests_count,
        r.total_amount
      ];
    });
    sendCsv(
      res,
      "reservas_proximas.csv",
      ["id", "huesped", "cabana", "check_in", "check_out", "noches", "huespedes", "monto_total"],
      rows
    );
  } catch (error) {
    next(error);
  }
});

// Contrato v1: reservas.csv (1 fila = 1 estadía)
router.get("/reservas.csv", async (req, res, next) => {
  try {
    const result = await query(
      `SELECT
         r.id,
         g.full_name AS guest_name,
         c.name AS cabin_name,
         r.source,
         r.check_in,
         r.check_out,
         r.guests_count,
         c.nightly_rate,
         r.total_amount AS base_total,
         r.lead_stage,
         r.status,
         r.notes,
         COALESCE(SUM(CASE WHEN s.category = 'suplemento' THEN s.amount ELSE 0 END), 0) AS suplemento,
         COALESCE(SUM(CASE WHEN s.category = 'limpieza' THEN s.amount ELSE 0 END), 0) AS limpieza,
         doc.document_type,
         doc.status AS document_status
       FROM reservations r
       JOIN guests g ON g.id = r.guest_id
       LEFT JOIN cabins c ON c.id = r.cabin_id
       LEFT JOIN sales s ON s.reservation_id = r.id
       LEFT JOIN LATERAL (
         SELECT d.document_type, d.status
         FROM documents d
         WHERE d.reservation_id = r.id
         ORDER BY CASE WHEN d.status = 'issued' THEN 0 ELSE 1 END,
                  d.issue_date DESC,
                  d.id DESC
         LIMIT 1
       ) doc ON TRUE
       GROUP BY
         r.id,
         g.full_name,
         c.name,
         c.nightly_rate,
         r.source,
         r.check_in,
         r.check_out,
         r.guests_count,
         r.total_amount,
         r.lead_stage,
         r.status,
         r.notes,
         doc.document_type,
         doc.status
       ORDER BY r.check_in DESC, r.id DESC`
    );

    const rows = result.rows.map((r) => {
      const checkIn = toDate(r.check_in);
      const checkOut = toDate(r.check_out);
      const nights =
        checkIn && checkOut
          ? Math.round((checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000))
          : 0;
      const suplemento = Number(r.suplemento || 0);
      const limpieza = Number(r.limpieza || 0);
      const baseTotal = Number(r.base_total || 0);
      const totalEstadia = baseTotal + suplemento + limpieza;
      const canal = SOURCE_MAP[r.source] || (r.source || "");
      const estado = mapReservationEstado(r.lead_stage, r.status);

      return [
        r.id, // reserva_id
        r.guest_name, // huesped_nombre
        r.cabin_name || "", // unidad
        canal, // canal
        checkIn ? checkIn.toISOString().slice(0, 10) : "", // check_in
        checkOut ? checkOut.toISOString().slice(0, 10) : "", // check_out
        nights, // noches
        r.guests_count || 0, // pax_total
        r.nightly_rate != null ? Number(r.nightly_rate) : "", // tarifa_noche
        suplemento, // suplemento
        limpieza, // limpieza
        totalEstadia, // total_estadia
        r.document_type || "", // documento_tipo
        r.document_status || "", // documento_estado
        estado, // estado
        r.notes || "" // notas
      ];
    });

    sendCsv(
      res,
      "reservas.csv",
      [
        "reserva_id",
        "huesped_nombre",
        "unidad",
        "canal",
        "check_in",
        "check_out",
        "noches",
        "pax_total",
        "tarifa_noche",
        "suplemento",
        "limpieza",
        "total_estadia",
        "documento_tipo",
        "documento_estado",
        "estado",
        "notas"
      ],
      rows
    );
  } catch (error) {
    next(error);
  }
});

// Contrato v1: cobros.csv (ventas / pagos por reserva)
router.get("/cobros.csv", async (req, res, next) => {
  try {
    const [from, to] = getDateRange(req);
    const result = await query(
      `SELECT id, reservation_id, sale_date, amount, payment_method, description
       FROM sales
       WHERE sale_date >= $1 AND sale_date <= $2
       ORDER BY sale_date DESC, id DESC`,
      [from, to]
    );
    const rows = result.rows.map((r) => [
      r.id, // pago_id
      r.reservation_id, // reserva_id
      r.sale_date ? toDate(r.sale_date).toISOString().slice(0, 10) : "", // fecha
      Number(r.amount || 0), // monto
      r.payment_method || "", // medio
      r.description || "" // descripcion
    ]);
    sendCsv(
      res,
      "cobros.csv",
      ["pago_id", "reserva_id", "fecha", "monto", "medio", "descripcion"],
      rows
    );
  } catch (error) {
    next(error);
  }
});

// Contrato v1: gastos.csv (1 fila = 1 gasto)
router.get("/gastos.csv", async (req, res, next) => {
  try {
    const [from, to] = getDateRange(req);
    const result = await query(
      `SELECT id, expense_date, category, amount, payment_method, supplier, description
       FROM expenses
       WHERE expense_date >= $1 AND expense_date <= $2
       ORDER BY expense_date DESC, id DESC`,
      [from, to]
    );
    const rows = result.rows.map((r) => [
      r.id, // gasto_id
      r.expense_date ? toDate(r.expense_date).toISOString().slice(0, 10) : "", // fecha
      r.category || "", // categoria
      "", // unidad (no modelado aún)
      Number(r.amount || 0), // monto
      r.payment_method || "", // medio
      r.supplier || "", // proveedor
      r.description || "" // descripcion
    ]);
    sendCsv(
      res,
      "gastos.csv",
      ["gasto_id", "fecha", "categoria", "unidad", "monto", "medio", "proveedor", "descripcion"],
      rows
    );
  } catch (error) {
    next(error);
  }
});

function parseIntParam(value, { min, max }) {
  const n = Number(value);
  if (!Number.isInteger(n)) return null;
  if (min != null && n < min) return null;
  if (max != null && n > max) return null;
  return n;
}

router.get("/ventas.pdf", async (req, res, next) => {
  try {
    const year = parseIntParam(req.query.year, { min: 2000, max: 2100 });
    const month = parseIntParam(req.query.month, { min: 1, max: 12 });
    if (!year || !month) return res.status(400).json({ error: "year y month son requeridos (YYYY, 1-12)" });

    const staging = await loadVentasMonthlyStructuredData({ year, month });

    let rows = staging?.rows || [];
    let totals = staging?.totals || null;
    let showAbonos = Boolean(staging?.show_abonos);

    if (!staging) {
      const from = `${year}-${String(month).padStart(2, "0")}-01`;
      const to = `${year}-${String(month).padStart(2, "0")}-31`;
      const sales = await query(
        `SELECT s.amount, s.description, g.full_name AS guest_name
         FROM sales s
         LEFT JOIN reservations r ON r.id = s.reservation_id
         LEFT JOIN guests g ON g.id = r.guest_id
         WHERE s.sale_date >= $1 AND s.sale_date <= $2
         ORDER BY s.sale_date ASC, s.id ASC`,
        [from, to]
      );

      rows = [];
      for (let i = 0; i < 24; i += 1) {
        const sale = sales.rows[i];
        if (!sale) {
          rows.push({
            row_no: i + 1,
            guest_name: "",
            r_or_c: "",
            product_code: "",
            pax: 0,
            pax_ad: 0,
            nights: 0,
            nightly_price: null,
            cleaning_supplement: null,
            total_per_night: null,
            total_stay: 0,
            utility: null,
            amount_resolved: 0,
            abono: null,
            boletas: null,
            notes: null,
            is_placeholder: true
          });
          continue;
        }

        const amount = Number(sale.amount || 0);
        rows.push({
          row_no: i + 1,
          guest_name: sale.guest_name || "",
          r_or_c: "",
          product_code: "",
          pax: null,
          pax_ad: null,
          nights: null,
          nightly_price: null,
          cleaning_supplement: null,
          total_per_night: null,
          total_stay: amount,
          utility: amount,
          amount_resolved: amount,
          abono: null,
          boletas: sale.description || null,
          notes: sale.description || null,
          is_placeholder: false
        });
      }

      const totalAmount = rows.reduce((acc, row) => acc + Number(row.amount_resolved || 0), 0);
      totals = { total_amount: totalAmount, total_noches_left: null, total_noches_right: null };
      showAbonos = false;
    }

    const pdf = await buildVentasMonthlyPdfBuffer({ year, month, rows, totals, showAbonos });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Ventas_${year}_${String(month).padStart(2, "0")}.pdf"`);
    return res.send(pdf);
  } catch (error) {
    return next(error);
  }
});

router.get("/reservas.pdf", async (req, res, next) => {
  try {
    const year = parseIntParam(req.query.year, { min: 2000, max: 2100 });
    const month = parseIntParam(req.query.month, { min: 1, max: 12 });
    if (!year || !month) return res.status(400).json({ error: "year y month son requeridos (YYYY, 1-12)" });

    let dayEntries = loadReservasMonthlyFromStaging({ year, month })?.dayEntries || null;
    if (!dayEntries) {
      const from = `${year}-${String(month).padStart(2, "0")}-01`;
      const to = `${year}-${String(month).padStart(2, "0")}-${String(new Date(year, month, 0).getDate()).padStart(2, "0")}`;

      const r = await query(
        `SELECT g.full_name, r.guests_count, r.check_in, r.check_out
         FROM reservations r
         JOIN guests g ON g.id = r.guest_id
         WHERE r.check_in <= $2::date AND r.check_out >= $1::date
           AND date_trunc('month', r.check_in) <= date_trunc('month', $2::date)
           AND date_trunc('month', r.check_out) >= date_trunc('month', $1::date)
         ORDER BY r.check_in ASC, r.id ASC`,
        [from, to]
      );

      const dayMap = new Map();
      const start = new Date(from + "T00:00:00Z");
      const end = new Date(to + "T00:00:00Z");
      for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
        const key = d.toISOString().slice(0, 10);
        dayMap.set(key, []);
      }

      for (const row of r.rows) {
        const name = String(row.full_name || "").toUpperCase();
        const pax = Number(row.guests_count || 1);
        const ci = row.check_in?.toISOString?.().slice(0, 10);
        const co = row.check_out?.toISOString?.().slice(0, 10);
        if (!ci || !co) continue;
        const cur = new Date(ci + "T00:00:00Z");
        const out = new Date(co + "T00:00:00Z");
        for (let dd = new Date(cur); dd < out; dd.setUTCDate(dd.getUTCDate() + 1)) {
          const key = dd.toISOString().slice(0, 10);
          if (!dayMap.has(key)) continue;
          dayMap.get(key).push({ name, pax });
        }
      }

      dayEntries = [...dayMap.entries()].map(([date, entries]) => ({ date, entries }));
    }

    const notes = await loadReservasMonthlyNotes({ year, month });
    const pdf = await buildReservasMonthlyPdfBuffer({ year, month, dayEntries, notes });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Reservas_${year}_${String(month).padStart(2, "0")}.pdf"`);
    return res.send(pdf);
  } catch (error) {
    return next(error);
  }
});

export default router;
