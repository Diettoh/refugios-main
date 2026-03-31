import { Router } from "express";
import { query } from "../db/client.js";

const router = Router();
const PAYMENT_METHODS = new Set(["cash", "card", "transfer", "mercadopago", "other"]);
const DEFAULT_EXPENSE_CATEGORIES = [
  "Gas",
  "Aseo Caro",
  "Booking",
  "Aseo Cathy",
  "Hamacas",
  "Piso Gym",
  "Pintura Gym",
  "Pintada Gym",
  "Espejos Gym",
  "Reparacion Refri",
  "Etico Turismo",
  "Frontel",
  "Imposiciones",
  "Contribuciones",
  "Aseo Dani",
  "Pago Proyecto Sanitario",
  "Sueldo GD",
  "Pelets",
  "Guardado Pelets",
  "Lavado Sabanas",
  "Materiales Estacionamiento",
  "Ripio",
  "Arriendo Bolo",
  "Carlos Mella Estacionamiento",
  "Comision Cta Cte",
  "Previred"
];

const defaultCategoryMap = new Map(
  DEFAULT_EXPENSE_CATEGORIES.map((label) => [normalizeCategoryKey(label), label])
);

function isDateOnly(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "").trim());
}

function isMonthOnly(value) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(String(value || "").trim());
}

function nonEmptyString(value) {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  return text || null;
}

function parseNumber(value) {
  if (value === "" || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseMonthNumber(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 12) return null;
  return String(parsed).padStart(2, "0");
}

function parseYearNumber(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1900 || parsed > 2300) return null;
  return parsed;
}

