import { Router } from "express";
import { query } from "../db/client.js";

const router = Router();
const MAX_IMAGES_PER_CABIN = 10;
const MAX_BASE64_LENGTH = 5 * 1024 * 1024;

/** GET /api/cabins — listar todas las cabañas con sus imágenes */
router.get("/", async (_req, res, next) => {
  try {
    const cabinsResult = await query(
      `SELECT id, name, description, sort_order, nightly_rate, short_code, color_hex, icon, size_category, max_guests, amenities, created_at, updated_at
       FROM cabins
       ORDER BY sort_order, id`
    );
    const imagesResult = await query(
      `SELECT id, cabin_id, image_data_base64, caption, sort_order
       FROM cabin_images
       ORDER BY cabin_id, sort_order, id`
    );
    const byCabin = new Map();
    for (const row of cabinsResult.rows) {
      byCabin.set(row.id, { ...row, images: [] });
    }
    for (const img of imagesResult.rows) {
      const cabin = byCabin.get(img.cabin_id);
      if (cabin) {
        cabin.images.push({
          id: img.id,
          image_data_base64: img.image_data_base64,
          caption: img.caption || null,
          sort_order: img.sort_order
        });
      }
    }
    const cabins = Array.from(byCabin.values());
    res.json({ cabins });
  } catch (error) {
    next(error);
  }
});

/** GET /api/cabins/images — compatibilidad: listado para disponibilidad (por sort_order) */
router.get("/images", async (_req, res, next) => {
  try {
    const result = await query(
      `SELECT c.id, c.name, c.sort_order, c.short_code, c.color_hex, c.icon,
              ci.id AS image_id, ci.image_data_base64, ci.caption, ci.sort_order AS img_sort
       FROM cabins c
       LEFT JOIN cabin_images ci ON ci.cabin_id = c.id
       ORDER BY c.sort_order, c.id, ci.sort_order, ci.id`
    );
    const byCabin = new Map();
    for (const row of result.rows) {
      if (!byCabin.has(row.id)) {
        byCabin.set(row.id, {
          id: row.id,
          name: row.name,
          sort_order: row.sort_order,
          short_code: row.short_code,
          color_hex: row.color_hex,
          icon: row.icon,
          size_category: row.size_category,
          max_guests: row.max_guests,
          amenities: row.amenities,
          images: []
        });
      }
      if (row.image_id) {
        byCabin.get(row.id).images.push({
          id: row.image_id,
          image_data_base64: row.image_data_base64,
          caption: row.caption || null,
          sort_order: row.img_sort
        });
      }
    }
    res.json({ cabins: Array.from(byCabin.values()).sort((a, b) => a.sort_order - b.sort_order) });
  } catch (error) {
    next(error);
  }
});

/** GET /api/cabins/:id — una cabaña con imágenes */
router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }
  try {
    const cabinResult = await query("SELECT * FROM cabins WHERE id = $1", [id]);
    if (cabinResult.rowCount === 0) {
      return res.status(404).json({ error: "Cabaña no encontrada" });
    }
    const cabin = cabinResult.rows[0];
    const imagesResult = await query(
      `SELECT id, image_data_base64, caption, sort_order
       FROM cabin_images WHERE cabin_id = $1 ORDER BY sort_order, id`,
      [id]
    );
    cabin.images = imagesResult.rows.map((r) => ({
      id: r.id,
      image_data_base64: r.image_data_base64,
      caption: r.caption || null,
      sort_order: r.sort_order
    }));
    res.json(cabin);
  } catch (error) {
    next(error);
  }
});

