import PDFDocument from "pdfkit";

const COLORS = {
  teal: "#2f5f66",
  redBox: "#bf1f20",
  grid: "#c6cbcf",
  dayInMonth: "#9aa2a6",
  dayOutMonth: "#bcc2c6",
  note: "#7a8187",
  entryGreen: "#6f8d78",
  entryRed: "#bf6a64"
};

const WEEKDAYS = ["LU", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function startGridDate(year, month) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const jsWeekday = first.getUTCDay();
  const monBasedWeekday = (jsWeekday + 6) % 7;
  first.setUTCDate(first.getUTCDate() - monBasedWeekday);
  return first;
}

function addDays(date, offset) {
  const copy = new Date(date.getTime());
  copy.setUTCDate(copy.getUTCDate() + offset);
  return copy;
}

function drawPanel(doc, year, { gridX, gridY, gridW }) {
  const panelX = gridX + gridW + 8;
  const labelW = 68;
  const rowH = 12;

  doc.fillColor(COLORS.teal).rect(panelX, gridY, labelW, rowH).fill();
  doc.fillColor(COLORS.teal).rect(panelX, gridY + rowH, labelW, rowH).fill();
  doc
    .font("Helvetica-Bold")
    .fontSize(4.5)
    .fillColor("#ffffff")
    .text("AÑO", panelX + 2, gridY + 3)
    .text("INICIO DE LA SEMANA", panelX + 2, gridY + rowH + 3);

  doc
    .font("Helvetica")
    .fontSize(5)
    .fillColor("#80868a")
    .text(String(year), panelX + labelW + 8, gridY + 3)
    .text("LU", panelX + labelW + 8, gridY + rowH + 3);
}

function drawYearChip(doc, year, { x, y }) {
  doc.fillColor(COLORS.redBox).rect(x, y, 24, 48).fill();
  doc.font("Helvetica-Bold").fontSize(8).fillColor("#ffffff").text(String(year), x + 2, y + 18, {
    width: 20,
    align: "center"
  });
}

function drawGrid(doc, { x, y, cellW, rowH, headerH }) {
  doc.lineWidth(0.4).strokeColor(COLORS.grid);

  // Header row (weekday labels)
  doc.fillColor(COLORS.teal).rect(x, y, cellW * 7, headerH).fill();
  for (let c = 0; c <= 7; c += 1) {
    const xx = x + c * cellW;
    doc.moveTo(xx, y).lineTo(xx, y + headerH + rowH * 6).stroke();
  }
  for (let r = 0; r <= 6; r += 1) {
    const yy = y + headerH + r * rowH;
    doc.moveTo(x, yy).lineTo(x + cellW * 7, yy).stroke();
  }
  doc.rect(x, y, cellW * 7, headerH + rowH * 6).stroke();

  doc.font("Helvetica-Bold").fontSize(4.7).fillColor("#d9e3e6");
  for (let c = 0; c < 7; c += 1) {
    doc.text(WEEKDAYS[c], x + c * cellW + 2, y + 4, { width: cellW - 4, align: "left", lineBreak: false });
  }
}

function drawDayNumber(doc, day, { x, y, inMonth }) {
  doc
    .font("Helvetica")
    .fontSize(4.6)
    .fillColor(inMonth ? COLORS.dayInMonth : COLORS.dayOutMonth)
    .text(String(day), x + 2, y + 2, { lineBreak: false });
}

function drawDayEntries(doc, entries, { x, y, cellW, rowH }) {
  const maxLines = 4;
  let lineY = y + 11;

  for (let i = 0; i < Math.min(maxLines, entries.length); i += 1) {
    const entry = entries[i];
    const name = String(entry?.name || "").trim();
    const pax = Number(entry?.pax || 0);
    if (!name) continue;

    doc
      .font("Helvetica")
      .fontSize(4.7)
      .fillColor(i % 2 === 0 ? COLORS.entryGreen : COLORS.entryRed)
      .text(`${name} X${pax > 0 ? pax : ""}`.trim(), x + 2, lineY, {
        width: cellW - 4,
        align: "left",
        lineBreak: false
      });
    lineY += 7;
    if (lineY > y + rowH - 8) break;
  }

  if (entries.length > maxLines) {
    doc.font("Helvetica-Oblique").fontSize(4.4).fillColor(COLORS.note).text(`+${entries.length - maxLines}`, x + 2, y + rowH - 8, {
      width: cellW - 4,
      align: "left",
      lineBreak: false
    });
  }
}

function buildEntryMap(dayEntries) {
  const map = new Map();
  for (const day of dayEntries || []) {
    if (!day?.date || !Array.isArray(day?.entries)) continue;
    map.set(
      String(day.date),
      day.entries
        .map((entry) => ({ name: String(entry?.name || "").trim(), pax: Number(entry?.pax || 0) }))
        .filter((entry) => entry.name)
    );
  }
  return map;
}

export async function buildReservasMonthlyPdfBuffer({ year, month, dayEntries, notes = [] }) {
  const doc = new PDFDocument({ size: "LETTER", margin: 0 });
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  const gridX = 112;
  const gridY = 94;
  const cellW = 52;
  const rowH = 50;
  const headerH = 14;
  const gridW = cellW * 7;

  drawYearChip(doc, year, { x: 70, y: gridY - 10 });
  drawPanel(doc, year, { gridX, gridY, gridW });
  drawGrid(doc, { x: gridX, y: gridY, cellW, rowH, headerH });

  const entryMap = buildEntryMap(dayEntries);
  const firstGridDate = startGridDate(year, month);

  for (let week = 0; week < 6; week += 1) {
    for (let dow = 0; dow < 7; dow += 1) {
      const date = addDays(firstGridDate, week * 7 + dow);
      const day = date.getUTCDate();
      const isCurrentMonth = date.getUTCMonth() + 1 === month;
      const dateKey = toDateKey(date);

      const cellX = gridX + dow * cellW;
      const cellY = gridY + headerH + week * rowH;

      drawDayNumber(doc, day, { x: cellX, y: cellY, inMonth: isCurrentMonth });

      const entries = entryMap.get(dateKey) || [];
      if (entries.length > 0) {
        drawDayEntries(doc, entries, { x: cellX, y: cellY, cellW, rowH });
      }
    }
  }

  const notesCellY = gridY + headerH + rowH * 5;
  const notesX = gridX + cellW * 2 + 3;
  const notesText = Array.isArray(notes) && notes.length > 0 ? `NOTAS: ${notes.join(" | ")}` : "NOTAS:";
  doc.font("Helvetica").fontSize(4.8).fillColor(COLORS.note).text(notesText, notesX, notesCellY + 18, {
    width: cellW * 5 - 6,
    align: "left"
  });

  doc.end();
  await new Promise((resolve) => doc.on("end", resolve));
  return Buffer.concat(chunks);
}