function normalizeCategoryKey(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function canonicalCategoryLabel(value) {
  const cleaned = nonEmptyString(value);
  if (!cleaned) return null;
  const key = normalizeCategoryKey(cleaned);
  return defaultCategoryMap.get(key) || cleaned;
}

function buildCategoryCatalog(rawValues = []) {
  const categoryMap = new Map(defaultCategoryMap);
  for (const raw of rawValues) {
    const normalized = canonicalCategoryLabel(raw);
    if (!normalized) continue;
    categoryMap.set(normalizeCategoryKey(normalized), normalized);
  }
  return [...categoryMap.entries()]
    .sort((a, b) => a[1].localeCompare(b[1], "es", { sensitivity: "base" }))
    .map(([value, label]) => ({ value, label }));
}

router.get("/meta", async (_req, res, next) => {
  try {
    const [categories, paymentMethods, suppliers] = await Promise.all([
      query(
        `SELECT DISTINCT trim(category) AS value
         FROM expenses
         WHERE category IS NOT NULL AND trim(category) <> ''
         ORDER BY value`
      ),
      query(
        `SELECT DISTINCT payment_method AS value
         FROM expenses
         WHERE payment_method IS NOT NULL AND trim(payment_method) <> ''
         ORDER BY value`
      ),
      query(
        `SELECT DISTINCT trim(supplier) AS value
         FROM expenses
         WHERE supplier IS NOT NULL AND trim(supplier) <> ''
         ORDER BY value`
      )
    ]);

    const categoryOptions = buildCategoryCatalog(categories.rows.map((row) => row.value));
    const categoryLabels = Object.fromEntries(categoryOptions.map((opt) => [opt.value, opt.label]));

    return res.json({
      categories: categoryOptions.map((opt) => opt.value),
      category_options: categoryOptions,
      category_labels: categoryLabels,
      payment_methods: paymentMethods.rows.map((row) => row.value),
      suppliers: suppliers.rows.map((row) => row.value)
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
    if (from) where.push(`e.expense_date >= ${addParam(from)}::date`);
    if (to) where.push(`e.expense_date <= ${addParam(to)}::date`);

    let monthKey = null;
    const monthRaw = String(req.query.month || "").trim();
    if (isMonthOnly(monthRaw)) {
      monthKey = monthRaw;
    } else {
      const monthOnly = parseMonthNumber(monthRaw);
      const yearOnly = parseYearNumber(req.query.year);
      if (monthOnly && yearOnly != null) monthKey = `${yearOnly}-${monthOnly}`;
    }
    if (monthKey) {
      where.push(`to_char(e.expense_date, 'YYYY-MM') = ${addParam(monthKey)}`);
    } else {
      const yearOnly = parseYearNumber(req.query.year);
      if (yearOnly != null) where.push(`EXTRACT(YEAR FROM e.expense_date) = ${addParam(yearOnly)}`);
    }

    const category = canonicalCategoryLabel(req.query.category);
    if (category) {
      where.push(
        `lower(regexp_replace(trim(e.category), '\\s+', ' ', 'g')) = ${addParam(normalizeCategoryKey(category))}`
      );
    }

    const paymentMethod = nonEmptyString(req.query.payment_method);
    if (paymentMethod) where.push(`e.payment_method = ${addParam(paymentMethod)}`);

    const supplier = nonEmptyString(req.query.supplier);
    if (supplier) where.push(`e.supplier ILIKE ${addParam(`%${supplier}%`)}`);

    const minAmount = parseNumber(req.query.min_amount);
    if (minAmount != null) where.push(`e.amount >= ${addParam(minAmount)}`);

    const maxAmount = parseNumber(req.query.max_amount);
    if (maxAmount != null) where.push(`e.amount <= ${addParam(maxAmount)}`);

    const text = nonEmptyString(req.query.q || req.query.search || req.query.description);
    if (text) {
      const pattern = addParam(`%${text}%`);
      where.push(`(e.category ILIKE ${pattern} OR COALESCE(e.supplier, '') ILIKE ${pattern} OR COALESCE(e.description, '') ILIKE ${pattern})`);
    }

    const result = await query(
      `SELECT e.*
       FROM expenses e
       ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
       ORDER BY e.expense_date DESC, e.id DESC`,
      params
    );
    return res.json(result.rows);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const {
      category,
      amount,
      payment_method,
      expense_date,
      expense_month = null,
      supplier = null,
      description = null
    } = req.body;

    const normalizedCategory = canonicalCategoryLabel(category);
    const normalizedAmount = parseNumber(amount);
    const normalizedPaymentMethod = nonEmptyString(payment_method);
    const normalizedSupplier = nonEmptyString(supplier);
    const normalizedDescription = nonEmptyString(description);
    const normalizedExpenseMonth = isMonthOnly(expense_month) ? expense_month : null;
    const normalizedExpenseDate = isDateOnly(expense_date)
      ? expense_date
      : normalizedExpenseMonth
        ? `${normalizedExpenseMonth}-01`
        : null;

    if (!normalizedCategory || normalizedAmount == null || !normalizedPaymentMethod || !normalizedExpenseDate) {
      return res.status(400).json({
        error: "category, amount, payment_method y expense_date (o expense_month) son requeridos"
      });
    }
    if (normalizedAmount < 0) {
      return res.status(400).json({ error: "amount debe ser mayor o igual a 0" });
    }
    if (!PAYMENT_METHODS.has(normalizedPaymentMethod)) {
      return res.status(400).json({ error: "payment_method invalido" });
    }

    const result = await query(
      `INSERT INTO expenses (category, amount, payment_method, expense_date, supplier, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        normalizedCategory,
        normalizedAmount,
        normalizedPaymentMethod,
        normalizedExpenseDate,
        normalizedSupplier,
        normalizedDescription
      ]
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

  try {
    const {
      category,
      amount,
      payment_method,
      expense_date,
      expense_month,
      supplier,
      description
    } = req.body || {};

    const updates = [];
    const params = [];
    let i = 1;
    const add = (sql, value) => {
      updates.push(sql.replace("?", `$${i++}`));
      params.push(value);
    };

    if (category !== undefined) {
      const normalizedCategory = canonicalCategoryLabel(category);
      if (!normalizedCategory) return res.status(400).json({ error: "category invalida" });
      add("category = ?", normalizedCategory);
    }

    if (amount !== undefined) {
      const normalizedAmount = parseNumber(amount);
      if (normalizedAmount == null) return res.status(400).json({ error: "amount invalido" });
      if (normalizedAmount < 0) return res.status(400).json({ error: "amount debe ser mayor o igual a 0" });
      add("amount = ?", normalizedAmount);
    }

    if (payment_method !== undefined) {
      const normalizedPaymentMethod = nonEmptyString(payment_method);
      if (!normalizedPaymentMethod) return res.status(400).json({ error: "payment_method es requerido" });
      if (!PAYMENT_METHODS.has(normalizedPaymentMethod)) {
        return res.status(400).json({ error: "payment_method invalido" });
      }
      add("payment_method = ?", normalizedPaymentMethod);
    }

    if (expense_month !== undefined || expense_date !== undefined) {
      const normalizedExpenseMonth = isMonthOnly(expense_month) ? expense_month : null;
      const normalizedExpenseDate = isDateOnly(expense_date)
        ? expense_date
        : normalizedExpenseMonth
          ? `${normalizedExpenseMonth}-01`
          : null;
      if (!normalizedExpenseDate) {
        return res.status(400).json({ error: "expense_date o expense_month invalido" });
      }
      add("expense_date = ?", normalizedExpenseDate);
    }

    if (supplier !== undefined) {
      add("supplier = ?", nonEmptyString(supplier));
    }

    if (description !== undefined) {
      add("description = ?", nonEmptyString(description));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    params.push(id);
    const result = await query(
      `UPDATE expenses
       SET ${updates.join(", ")}
       WHERE id = $${i}
       RETURNING *`,
      params
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Gasto no encontrado" });
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
    const result = await query("DELETE FROM expenses WHERE id = $1 RETURNING id", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Gasto no encontrado" });
    }
    return res.json({ ok: true, id });
  } catch (error) {
    return next(error);
  }
});

export default router;