/** POST /api/cabins — crear cabaña */
router.post("/", async (req, res, next) => {
  const {
    name,
    description = null,
    sort_order = 0,
    nightly_rate = 0,
    short_code = null,
    color_hex = null,
    icon = null,
    size_category = null,
    max_guests = null,
    amenities = null
  } = req.body || {};
  if (!name || String(name).trim() === "") {
    return res.status(400).json({ error: "name es requerido" });
  }
  const nightlyRateNumber = Number(nightly_rate);
  if (!Number.isFinite(nightlyRateNumber) || nightlyRateNumber < 0) {
    return res.status(400).json({ error: "nightly_rate invalido" });
  }
  const trimmedShortCode = short_code != null ? String(short_code).trim() : null;
  const trimmedColorHex = color_hex != null ? String(color_hex).trim() : null;
  const normalizedSizeCategory = size_category && String(size_category).trim() !== "" ? String(size_category).trim() : "small";
  if (!["small", "large"].includes(normalizedSizeCategory)) {
    return res.status(400).json({ error: "size_category invalido. Usa: small o large" });
  }
  const maxGuestsNumber = max_guests != null ? Number(max_guests) : normalizedSizeCategory === "large" ? 8 : 4;
  if (!Number.isInteger(maxGuestsNumber) || maxGuestsNumber <= 0) {
    return res.status(400).json({ error: "max_guests invalido" });
  }
  const amenitiesArray =
    Array.isArray(amenities) && amenities.length > 0
      ? amenities.map((a) => String(a).trim()).filter(Boolean)
      : null;
  if (trimmedColorHex && !/^#[0-9A-Fa-f]{6}$/.test(trimmedColorHex)) {
    return res.status(400).json({ error: "color_hex invalido. Usa formato #RRGGBB" });
  }
  try {
    if (trimmedShortCode) {
      const exists = await query("SELECT 1 FROM cabins WHERE short_code = $1 LIMIT 1", [trimmedShortCode]);
      if (exists.rowCount > 0) {
        return res.status(400).json({ error: "short_code ya existe para otra cabaña" });
      }
    }
    const result = await query(
      `INSERT INTO cabins (name, description, sort_order, nightly_rate, short_code, color_hex, icon, size_category, max_guests, amenities, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       RETURNING *`,
      [
        String(name).trim(),
        description || null,
        Number(sort_order) || 0,
        nightlyRateNumber,
        trimmedShortCode,
        trimmedColorHex,
        icon || null,
        normalizedSizeCategory,
        maxGuestsNumber,
        amenitiesArray
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/** PATCH /api/cabins/:id — actualizar cabaña */
router.patch("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }
  const { name, description, sort_order, nightly_rate, short_code, color_hex, icon } = req.body || {};
  const updates = [];
  const params = [];
  let i = 1;
  if (name !== undefined) {
    if (String(name).trim() === "") {
      return res.status(400).json({ error: "name no puede estar vacío" });
    }
    updates.push(`name = $${i++}`);
    params.push(String(name).trim());
  }
  if (description !== undefined) {
    updates.push(`description = $${i++}`);
    params.push(description === null || description === "" ? null : String(description));
  }
  if (sort_order !== undefined) {
    updates.push(`sort_order = $${i++}`);
    params.push(Number(sort_order) || 0);
  }
  if (nightly_rate !== undefined) {
    const nightlyRateNumber = Number(nightly_rate);
    if (!Number.isFinite(nightlyRateNumber) || nightlyRateNumber < 0) {
      return res.status(400).json({ error: "nightly_rate invalido" });
    }
    updates.push(`nightly_rate = $${i++}`);
    params.push(nightlyRateNumber);
  }
  if (short_code !== undefined) {
    const trimmedShortCode = short_code === null ? null : String(short_code).trim();
    if (trimmedShortCode) {
      const exists = await query("SELECT 1 FROM cabins WHERE short_code = $1 AND id <> $2 LIMIT 1", [
        trimmedShortCode,
        id
      ]);
      if (exists.rowCount > 0) {
        return res.status(400).json({ error: "short_code ya existe para otra cabaña" });
      }
    }
    updates.push(`short_code = $${i++}`);
    params.push(trimmedShortCode);
  }
  if (color_hex !== undefined) {
    const trimmedColorHex = color_hex === null ? null : String(color_hex).trim();
    if (trimmedColorHex && !/^#[0-9A-Fa-f]{6}$/.test(trimmedColorHex)) {
      return res.status(400).json({ error: "color_hex invalido. Usa formato #RRGGBB" });
    }
    updates.push(`color_hex = $${i++}`);
    params.push(trimmedColorHex);
  }
  if (icon !== undefined) {
    updates.push(`icon = $${i++}`);
    params.push(icon === null || icon === "" ? null : String(icon));
  }
  if (req.body.size_category !== undefined) {
    const normalizedSizeCategory =
      req.body.size_category && String(req.body.size_category).trim() !== ""
        ? String(req.body.size_category).trim()
        : "small";
    if (!["small", "large"].includes(normalizedSizeCategory)) {
      return res.status(400).json({ error: "size_category invalido. Usa: small o large" });
    }
    updates.push(`size_category = $${i++}`);
    params.push(normalizedSizeCategory);
  }
  if (req.body.max_guests !== undefined) {
    const maxGuestsNumber = Number(req.body.max_guests);
    if (!Number.isInteger(maxGuestsNumber) || maxGuestsNumber <= 0) {
      return res.status(400).json({ error: "max_guests invalido" });
    }
    updates.push(`max_guests = $${i++}`);
    params.push(maxGuestsNumber);
  }
  if (req.body.amenities !== undefined) {
    const amenities = Array.isArray(req.body.amenities)
      ? req.body.amenities.map((a) => String(a).trim()).filter(Boolean)
      : null;
    updates.push(`amenities = $${i++}`);
    params.push(amenities);
  }
  if (updates.length === 0) {
    return res.status(400).json({ error: "No hay campos para actualizar" });
  }
  updates.push("updated_at = NOW()");
  params.push(id);
  try {
    const result = await query(
      `UPDATE cabins SET ${updates.join(", ")} WHERE id = $${i} RETURNING *`,
      params
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cabaña no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/** DELETE /api/cabins/:id — eliminar cabaña (cascade elimina imágenes) */
router.delete("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }
  try {
    // Protege cabañas operativas base (1..4) para evitar perder asignaciones históricas.
    // Si se requiere "ocultar" una cabaña, hacerlo vía edición (nombre/sort_order) o agregar un flag de "archivada" (futuro).
    if (id >= 1 && id <= 4) {
      return res.status(409).json({
        error: "No se puede eliminar una cabaña operativa (IDs 1-4). Usa 'Editar Datos'."
      });
    }

    // Evita eliminar cabañas con reservas asociadas (aunque el FK sea ON DELETE SET NULL).
    const hasReservations = await query("SELECT 1 FROM reservations WHERE cabin_id = $1 LIMIT 1", [id]);
    if (hasReservations.rowCount > 0) {
      return res.status(409).json({
        error: "No se puede eliminar la cabaña porque tiene reservas asociadas. Reasigna o elimina esas reservas primero."
      });
    }

    const result = await query("DELETE FROM cabins WHERE id = $1 RETURNING id", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cabaña no encontrada" });
    }
    res.json({ ok: true, id });
  } catch (error) {
    next(error);
  }
});

/** PATCH /api/cabins/:id/images — reemplazar imágenes de una cabaña */
router.patch("/:id/images", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }
  const { images } = req.body || {};
  if (!Array.isArray(images)) {
    return res.status(400).json({ error: "Se requiere body.images como array" });
  }
  if (images.length > MAX_IMAGES_PER_CABIN) {
    return res.status(400).json({ error: `Máximo ${MAX_IMAGES_PER_CABIN} imágenes por cabaña` });
  }
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const data = img?.image_data_base64 ?? img?.data;
    if (typeof data !== "string" || data.length === 0) {
      return res.status(400).json({ error: `Imagen ${i + 1}: image_data_base64 requerido` });
    }
    if (data.length > MAX_BASE64_LENGTH) {
      return res.status(400).json({ error: `Imagen ${i + 1}: tamaño base64 excede el límite` });
    }
  }
  try {
    const exists = await query("SELECT 1 FROM cabins WHERE id = $1", [id]);
    if (exists.rowCount === 0) {
      return res.status(404).json({ error: "Cabaña no encontrada" });
    }
    await query("DELETE FROM cabin_images WHERE cabin_id = $1", [id]);
    const inserted = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const data = img?.image_data_base64 ?? img?.data;
      const caption = img?.caption ?? null;
      const sortOrder = Number.isFinite(Number(img?.sort_order)) ? Number(img.sort_order) : i;
      const r = await query(
        `INSERT INTO cabin_images (cabin_id, image_data_base64, caption, sort_order)
         VALUES ($1, $2, $3, $4)
         RETURNING id, caption, sort_order`,
        [id, data, caption, sortOrder]
      );
      inserted.push(r.rows[0]);
    }
    res.json({ ok: true, cabin_id: id, images: inserted });
  } catch (error) {
    next(error);
  }
});

/** Compatibilidad: PATCH /api/cabins/:number/images con number = id (ya no cabin_number) */
// La ruta :id/images ya cubre esto. Si el frontend usaba /cabins/1/images con 1=cabin_number,
// ahora 1 es el id de cabin. Los ids 1..6 coincidirán con las cabañas por defecto.

export default router;
