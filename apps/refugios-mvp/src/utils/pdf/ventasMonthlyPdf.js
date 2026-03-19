import PDFDocument from "pdfkit";

const PAGE_WIDTH = 612;
const TABLE_X = 48;
const TABLE_Y = 84;
const TABLE_WIDTH = 512;
const HEADER_HEIGHT = 10;
const ROW_HEIGHT = 8;
const ROWS_PER_PAGE = 24;

const COLORS = {
  grid: "#8f9498",
  text: "#2f3a3f",
  header: "#86c8ca",
  rowNo: "#8eced0",
  supplement: "#efefef",
  total: "#dff1e3",
  utility: "#d9efdf",
  boletas: "#f4dedd",
  white: "#ffffff"
};

function moneyCLP(n) {
  const value = Number(n || 0);
  const abs = Math.round(Math.abs(value));
  return abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function toNumber(n) {
  const value = Number(n);
  return Number.isFinite(value) ? value : null;
}

function firstPositive(...values) {
  for (const value of values) {
    const n = toNumber(value);
    if (n != null && n > 0) return n;
  }
  return 0;
}

function getColumns(showAbonos) {
  if (showAbonos) {
    return [
      { key: "row_no", label: "#", w: 16, align: "center", bg: COLORS.rowNo },
      { key: "guest_name", label: "NOMBRE", w: 116, align: "left", bg: COLORS.white },
      { key: "r_or_c", label: "R / C", w: 24, align: "center", bg: COLORS.white },
      { key: "product_code", label: "T / P / A / B", w: 38, align: "center", bg: COLORS.white },
      { key: "pax", label: "PAX", w: 22, align: "center", bg: COLORS.white },
      { key: "pax_ad", label: "PAX Ad", w: 26, align: "center", bg: COLORS.white },
      { key: "nights", label: "NOCHES", w: 28, align: "center", bg: COLORS.white },
      { key: "nightly_price", label: "PRECIO POR NOCHE", w: 44, align: "right", bg: COLORS.white },
      { key: "cleaning_supplement", label: "SUPLEMENTO LIMPIEZA", w: 46, align: "right", bg: COLORS.supplement },
      { key: "total_per_night", label: "TOTAL POR NOCHE", w: 44, align: "right", bg: COLORS.white },
      { key: "total_stay", label: "TOTAL Estadia", w: 48, align: "right", bg: COLORS.total },
      { key: "utility", label: "UTILIDAD", w: 40, align: "right", bg: COLORS.utility },
      { key: "abono", label: "ABONOS", w: 38, align: "left", bg: COLORS.white },
      { key: "boletas", label: "BOLETAS", w: 34, align: "left", bg: COLORS.boletas }
    ];
  }

  return [
    { key: "row_no", label: "#", w: 16, align: "center", bg: COLORS.rowNo },
    { key: "guest_name", label: "NOMBRE", w: 132, align: "left", bg: COLORS.white },
    { key: "r_or_c", label: "R / C", w: 24, align: "center", bg: COLORS.white },
    { key: "product_code", label: "T / P / A / B", w: 38, align: "center", bg: COLORS.white },
    { key: "pax", label: "PAX", w: 22, align: "center", bg: COLORS.white },
    { key: "pax_ad", label: "PAX Ad", w: 28, align: "center", bg: COLORS.white },
    { key: "nights", label: "NOCHES", w: 30, align: "center", bg: COLORS.white },
    { key: "nightly_price", label: "PRECIO POR NOCHE", w: 46, align: "right", bg: COLORS.white },
    { key: "cleaning_supplement", label: "SUPLEMENTO LIMPIEZA", w: 50, align: "right", bg: COLORS.supplement },
    { key: "total_per_night", label: "TOTAL POR NOCHE", w: 46, align: "right", bg: COLORS.white },
    { key: "total_stay", label: "TOTAL Estadia", w: 54, align: "right", bg: COLORS.total },
    { key: "utility", label: "UTILIDAD", w: 46, align: "right", bg: COLORS.utility },
    { key: "boletas", label: "BOLETAS", w: 32, align: "left", bg: COLORS.boletas }
  ];
}

function scaleColumns(columns, targetWidth) {
  const base = columns.reduce((sum, column) => sum + column.w, 0);
  const scale = base > 0 ? targetWidth / base : 1;
  let remaining = targetWidth;

  return columns.map((column, index) => {
    const raw = column.w * scale;
    const width = index === columns.length - 1 ? remaining : Math.max(8, Math.round(raw));
    remaining -= width;
    return { ...column, w: width };
  });
}

function cellText(row, key) {
  const numeric = (field, fallbackZero = false) => {
    const value = toNumber(row?.[field]);
    if (value == null) return fallbackZero ? "0" : "";
    return String(Math.round(value));
  };

  switch (key) {
    case "row_no":
      return String(row?.row_no || "");
    case "guest_name":
      return row?.guest_name || "";
    case "r_or_c":
      return row?.r_or_c || "";
    case "product_code":
      return row?.product_code || "";
    case "pax":
      return numeric("pax", true);
    case "pax_ad":
      return numeric("pax_ad", true);
    case "nights":
      return numeric("nights", true);
    case "nightly_price": {
      const value = toNumber(row?.nightly_price);
      return value && value > 0 ? moneyCLP(value) : "";
    }
    case "cleaning_supplement": {
      const value = toNumber(row?.cleaning_supplement);
      return value && value > 0 ? moneyCLP(value) : "";
    }
    case "total_per_night": {
      const value = toNumber(row?.total_per_night);
      return value && value > 0 ? moneyCLP(value) : "";
    }
    case "total_stay": {
      const value = firstPositive(row?.total_stay, row?.amount_resolved, row?.utility);
      return `${moneyCLP(value)} -$`;
    }
    case "utility": {
      const value = firstPositive(row?.utility, row?.total_stay, row?.amount_resolved);
      if (value <= 0) return "--";
      return `${moneyCLP(value)}-`;
    }
    case "abono": {
      const value = toNumber(row?.abono);
      return value && value > 0 ? `abono ${moneyCLP(value)}` : "";
    }
    case "boletas":
      return row?.boletas || "";
    default:
      return "";
  }
}

function drawCell(
  doc,
  x,
  y,
  w,
  h,
  { text = "", align = "left", bg = COLORS.white, bold = false, fontSize = 4.8, multiline = false }
) {
  doc.save();
  doc.fillColor(bg).rect(x, y, w, h).fill();
  doc.lineWidth(0.35).strokeColor(COLORS.grid).rect(x, y, w, h).stroke();
  doc.restore();

  doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(fontSize).fillColor(COLORS.text);
  const leftPad = 1.3;
  const textWidth = Math.max(0, w - leftPad * 2);
  doc.text(String(text || ""), x + leftPad, y + 1.6, {
    width: textWidth,
    align,
    lineBreak: multiline
  });
}

function drawBackgroundGrid(doc) {
  const x0 = TABLE_X - 12;
  const y0 = TABLE_Y - 12;
  const width = TABLE_WIDTH + 24;
  const height = 230;
  const step = 22;

  doc.lineWidth(0.2).strokeColor("#d8dcde");
  for (let x = x0; x <= x0 + width; x += step) {
    doc.moveTo(x, y0).lineTo(x, y0 + height).stroke();
  }
  for (let y = y0; y <= y0 + height; y += step) {
    doc.moveTo(x0, y).lineTo(x0 + width, y).stroke();
  }
}

function columnX(columns, key, xStart) {
  let x = xStart;
  for (const column of columns) {
    if (column.key === key) return { x, w: column.w };
    x += column.w;
  }
  return null;
}

function drawTotals(doc, columns, x, y, totals) {
  const totalStayCol = columnX(columns, "total_stay", x);
  const utilityCol = columnX(columns, "utility", x);
  if (!totalStayCol || !utilityCol) return y;

  drawCell(doc, totalStayCol.x, y, totalStayCol.w, ROW_HEIGHT, {
    text: "TOTAL",
    align: "left",
    bg: COLORS.total,
    fontSize: 4.8
  });
  drawCell(doc, utilityCol.x, y, utilityCol.w, ROW_HEIGHT, {
    text: `$ ${moneyCLP(totals?.total_amount || 0)}`,
    align: "right",
    bg: COLORS.utility,
    fontSize: 4.8
  });

  return y + ROW_HEIGHT;
}

function drawFooterBox(doc, x, y, totals) {
  const titleW = 24;
  const boxW = 38;
  const headerH = 8;
  const valueH = 14;

  drawCell(doc, x + titleW, y, boxW, headerH, {
    text: "CASA",
    align: "center",
    bg: COLORS.total,
    bold: true,
    fontSize: 4.8
  });
  drawCell(doc, x + titleW + boxW, y, boxW, headerH, {
    text: "REFUGIOS",
    align: "center",
    bg: COLORS.total,
    bold: true,
    fontSize: 4.8
  });

  drawCell(doc, x, y + headerH, titleW, valueH, {
    text: "TOTA\nL\nNOCH\nES",
    align: "center",
    bg: COLORS.total,
    bold: true,
    fontSize: 3.8,
    multiline: true
  });
  drawCell(doc, x + titleW, y + headerH, boxW, valueH, {
    text: totals?.total_noches_left ?? "",
    align: "center",
    bg: COLORS.white,
    fontSize: 5
  });
  drawCell(doc, x + titleW + boxW, y + headerH, boxW, valueH, {
    text: totals?.total_noches_right ?? "",
    align: "center",
    bg: COLORS.white,
    fontSize: 5
  });
}

export async function buildVentasMonthlyPdfBuffer({ year, rows, totals, showAbonos = false }) {
  const doc = new PDFDocument({ size: "LETTER", margin: 0 });
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  drawBackgroundGrid(doc);

  doc.font("Helvetica-Bold").fontSize(7).fillColor("#5c97a0").text(`VENTAS ${year}`, TABLE_X + 1, 64);

  const columns = scaleColumns(getColumns(showAbonos), TABLE_WIDTH);
  let cx = TABLE_X;
  for (const column of columns) {
    drawCell(doc, cx, TABLE_Y, column.w, HEADER_HEIGHT, {
      text: column.label,
      align: column.align === "right" ? "center" : column.align,
      bg: COLORS.header,
      bold: true,
      fontSize: 4.2
    });
    cx += column.w;
  }

  let cy = TABLE_Y + HEADER_HEIGHT;
  const paddedRows = Array.isArray(rows) ? rows.slice(0, ROWS_PER_PAGE) : [];
  while (paddedRows.length < ROWS_PER_PAGE) {
    paddedRows.push({
      row_no: paddedRows.length + 1,
      is_placeholder: true
    });
  }

  for (const row of paddedRows) {
    cx = TABLE_X;
    for (const column of columns) {
      drawCell(doc, cx, cy, column.w, ROW_HEIGHT, {
        text: cellText(row, column.key),
        align: column.align,
        bg: column.bg,
        fontSize: 4.25
      });
      cx += column.w;
    }
    cy += ROW_HEIGHT;
  }

  cy = drawTotals(doc, columns, TABLE_X, cy, totals);
  drawFooterBox(doc, TABLE_X + 126, cy + 14, totals || {});

  doc.end();
  await new Promise((resolve) => doc.on("end", resolve));
  return Buffer.concat(chunks);
}
