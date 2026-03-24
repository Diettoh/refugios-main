const money = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const UI_VERSION = "0.9.6";

const paymentLabels = {
  transfer: "Transferencia",
  card: "Tarjeta",
  cash: "Efectivo",
  mercadopago: "MercadoPago",
  other: "Otro"
};

const sourceLabels = {
  booking: "Booking.com",
  airbnb: "Airbnb",
  web: "Pagina web",
  direct: "Directo",
  other: "Otro"
};

const seasonLabels = {
  alta: "Alta",
  baja: "Baja",
  temporada: "Temporada",
  permanente: "Permanente"
};

const reservationDocLabels = {
  boleta: "Boleta",
  factura: "Factura",
  booking: "Booking",
  ninguno: "Ninguno"
};

const channelPaymentToReservation = {
  transfer: { source: "direct", payment_method: "transfer" },
  web: { source: "web", payment_method: "other" },
  airbnb: { source: "airbnb", payment_method: "other" },
  booking: { source: "booking", payment_method: "other" }
};

function formatChannelPaymentLabel(source, paymentMethod) {
  const src = String(source || "").toLowerCase();
  const pay = String(paymentMethod || "").toLowerCase();
  if (src === "direct" && pay === "transfer") return "Transferencia";
  if (src === "web") return "Pagina web";
  if (src === "airbnb") return "Airbnb";
  if (src === "booking") return "Booking";
  if (src && pay && pay !== "other") {
    return `${sourceLabels[src] || src} / ${paymentLabels[pay] || pay}`;
  }
  return sourceLabels[src] || paymentLabels[pay] || source || paymentMethod || "-";
}

const EXPENSE_CATEGORY_PRESETS = [
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
const EXPENSE_CATEGORY_PRESET_MAP = new Map(
  EXPENSE_CATEGORY_PRESETS.map((label) => [normalizeExpenseCategoryKey(label), label])
);

function normalizeExpenseCategoryKey(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

const state = {
  periodFrom: "",
  periodTo: "",
  availabilityDate: new Date().toISOString().slice(0, 10),
  calendarMonth: new Date().toISOString().slice(0, 7),
  calendarView: window.localStorage.getItem("calendar_view") || "panel",
  totalCabins: Number(localStorage.getItem("total_cabins") || 6),
  expensesFilterMonth: "",
  expensesFilterPayment: "",
  expensesFilterCategory: "",
  expensesFilterSupplier: "",
  expensesFilterMinAmount: "",
  expensesFilterMaxAmount: "",
  expensesFilterText: "",
  expensesPage: 1,
  expensesPageSize: 10,
  expensesTotalRows: 0,
  expensesMeta: { categories: [], category_options: [], category_labels: {} },
  guestsFilterDebt: "",
  guestsFilterName: "",
  reservationsFilterSource: "",
  reservationsFilterDebt: "",
  reservationsFilterName: "",
  reservationsFilterCheckInFrom: "",
  reservationsFilterCheckInTo: "",
  reservationsFilterCheckOutFrom: "",
  reservationsFilterCheckOutTo: "",
  reservationsFilterMinNights: "",
  reservationsFilterMaxNights: "",
  reservationsFilterDocType: "",
  documentsFilterType: "",
  cabins: []
};

function getCabinVisualDefaults(cabin) {
  const rawName = String(cabin?.name || "").toLowerCase();
  const code = String(cabin?.short_code || "").toLowerCase();
  const order = Number(cabin?.sort_order || 0);

  // Lógica oficial AvA Refugios
  if (rawName.includes("casa") || code === "casa" || order === 4) {
    return { color: "#1e293b", capacity: 8, icon: "🏠" };
  }
  
  // Refugios (1, 2, 3)
  if (order === 1 || code === "1") return { color: "#2563eb", capacity: 4, icon: "🌲" };
  if (order === 2 || code === "2") return { color: "#10b981", capacity: 4, icon: "🌲" };
  if (order === 3 || code === "3") return { color: "#f59e0b", capacity: 4, icon: "🌲" };

  return { color: "#6B7280", capacity: 4, icon: "🌲" };
}

function getCabinCapacity(cabin) {
  if (typeof cabin?.max_guests === "number" && cabin.max_guests > 0) return cabin.max_guests;
  return getCabinVisualDefaults(cabin).capacity;
}

function cabinBadge(cabin) {
  if (!cabin) return "";
  const code = cabin.short_code || "";
  const defaults = getCabinVisualDefaults(cabin);
  const color = cabin.color_hex || defaults.color;
  const icon = cabin.icon || (cabin.size_category === "large" ? "🏠" : "🌲");
  const safeName = cabin.name || "";
  const typeLabel = cabin.size_category === "large" ? "Cabaña Casa" : "Cabaña Refugio";
  const capacity = `${getCabinCapacity(cabin)} pax`;
  const amenities = Array.isArray(cabin.amenities) ? cabin.amenities : [];
  const amenityIconsMap = {
    wifi: "📶",
    parking: "🅿️",
    hot_tub: "♨️",
    kitchen: "🍳",
    terrace: "🪑",
    trails: "🥾",
    fireplace: "🔥",
    pet_friendly: "🐾"
  };
  const amenityIcons = amenities
    .map((a) => amenityIconsMap[a])
    .filter(Boolean)
    .join(" ");

  return `<span class="cabin-badge">
    <span class="cabin-badge__dot" style="background-color:${color}"></span>
    <span class="cabin-badge__name">${safeName}${code ? ` (${code})` : ""}</span>
    <span class="cabin-badge__type">${typeLabel} · ${capacity}</span>
    ${amenityIcons ? `<span class="cabin-badge__amenities">${amenityIcons}</span>` : ""}
    ${icon ? `<span class="cabin-badge__icon">${icon}</span>` : ""}
  </span>`;
}

function normalizeDocumentId(value) {
  return String(value || "")
    .replace(/[.\s-]/g, "")
    .toUpperCase()
    .trim();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  const button = document.getElementById("theme-toggle");
  if (button) {
    button.textContent = theme === "dark" ? "Tema claro" : "Tema oscuro";
  }
  refreshChartsForTheme();
}

function refreshChartsForTheme() {
  if (!getAuthToken()) return;
  if (typeof refreshMonthlyReportTables === "function") refreshMonthlyReportTables();
  if (typeof refreshGastosDash === "function") refreshGastosDash();
  if (typeof refreshReservasDash === "function") refreshReservasDash();
  if (typeof refreshCabanasDash === "function") refreshCabanasDash();
}

function setupThemeToggle() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  const button = document.getElementById("theme-toggle");
  if (!button) return;
  button.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

function setUiVersion() {
  const el = document.getElementById("ui-version");
  if (el) el.textContent = `UI v${UI_VERSION}`;
}

function setupPublicUrlDisplay() {
  const link = document.getElementById("public-url-link");
  if (!link) return;
  api("/api/public-url")
    .then((data) => {
      const url = data?.public_url || "";
      if (url && url.includes("trycloudflare.com")) {
        link.href = url;
        link.textContent = "Compartir tunnel";
        link.style.display = "";
      }
    })
    .catch(() => {});
}

function setupFocusMode() {
  const navLinks = [...document.querySelectorAll(".sidebar__link")];
  const panels = [...document.querySelectorAll(".panel")];
  const DEFAULT_PANEL = "#section-dashboard";

  const setActivePanel = (id) => {
    panels.forEach((panel) => panel.classList.toggle("is-active", `#${panel.id}` === id));
    navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === id));
    window.scrollTo({ top: 0 });
  };

  document.body.classList.add("focus-mode");
  setActivePanel(DEFAULT_PANEL);

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id) return;
      event.preventDefault();
      setActivePanel(id);
      const sidebar = document.getElementById("sidebar");
      if (sidebar) sidebar.classList.remove("is-open");
    });
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#section-']");
    if (!link || link.classList.contains("sidebar__link")) return;
    event.preventDefault();
    setActivePanel(link.getAttribute("href"));
  });
}

function setupSidebarToggle() {
  const toggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (!toggle || !sidebar) return;

  const close = () => sidebar.classList.remove("is-open");

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
  });

  if (overlay) {
    overlay.addEventListener("click", close);
  }
}

function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  if (!document.querySelector(".form-modal:not([hidden])")) {
    document.body.classList.remove("modal-open");
  }
  // Resetear sale-modal si fue abierto como "Cobrar"
  if (modal.id === "sale-modal") {
    const title = modal.querySelector(".modal__header h3");
    const debtInfo = document.getElementById("sale-debt-info");
    if (title) title.textContent = "Registrar venta";
    if (debtInfo) { debtInfo.hidden = true; debtInfo.innerHTML = ""; }
  }
}

function openModal(modal) {
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  const firstField = modal.querySelector("input, select, textarea, button");
  if (firstField) firstField.focus();
}

function setupSectionModals() {
  document.body.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-modal-open]");
    if (openButton) {
      const modalId = openButton.getAttribute("data-modal-open");
      if (!modalId) return;
      const modal = document.getElementById(modalId);
      if (modalId === "guest-modal") {
        const form = document.getElementById("guest-form");
        const title = modal?.querySelector(".modal__header h3");
        if (title) title.textContent = "Nuevo huésped";
        if (form) {
          form.reset();
          const idEl = form.querySelector('[name="id"]');
          if (idEl) idEl.value = "";
          // Resetear readonly y visibilidad del boton
          const inputs = form.querySelectorAll("input, textarea");
          inputs.forEach((input) => input.readOnly = false);
          const saveBtn = form.querySelector('button[type="submit"]');
          if (saveBtn) saveBtn.style.display = "";
        }
      }
      if (modalId === "expense-modal") {
        const form = document.getElementById("expense-form");
        if (form) {
          form.reset();
          const monthInput = form.querySelector('[name="expense_month"]');
          if (monthInput) monthInput.value = new Date().toISOString().slice(0, 7);
        }
      }
      openModal(modal);
      if (modalId === "reservation-modal") {
        // Asegura que se rellene tarifa/noches/monto cuando se abre el modal,
        // aunque la cabaña ya venga preseleccionada.
        setTimeout(() => {
          const form = document.getElementById("reservation-form");
          const cabinSelect = document.getElementById("reservation-cabin");
          if (!form || !cabinSelect) return;
          cabinSelect.dispatchEvent(new Event("change"));
        }, 0);
      }
      return;
    }

    const closeButton = event.target.closest("[data-modal-close]");
    if (closeButton) {
      closeModal(closeButton.closest(".form-modal"));
      return;
    }

    if (event.target.classList.contains("form-modal")) {
      closeModal(event.target);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const opened = document.querySelector(".form-modal:not([hidden])");
    if (opened) closeModal(opened);
  });
}

function releaseCabinButton(reservationId) {
  return `<button type="button" class="btn-release-cabin" data-release-id="${reservationId}">Liberar cabaña</button>`;
}

function toDataUrl(base64) {
  if (!base64) return "";
  if (base64.startsWith("data:")) return base64;
  return `data:image/jpeg;base64,${base64}`;
}

function getCabinById(cabinId) {
  return (state.cabins || []).find((c) => c.id === cabinId);
}

function getCabinImages(cabinId) {
  const cabin = getCabinById(cabinId);
  return cabin?.images || [];
}

function getCabinName(cabinId) {
  const cabin = getCabinById(cabinId);
  return cabin?.name || `Cabaña #${cabinId}`;
}

function isOperationalCabin(cabin) {
  return !!cabin && !!cabin.id;
}

function getOperationalCabins(cabins) {
  return [...(cabins || [])].filter((c) => isOperationalCabin(c));
}

function toPayload(form) {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function normalize(body) {
  const output = { ...body };

  for (const [key, value] of Object.entries(output)) {
    if (typeof value === "string") output[key] = value.trim();
  }

  for (const key of ["guest_id", "reservation_id", "sale_id", "guests_count", "cabin_id", "nights"]) {
    if (output[key] === "" || output[key] == null) delete output[key];
    else output[key] = Number(output[key]);
  }

  for (const key of ["amount", "total_amount", "nightly_rate", "cleaning_supplement", "additional_charge"]) {
    if (output[key] === "") delete output[key];
    else if (output[key] != null) output[key] = Number(output[key]);
  }

  if (output.category != null) {
    const categoryKey = normalizeExpenseCategoryKey(output.category);
    if (categoryKey) output.category = EXPENSE_CATEGORY_PRESET_MAP.get(categoryKey) || output.category;
  }

  return output;
}

function setStatus(message, type = "") {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status ${type}`.trim();
}

function getAuthToken() {
  return window.localStorage.getItem("refugios_jwt") || "";
}

function setAuthToken(token) {
  if (!token) {
    window.localStorage.removeItem("refugios_jwt");
  } else {
    window.localStorage.setItem("refugios_jwt", token);
  }
}

function showLoginOverlay(message = "Sesión expirada. Vuelve a iniciar sesión.") {
  const overlay = document.getElementById("warmup-overlay");
  const msgEl = document.getElementById("warmup-message");
  const btn = document.getElementById("warmup-enter-btn");
  if (overlay) overlay.hidden = false;
  if (msgEl) msgEl.textContent = message;
  if (btn) {
    btn.disabled = false;
    btn.textContent = "Entrar al panel";
    btn.onclick = null;
  }
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(path, {
    ...options,
    headers
  });

  if (response.status === 401) {
    setAuthToken("");
    showLoginOverlay("Sesión expirada. Vuelve a iniciar sesión.");
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Sesión expirada");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Error ${response.status}`);
  }

  return response.json();
}

function renderList(id, rows, formatter) {
  const container = document.getElementById(id);
  container.innerHTML = rows.map(formatter).join("");
}

function setReservationGuestStatus(message, type = "") {
  const status = document.getElementById("reservation-guest-status");
  if (!status) return;
  status.textContent = message;
  status.className = `form-helper ${type}`.trim();
}

function debtLabel(status, amountDue) {
  if (status === "paid") return "No debe";
  if (status === "partial") return `Debe ${money.format(amountDue || 0)}`;
  if (status === "pending") return `Debe ${money.format(amountDue || 0)}`;
  return "Sin estado";
}

function debtClass(status) {
  if (status === "paid") return "debt-paid";
  if (status === "partial") return "debt-partial";
  if (status === "pending") return "debt-pending";
  return "";
}

function chip(label, className = "") {
  return `<span class="chip ${className}">${label}</span>`;
}

function deleteButton(type, id) {
  return `<button type="button" class="btn-delete" data-delete-type="${type}" data-id="${id}">Eliminar</button>`;
}

function editGuestButton(guest) {
  const fullName = encodeURIComponent(guest?.full_name || "");
  const doc = encodeURIComponent(guest?.document_id || "");
  const email = encodeURIComponent(guest?.email || "");
  const phone = encodeURIComponent(guest?.phone || "");
  const taxType = guest?.tax_document_type || "sii";
  const baseAttrs = `data-guest-id="${guest?.id}"
    data-guest-name="${fullName}"
    data-guest-document="${doc}"
    data-guest-email="${email}"
    data-guest-phone="${phone}"
    data-tax-document-type="${taxType}"`;

  return `
    <button type="button" class="btn btn--sm btn--ghost btn-edit-guest" data-action="view" ${baseAttrs}>Ver</button>
    <button type="button" class="btn btn--sm btn--ghost btn-edit-guest" data-action="edit" ${baseAttrs}>Editar</button>
    <button type="button" class="btn btn--sm btn--ghost btn-guest-history" data-guest-id="${guest?.id}" data-guest-name="${guest?.full_name}">Histórico</button>
  `;
}

function debtPriority(status) {
  if (status === "pending") return 0;
  if (status === "partial") return 1;
  if (status === "paid") return 2;
  return 3;
}

function dateWeight(value) {
  const ts = Date.parse(value || "");
  return Number.isFinite(ts) ? ts : 0;
}

function formatDate(value) {
  if (!value) return "-";
  const ts = Date.parse(value);
  if (!Number.isFinite(ts)) return value;
  return new Date(ts).toLocaleDateString("es-CL", { timeZone: "UTC" });
}

function toDateKey(value) {
  if (!value) return "";
  if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
  const ts = Date.parse(String(value));
  if (!Number.isFinite(ts)) return "";
  return new Date(ts).toISOString().slice(0, 10);
}

function inDateRange(value, from, to) {
  const rowDate = toDateKey(value);
  const fromDate = toDateKey(from);
  const toDate = toDateKey(to);
  if (!rowDate) return false;
  if (fromDate && rowDate < fromDate) return false;
  if (toDate && rowDate > toDate) return false;
  return true;
}

function periodQs() {
  const params = new URLSearchParams();
  if (state.periodFrom) params.set("from", state.periodFrom);
  if (state.periodTo) params.set("to", state.periodTo);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function buildReservationsQs({ includePeriod = true } = {}) {
  const params = new URLSearchParams();
  if (includePeriod) {
    if (state.periodFrom) params.set("from", state.periodFrom);
    if (state.periodTo) params.set("to", state.periodTo);
  }

  if (state.reservationsFilterSource) params.set("source", state.reservationsFilterSource);
  if (state.reservationsFilterDebt) params.set("debt_status", state.reservationsFilterDebt);
  if (state.reservationsFilterName) params.set("guest_name", state.reservationsFilterName);
  if (state.reservationsFilterDocType) params.set("reservation_document_type", state.reservationsFilterDocType);
  if (state.reservationsFilterCheckInFrom) params.set("check_in_from", state.reservationsFilterCheckInFrom);
  if (state.reservationsFilterCheckInTo) params.set("check_in_to", state.reservationsFilterCheckInTo);
  if (state.reservationsFilterCheckOutFrom) params.set("check_out_from", state.reservationsFilterCheckOutFrom);
  if (state.reservationsFilterCheckOutTo) params.set("check_out_to", state.reservationsFilterCheckOutTo);
  if (state.reservationsFilterMinNights !== "") params.set("min_nights", String(state.reservationsFilterMinNights));
  if (state.reservationsFilterMaxNights !== "") params.set("max_nights", String(state.reservationsFilterMaxNights));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function buildExpensesQs() {
  const params = new URLSearchParams();
  if (state.periodFrom) params.set("from", state.periodFrom);
  if (state.periodTo) params.set("to", state.periodTo);
  if (state.expensesFilterMonth) params.set("month", state.expensesFilterMonth);
  if (state.expensesFilterPayment) params.set("payment_method", state.expensesFilterPayment);
  if (state.expensesFilterCategory) params.set("category", state.expensesFilterCategory);
  if (state.expensesFilterSupplier) params.set("supplier", state.expensesFilterSupplier);
  if (state.expensesFilterMinAmount !== "") params.set("min_amount", String(state.expensesFilterMinAmount));
  if (state.expensesFilterMaxAmount !== "") params.set("max_amount", String(state.expensesFilterMaxAmount));
  if (state.expensesFilterText) params.set("q", state.expensesFilterText);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function filterRows(rows, dateField) {
  if (!state.periodFrom && !state.periodTo) return rows;
  return rows.filter((row) => inDateRange(row[dateField], state.periodFrom, state.periodTo));
}

function updatePeriodLabel() {
  const label = document.getElementById("current-period");
  if (!label) return;
  if (!state.periodFrom && !state.periodTo) {
    label.textContent = "Período: Histórico acumulado";
    return;
  }
  const fromText = state.periodFrom ? formatDate(state.periodFrom) : "inicio";
  const toText = state.periodTo ? formatDate(state.periodTo) : "hoy";
  label.textContent = `Período: ${fromText} - ${toText}`;
}

function renderSummary({ sales, expenses, reservations }) {
  const today = new Date();
  const monthKey = today.toISOString().slice(0, 7);
  const monthStart = `${monthKey}-01`;
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().slice(0, 10);
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const salesMonth = sales.filter((row) => toDateKey(row.sale_date).startsWith(monthKey));
  const expensesMonth = expenses.filter((row) => toDateKey(row.expense_date).startsWith(monthKey));
  const totalSalesMonth = salesMonth.reduce((acc, row) => acc + Number(row.amount || 0), 0);
  const totalExpensesMonth = expensesMonth.reduce((acc, row) => acc + Number(row.amount || 0), 0);
  const profitMonth = totalSalesMonth - totalExpensesMonth;

  const activeReservations = reservations.filter((row) => row.status !== "cancelled");
  const nightsSoldMonth = activeReservations.reduce((acc, row) => {
    const checkIn = toDateKey(row.check_in);
    const checkOut = toDateKey(row.check_out);
    if (!checkIn || !checkOut) return acc;
    const overlapStart = checkIn > monthStart ? checkIn : monthStart;
    const overlapEnd = checkOut < nextMonthStart ? checkOut : nextMonthStart;
    if (overlapEnd <= overlapStart) return acc;
    const nights = Math.round((new Date(overlapEnd).getTime() - new Date(overlapStart).getTime()) / (24 * 60 * 60 * 1000));
    return acc + Math.max(0, nights);
  }, 0);
  const operationalCabins = getOperationalCabins(state.cabins || []);
  const totalCabins = Math.max(1, operationalCabins.length || Number(state.totalCabins) || 1);
  const occupancyPctMonth = Math.min(100, Math.round((nightsSoldMonth / (totalCabins * daysInMonth)) * 100));

  const day = today.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const weekFrom = monday.toISOString().slice(0, 10);
  const weekTo = sunday.toISOString().slice(0, 10);

  const checkinsWeek = reservations.filter((row) => {
    const d = toDateKey(row.check_in);
    return d >= weekFrom && d <= weekTo;
  }).length;
  const checkoutsWeek = reservations.filter((row) => {
    const d = toDateKey(row.check_out);
    return d >= weekFrom && d <= weekTo;
  }).length;

  const cards = [
    ["Ventas del mes", money.format(totalSalesMonth)],
    ["Gastos del mes", money.format(totalExpensesMonth)],
    ["Utilidad del mes", money.format(profitMonth)],
    ["Ocupación del mes", `${occupancyPctMonth}%`],
    ["Noches vendidas mes", String(nightsSoldMonth)],
    ["Check-in semana", String(checkinsWeek)],
    ["Check-out semana", String(checkoutsWeek)]
  ];

  document.getElementById("summary").innerHTML = cards
    .map(([label, value]) => `<div class="card"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function getExpenseCategoryLabelByKey(key) {
  if (!key) return "";
  const metaLabel = state.expensesMeta?.category_labels?.[key];
  if (metaLabel) return metaLabel;
  if (categoryLabels[key]) return categoryLabels[key];
  return key
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildExpenseCategoryCatalog(rows) {
  const catalog = new Map();
  const addCategory = (value, label) => {
    const normalizedValue = normalizeExpenseCategoryKey(value);
    if (!normalizedValue) return;
    if (!catalog.has(normalizedValue)) {
      const normalizedLabel = String(label || "").trim();
      catalog.set(normalizedValue, normalizedLabel || getExpenseCategoryLabelByKey(normalizedValue));
    }
  };

  for (const preset of EXPENSE_CATEGORY_PRESETS) {
    addCategory(preset, preset);
  }

  for (const option of state.expensesMeta?.category_options || []) {
    if (typeof option === "string") {
      addCategory(option, option);
      continue;
    }
    addCategory(option?.value, option?.label || option?.value);
  }

  for (const row of rows || []) {
    addCategory(row?.category, row?.category);
  }

  return [...catalog.entries()]
    .map(([value, label]) => ({ value, label: label || getExpenseCategoryLabelByKey(value) }))
    .sort((a, b) => a.label.localeCompare(b.label, "es", { sensitivity: "base" }));
}

function applyExpensesFilters(rows) {
  const minAmount = state.expensesFilterMinAmount === "" ? null : Number(state.expensesFilterMinAmount);
  const maxAmount = state.expensesFilterMaxAmount === "" ? null : Number(state.expensesFilterMaxAmount);

  return rows.filter((row) => {
    if (state.expensesFilterPayment && row.payment_method !== state.expensesFilterPayment) return false;
    const category = normalizeExpenseCategoryKey(row.category);
    const supplier = String(row.supplier || "").toLowerCase();
    const description = String(row.description || "").toLowerCase();
    const expenseMonth = String(toDateKey(row.expense_date) || "").slice(0, 7);
    const amount = Number(row.amount || 0);

    if (state.expensesFilterMonth && expenseMonth !== state.expensesFilterMonth) return false;
    if (state.expensesFilterCategory && category !== state.expensesFilterCategory) return false;
    if (state.expensesFilterSupplier && !supplier.includes(state.expensesFilterSupplier)) return false;
    if (Number.isFinite(minAmount) && amount < minAmount) return false;
    if (Number.isFinite(maxAmount) && amount > maxAmount) return false;
    if (state.expensesFilterText) {
      const haystack = `${category} ${supplier} ${description}`;
      if (!haystack.includes(state.expensesFilterText)) return false;
    }
    return true;
  });
}

function refreshExpenseCategoryOptions(rows) {
  const select = document.getElementById("expenses-filter-category");
  if (!select) return;

  const current = state.expensesFilterCategory || "";
  const categories = buildExpenseCategoryCatalog(rows);

  select.innerHTML =
    '<option value=\"\">Todas</option>' +
    categories.map((opt) => `<option value=\"${opt.value}\">${opt.label}</option>`).join("");

  if (current && categories.some((opt) => opt.value === current)) {
    select.value = current;
  } else {
    select.value = "";
    if (current) state.expensesFilterCategory = "";
  }
}

function refreshExpenseCategoryInputOptions(rows) {
  const datalist = document.getElementById("expense-category-list");
  if (!datalist) return;
  const categories = buildExpenseCategoryCatalog(rows);
  datalist.innerHTML = categories.map((opt) => `<option value=\"${opt.label}\"></option>`).join("");
}

function renderExpensesKpis(rows) {
  const total = rows.reduce((acc, row) => acc + Number(row.amount || 0), 0);
  const count = rows.length;
  const average = count > 0 ? total / count : 0;
  const totalEl = document.getElementById("expenses-kpi-total");
  const countEl = document.getElementById("expenses-kpi-count");
  const avgEl = document.getElementById("expenses-kpi-average");
  if (totalEl) totalEl.textContent = money.format(total);
  if (countEl) countEl.textContent = String(count);
  if (avgEl) avgEl.textContent = money.format(average);
}

function getExpensesPagedRows(rows) {
  const start = (state.expensesPage - 1) * state.expensesPageSize;
  return rows.slice(start, start + state.expensesPageSize);
}

function renderExpensesPaginationControls(totalRows) {
  const controls = document.getElementById("expenses-pagination");
  if (!controls) return;
  const totalPages = Math.max(1, Math.ceil(totalRows / state.expensesPageSize));
  if (state.expensesPage > totalPages) state.expensesPage = totalPages;
  controls.innerHTML = `
    <button data-exp-pagination="prev" ${state.expensesPage === 1 ? "disabled" : ""}>Anterior</button>
    <span>Pagina ${state.expensesPage} / ${totalPages}</span>
    <button data-exp-pagination="next" ${state.expensesPage === totalPages ? "disabled" : ""}>Siguiente</button>
    <label>Filas
      <select id="expenses-page-size">
        <option value="10" ${state.expensesPageSize === 10 ? "selected" : ""}>10</option>
        <option value="20" ${state.expensesPageSize === 20 ? "selected" : ""}>20</option>
        <option value="50" ${state.expensesPageSize === 50 ? "selected" : ""}>50</option>
      </select>
    </label>
  `;
}

function renderExpensesTable(rows) {
  const body = document.getElementById("expenses-table-body");
  if (!body) return;
  state.expensesTotalRows = rows.length;
  const pageRows = getExpensesPagedRows(rows);
  renderExpensesPaginationControls(rows.length);
  body.innerHTML = pageRows
    .map(
      (row) => `<tr>
        <td>${formatDate(row.expense_date)}</td>
      <td>${formatExpenseCategoryLabel(row.category)}</td>
        <td>${paymentLabels[row.payment_method] || row.payment_method}</td>
        <td>${money.format(row.amount)}</td>
        <td>${deleteButton("expenses", row.id)}</td>
      </tr>`
    )
    .join("");
}

function applyGuestsFilters(rows) {
  return rows.filter((row) => {
    if (state.guestsFilterDebt && row.reservation_debt_status !== state.guestsFilterDebt) return false;
    if (state.guestsFilterName) {
      const name = String(row.full_name || "").toLowerCase();
      if (!name.includes(state.guestsFilterName)) return false;
    }
    return true;
  });
}

function applyReservationsFilters(rows) {
  return rows.filter((row) => {
    if (state.reservationsFilterSource && row.source !== state.reservationsFilterSource) return false;
    if (state.reservationsFilterDebt && row.debt_status !== state.reservationsFilterDebt) return false;
    if (state.reservationsFilterName) {
      const name = String(row.guest_name || "").toLowerCase();
      if (!name.includes(state.reservationsFilterName)) return false;
    }
    if (state.reservationsFilterDocType && row.reservation_document_type !== state.reservationsFilterDocType) return false;

    const checkIn = toDateKey(row.check_in);
    const checkOut = toDateKey(row.check_out);
    if (state.reservationsFilterCheckInFrom && checkIn && checkIn < state.reservationsFilterCheckInFrom) return false;
    if (state.reservationsFilterCheckInTo && checkIn && checkIn > state.reservationsFilterCheckInTo) return false;
    if (state.reservationsFilterCheckOutFrom && checkOut && checkOut < state.reservationsFilterCheckOutFrom) return false;
    if (state.reservationsFilterCheckOutTo && checkOut && checkOut > state.reservationsFilterCheckOutTo) return false;

    const nights = Number(row.nights);
    const hasMinNights = state.reservationsFilterMinNights !== "";
    const hasMaxNights = state.reservationsFilterMaxNights !== "";
    const minNights = Number(state.reservationsFilterMinNights);
    const maxNights = Number(state.reservationsFilterMaxNights);
    if (hasMinNights && Number.isFinite(minNights) && minNights >= 0 && Number.isFinite(nights) && nights < minNights) return false;
    if (hasMaxNights && Number.isFinite(maxNights) && maxNights >= 0 && Number.isFinite(nights) && nights > maxNights) return false;
    return true;
  });
}

function applyDocumentsFilters(rows) {
  return rows.filter((row) => {
    if (state.documentsFilterType && row.document_type !== state.documentsFilterType) return false;
    return true;
  });
}

function isReservationActiveOnDate(reservation, day) {
  const targetDay = toDateKey(day);
  const checkIn = toDateKey(reservation?.check_in);
  const checkOut = toDateKey(reservation?.check_out);
  if (!targetDay || !checkIn || !checkOut) return false;
  if (reservation.status === "cancelled") return false;
  return checkIn <= targetDay && targetDay < checkOut;
}

function renderAvailability(reservations) {
  const cabins = getOperationalCabins(state.cabins).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const total = cabins.length;
  const active = reservations.filter((row) => isReservationActiveOnDate(row, state.availabilityDate));
  const occupiedCabinIds = new Set(active.map((r) => r.cabin_id).filter((id) => Number.isInteger(id)));
  const occupied = Math.min(occupiedCabinIds.size || active.length, total);
  const free = Math.max(total - occupied, 0);
  const occupancyPct = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const totalEl = document.getElementById("cabins-total");
  const occupiedEl = document.getElementById("cabins-occupied");
  const freeEl = document.getElementById("cabins-free");
  const occupancyEl = document.getElementById("cabins-occupancy");
  if (totalEl) totalEl.textContent = String(total);
  if (occupiedEl) occupiedEl.textContent = String(occupied);
  if (freeEl) freeEl.textContent = String(free);
  if (occupancyEl) occupancyEl.textContent = `${occupancyPct}%`;

  const grid = document.getElementById("availability-grid");
  if (grid) {
    grid.innerHTML = cabins
      .map((cabin, index) => {
        const isOccupied = occupiedCabinIds.has(cabin.id);
        const images = cabin.images || [];
        const mainImg = images[0];
        const mainSrc = mainImg ? toDataUrl(mainImg.image_data_base64) : "";
        return `<li class="availability-house cabin-card ${isOccupied ? "is-occupied" : "is-free"}" data-cabin="${cabin.id}">
          <div class="cabin-card__img-wrap">
            ${mainSrc ? `<img class="cabin-card__img" src="${mainSrc}" alt="${cabin.name}" loading="lazy" />` : `<span class="house-icon">${isOccupied ? "🏠" : "🏡"}</span>`}
          </div>
          <span class="house-name">${cabinBadge(cabin)}</span>
          <div class="cabin-card__actions">
            <button type="button" class="btn btn--sm btn--ghost cabin-btn-gallery" data-cabin="${cabin.id}">Ver galería</button>
            <button type="button" class="btn btn--sm btn--ghost cabin-btn-edit" data-cabin="${cabin.id}">Editar imágenes</button>
          </div>
        </li>`;
      })
      .join("");
  }

  const list = document.getElementById("availability-reservations");
  if (list) {
    if (active.length === 0) {
      list.innerHTML = `<li class="availability-reservation-empty">Sin reservas activas para ${formatDate(state.availabilityDate)}.</li>`;
    } else {
      const rows = active
        .map((row) => {
          const cabin = cabins.find((c) => c.id === row.cabin_id) || null;
          return `<li class="record-item">
            <div class="record-main">
              <span class="record-title">
                ${cabin ? cabinBadge(cabin) : ""}
                <span class="record-title__guest">${row.guest_name}</span>
              </span>
              <span class="record-id">#${row.id}</span>
            </div>
            <div class="record-meta">
              ${chip(`Llegada ${formatDate(row.check_in)}${row.check_in_time ? " " + String(row.check_in_time).slice(0, 5) : ""}`)}
              ${chip(`Salida ${formatDate(row.check_out)}${row.checkout_time ? " " + String(row.checkout_time).slice(0, 5) : ""}`)}
              ${chip(`Canal ${sourceLabels[row.source] || row.source}`)}
              ${chip(`Estado ${row.status}`)}
            </div>
            <div class="record-actions">${releaseCabinButton(row.id)}</div>
          </li>`;
        })
        .join("");
      list.innerHTML = rows;
    }
  }
}

function renderOccupancyTimeline(reservations) {
  const container = document.getElementById("occupancy-timeline");
  if (!container) return;

  const cabins = getOperationalCabins(state.cabins).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const [yy, mm] = (state.calendarMonth || new Date().toISOString().slice(0, 7)).split("-").map(Number);
  const daysInMonth = new Date(yy, mm, 0).getDate();
  const today = new Date().toISOString().slice(0, 10);
  const selectedDate = state.availabilityDate || today;

  let html = `<div class="timeline-row timeline-header">
    <div class="timeline-cabin-label">Día del mes</div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    html += `<div class="timeline-day is-header">${d}</div>`;
  }
  html += `</div>`;

  cabins.forEach((cabin) => {
    html += `<div class="timeline-row">
      <div class="timeline-cabin-label" title="${cabin.name}">${cabin.short_code || cabin.name}</div>`;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${yy}-${String(mm).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const activeOnDay = reservations.filter(r => 
        r.cabin_id === cabin.id && 
        r.status !== "cancelled" &&
        toDateKey(r.check_in) <= dateKey && 
        dateKey < toDateKey(r.check_out)
      );

      const isOccupied = activeOnDay.length > 0;
      const isSelected = dateKey === selectedDate;
      const occClass = isOccupied ? "is-occupied" : "is-free";
      const selClass = isSelected ? "is-selected" : "";

      const guestCount = isOccupied ? activeOnDay.reduce((sum, r) => sum + (r.guests_count || 0), 0) : 0;
      const title = isOccupied 
        ? `${cabin.name}: ${activeOnDay[0].guest_name} (${guestCount} pax)`
        : `${cabin.name}: Disponible`;

      html += `<div class="timeline-day ${occClass} ${selClass}" 
                data-date="${dateKey}" 
                title="${title}">
                  ${isOccupied ? guestCount : ""}
               </div>`;
    }
    html += `</div>`;
  });

  container.innerHTML = html;

  // Eventos de clic
  container.querySelectorAll(".timeline-day:not(.is-header)").forEach(el => {
    el.addEventListener("click", () => {
      const date = el.dataset.date;
      if (!date) return;
      state.availabilityDate = date;
      const dateInput = document.getElementById("availability-date");
      if (dateInput) dateInput.value = date;

      // Actualizar vista sin recargar todo (más rápido)
      renderOccupancyTimeline(reservations);
      renderAvailability(reservations);
      renderCalendar(reservations);

      // Scroll suave al detalle si es necesario
      const target = document.getElementById("availability-reservations");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

const MONTH_NAMES = [
"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function getOccupancyForDate(reservations, dateKey, totalCabins, allowedCabinIds = null) {
  const active = reservations.filter((r) => {
    if (r.status === "cancelled") return false;
    const checkIn = toDateKey(r.check_in);
    const checkOut = toDateKey(r.check_out);
    return checkIn && checkOut && checkIn <= dateKey && dateKey < checkOut;
  });
  const scoped = allowedCabinIds
    ? active.filter((r) => Number.isInteger(r.cabin_id) && allowedCabinIds.has(r.cabin_id))
    : active;
  const occupiedCabinIds = new Set(scoped.map((r) => r.cabin_id).filter((id) => Number.isInteger(id)));
  const occupied = Math.min(occupiedCabinIds.size || scoped.length, totalCabins);
  const pct = totalCabins > 0 ? Math.round((occupied / totalCabins) * 100) : 0;
  return { occupied, pct };
}

function getActiveReservationsForDate(reservations, dateKey) {
  return reservations.filter((r) => {
    if (r.status === "cancelled") return false;
    const checkIn = toDateKey(r.check_in);
    const checkOut = toDateKey(r.check_out);
    return checkIn && checkOut && checkIn <= dateKey && dateKey < checkOut;
  });
}

function getCabinColor(cabin) {
  if (!cabin) return "#94a3b8";
  const defaults = getCabinVisualDefaults(cabin);
  return cabin.color_hex || defaults.color;
}

function getDayGuestLines(activeReservations, cabins) {
  const cabinById = new Map((cabins || []).map((c) => [Number(c.id), c]));
  return activeReservations
    .filter((row) => String(row.guest_name || "").trim())
    .map((row) => {
      const name = String(row.guest_name || "").trim().toUpperCase();
      const guests = Number(row.guests_count) || 1;
      const cabin = cabinById.get(Number(row.cabin_id));
      const color = getCabinColor(cabin);
      return { label: `${name} X${guests}`, color, status: row.status };
    });
}

function renderDayCabinChips(cabins, activeReservations) {
  const occupied = new Set(activeReservations.map((r) => r.cabin_id).filter((id) => Number.isInteger(id)));
  return cabins
    .map((cabin, idx) => {
      const rawCode = String(cabin.short_code || "").trim().toUpperCase();
      const code = rawCode ? rawCode.charAt(0) : (idx === 0 ? "A" : idx === 1 ? "B" : idx === 2 ? "P" : "C");
      const colorClass = idx === 0 ? "is-a" : idx === 1 ? "is-b" : idx === 2 ? "is-p" : "is-c";
      const activeClass = occupied.has(cabin.id) ? "is-active" : "";
      return `<span class="calendar-cabin-chip ${colorClass} ${activeClass}">${code}</span>`;
    })
    .join("");
}

function renderCalendarDay(dateKey, dayLabel, dayClasses, reservations, cabins, totalCabins) {
  const allowedCabinIds = new Set(cabins.map((c) => c.id).filter((id) => Number.isInteger(id)));
  const active = getActiveReservationsForDate(reservations, dateKey)
    .filter((r) => Number.isInteger(r.cabin_id) && allowedCabinIds.has(r.cabin_id));
  const occ = getOccupancyForDate(reservations, dateKey, totalCabins, allowedCabinIds);
  const occClass = occ.pct >= 100 ? "is-full" : occ.pct > 0 ? "is-partial" : "is-free";
  const guests = getDayGuestLines(active, cabins);
  const isPdf = state.calendarView === "pdf";
  const guestHtml = guests.length
    ? guests
        .map(
          (line) => {
            const confirmedClass = isPdf && line.status === "confirmed" ? " is-confirmed" : "";
            if (isPdf) {
              return `<span class="calendar-guest-row${confirmedClass}">${line.label}</span>`;
            }
            return `<span class="calendar-guest-row" style="border-left-color:${line.color};background:${line.color}22">${line.label}</span>`;
          }
        )
        .join("")
    : `<span class="calendar-guest-row is-empty"></span>`;
  return `<button type="button" class="calendar-day ${dayClasses} ${occClass}" data-date="${dateKey}">
    <span class="calendar-day__head">
      <span class="calendar-day__num">${dayLabel}</span>
      <span class="calendar-day__ratio">${occ.occupied}/${totalCabins}</span>
    </span>
    <span class="calendar-day__guest-list">${guestHtml}</span>
    <span class="calendar-day__cabin-row">${renderDayCabinChips(cabins, active)}</span>
  </button>`;
}

function getCalendarCabins(cabins) {
  return getOperationalCabins(cabins || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

function renderCalendar(reservations) {
  const container = document.getElementById("calendar-days");
  const titleEl = document.getElementById("calendar-title");
  const gridEl = document.getElementById("calendar-grid");
  if (!container || !titleEl) return;

  const cabins = getCalendarCabins(state.cabins);
  const totalCabins = Math.max(1, cabins.length);

  const [yy, mm] = (state.calendarMonth || new Date().toISOString().slice(0, 7)).split("-").map(Number);
  const firstDay = new Date(yy, mm - 1, 1);
  const lastDay = new Date(yy, mm, 0);
  const startPad = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  titleEl.textContent = `${MONTH_NAMES[mm - 1]} ${yy}`;

  if (gridEl) {
    gridEl.classList.toggle("is-pdf", state.calendarView === "pdf");
    const weekdaySpans = gridEl.querySelectorAll(".calendar-weekdays span");
    const labels = state.calendarView === "pdf"
      ? ["LU", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"]
      : ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
    weekdaySpans.forEach((el, i) => {
      if (labels[i]) el.textContent = labels[i];
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  const selected = state.availabilityDate || today;

  let html = "";
  for (let i = 0; i < startPad; i++) {
    const prevMonth = new Date(yy, mm - 1, -startPad + i + 1);
    const d = prevMonth.toISOString().slice(0, 10);
    html += renderCalendarDay(d, prevMonth.getDate(), "is-other-month", reservations, cabins, totalCabins);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${yy}-${String(mm).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isToday = dateKey === today ? " is-today" : "";
    const isSelected = dateKey === selected ? " is-selected" : "";
    html += renderCalendarDay(dateKey, d, `${isToday}${isSelected}`.trim(), reservations, cabins, totalCabins);
  }
  const totalCells = startPad + daysInMonth;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 0; i < remaining; i++) {
    const nextMonth = new Date(yy, mm, i + 1);
    const d = nextMonth.toISOString().slice(0, 10);
    html += renderCalendarDay(d, nextMonth.getDate(), "is-other-month", reservations, cabins, totalCabins);
  }
  container.innerHTML = html;
}

function setupCalendarControls() {
  const prevBtn = document.getElementById("calendar-prev");
  const nextBtn = document.getElementById("calendar-next");
  const dateInput = document.getElementById("availability-date");
  const viewBtn = document.getElementById("calendar-view-toggle");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const [yy, mm] = state.calendarMonth.split("-").map(Number);
      const d = new Date(yy, mm - 2, 1);
      state.calendarMonth = d.toISOString().slice(0, 7);
      loadAll();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const [yy, mm] = state.calendarMonth.split("-").map(Number);
      const d = new Date(yy, mm, 1);
      state.calendarMonth = d.toISOString().slice(0, 7);
      loadAll();
    });
  }

  if (viewBtn) {
    const applyLabel = () => {
      viewBtn.textContent = state.calendarView === "pdf" ? "Vista panel" : "Vista PDF";
    };
    applyLabel();
    viewBtn.addEventListener("click", () => {
      state.calendarView = state.calendarView === "pdf" ? "panel" : "pdf";
      window.localStorage.setItem("calendar_view", state.calendarView);
      applyLabel();
      loadAll();
    });
  }

  document.body.addEventListener("click", (e) => {
    const dayBtn = e.target.closest(".calendar-day[data-date]");
    if (!dayBtn) return;
    const date = dayBtn.dataset.date;
    if (!date) return;
    state.availabilityDate = date;
    if (dateInput) dateInput.value = date;
    setStatus(`Cargando disponibilidad para ${formatDate(date)}...`);
    loadAll().then(() => {
      setStatus(`Disponibilidad actualizada para ${formatDate(state.availabilityDate)}`, "ok");
      const target = document.getElementById("cabins-occupied");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

let editingCabinId = 0;
let editingCabinImagesList = [];

function openCabinGallery(cabinId) {
  const images = getCabinImages(cabinId);
  const titleEl = document.getElementById("cabin-gallery-title");
  const contentEl = document.getElementById("cabin-gallery-content");
  const modal = document.getElementById("cabin-gallery-modal");
  if (!titleEl || !contentEl || !modal) return;
  titleEl.textContent = `Galería · ${getCabinName(cabinId)}`;
  if (images.length === 0) {
    contentEl.innerHTML = "<p class=\"form-helper\">Sin imágenes. Usa \"Editar imágenes\" para agregar.</p>";
  } else {
    contentEl.innerHTML = images
      .map((img) => {
        const src = toDataUrl(img.image_data_base64);
        return `<img src="${src}" alt="${img.caption || ""}" loading="lazy" />`;
      })
      .join("");
  }
  openModal(modal);
}

function renderCabinEditList() {
  const list = document.getElementById("cabin-edit-list");
  if (!list) return;
  list.innerHTML = editingCabinImagesList
    .map(
      (img, idx) => `<li data-index="${idx}">
        <img src="${toDataUrl(img.image_data_base64)}" alt="" />
        <button type="button" class="cabin-edit-remove" data-index="${idx}" aria-label="Quitar">×</button>
      </li>`
    )
    .join("");
}

function openCabinEdit(cabinId) {
  editingCabinId = cabinId;
  editingCabinImagesList = getCabinImages(cabinId).map((img) => ({
    image_data_base64: img.image_data_base64,
    caption: img.caption || ""
  }));
  const titleEl = document.getElementById("cabin-edit-title");
  const modal = document.getElementById("cabin-edit-modal");
  const fileInput = document.getElementById("cabin-edit-file");
  if (titleEl) titleEl.textContent = `Editar imágenes · ${getCabinName(cabinId)}`;
  if (fileInput) fileInput.value = "";
  renderCabinEditList();
  openModal(modal);
}

function openCabinFormModal(cabin) {
  const modal = document.getElementById("cabin-form-modal");
  const form = document.getElementById("cabin-form");
  const title = document.getElementById("cabin-form-title");
  if (!modal || !form || !title) {
    setStatus("No se pudo abrir el editor de cabañas (falta modal/form). Recarga la página.", "error");
    return;
  }

  const setVal = (selector, value) => {
    const el = form.querySelector(selector);
    if (el) el.value = value;
  };

  if (cabin) {
    title.textContent = "Editar cabaña";
    setVal('[name="cabin_id"]', String(cabin.id || ""));
    setVal('[name="name"]', cabin.name || "");
    setVal('[name="description"]', cabin.description || "");
    setVal('[name="sort_order"]', String(cabin.sort_order ?? 0));
    setVal('[name="nightly_rate"]', String(cabin.nightly_rate ?? 0));
    setVal('[name="short_code"]', cabin.short_code || "");
    setVal('[name="color_hex"]', cabin.color_hex || "");
    setVal('[name="icon"]', cabin.icon || "");
    setVal('[name="size_category"]', cabin.size_category || "small");
    setVal('[name="max_guests"]', String(cabin.max_guests || 4));

    const amenities = Array.isArray(cabin.amenities) ? cabin.amenities : [];
    form.querySelectorAll('[name="amenities"]').forEach((cb) => {
      cb.checked = amenities.includes(cb.value);
    });
  } else {
    title.textContent = "Nueva cabaña";
    form.reset();
    setVal('[name="cabin_id"]', "");
    setVal('[name="sort_order"]', "0");
    setVal('[name="nightly_rate"]', "0");
    setVal('[name="max_guests"]', "4");
    setVal('[name="size_category"]', "small");
    setVal('[name="description"]', "Dormitorio principal: Cama 2 plazas.\nAltillo: Cama 1 plaza.\nLiving: Futón.\n1 Baño con ducha.\nCocina americana equipada.\nCalefacción bosca a pellet.");
    
    // Default amenities for AvA Refugios
    const defaultAmenities = ["wifi", "parking", "kitchen", "terrace", "trails", "fireplace", "pet_friendly"];
    form.querySelectorAll('[name="amenities"]').forEach((cb) => {
      cb.checked = defaultAmenities.includes(cb.value);
    });
  }
  openModal(modal);
}

function bindCabinForm() {
  const form = document.getElementById("cabin-form");
  if (!form) return;

  const sizeSelect = form.querySelector('[name="size_category"]');
  const guestsInput = form.querySelector('[name="max_guests"]');
  const descInput = form.querySelector('[name="description"]');
  
  if (sizeSelect && guestsInput && descInput) {
    sizeSelect.addEventListener("change", () => {
      if (sizeSelect.value === "large") {
        guestsInput.value = "8";
        descInput.value = "Dormitorio principal: Cama 2 plazas.\nSegundo dormitorio: 2 camas individuales.\nTercer dormitorio: 2 literas (4 camas).\n2 Baños completos.\nLiving amplio, cocina americana.\nEstufa a leña y parafina.";
      } else {
        guestsInput.value = "4";
        descInput.value = "Dormitorio principal: Cama 2 plazas.\nAltillo: Cama 1 plaza.\nLiving: Futón.\n1 Baño con ducha.\nCocina americana equipada.\nCalefacción bosca a pellet.";
      }
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const cabinId = form.querySelector('[name="cabin_id"]').value;
    const amenities = Array.from(form.querySelectorAll('[name="amenities"]:checked')).map((cb) => cb.value);
    const payload = {
      name: form.querySelector('[name="name"]').value,
      description: form.querySelector('[name="description"]').value,
      sort_order: parseInt(form.querySelector('[name="sort_order"]').value, 10) || 0,
      nightly_rate: Number(form.querySelector('[name="nightly_rate"]').value || 0),
      short_code: form.querySelector('[name="short_code"]').value || null,
      color_hex: form.querySelector('[name="color_hex"]').value || null,
      icon: form.querySelector('[name="icon"]').value || null,
      size_category: form.querySelector('[name="size_category"]').value,
      max_guests: Number(form.querySelector('[name="max_guests"]').value || 0),
      amenities: amenities
    };
    setStatus("Guardando...", "");
    try {
      if (cabinId) {
        await api(`/api/cabins/${cabinId}`, { method: "PATCH", body: JSON.stringify(payload) });
        setStatus("Cabaña actualizada", "ok");
      } else {
        const result = await api("/api/cabins", { method: "POST", body: JSON.stringify(payload) });
        setStatus("Cabaña creada. Ahora puedes gestionar sus fotos.", "ok");
        if (result && result.id) {
          openCabinEdit(result.id);
        }
      }
      form.reset();
      await loadAll();
      closeModal(document.getElementById("cabin-form-modal"));
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
}

function bindCabinFormOpenButtons() {
  document.body.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-modal-open=\"cabin-form-modal\"]");
    if (btn) {
      openCabinFormModal(null);
      event.stopPropagation();
      return;
    }
    const editBtn = event.target.closest(".cabin-btn-edit-form");
    if (editBtn) {
      const cabinId = Number(editBtn.dataset.cabinId);
      if (Number.isInteger(cabinId) && cabinId >= 1) {
        const cabin = (state.cabins || []).find((c) => c.id === cabinId);
        openCabinFormModal(cabin || { id: cabinId, name: "", description: "", sort_order: 0 });
      }
      return;
    }
  });
}

function bindCabinGalleryAndEdit() {
  document.body.addEventListener("click", (event) => {
    const galleryBtn = event.target.closest(".cabin-btn-gallery");
    if (galleryBtn) {
      const cabinId = Number(galleryBtn.dataset.cabin);
      if (Number.isInteger(cabinId) && cabinId >= 1) openCabinGallery(cabinId);
      return;
    }
    const editBtn = event.target.closest(".cabin-btn-edit");
    if (editBtn) {
      const cabinId = Number(editBtn.dataset.cabin);
      if (Number.isInteger(cabinId) && cabinId >= 1) openCabinEdit(cabinId);
      return;
    }
    const removeBtn = event.target.closest(".cabin-edit-remove");
    if (removeBtn) {
      const idx = Number(removeBtn.dataset.index);
      if (Number.isInteger(idx) && idx >= 0 && idx < editingCabinImagesList.length) {
        editingCabinImagesList.splice(idx, 1);
        renderCabinEditList();
      }
    }
  });

  const fileInput = document.getElementById("cabin-edit-file");
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const files = Array.from(fileInput.files || []);
      if (files.length === 0) return;
      const remaining = Math.max(0, 10 - editingCabinImagesList.length);
      const toAdd = files.slice(0, remaining);
      toAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          editingCabinImagesList.push({ image_data_base64: reader.result, caption: "" });
          if (editingCabinImagesList.length <= 10) renderCabinEditList();
        };
        reader.readAsDataURL(file);
      });
      fileInput.value = "";
    });
  }

  const saveBtn = document.getElementById("cabin-edit-save");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      if (editingCabinId < 1) return;
      setStatus("Guardando imágenes...");
      try {
        await api(`/api/cabins/${editingCabinId}/images`, {
          method: "PATCH",
          body: JSON.stringify({
            images: editingCabinImagesList.map((img) => ({
              image_data_base64: img.image_data_base64,
              caption: img.caption || null
            }))
          })
        });
        await loadAll();
        closeModal(document.getElementById("cabin-edit-modal"));
        setStatus("Imágenes guardadas", "ok");
      } catch (error) {
        setStatus(error.message, "error");
      }
    });
  }
}

function bindAvailabilityActions() {
  document.body.addEventListener("click", async (event) => {
    const releaseButton = event.target.closest(".btn-release-cabin");
    if (!releaseButton) return;

    const id = Number(releaseButton.dataset.releaseId);
    if (!Number.isInteger(id) || id <= 0) return;

    const confirmed = window.confirm(`Liberar cabaña de la reserva #${id}?`);
    if (!confirmed) return;

    setStatus("Liberando cabaña...");
    try {
      await api(`/api/reservations/${id}/release`, { method: "PATCH" });
      await loadAll();
      setStatus(`Cabaña liberada (reserva #${id})`, "ok");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
}

function setupAvailabilityControls() {
  const dateInput = document.getElementById("availability-date");
  if (dateInput) {
    dateInput.value = state.availabilityDate;
    dateInput.addEventListener("change", async () => {
      state.availabilityDate = dateInput.value || new Date().toISOString().slice(0, 10);
      if (state.availabilityDate) state.calendarMonth = state.availabilityDate.slice(0, 7);
      await loadAll();
      setStatus(`Disponibilidad actualizada para ${formatDate(state.availabilityDate)}`, "ok");
    });
  }
}

async function loadAll() {
  const [yy, mm] = (state.calendarMonth || new Date().toISOString().slice(0, 7)).split("-").map(Number);
  const baseDate = new Date(yy, mm - 1, 1);
  const wideFrom = new Date(baseDate.getTime() - 90 * 86400000).toISOString().slice(0, 10);
  const wideTo   = new Date(baseDate.getTime() + 180 * 86400000).toISOString().slice(0, 10);
  const reservationsQs = buildReservationsQs({ includePeriod: true });
  const expensesQs = buildExpensesQs();

  const [guests, reservations, wideReservations, sales, expenses, expensesMeta, documents, cabinsData] = await Promise.all([
    api("/api/guests"),
    api(`/api/reservations${reservationsQs}`),
    api(`/api/reservations?from=${wideFrom}&to=${wideTo}`),
    api(`/api/sales${periodQs()}`),
    api(`/api/expenses${expensesQs}`),
    api("/api/expenses/meta").catch(() => ({ categories: [], category_options: [], category_labels: {} })),
    api("/api/documents"),
    api("/api/cabins").catch(() => ({ cabins: [] }))
  ]);
  state.cabins = cabinsData.cabins || [];
  if (typeof refreshVentasCabinFilter === 'function') refreshVentasCabinFilter();
  state.sales = sales;
  state.expenses = expenses;
  state.expensesMeta = expensesMeta || { categories: [], category_options: [], category_labels: {} };
  state.reservations = reservations;

  const filteredReservations = reservations;
  const filteredSales = filterRows(sales, "sale_date");
  const filteredExpenses = expenses;
  const filteredDocuments = filterRows(documents, "issue_date");
  const filteredGuests = state.periodFrom || state.periodTo
    ? guests.filter((row) => inDateRange(row.reservation_check_in, state.periodFrom, state.periodTo))
    : guests;

  renderSummary({
    sales: filteredSales,
    expenses: filteredExpenses,
    reservations: filteredReservations
  });
  renderAvailability(wideReservations);
  renderCalendar(wideReservations);
  renderOccupancyTimeline(wideReservations);

  const orderedGuests = [...filteredGuests].sort((a, b) => {
    const debtDiff = debtPriority(a.reservation_debt_status) - debtPriority(b.reservation_debt_status);
    if (debtDiff !== 0) return debtDiff;
    return dateWeight(b.reservation_check_in) - dateWeight(a.reservation_check_in);
  });

  const orderedReservations = [...filteredReservations].sort((a, b) => {
    const debtDiff = debtPriority(a.debt_status) - debtPriority(b.debt_status);
    if (debtDiff !== 0) return debtDiff;
    return dateWeight(a.check_in) - dateWeight(b.check_in);
  });

  const orderedExpenses = [...filteredExpenses].sort((a, b) => dateWeight(b.expense_date) - dateWeight(a.expense_date));
  const orderedDocuments = [...filteredDocuments].sort((a, b) => dateWeight(b.issue_date) - dateWeight(a.issue_date));

  const guestsForView = applyGuestsFilters(orderedGuests);
  renderList("guests-list", guestsForView, (row) => {
    const hasReservation = Boolean(row.reservation_id);
    const meta = hasReservation
      ? [
          chip(`Cabaña: ${row.cabin_name || "Sin asignar"}`),
          chip(`Canal/Pago ${formatChannelPaymentLabel(row.reservation_source, row.reservation_payment_method)}`),
          chip(`Llega ${formatDate(row.reservation_check_in)}`),
          chip(`Sale ${formatDate(row.reservation_check_out)}`),          row.reservation_nights != null ? chip(`${row.reservation_nights} noche${Number(row.reservation_nights) === 1 ? "" : "s"}`) : "",
          Number(row.guest_alias_count || 0) > 1 ? chip(`Alias ${Number(row.guest_alias_count || 0)}`) : "",
          Number(row.guest_paid_before_latest || 0) > 0 ? chip(`Pagado previo ${money.format(row.guest_paid_before_latest || 0)}`) : "",
          Number(row.guest_total_nights || 0) > 0 ? chip(`Noches totales ${Number(row.guest_total_nights || 0)}`) : "",
          Number(row.guest_total_paid_amount || 0) > 0 ? chip(`Pagado histórico ${money.format(row.guest_total_paid_amount || 0)}`) : "",
          chip(debtLabel(row.reservation_debt_status, row.reservation_amount_due), debtClass(row.reservation_debt_status))
        ].join("")
      : chip("Sin reservas asociadas");

    return `<li class="record-item">
      <div class="record-main">
        <span class="record-title">${row.full_name} ${row.document_id ? `<span class="record-id">(${row.document_id})</span>` : ""}</span>
        <span class="record-id">#${row.id}</span>
      </div>
      <div class="record-meta">
        ${row.email ? chip(`📧 ${row.email}`) : ""}
        ${row.phone ? chip(`📞 ${row.phone}`) : ""}
        ${meta}
      </div>
      <div class="record-actions">${editGuestButton(row)} ${deleteButton("guests", row.id)}</div>
    </li>`;
  });

  const reservationsForView = applyReservationsFilters(orderedReservations);
  renderList("reservations-list", reservationsForView, (row) => `<li class="record-item">
      <div class="record-main">
        <span class="record-title">${row.guest_name} ${row.guest_document ? `<span class="record-id">(${row.guest_document})</span>` : ""}</span>
        <span class="record-id">#${row.id}</span>
      </div>
      <div class="record-meta">
        ${chip(`Canal/Pago ${formatChannelPaymentLabel(row.source, row.payment_method)}`)}
        ${chip(`Llega ${formatDate(row.check_in)}${row.check_in_time ? " " + String(row.check_in_time).slice(0, 5) : ""}`)}
        ${chip(`Sale ${formatDate(row.check_out)}${row.checkout_time ? " " + String(row.checkout_time).slice(0, 5) : ""}`)}
        ${row.nights != null ? chip(`${row.nights} noche${Number(row.nights) === 1 ? "" : "s"}`) : ""}
        ${chip(`Total ${money.format(row.total_amount)}`)}
        ${chip(`Abonado ${money.format(row.paid_amount || 0)}`)}
        ${chip(debtLabel(row.debt_status, row.amount_due), debtClass(row.debt_status))}
      </div>
      <div class="record-actions">
        ${row.debt_status !== "paid" ? `<button class="btn btn--sm btn--accent" data-cobrar-id="${row.id}" data-cobrar-amount="${row.amount_due || 0}" data-cobrar-guest="${row.guest_name || ""}">Cobrar</button>` : ""}
        ${deleteButton("reservations", row.id)}
      </div>
    </li>`);

  refreshExpenseCategoryOptions(orderedExpenses);
  refreshExpenseCategoryInputOptions(orderedExpenses);
  const expensesForView = applyExpensesFilters(orderedExpenses);
  renderExpensesKpis(expensesForView);
  renderExpensesTable(expensesForView);

  const documentsForView = applyDocumentsFilters(orderedDocuments);
  renderList("documents-list", documentsForView, (row) => `<li class="record-item">
      <div class="record-main">
        <span class="record-title">${row.document_type.toUpperCase()} ${row.document_number || "S/N"}</span>
        <span class="record-id">#${row.id}</span>
      </div>
      <div class="record-meta">
        ${chip(`Fecha ${formatDate(row.issue_date)}`)}
        ${chip(`Monto ${money.format(row.amount)}`)}
        ${row.reservation_id ? chip(`Reserva #${row.reservation_id}`) : ""}
        ${row.sale_id ? chip(`Venta #${row.sale_id}`) : ""}
      </div>
      <div class="record-actions">${deleteButton("documents", row.id)}</div>
    </li>`);

  renderCabinsList(state.cabins);
  const cabinSelect = document.getElementById("reservation-cabin");
  if (cabinSelect) {
    const current = cabinSelect.value;
    cabinSelect.innerHTML =
      '<option value="">Seleccionar</option>' +
      getOperationalCabins(state.cabins)
        .map((c) => {
          const code = c.short_code || c.name || "";
          const size =
            c.size_category === "large" ? "Grande" : c.size_category === "small" ? "Pequeña" : "";
          const capacity =
            `(${getCabinCapacity(c)} pax)`;
          const amenities = Array.isArray(c.amenities) ? c.amenities : [];
          const amenityIconsMap = {
            pool: "🏊",
            breakfast: "☕",
            breakfast_included: "☕",
            breakfast_optional: "☕+",
            wifi: "📶",
            parking: "🅿️",
            pet_friendly: "🐾",
            hot_tub: "♨️",
            fireplace: "🔥",
            heating: "🌡️"
          };
          const amenityIcons = amenities
            .map((a) => amenityIconsMap[a])
            .filter(Boolean)
            .slice(0, 3)
            .join(" ");
          const nightlyRate = Number(c.nightly_rate || 0);
          const price = nightlyRate > 0 ? ` — ${money.format(nightlyRate)}/noche` : "";
          const extras = [size, capacity].filter(Boolean).join(" ");
          const labelCore = `${code} ${extras ? `· ${extras}` : ""}`.trim();
          const labelAmenities = amenityIcons ? ` · ${amenityIcons}` : "";
          return `<option value="${c.id}">${labelCore}${labelAmenities}${price}</option>`;
        })
        .join("");
    if (current) cabinSelect.value = current;
    cabinSelect.dispatchEvent(new Event("change"));
  }
  refreshMonthlyReportTables();
  if (typeof refreshGastosDash === "function") refreshGastosDash();
  if (typeof refreshReservasDash === "function") refreshReservasDash();
  if (typeof refreshCabanasDash === "function") refreshCabanasDash();
}

function refreshMonthlyReportTables() {
  if (!state.sales || !state.expenses) return;
  const { from, to } = getDashboardVentasPeriod();
  if (!from || !to) return;
  const sales = (state.sales || []).filter((r) => inDateRange(r.sale_date, from, to));
  const expenses = (state.expenses || []).filter((r) => inDateRange(r.expense_date, from, to));
  renderMonthlyTables(from, to, sales, expenses);
}

let chartSalesExpenses = null;
let chartOccupancy = null;

async function loadDashboardAnalytics() {
  const params = new URLSearchParams();
  if (state.periodFrom) params.set("from", state.periodFrom);
  if (state.periodTo) params.set("to", state.periodTo);
  try {
    const data = await api(`/api/dashboard/analytics?${params}`);
    renderDashboardCharts(data);
    renderDashboardAlerts(data.alerts || []);
    const cabins = data.cabinsTotal || (state.cabins || []).length || 1;
    const infoCabins = document.getElementById("info-cabins");
    const infoAlerts = document.getElementById("info-alerts-count");
    const infoSales = document.getElementById("info-sales-total");
    if (infoCabins) infoCabins.textContent = `${cabins} cabaña${cabins !== 1 ? "s" : ""}`;
    if (infoAlerts) infoAlerts.textContent = `${(data.alerts || []).length} alerta${(data.alerts || []).length !== 1 ? "s" : ""}`;
    if (infoSales) infoSales.textContent = money.format(data.totals?.sales || 0);
  } catch (err) {
    if (chartSalesExpenses) {
      chartSalesExpenses.destroy();
      chartSalesExpenses = null;
    }
    if (chartOccupancy) {
      chartOccupancy.destroy();
      chartOccupancy = null;
    }
  }
}

function renderDashboardCharts(data) {
  const months = data.months || [];
  const salesData = (data.salesByMonth || []).map((r) => r.total);
  const expensesData = (data.expensesByMonth || []).map((r) => r.total);
  const occupancyData = (data.occupancyByMonth || []).map((r) => r.ocupacion_pct || 0);

  const isDark = document.documentElement.dataset.theme !== "light";
  const textColor = isDark ? "rgba(240,244,248,0.9)" : "rgba(15,23,42,0.85)";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";
  const tooltipBg = isDark ? "rgba(26,35,50,0.95)" : "rgba(255,255,255,0.95)";
  const tooltipFg = isDark ? "rgba(240,244,248,0.95)" : "rgba(15,23,42,0.9)";
  const chartOpts = (extra) => ({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: "top", labels: { color: textColor } },
      tooltip: { backgroundColor: tooltipBg, titleColor: tooltipFg, bodyColor: tooltipFg }
    },
    scales: extra?.scales || {}
  });

  const ctxSales = document.getElementById("chart-sales-expenses");
  if (ctxSales && typeof Chart !== "undefined") {
    if (chartSalesExpenses) chartSalesExpenses.destroy();
    chartSalesExpenses = new Chart(ctxSales, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          { label: "Ventas", data: salesData, backgroundColor: "rgba(52,211,153,0.5)", borderColor: "#34d399", borderWidth: 1 },
          { label: "Gastos", data: expensesData, backgroundColor: "rgba(248,113,113,0.5)", borderColor: "#f87171", borderWidth: 1 }
        ]
      },
      options: {
        ...chartOpts(),
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true }
        }
      }
    });
  }

  const ctxOcc = document.getElementById("chart-occupancy");
  if (ctxOcc && typeof Chart !== "undefined") {
    if (chartOccupancy) chartOccupancy.destroy();
    chartOccupancy = new Chart(ctxOcc, {
      type: "line",
      data: {
        labels: months,
        datasets: [{ label: "Ocupación %", data: occupancyData, borderColor: "#60a5fa", backgroundColor: "rgba(96,165,250,0.2)", fill: true, tension: 0.3 }]
      },
      options: {
        ...chartOpts(),
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { color: gridColor }, min: 0, max: 100 }
        }
      }
    });
  }
}

function renderDashboardAlerts(alerts) {
  const wrap = document.getElementById("dashboard-alerts");
  const list = document.getElementById("dashboard-alerts-list");
  if (!wrap || !list) return;
  if (!alerts || alerts.length === 0) {
    wrap.hidden = true;
    list.innerHTML = "";
    return;
  }
  wrap.hidden = false;
  list.innerHTML = alerts
    .map((a) => `<li class="alert--${a.type || 'info'}"><strong>${a.title || ""}</strong> ${a.message || ""}</li>`)
    .join("");
}

function renderCabinsList(cabins) {
  const list = document.getElementById("cabins-list");
  if (!list) return;
  const sorted = getOperationalCabins(cabins).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  list.innerHTML = sorted
    .map((cabin) => {
      const mainImg = (cabin.images || [])[0];
      const mainSrc = mainImg ? toDataUrl(mainImg.image_data_base64) : "";
      const nightlyRate = Number(cabin.nightly_rate || 0);
      const price =
        nightlyRate > 0
          ? `<p class="cabin-record__price">Tarifa: ${money.format(nightlyRate)}</p>`
          : `<p class="cabin-record__price cabin-record__price--missing">Tarifa: no configurada</p>`;
      return `<li class="record-item cabin-record">
        <div class="cabin-record__thumb">
          ${mainSrc ? `<img src="${mainSrc}" alt="${cabin.name}" />` : `<span class="house-icon">🏡</span>`}
        </div>
        <div class="cabin-record__info">
          <span class="record-title">${cabinBadge(cabin)}</span>
          ${cabin.description ? `<p class="cabin-record__desc">${cabin.description}</p>` : ""}
          ${price}
        </div>
        <div class="record-actions">
          <button type="button" class="btn btn--sm btn--ghost cabin-btn-edit-form" data-cabin-id="${cabin.id}">Editar Datos</button>
          <button type="button" class="btn btn--sm btn--ghost cabin-btn-gallery" data-cabin="${cabin.id}">Ver Fotos</button>
          <button type="button" class="btn btn--sm btn--ghost cabin-btn-edit" data-cabin="${cabin.id}">Gestionar Fotos</button>
          ${deleteButton("cabins", cabin.id)}
        </div>
      </li>`;
    })
    .join("");
}

function bindForm(id, endpoint, successMessage) {
  const form = document.getElementById(id);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = normalize(toPayload(form));

    setStatus("Guardando...", "");

    try {
      await api(endpoint, { method: "POST", body: JSON.stringify(payload) });
      form.reset();
      await loadAll();
      closeModal(form.closest(".form-modal"));
      setStatus(successMessage, "ok");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
}

function bindGuestForm() {
  const form = document.getElementById("guest-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const raw = toPayload(form);

    const id = Number(raw.id || 0);
    const payload = normalize(raw);
    delete payload.id;

    if (payload.document_id != null) {
      const norm = normalizeDocumentId(payload.document_id);
      payload.document_id = norm || null;
    }
    if (payload.email != null) {
      const value = String(payload.email || "").trim();
      payload.email = value ? value : null;
    }
    if (payload.phone != null) {
      const value = String(payload.phone || "").trim();
      payload.phone = value ? value : null;
    }

    setStatus("Guardando...", "");

    try {
      if (Number.isInteger(id) && id > 0) {
        await api(`/api/guests/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await api("/api/guests", { method: "POST", body: JSON.stringify(payload) });
      }
      form.reset();
      await loadAll();
      closeModal(form.closest(".form-modal"));
      setStatus("Huésped guardado", "ok");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
}

async function lookupGuestByDocument(documentId) {
  return api(`/api/guests/by-document/${encodeURIComponent(documentId)}`);
}

function bindReservationGuestLookup() {
  const form = document.getElementById("reservation-form");
  if (!form) return;

  const documentInput = form.querySelector('input[name="guest_document_id"]');
  const guestNameInput = form.querySelector('input[name="guest_full_name"]');
  const guestEmailInput = form.querySelector('input[name="guest_email"]');
  const guestPhoneInput = form.querySelector('input[name="guest_phone"]');
  const guestIdInput = form.querySelector('input[name="guest_id"]');
  if (!documentInput || !guestIdInput || !guestNameInput) return;

  const clearGuest = () => {
    guestIdInput.value = "";
    setReservationGuestStatus("Ingresa RUT para buscar huésped.");
  };

  let lookupSeq = 0;
  let inputTimer = null;
  const runLookup = async () => {
    const rut = normalizeDocumentId(documentInput.value);
    documentInput.value = rut;
    if (!rut) {
      clearGuest();
      return;
    }
    if (rut === "0" || rut.length < 7) {
      guestIdInput.value = "";
      setReservationGuestStatus("Ingresa un RUT valido para buscar huesped.", "error");
      return;
    }

    const seq = ++lookupSeq;
    setReservationGuestStatus("Buscando huésped por RUT...");
    try {
      const guest = await lookupGuestByDocument(rut);
      if (seq !== lookupSeq) return;
      guestIdInput.value = String(guest.id);
      if (!guestNameInput.value) guestNameInput.value = guest.full_name || "";
      if (guestEmailInput && !guestEmailInput.value) guestEmailInput.value = guest.email || "";
      if (guestPhoneInput && !guestPhoneInput.value) guestPhoneInput.value = guest.phone || "";
      setReservationGuestStatus(`Huésped encontrado: ${guest.full_name} (#${guest.id})`, "ok");
    } catch (error) {
      if (seq !== lookupSeq) return;
      guestIdInput.value = "";
      if (error.message?.includes("no encontrado")) {
        setReservationGuestStatus("RUT no registrado. Escribe nombre para crearlo al guardar.", "error");
        return;
      }
      setReservationGuestStatus(`No se pudo buscar huésped: ${error.message}`, "error");
    }
  };

  documentInput.addEventListener("blur", runLookup);
  documentInput.addEventListener("change", runLookup);
  documentInput.addEventListener("input", () => {
    const prevGuestId = guestIdInput.value;
    guestIdInput.value = "";
    setReservationGuestStatus("Ingresa RUT para buscar huésped.");

    // Si habia un huésped "fijado" y cambias el RUT, limpia los campos para evitar datos stale.
    if (prevGuestId) {
      guestNameInput.value = "";
      if (guestEmailInput) guestEmailInput.value = "";
      if (guestPhoneInput) guestPhoneInput.value = "";
    }

    if (inputTimer) clearTimeout(inputTimer);
    const rut = normalizeDocumentId(documentInput.value);
    if (!rut || rut.length < 7) return;
    inputTimer = setTimeout(runLookup, 350);
  });

  const noRutCheckbox = form.querySelector('#no-rut-checkbox');
  if (noRutCheckbox) {
    noRutCheckbox.addEventListener("change", (e) => {
      const isNoRut = e.target.checked;
      documentInput.disabled = isNoRut;
      documentInput.required = !isNoRut;
      if (isNoRut) {
        documentInput.value = "";
        clearGuest();
        setReservationGuestStatus("Modo sin RUT activado. Ingresa el nombre para crearlo.");
      } else {
        setReservationGuestStatus("Ingresa RUT para buscar huésped.");
      }
    });
  }
}

function bindReservationForm() {
  const form = document.getElementById("reservation-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = normalize(toPayload(form));
    const noRutCheckbox = form.querySelector('#no-rut-checkbox');
    const isNoRut = noRutCheckbox && noRutCheckbox.checked;

    const rut = isNoRut ? null : normalizeDocumentId(payload.guest_document_id);
    payload.guest_document_id = rut;

    if (!rut && !isNoRut) {
      setStatus("Debes ingresar RUT del huésped", "error");
      setReservationGuestStatus("Debes ingresar RUT válido.", "error");
      return;
    }

    setStatus("Guardando...", "");
    try {
      let guestId = Number(payload.guest_id);
      if (!Number.isInteger(guestId) || guestId <= 0) {
        if (!payload.guest_full_name) {
          throw new Error("RUT no encontrado. Ingresa nombre para crear huésped.");
        }
        const createdGuest = await api("/api/guests", {
          method: "POST",
          body: JSON.stringify({
            full_name: payload.guest_full_name,
            document_id: rut,
            email: payload.guest_email || null,
            phone: payload.guest_phone || null
          })
        });
        guestId = Number(createdGuest.id);
      } else {
        const guestPatch = {};
        const name = String(payload.guest_full_name || "").trim();
        const email = String(payload.guest_email || "").trim();
        const phone = String(payload.guest_phone || "").trim();
        if (name) guestPatch.full_name = name;
        if (email) guestPatch.email = email;
        if (phone) guestPatch.phone = phone;
        if (Object.keys(guestPatch).length > 0) {
          await api(`/api/guests/${guestId}`, { method: "PATCH", body: JSON.stringify(guestPatch) });
        }
      }

      const channelPayment = String(payload.channel_payment || "").toLowerCase();
      const channelMapping = channelPaymentToReservation[channelPayment];
      const reservationPayload = {
        ...payload,
        guest_id: guestId,
        guest_name: payload.guest_full_name,
        guest_document: payload.guest_document_id,
        channel_payment: channelPayment,
        source: channelMapping?.source || payload.source,
        payment_method: channelMapping?.payment_method || payload.payment_method,
        check_in_time: payload.check_in_time || null,
        checkout_time: payload.checkout_time || null,
        additional_charge: payload.additional_charge || 0,
        tax_document_type: payload.tax_document_type || "sii",
        notes: payload.notes || null
      };

      if (!reservationPayload.source || !reservationPayload.payment_method) {
        throw new Error("Selecciona un canal / medio de pago valido.");
      }

      await api("/api/reservations", { method: "POST", body: JSON.stringify(reservationPayload) });
      form.reset();
      setReservationGuestStatus("Ingresa RUT para buscar huésped.");
      await loadAll();
      closeModal(form.closest(".form-modal"));
      setStatus("Reserva guardada", "ok");
    } catch (error) {
      setStatus(error.message, "error");
      setReservationGuestStatus(error.message, "error");
    }
  });
}

function bindReservationPricing() {
  const form = document.getElementById("reservation-form");
  if (!form) return;
  const checkInInput = form.querySelector('input[name="check_in"]');
  const checkOutInput = form.querySelector('input[name="check_out"]');
  const nightsInput = document.getElementById("reservation-nights");
  if (!checkInInput || !checkOutInput || !nightsInput) return;

  const recomputeNights = () => {
    const ci = checkInInput.value;
    const co = checkOutInput.value;
    if (ci && co) {
      const d1 = new Date(ci);
      const d2 = new Date(co);
      const diff = Math.max(0, Math.round((d2 - d1) / 86400000));
      nightsInput.value = String(diff);
    }
  };

  checkInInput.addEventListener("change", recomputeNights);
  checkOutInput.addEventListener("change", recomputeNights);
}

function bindGuestEditButtons() {
  document.body.addEventListener("click", async (event) => {
    const button = event.target.closest(".btn-edit-guest");
    if (!button) return;

    const action = button.dataset.action || "edit";
    const id = Number(button.dataset.guestId);
    if (!Number.isInteger(id) || id <= 0) return;

    const modal = document.getElementById("guest-modal");
    const form = document.getElementById("guest-form");
    if (!modal || !form) return;

    const title = modal.querySelector(".modal__header h3");
    if (title) title.textContent = action === "view" ? `Detalle de huésped #${id}` : `Editar huésped #${id}`;

    const saveBtn = form.querySelector('button[type="submit"]');
    if (saveBtn) saveBtn.style.display = action === "view" ? "none" : "";

    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      if (input.name !== "id") {
        if (action === "view") {
          input.disabled = true; // Usamos disabled para selects también
          input.readOnly = true;
        } else {
          input.disabled = false;
          input.readOnly = false;
        }
      }
    });

    form.querySelector('[name="id"]').value = String(id);
    form.querySelector('[name="full_name"]').value = decodeURIComponent(button.dataset.guestName || "");
    form.querySelector('[name="document_id"]').value = decodeURIComponent(button.dataset.guestDocument || "");
    form.querySelector('[name="email"]').value = decodeURIComponent(button.dataset.guestEmail || "");
    form.querySelector('[name="phone"]').value = decodeURIComponent(button.dataset.guestPhone || "");
    
    const taxTypeEl = form.querySelector('[name="tax_document_type"]');
    if (taxTypeEl) taxTypeEl.value = button.dataset.taxDocumentType || "sii";

    openModal(modal);
  });
}

function bindGuestHistoryButtons() {
  document.body.addEventListener("click", async (event) => {
    const button = event.target.closest(".btn-guest-history");
    if (!button) return;

    const guestId = Number(button.dataset.guestId);
    const guestName = button.dataset.guestName;
    if (!Number.isInteger(guestId) || guestId <= 0) return;

    const modal = document.getElementById("guest-history-modal");
    const title = document.getElementById("guest-history-title");
    const list = document.getElementById("guest-history-list");
    if (!modal || !list) return;

    if (title) title.textContent = `Historial de reservas: ${guestName}`;
    list.innerHTML = "<li class=\"record-item\">Cargando historial...</li>";
    openModal(modal);

    try {
      // Usamos el filtro guest_id que añadimos al backend
      const history = await api(`/api/reservations?guest_id=${guestId}`);
      
      if (history.length === 0) {
        list.innerHTML = "<li class=\"record-item\">No hay reservas registradas para este huésped.</li>";
      } else {
        list.innerHTML = history.map((row) => {
          const baseNightsTotal = (Number(row.nightly_rate || 0) * Number(row.nights || 0));
          const addCharge = Number(row.additional_charge || 0);
          const notes = row.notes || "Sin notas";
          
          return `
          <li class="record-item">
            <div class="record-main">
              <span class="record-title">${row.cabin_name || "Sin cabaña"}</span>
              <span class="record-id">Reserva #${row.id}</span>
            </div>
            <div class="record-meta">
              ${chip(`Check-in: ${formatDate(row.check_in)}`)}
              ${chip(`Noches: ${row.nights}`)}
              ${chip(`Base: ${money.format(baseNightsTotal)}`)}
              ${chip(`Adicional: ${money.format(addCharge)}`, addCharge > 0 ? "badge--warning" : "")}
              ${chip(`Notas: ${notes}`, "badge--ghost")}
              ${chip(`Total Final: ${money.format(row.total_amount)}`, "badge--info")}
              ${chip(debtLabel(row.debt_status, row.amount_due), debtClass(row.debt_status))}
            </div>
          </li>
        `;}).join("");
      }
    } catch (error) {
      list.innerHTML = `<li class="record-item status error">Error al cargar historial: ${error.message}</li>`;
    }
  });
}

function bindDeleteButtons() {
  // Delegación: botones "Cobrar" en reservas
  document.body.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-cobrar-id]");
    if (!btn) return;
    const id = Number(btn.dataset.cobrarId);
    const amount = Number(btn.dataset.cobrarAmount || 0);
    const guest = btn.dataset.cobrarGuest || "";
    openSaleModalForReservation(id, amount, guest);
  });

  document.body.addEventListener("click", async (event) => {
    const button = event.target.closest(".btn-delete");
    if (!button) return;

    const { deleteType, id } = button.dataset;
    if (!deleteType || !id) return;

    const confirmed = window.confirm(`Eliminar registro #${id}? Esta accion no se puede deshacer.`);
    if (!confirmed) return;

    setStatus("Eliminando...", "");

    try {
      await api(`/api/${deleteType}/${id}`, { method: "DELETE" });
      await loadAll();
      setStatus(`Registro #${id} eliminado`, "ok");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
}

function bindPeriodControls() {
  /* Filtro período movido a Dashboard Ventas (sección separada) */
}

function bindExpensesFilters() {
  const month = document.getElementById("expenses-filter-month");
  const payment = document.getElementById("expenses-filter-payment");
  const category = document.getElementById("expenses-filter-category");
  const supplier = document.getElementById("expenses-filter-supplier");
  const minAmount = document.getElementById("expenses-filter-min-amount");
  const maxAmount = document.getElementById("expenses-filter-max-amount");
  const text = document.getElementById("expenses-filter-text");
  if (month) {
    month.addEventListener("change", async () => {
      state.expensesFilterMonth = String(month.value || "").trim();
      state.expensesPage = 1;
      await loadAll();
    });
  }

  if (payment) {
    payment.addEventListener("change", async () => {
      state.expensesFilterPayment = payment.value || "";
      state.expensesPage = 1;
      await loadAll();
    });
  }

  if (category) {
    category.addEventListener("change", async () => {
      state.expensesFilterCategory = normalizeExpenseCategoryKey(category.value || "");
      state.expensesPage = 1;
      await loadAll();
    });
  }

  if (supplier) {
    supplier.addEventListener("input", async () => {
      state.expensesFilterSupplier = String(supplier.value || "").trim().toLowerCase();
      state.expensesPage = 1;
      await loadAll();
    });
  }

  if (minAmount) {
    minAmount.addEventListener("input", async () => {
      state.expensesFilterMinAmount = String(minAmount.value || "").trim();
      state.expensesPage = 1;
      await loadAll();
    });
  }

  if (maxAmount) {
    maxAmount.addEventListener("input", async () => {
      state.expensesFilterMaxAmount = String(maxAmount.value || "").trim();
      state.expensesPage = 1;
      await loadAll();
    });
  }

  if (text) {
    text.addEventListener("input", async () => {
      state.expensesFilterText = String(text.value || "").trim().toLowerCase();
      state.expensesPage = 1;
      await loadAll();
    });
  }
}

function bindExpensesPagination() {
  const container = document.getElementById("expenses-pagination");
  if (!container) return;
  container.addEventListener("click", async (event) => {
    const btn = event.target.closest("button[data-exp-pagination]");
    if (!btn) return;
    const direction = btn.getAttribute("data-exp-pagination");
    const totalPages = Math.max(1, Math.ceil(state.expensesTotalRows / state.expensesPageSize));
    if (direction === "prev" && state.expensesPage > 1) state.expensesPage -= 1;
    if (direction === "next" && state.expensesPage < totalPages) state.expensesPage += 1;
    await loadAll();
  });
  container.addEventListener("change", async (event) => {
    const select = event.target.closest("#expenses-page-size");
    if (!select) return;
    state.expensesPageSize = Number(select.value) || 10;
    state.expensesPage = 1;
    await loadAll();
  });
}

function bindGuestsFilters() {
  const debt = document.getElementById("guests-filter-debt");
  const name = document.getElementById("guests-filter-name");

  if (debt) {
    debt.addEventListener("change", async () => {
      state.guestsFilterDebt = debt.value || "";
      await loadAll();
    });
  }

  if (name) {
    name.addEventListener("input", async () => {
      state.guestsFilterName = String(name.value || "").trim().toLowerCase();
      await loadAll();
    });
  }
}

function bindReservationsFilters() {
  const source = document.getElementById("reservations-filter-source");
  const debt = document.getElementById("reservations-filter-debt");
  const name = document.getElementById("reservations-filter-name");
  const checkInFrom = document.getElementById("reservations-filter-check-in-from");
  const checkInTo = document.getElementById("reservations-filter-check-in-to");
  const checkOutFrom = document.getElementById("reservations-filter-check-out-from");
  const checkOutTo = document.getElementById("reservations-filter-check-out-to");
  const minNights = document.getElementById("reservations-filter-min-nights");
  const maxNights = document.getElementById("reservations-filter-max-nights");
  const docType = document.getElementById("reservations-filter-doc-type");

  if (source) {
    source.addEventListener("change", async () => {
      state.reservationsFilterSource = source.value || "";
      await loadAll();
    });
  }

  if (debt) {
    debt.addEventListener("change", async () => {
      state.reservationsFilterDebt = debt.value || "";
      await loadAll();
    });
  }

  if (name) {
    name.addEventListener("input", async () => {
      state.reservationsFilterName = String(name.value || "").trim().toLowerCase();
      await loadAll();
    });
  }

  if (checkInFrom) {
    checkInFrom.addEventListener("change", async () => {
      state.reservationsFilterCheckInFrom = checkInFrom.value || "";
      await loadAll();
    });
  }

  if (checkInTo) {
    checkInTo.addEventListener("change", async () => {
      state.reservationsFilterCheckInTo = checkInTo.value || "";
      await loadAll();
    });
  }

  if (checkOutFrom) {
    checkOutFrom.addEventListener("change", async () => {
      state.reservationsFilterCheckOutFrom = checkOutFrom.value || "";
      await loadAll();
    });
  }

  if (checkOutTo) {
    checkOutTo.addEventListener("change", async () => {
      state.reservationsFilterCheckOutTo = checkOutTo.value || "";
      await loadAll();
    });
  }

  if (minNights) {
    minNights.addEventListener("input", async () => {
      state.reservationsFilterMinNights = minNights.value === "" ? "" : Math.max(0, Number(minNights.value || 0));
      await loadAll();
    });
  }

  if (maxNights) {
    maxNights.addEventListener("input", async () => {
      state.reservationsFilterMaxNights = maxNights.value === "" ? "" : Math.max(0, Number(maxNights.value || 0));
      await loadAll();
    });
  }

  if (docType) {
    docType.addEventListener("change", async () => {
      state.reservationsFilterDocType = docType.value || "";
      await loadAll();
    });
  }
}

function bindDocumentsFilters() {
  const type = document.getElementById("documents-filter-type");
  if (type) {
    type.addEventListener("change", async () => {
      state.documentsFilterType = type.value || "";
      await loadAll();
    });
  }
}

/**
 * Exporta una sección como PDF usando window.print().
 * Marca la sección con .is-printing para que el @media print la muestre.
 * @param {string} sectionId - id del elemento <section>
 * @param {string} title     - título que aparece en el encabezado impreso
 * @param {string} [period]  - texto de período (ej. "Febrero 2026")
 */
/**
 * Abre el modal de venta pre-llenado para cobrar una reserva con deuda.
 * @param {number} reservationId
 * @param {number} amountDue   - saldo pendiente
 * @param {string} guestName
 */
function openSaleModalForReservation(reservationId, amountDue, guestName) {
  const modal = document.getElementById("sale-modal");
  if (!modal) return;

  const form = document.getElementById("sale-form");
  const debtInfo = document.getElementById("sale-debt-info");
  const modalTitle = modal.querySelector(".modal__header h3");

  // Pre-llenar campos
  if (form) {
    form.reset();
    const today = new Date().toISOString().slice(0, 10);
    const dateInput = form.querySelector("[name='sale_date']");
    const amountInput = form.querySelector("[name='amount']");
    const reservationInput = form.querySelector("[name='reservation_id']");
    const categoryInput = form.querySelector("[name='category']");
    if (dateInput) dateInput.value = today;
    if (amountInput) amountInput.value = amountDue > 0 ? amountDue : "";
    if (reservationInput) reservationInput.value = reservationId;
    if (categoryInput) categoryInput.value = "lodging";
  }

  // Mostrar info de deuda
  if (debtInfo) {
    if (amountDue > 0) {
      debtInfo.hidden = false;
      debtInfo.className = "sale-debt-info";
      debtInfo.innerHTML = `
        <span class="sale-debt-info__label">Saldo pendiente · Reserva #${reservationId} · ${guestName}</span>
        <span class="sale-debt-info__amount">${money.format(amountDue)}</span>`;
    } else {
      debtInfo.hidden = false;
      debtInfo.className = "sale-debt-info sale-debt-info--paid";
      debtInfo.innerHTML = `
        <span class="sale-debt-info__label">Reserva #${reservationId} · ${guestName}</span>
        <span class="sale-debt-info__amount">Sin saldo pendiente</span>`;
    }
  }

  if (modalTitle) modalTitle.textContent = `Registrar cobro — Reserva #${reservationId}`;

  openModal(modal);
}

function exportSectionAsPdf(sectionId, title, period = "") {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const titleEl = document.getElementById("print-title");
  const periodEl = document.getElementById("print-period");
  const dateEl = document.getElementById("print-date");

  if (titleEl) titleEl.textContent = title;
  if (periodEl) periodEl.textContent = period;
  if (dateEl) dateEl.textContent = `Generado el ${new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })}`;

  // Mostrar vistas ocultas con [hidden] dentro de la sección (ej. tablas del informe mensual)
  const hiddenViews = section.querySelectorAll(".monthly-report-view[hidden]");
  hiddenViews.forEach(el => el.removeAttribute("hidden"));

  section.classList.add("is-printing");

  window.print();

  window.addEventListener("afterprint", () => {
    section.classList.remove("is-printing");
    hiddenViews.forEach(el => el.setAttribute("hidden", ""));
  }, { once: true });
}

/** Descarga un export (CSV/etc.) con el token JWT y dispara la descarga en el navegador */
async function downloadExport(url, defaultFilename) {
  const token = getAuthToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (res.status === 401) {
    setAuthToken("");
    showLoginOverlay("Sesión expirada. Vuelve a iniciar sesión.");
    throw new Error("Sesión expirada");
  }
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const disposition = res.headers.get("Content-Disposition");
  const match = disposition && disposition.match(/filename="?([^";]+)"?/);
  const filename = (match && match[1]) || defaultFilename;
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function getDashboardVentasPeriod() {
  const typeEl = document.getElementById("dashboard-ventas-period-type");
  const yearEl = document.getElementById("monthly-report-year");
  const monthEl = document.getElementById("monthly-report-month");
  const quarterEl = document.getElementById("dashboard-ventas-quarter");
  const semesterEl = document.getElementById("dashboard-ventas-semester");
  const type = (typeEl?.value || "month");
  const year = parseInt(yearEl?.value || new Date().getFullYear(), 10);
  let from, to;
  if (type === "month") {
    const month = monthEl?.value || "01";
    from = `${year}-${month}-01`;
    const lastDay = new Date(year, parseInt(month, 10), 0).getDate();
    to = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
  } else if (type === "quarter") {
    const q = parseInt(quarterEl?.value || "1", 10);
    const [m1, m2] = [[1, 3], [4, 6], [7, 9], [10, 12]][q - 1] || [1, 3];
    from = `${year}-${String(m1).padStart(2, "0")}-01`;
    const lastDay = new Date(year, m2, 0).getDate();
    to = `${year}-${String(m2).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  } else if (type === "semester") {
    const s = parseInt(semesterEl?.value || "1", 10);
    if (s === 1) {
      from = `${year}-01-01`;
      to = `${year}-06-30`;
    } else {
      from = `${year}-07-01`;
      to = `${year}-12-31`;
    }
  } else {
    from = `${year}-01-01`;
    to = `${year}-12-31`;
  }
  return { from, to };
}

function bindExportButtons() {
  const cobrosBtn = document.getElementById("dashboard-ventas-export-cobros");
  if (cobrosBtn) {
    cobrosBtn.addEventListener("click", async () => {
      try {
        const { from, to } = getDashboardVentasPeriod();
        const q = `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
        await downloadExport(`/api/exports/cobros.csv${q}`, `cobros_${from}_${to}.csv`);
        setStatus("Cobros exportados", "ok");
      } catch (e) {
        setStatus(e.message || "Error al exportar", "error");
      }
    });
  }

  const gastosBtn = document.getElementById("dashboard-ventas-export-gastos");
  if (gastosBtn) {
    gastosBtn.addEventListener("click", async () => {
      try {
        const { from, to } = getDashboardVentasPeriod();
        const q = `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
        await downloadExport(`/api/exports/gastos.csv${q}`, `gastos_${from}_${to}.csv`);
        setStatus("Gastos exportados", "ok");
      } catch (e) {
        setStatus(e.message || "Error al exportar", "error");
      }
    });
  }

  const expensesBtn = document.getElementById("expenses-export-btn");
  if (expensesBtn) {
    expensesBtn.addEventListener("click", async () => {
      try {
        const { from, to } = getDashboardVentasPeriod();
        const q = `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
        await downloadExport(`/api/exports/gastos.csv${q}`, `gastos_${from}_${to}.csv`);
        setStatus("Gastos exportados", "ok");
      } catch (e) {
        setStatus(e.message || "Error al exportar", "error");
      }
    });
  }

  const guestsBtn = document.getElementById("guests-export-btn");
  if (guestsBtn) {
    guestsBtn.addEventListener("click", async () => {
      try {
        await downloadExport("/api/exports/guests", "huéspedes.csv");
      } catch (e) {
        setStatus(e.message || "Error al exportar", "error");
      }
    });
  }

  const upcomingBtn = document.getElementById("reservations-upcoming-export-btn");
  if (upcomingBtn) {
    upcomingBtn.addEventListener("click", async () => {
      try {
        await downloadExport("/api/exports/reservations-upcoming?days=14", "reservas-proximas.csv");
      } catch (e) {
        setStatus(e.message || "Error al exportar", "error");
      }
    });
  }

  // ── Botones PDF por sección ──────────────────────────────
  function getPeriodLabel(from, to) {
    if (!from || !to) return "";
    const fmt = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
    return `${fmt(from)} – ${fmt(to)}`;
  }

  const ventasPdfBtn = document.getElementById("dashboard-ventas-export-pdf");
  if (ventasPdfBtn) {
    ventasPdfBtn.addEventListener("click", () => {
      const { from, to } = getDashboardVentasPeriod();
      exportSectionAsPdf("section-dashboard-ventas", "Ventas · Informes y exportación", getPeriodLabel(from, to));
    });
  }

  const gastosPdfBtn = document.getElementById("dash-gastos-export-pdf");
  if (gastosPdfBtn) {
    gastosPdfBtn.addEventListener("click", () => {
      const typeEl = document.getElementById("gastos-dash-period-type");
      const yearEl = document.getElementById("gastos-dash-year");
      const monthEl = document.getElementById("gastos-dash-month");
      const type = typeEl?.value || "month";
      const year = yearEl?.value || new Date().getFullYear();
      const month = monthEl?.value || "01";
      const period = type === "month"
        ? new Date(`${year}-${month}-01T12:00:00`).toLocaleDateString("es-CL", { month: "long", year: "numeric" })
        : `${year}`;
      exportSectionAsPdf("section-dash-gastos", "Gastos · Análisis", period);
    });
  }

  const reservasPdfBtn = document.getElementById("dash-reservas-export-pdf");
  if (reservasPdfBtn) {
    reservasPdfBtn.addEventListener("click", () => {
      const typeEl = document.getElementById("reservas-dash-period-type");
      const yearEl = document.getElementById("reservas-dash-year");
      const monthEl = document.getElementById("reservas-dash-month");
      const type = typeEl?.value || "month";
      const year = yearEl?.value || new Date().getFullYear();
      const month = monthEl?.value || "01";
      const period = type === "month"
        ? new Date(`${year}-${month}-01T12:00:00`).toLocaleDateString("es-CL", { month: "long", year: "numeric" })
        : `${year}`;
      exportSectionAsPdf("section-dash-reservas", "Reservas · Análisis", period);
    });
  }

  const cabanasPdfBtn = document.getElementById("dash-cabanas-export-pdf");
  if (cabanasPdfBtn) {
    cabanasPdfBtn.addEventListener("click", () => {
      const typeEl = document.getElementById("cabanas-dash-period-type");
      const yearEl = document.getElementById("cabanas-dash-year");
      const monthEl = document.getElementById("cabanas-dash-month");
      const type = typeEl?.value || "month";
      const year = yearEl?.value || new Date().getFullYear();
      const month = monthEl?.value || "01";
      const period = type === "month"
        ? new Date(`${year}-${month}-01T12:00:00`).toLocaleDateString("es-CL", { month: "long", year: "numeric" })
        : `${year}`;
      exportSectionAsPdf("section-dash-cabanas", "Cabañas · Análisis", period);
    });
  }
}

for (const [formId, endpoint, message] of [
  ["sale-form", "/api/sales", "Venta registrada"],
  ["expense-form", "/api/expenses", "Gasto registrado"],
  ["document-form", "/api/documents", "Documento registrado"]
]) {
  bindForm(formId, endpoint, message);
}

bindGuestForm();
bindReservationGuestLookup();
bindReservationForm();
bindReservationPricing();
bindGuestEditButtons();
bindGuestHistoryButtons();
bindDeleteButtons();
bindCabinForm();
bindCabinFormOpenButtons();
bindPeriodControls();
bindExpensesFilters();
bindExpensesPagination();
bindGuestsFilters();
bindReservationsFilters();
bindDocumentsFilters();
bindCabinGalleryAndEdit();
bindAvailabilityActions();
setupAvailabilityControls();
setupCalendarControls();
setupSectionModals();
setupThemeToggle();
setUiVersion();
setupPublicUrlDisplay();
setupFocusMode();
setupSidebarToggle();
updatePeriodLabel();
bindExportButtons();
setupMonthlyReportDashboard();

const monthlyCharts = {};

function setupMonthlyReportDashboard() {
  const periodType = document.getElementById("dashboard-ventas-period-type");
  const monthSelect = document.getElementById("monthly-report-month");
  const yearSelect = document.getElementById("monthly-report-year");
  const quarterSelect = document.getElementById("dashboard-ventas-quarter");
  const semesterSelect = document.getElementById("dashboard-ventas-semester");
  const monthWrap = document.getElementById("dashboard-ventas-month-wrap");
  const quarterWrap = document.getElementById("dashboard-ventas-quarter-wrap");
  const semesterWrap = document.getElementById("dashboard-ventas-semester-wrap");

  const guestFilter = document.getElementById("dashboard-ventas-filter-guest");
  const cabinFilter = document.getElementById("dashboard-ventas-filter-cabin");
  const categoryFilter = document.getElementById("dashboard-ventas-filter-category");

  if (!monthSelect || !yearSelect) return;

  // Llenar select de cabañas (se llama también desde loadAll)
  window.refreshVentasCabinFilter = () => {
    if (cabinFilter && state.cabins) {
      const current = cabinFilter.value;
      cabinFilter.innerHTML = '<option value="">Todas</option>' +
        state.cabins.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
      if (current) cabinFilter.value = current;
    }
  };
  refreshVentasCabinFilter();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  for (let y = currentYear; y >= 2020; y--) {
    const opt = document.createElement("option");
    opt.value = String(y);
    opt.textContent = String(y);
    if (y === currentYear) opt.selected = true;
    yearSelect.appendChild(opt);
  }
  monthSelect.value = String(currentMonth).padStart(2, "0");
  quarterSelect.value = String(Math.ceil(currentMonth / 3));
  semesterSelect.value = currentMonth <= 6 ? "1" : "2";
  if (periodType) periodType.value = "year";

  function updatePeriodVisibility() {
    const type = periodType?.value || "month";
    if (monthWrap) monthWrap.style.display = type === "month" ? "" : "none";
    if (quarterWrap) quarterWrap.style.display = type === "quarter" ? "" : "none";
    if (semesterWrap) semesterWrap.style.display = type === "semester" ? "" : "none";
  }

  const loadMonthlyReport = async () => {
    if (!getAuthToken()) return;
    const { from, to } = getDashboardVentasPeriod();
    if (!from || !to) return;
    
    const guest = guestFilter?.value || "";
    const cabin = cabinFilter?.value || "";
    const cat = categoryFilter?.value || "";

    let salesUrl = `/api/sales?from=${from}&to=${to}`;
    if (guest) salesUrl += `&q=${encodeURIComponent(guest)}`;
    if (cabin) salesUrl += `&cabin_id=${cabin}`;
    if (cat) salesUrl += `&category=${cat}`;

    try {
      const sales = await api(salesUrl);
      renderMonthlyTables(from, to, sales, []); // Pasamos lista vacía de gastos
    } catch (err) {
      console.error(err);
      setStatus("No se pudo cargar el informe", "error");
    }
  };

  updatePeriodVisibility();
  periodType?.addEventListener("change", () => {
    updatePeriodVisibility();
    loadMonthlyReport();
  });
  monthSelect.addEventListener("change", loadMonthlyReport);
  yearSelect.addEventListener("change", loadMonthlyReport);
  quarterSelect?.addEventListener("change", loadMonthlyReport);
  semesterSelect?.addEventListener("change", loadMonthlyReport);
  cabinFilter?.addEventListener("change", loadMonthlyReport);
  categoryFilter?.addEventListener("change", loadMonthlyReport);
  
  if (guestFilter) {
    let timeout;
    guestFilter.addEventListener("input", () => {
      clearTimeout(timeout);
      timeout = setTimeout(loadMonthlyReport, 500);
    });
  }

  loadMonthlyReport();
}

const PIE_COLORS = [
  "#34d399", "#60a5fa", "#f87171", "#fbbf24", "#a78bfa",
  "#2dd4bf", "#f472b6", "#94a3b8", "#eab308", "#22c55e"
];

const categoryLabels = {
  lodging: "Alojamiento",
  suplemento: "Suplemento",
  limpieza: "Limpieza",
  aseo: "Aseo",
  servicios: "Servicios",
  servicio: "Servicios",
  insumos: "Insumos",
  equipamiento: "Equipamiento",
  mantenimiento: "Mantenimiento",
  utilities: "Servicios básicos",
  comision: "Comisiones",
  impuestos: "Impuestos",
  transporte: "Transporte",
  boletas: "Boletas",
  abonos: "Abonos",
  otros: "Otros",
  other: "Otros",
  gas: "Gas",
  "aseo caro": "Aseo Caro",
  booking: "Booking",
  "aseo cathy": "Aseo Cathy",
  hamacas: "Hamacas",
  "piso gym": "Piso Gym",
  "pintura gym": "Pintura Gym",
  "pintada gym": "Pintada Gym",
  "espejos gym": "Espejos Gym",
  "reparacion refri": "Reparacion Refri",
  "etico turismo": "Etico Turismo",
  frontel: "Frontel",
  imposiciones: "Imposiciones",
  contribuciones: "Contribuciones",
  "aseo dani": "Aseo Dani",
  "pago proyecto sanitario": "Pago Proyecto Sanitario",
  "sueldo gd": "Sueldo GD",
  pelets: "Pelets",
  "guardado pelets": "Guardado Pelets",
  "lavado sabanas": "Lavado Sabanas",
  "materiales estacionamiento": "Materiales Estacionamiento",
  ripio: "Ripio",
  "arriendo bolo": "Arriendo Bolo",
  "carlos mella estacionamiento": "Carlos Mella Estacionamiento",
  "comision cta cte": "Comision Cta Cte",
  previred: "Previred"
};

function formatExpenseCategoryLabel(value) {
  const key = normalizeExpenseCategoryKey(value);
  if (!key) return "-";
  return getExpenseCategoryLabelByKey(key);
}

function aggregateByField(rows, field, amountKey = "amount") {
  const map = {};
  for (const row of rows) {
    const key = field === "category"
      ? normalizeExpenseCategoryKey(row[field] || "otros")
      : String(row[field] || "otros").toLowerCase();
    map[key] = (map[key] || 0) + Number(row[amountKey] || 0);
  }
  return Object.entries(map)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({
      label: field === "category" ? formatExpenseCategoryLabel(k) : categoryLabels[k] || k.charAt(0).toUpperCase() + k.slice(1),
      value: v
    }));
}

function aggregateSalesBySource(sales) {
  const resMap = new Map((state.reservations || []).map((r) => [r.id, r]));
  const map = {};
  for (const s of sales) {
    const key = s.reservation_id ? (resMap.get(s.reservation_id)?.source || "other") : "other";
    const k = key || "other";
    map[k] = (map[k] || 0) + Number(s.amount || 0);
  }
  return Object.entries(map)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({ label: sourceLabels[k] || k, value: v }));
}

function renderPieChart(canvasId, data, labelKey = "label", valueKey = "value") {
  const ctx = document.getElementById(canvasId);
  if (!ctx || typeof Chart === "undefined") return;
  if (monthlyCharts[canvasId]) {
    monthlyCharts[canvasId].destroy();
    delete monthlyCharts[canvasId];
  }
  const isDark = document.documentElement.dataset.theme !== "light";
  const textColor = isDark ? "rgba(240,244,248,0.9)" : "rgba(15,23,42,0.85)";
  const labels = data.map((d) => d[labelKey]);
  const values = data.map((d) => d[valueKey]);
  const total = values.reduce((a, b) => a + b, 0);
  const backgroundColor = data.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]);
  const tooltipBg = isDark ? "rgba(26,35,50,0.95)" : "rgba(255,255,255,0.95)";
  const tooltipFg = isDark ? "rgba(240,244,248,0.95)" : "rgba(15,23,42,0.9)";
  monthlyCharts[canvasId] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels.map((l, i) => `${l} (${total > 0 ? Math.round((values[i] / total) * 100) : 0}%)`),
      datasets: [{ data: values, backgroundColor, borderWidth: 0 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: "right", labels: { color: textColor, padding: 12 } },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipFg,
          bodyColor: tooltipFg,
          callbacks: {
            label: (ctx) => {
              const v = ctx.raw;
              const pct = total > 0 ? ((v / total) * 100).toFixed(1) : 0;
              return `${money.format(v)} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

function renderMonthlyCharts(sales, expenses, from, to) {
  const salesByCat = aggregateByField(sales, "category");
  renderPieChart("monthly-chart-sales-category", salesByCat.length ? salesByCat : [{ label: "Sin ventas", value: 1 }]);
  const expByCat = aggregateByField(expenses, "category");
  renderPieChart("monthly-chart-expenses-category", expByCat.length ? expByCat : [{ label: "Sin gastos", value: 1 }]);
}

function renderMonthlyTables(from, to, sales, expenses) {
  const salesBody = document.getElementById("monthly-sales-table-body");
  const summaryBody = document.getElementById("ventas-summary-table-body");
  if (!salesBody) return;
  sales = Array.isArray(sales) ? sales : [];

  const totalSales = sales.reduce((acc, row) => acc + Number(row.amount || 0), 0);
  const salesTotalEl = document.getElementById("ventas-kpi-sales-total");
  const salesCountEl = document.getElementById("ventas-kpi-sales-count");
  if (salesTotalEl) salesTotalEl.textContent = money.format(totalSales);
  if (salesCountEl) salesCountEl.textContent = String(sales.length);

  const cabinById = new Map((state.cabins || []).map((c) => [Number(c.id), c]));
  const summary = {
    casa: { label: "CASA", count: 0, nights: 0, revenue: 0 },
    refugios: { label: "REFUGIOS", count: 0, nights: 0, revenue: 0 }
  };

  salesBody.innerHTML = sales
    .map(
      (row) => {
        const desc = row.description || row.reservation_notes || "-";
        const isAdd = desc.includes("Cobro Adicional") || row.category === 'suplemento';
        const short = desc.length > 20 ? desc.slice(0, 20) + "..." : desc;
        
        const rut = row.guest_document || "-";
        const checkIn = row.reservation_check_in ? formatDate(row.reservation_check_in) : "-";
        const checkOut = row.reservation_check_out ? formatDate(row.reservation_check_out) : "-";
        const nights = row.reservation_nights || 0;
        const rate = row.reservation_nightly_rate || 0;
        const additional = row.reservation_additional_charge || 0;
        const taxType = (row.guest_tax_type || "sii").toUpperCase();

        const cabin = cabinById.get(Number(row.cabin_id));
        const isCasa = getCabinCapacity(cabin) >= 8;
        const rc = isCasa ? "C" : "R";

        if (row.category === "lodging") {
          const bucket = isCasa ? summary.casa : summary.refugios;
          bucket.count += 1;
          bucket.nights += nights;
          bucket.revenue += Number(row.amount || 0);
        }

        return `
    <tr>
      <td>${formatDate(row.sale_date)}</td>
      <td>
        <div><strong>${row.guest_name || "-"}</strong></div>
        <div style="font-size:0.8em; color:gray;">${rut}</div>
      </td>
      <td>
        <div style="display:flex; align-items:center; gap:4px;">
          <span class="badge badge--ghost" style="font-size:0.7em; font-weight:800; min-width:1.5em; text-align:center;">${rc}</span>
          <span>${row.cabin_name || "-"}</span>
        </div>
      </td>
      <td>
        <div style="font-size:0.85em;">In: ${checkIn}</div>
        <div style="font-size:0.85em;">Out: ${checkOut}</div>
      </td>
      <td style="text-align:center;">${nights}</td>
      <td>${money.format(rate)}</td>
      <td>${additional > 0 ? money.format(additional) : "-"}</td>
      <td><strong>${money.format(row.amount)}</strong></td>
      <td>${paymentLabels[row.payment_method] || row.payment_method || "-"}</td>
      <td><span class="badge badge--ghost" style="font-size:0.7em;">${taxType}</span></td>
      <td title="${desc}" style="cursor:help; font-size:0.85em;">
        ${isAdd ? "📌 " : ""}${short}
      </td>
      <td>
        <div style="display:flex; gap:4px;">
          <button class="btn btn--ghost btn--sm" onclick="alert('${desc.replace(/'/g, "\\'")}')" title="Ver nota completa">Ver</button>
          ${deleteButton("sales", row.id)}
        </div>
      </td>
    </tr>`;
      }
    )
    .join("") || "<tr><td colspan='12'>Sin ventas en este mes</td></tr>";

  if (summaryBody) {
    summaryBody.innerHTML = [summary.casa, summary.refugios]
      .map(
        (s) => `
      <tr>
        <td style="font-weight:800;">${s.label}</td>
        <td>${s.count}</td>
        <td>${s.nights}</td>
        <td>${money.format(s.revenue)}</td>
      </tr>`
      )
      .join("");
  }
}

function channelLetter(source) {
  const s = String(source || "").toLowerCase();
  if (s === "booking") return "B";
  if (s === "airbnb") return "A";
  if (s === "web") return "P";
  if (s === "direct") return "T";
  if (s === "other") return "O";
  return "";
}

function reservationNights(row) {
  const raw = Number(row?.nights);
  if (Number.isFinite(raw) && raw > 0) return Math.round(raw);
  const checkIn = toDateKey(row?.check_in);
  const checkOut = toDateKey(row?.check_out);
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const nights = Math.round(ms / 86400000);
  return Number.isInteger(nights) && nights > 0 ? nights : 0;
}

function reservationNightlyRate(row) {
  const raw = Number(row?.nightly_rate);
  if (Number.isFinite(raw) && raw > 0) return raw;
  const cabinRate = Number(row?.cabin_nightly_rate);
  if (Number.isFinite(cabinRate) && cabinRate > 0) return cabinRate;
  return 0;
}

function renderVentasExcel(from, to, reservations) {
  const body = document.getElementById("ventas-excel-table-body");
  const totalEstadiaEl = document.getElementById("ventas-excel-total-estadia");
  const totalUtilidadEl = document.getElementById("ventas-excel-total-utilidad");
  const summaryBody = document.getElementById("ventas-excel-summary-body");
  if (!body || !totalEstadiaEl || !totalUtilidadEl || !summaryBody) return;

  const cabinById = new Map((state.cabins || []).map((c) => [Number(c.id), c]));
  const rows = (Array.isArray(reservations) ? reservations : [])
    .filter((r) => inDateRange(r.check_in, from, to) || inDateRange(r.check_out, from, to))
    .sort((a, b) => dateWeight(a.check_in) - dateWeight(b.check_in));

  let totalEstadia = 0;
  const summary = {
    casa: { label: "CASA", count: 0, nights: 0, revenue: 0 },
    refugios: { label: "REFUGIOS", count: 0, nights: 0, revenue: 0 }
  };

  body.innerHTML =
    rows
      .map((r, idx) => {
        const cabin = cabinById.get(Number(r.cabin_id));
        const isCasa = getCabinCapacity(cabin) >= 8;
        const rc = isCasa ? "C" : "R";
        const guests = Number(r.guests_count) || 0;
        const paxAd = Math.max(0, guests - Number(getCabinCapacity(cabin) || guests));
        const nights = reservationNights(r);
        const nightlyRate = reservationNightlyRate(r);
        const cleaning = Number(r.cleaning_supplement || 0) || 0;
        const totalNight = nightlyRate;
        const totalStay = Number(r.total_amount || 0) || 0;
        const utilidad = null;
        const boletas =
          r.reservation_document_type === "boleta" || r.reservation_document_type === "factura" ? "SI" : "";

        totalEstadia += totalStay;
        const bucket = isCasa ? summary.casa : summary.refugios;
        bucket.count += 1;
        bucket.nights += nights;
        bucket.revenue += totalStay;

        return `
    <tr>
      <td>${idx + 1}</td>
      <td>${String(r.guest_name || "").trim() || "-"}</td>
      <td>${rc}</td>
      <td>${channelLetter(r.source)}</td>
      <td>${guests || "-"}</td>
      <td>${paxAd || 0}</td>
      <td>${nights || "-"}</td>
      <td>${nightlyRate ? money.format(nightlyRate) : "-"}</td>
      <td>${cleaning ? money.format(cleaning) : ""}</td>
      <td>${totalNight ? money.format(totalNight) : "-"}</td>
      <td>${money.format(totalStay)}</td>
      <td>${utilidad == null ? "-" : money.format(utilidad)}</td>
      <td>${boletas}</td>
    </tr>`;
      })
      .join("") || `<tr><td colspan="13">Sin reservas en este período</td></tr>`;

  totalEstadiaEl.textContent = money.format(totalEstadia);
  totalUtilidadEl.textContent = "-";

  summaryBody.innerHTML = [summary.casa, summary.refugios]
    .map(
      (s) => `
    <tr>
      <td style="font-weight:800;">${s.label}</td>
      <td>${s.count}</td>
      <td>${s.nights}</td>
      <td>${money.format(s.revenue)}</td>
    </tr>`
    )
    .join("");
}

async function warmupAndStart() {
  const overlay = document.getElementById("warmup-overlay");
  const msgEl = document.getElementById("warmup-message");
  const btn = document.getElementById("warmup-enter-btn");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  if (!overlay || !msgEl || !btn) {
    // Fallback: arrancar normal
    setStatus("Cargando panel...");
    return loadAll()
      .then(() => {
        const stamp = new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
        setStatus(`Panel actualizado ${stamp}`, "ok");
      })
      .catch((error) => {
        console.error(error);
        const message = `No se pudo cargar el panel: ${error.message}`;
        setStatus(message, "error");
      });
  }

  overlay.hidden = false;
  msgEl.textContent = "Despertando servidor en Render…";
  btn.disabled = true;

  const delays = [500, 1000, 1500, 2000, 3000, 5000, 8000, 12000];
  let attempt = 0;
  let ready = false;
  let hardFailMessage = "";

  for (let i = 0; i < delays.length; i++) {
    attempt = i + 1;
    try {
      const res = await fetch("/api/health/db", { method: "GET", cache: "no-store" });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.db === "ok" || data.db === true) {
          ready = true;
          break;
        }
      } else if (res.status === 503) {
        const data = await res.json().catch(() => ({}));
        const errorText = String(data?.error || "");
        if (errorText.toLowerCase().includes("database_url")) {
          hardFailMessage = "Servidor sin DATABASE_URL. Configura la variable y reinicia backend.";
          break;
        }
      }
    } catch {
      // ignorar error y reintentar
    }
    msgEl.textContent = `Despertando servidor… (intento ${attempt})`;
    await new Promise((r) => setTimeout(r, delays[i]));
  }

  if (!ready) {
    msgEl.textContent = hardFailMessage || "No se pudo conectar al servidor. Reintenta en unos segundos.";
    btn.disabled = false;
    btn.textContent = "Reintentar";
    btn.onclick = () => {
      window.location.reload();
    };
    return;
  }

  msgEl.textContent = "Servidor listo. Ingresa tus credenciales para acceder.";
  btn.disabled = false;
  if (loginForm && loginError) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      loginError.textContent = "";
      btn.disabled = true;
      btn.textContent = "Ingresando...";
      try {
        const formData = new FormData(loginForm);
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || `Error ${res.status}`);
        }
        const token = data.token || data.access_token || data.accessToken;
        if (token) setAuthToken(token);
        else {
          loginError.textContent = "El servidor no devolvió sesión. Reintenta.";
          btn.disabled = false;
          btn.textContent = "Entrar al panel";
          return;
        }
        overlay.hidden = true;
        setStatus("Cargando panel...");
        await loadAll();
        const stamp = new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
        setStatus(`Panel actualizado ${stamp}`, "ok");
      } catch (error) {
        console.error(error);
        loginError.textContent = error.message || "No se pudo iniciar sesión";
        btn.disabled = false;
        btn.textContent = "Entrar al panel";
      }
    });
  }
}

warmupAndStart();

/* ================================================================
   SECTION DASHBOARDS — Informes de Gastos, Reservas y Cabañas
   ================================================================ */

const debtLabelsMap = { pending: "Pendiente", partial: "Parcial", paid: "Pagado" };
const statusLabelsMap = { pending: "Pendiente", confirmed: "Confirmada", completed: "Completada", cancelled: "Cancelada" };

function aggregateCountByField(rows, field) {
  const map = {};
  for (const row of rows) {
    const key = String(row[field] || "otros").toLowerCase();
    map[key] = (map[key] || 0) + 1;
  }
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({
      label: sourceLabels[k] || paymentLabels[k] || debtLabelsMap[k] || statusLabelsMap[k] || categoryLabels[k] || k.charAt(0).toUpperCase() + k.slice(1),
      value: v
    }));
}

function aggregateByMonth(rows, dateField, amountKey = "amount") {
  const map = {};
  for (const row of rows) {
    const d = row[dateField];
    if (!d) continue;
    const month = (typeof d === "string" ? d : new Date(d).toISOString()).slice(0, 7);
    map[month] = (map[month] || 0) + Number(row[amountKey] || 0);
  }
  const sorted = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  return { labels: sorted.map(([k]) => k), values: sorted.map(([, v]) => v) };
}

function getThemeChartColors() {
  const isDark = document.documentElement.dataset.theme !== "light";
  return {
    textColor: isDark ? "rgba(240,244,248,0.9)" : "rgba(15,23,42,0.85)",
    gridColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)",
    tooltipBg: isDark ? "rgba(26,35,50,0.95)" : "rgba(255,255,255,0.95)",
    tooltipFg: isDark ? "rgba(240,244,248,0.95)" : "rgba(15,23,42,0.9)"
  };
}

function renderBarChart(canvasId, data, label, color) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || typeof Chart === "undefined") return;
  if (monthlyCharts[canvasId]) { monthlyCharts[canvasId].destroy(); delete monthlyCharts[canvasId]; }
  const { textColor, gridColor, tooltipBg, tooltipFg } = getThemeChartColors();
  monthlyCharts[canvasId] = new Chart(ctx, {
    type: "bar",
    data: { labels: data.labels, datasets: [{ label, data: data.values, backgroundColor: color || "#34d399", borderWidth: 0 }] },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: tooltipBg, titleColor: tooltipFg, bodyColor: tooltipFg } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true }
      }
    }
  });
}

function getSectionPeriod(prefix) {
  const typeEl = document.getElementById(`${prefix}-period-type`);
  const yearEl = document.getElementById(`${prefix}-year`);
  const monthEl = document.getElementById(`${prefix}-month`);
  const quarterEl = document.getElementById(`${prefix}-quarter`);
  const semesterEl = document.getElementById(`${prefix}-semester`);
  const type = typeEl?.value || "month";
  const year = parseInt(yearEl?.value || new Date().getFullYear(), 10);
  let from, to;
  if (type === "month") {
    const month = monthEl?.value || "01";
    from = `${year}-${month}-01`;
    to = `${year}-${month}-${String(new Date(year, parseInt(month, 10), 0).getDate()).padStart(2, "0")}`;
  } else if (type === "quarter") {
    const q = parseInt(quarterEl?.value || "1", 10);
    const [m1, m2] = [[1, 3], [4, 6], [7, 9], [10, 12]][q - 1] || [1, 3];
    from = `${year}-${String(m1).padStart(2, "0")}-01`;
    to = `${year}-${String(m2).padStart(2, "0")}-${String(new Date(year, m2, 0).getDate()).padStart(2, "0")}`;
  } else if (type === "semester") {
    const s = parseInt(semesterEl?.value || "1", 10);
    from = s === 1 ? `${year}-01-01` : `${year}-07-01`;
    to = s === 1 ? `${year}-06-30` : `${year}-12-31`;
  } else {
    from = `${year}-01-01`; to = `${year}-12-31`;
  }
  return { from, to };
}

function setupSectionDashboard(prefix, renderFn) {
  const periodType = document.getElementById(`${prefix}-period-type`);
  const monthSelect = document.getElementById(`${prefix}-month`);
  const yearSelect = document.getElementById(`${prefix}-year`);
  const quarterSelect = document.getElementById(`${prefix}-quarter`);
  const semesterSelect = document.getElementById(`${prefix}-semester`);
  const monthWrap = document.getElementById(`${prefix}-month-wrap`);
  const quarterWrap = document.getElementById(`${prefix}-quarter-wrap`);
  const semesterWrap = document.getElementById(`${prefix}-semester-wrap`);
  if (!monthSelect || !yearSelect) return () => {};

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  for (let y = currentYear; y >= 2020; y--) {
    const opt = document.createElement("option");
    opt.value = String(y); opt.textContent = String(y);
    if (y === currentYear) opt.selected = true;
    yearSelect.appendChild(opt);
  }
  monthSelect.value = String(currentMonth).padStart(2, "0");
  if (quarterSelect) quarterSelect.value = String(Math.ceil(currentMonth / 3));
  if (semesterSelect) semesterSelect.value = currentMonth <= 6 ? "1" : "2";

  function updateVisibility() {
    const type = periodType?.value || "month";
    if (monthWrap) monthWrap.style.display = type === "month" ? "" : "none";
    if (quarterWrap) quarterWrap.style.display = type === "quarter" ? "" : "none";
    if (semesterWrap) semesterWrap.style.display = type === "semester" ? "" : "none";
  }

  const refresh = () => { const { from, to } = getSectionPeriod(prefix); if (from && to) renderFn(from, to); };

  updateVisibility();
  periodType?.addEventListener("change", () => { updateVisibility(); refresh(); });
  monthSelect.addEventListener("change", refresh);
  yearSelect.addEventListener("change", refresh);
  quarterSelect?.addEventListener("change", refresh);
  semesterSelect?.addEventListener("change", refresh);

  return refresh;
}

/* ── Gastos ── */
function renderGastosDash(from, to) {
  const expenses = (state.expenses || []).filter((r) => inDateRange(r.expense_date, from, to));
  const byCat = aggregateByField(expenses, "category");

  renderPieChart("gastos-chart-category", byCat.length ? byCat : [{ label: "Sin gastos", value: 1 }]);

  const tbody = document.getElementById("gastos-dash-table-body");
  if (tbody) {
    tbody.innerHTML = expenses.map((r) => `<tr><td>${formatDate(r.expense_date)}</td><td>${formatExpenseCategoryLabel(r.category)}</td><td>${r.supplier || "-"}</td><td>${paymentLabels[r.payment_method] || r.payment_method || "-"}</td><td>${money.format(r.amount)}</td></tr>`).join("") || "<tr><td colspan='5'>Sin gastos en este período</td></tr>";
  }
}

/* ── Reservas ── */
function renderReservasDash(from, to) {
  const reservations = (state.reservations || []).filter((r) => {
    const ci = (typeof r.check_in === "string" ? r.check_in : "").slice(0, 10);
    return ci >= from && ci <= to;
  });

  const bySource = aggregateCountByField(reservations, "source");
  const byStatus = aggregateCountByField(reservations, "status");
  const byDebt = aggregateCountByField(reservations, "debt_status");
  const revenueByMonth = aggregateByMonth(reservations, "check_in", "total_amount");

  renderPieChart("reservas-chart-source", bySource.length ? bySource : [{ label: "Sin reservas", value: 1 }]);
  renderPieChart("reservas-chart-status", byStatus.length ? byStatus : [{ label: "Sin reservas", value: 1 }]);
  renderPieChart("reservas-chart-debt", byDebt.length ? byDebt : [{ label: "Sin datos", value: 1 }]);
  renderBarChart("reservas-chart-revenue", revenueByMonth.labels.length ? revenueByMonth : { labels: ["-"], values: [0] }, "Ingresos", "#34d399");

  const tbody = document.getElementById("reservas-dash-table-body");
  if (tbody) {
    tbody.innerHTML = reservations.map((r) => `<tr><td>${formatDate(r.check_in)}</td><td>${formatDate(r.check_out)}</td><td>${r.guest_name || "-"}</td><td>${r.cabin_name || "-"}</td><td>${sourceLabels[r.source] || r.source || "-"}</td><td>${money.format(r.total_amount)}</td><td>${debtLabelsMap[r.debt_status] || r.debt_status || "-"}</td></tr>`).join("") || "<tr><td colspan='7'>Sin reservas en este período</td></tr>";
  }
}

/* ── Cabañas ── */
function renderCabanasDash(from, to) {
  const reservations = (state.reservations || []).filter((r) => {
    const ci = (typeof r.check_in === "string" ? r.check_in : "").slice(0, 10);
    return ci >= from && ci <= to;
  });
  const cabins = state.cabins || [];
  const sales = (state.sales || []).filter((s) => inDateRange(s.sale_date, from, to));

  const revenueByReservation = new Map();
  for (const sale of sales) {
    const reservationId = Number(sale.reservation_id);
    if (!Number.isInteger(reservationId)) continue;
    revenueByReservation.set(
      reservationId,
      (revenueByReservation.get(reservationId) || 0) + Number(sale.amount || 0)
    );
  }

  const inferCabinId = (reservation) => {
    if (Number.isInteger(reservation?.cabin_id) && reservation.cabin_id >= 1 && reservation.cabin_id <= 4) return reservation.cabin_id;
    const txt = `${reservation?.cabin_name || ""} ${reservation?.notes || ""}`.toLowerCase();
    if (!txt.trim()) return null;
    if (txt.includes("casa") || txt.includes("ava") || txt.includes("negra")) return 4;
    if (txt.includes("azul") || /\bcabaña\s*1\b|\bcabana\s*1\b|\b#1\b/.test(txt)) return 1;
    if (txt.includes("roja") || /\bcabaña\s*2\b|\bcabana\s*2\b|\b#2\b/.test(txt)) return 2;
    if (txt.includes("verde") || /\bcabaña\s*3\b|\bcabana\s*3\b|\b#3\b/.test(txt)) return 3;
    return null;
  };

  const byCabin = {};
  let unassigned = 0;
    for (const r of reservations) {
      const cabinId = inferCabinId(r);
    if (!cabinId) {
      unassigned++;
      continue;
    }
    if (!byCabin[cabinId]) byCabin[cabinId] = { nights: 0, revenue: 0, count: 0, guests: new Set() };
    const nights = Math.max(1, Math.round((new Date(r.check_out) - new Date(r.check_in)) / 86400000));
    byCabin[cabinId].nights += nights;
    byCabin[cabinId].revenue += revenueByReservation.get(r.id) ?? Number(r.total_amount || 0);
    byCabin[cabinId].count += 1;
    const guestName = String(r.guest_name || "").trim();
    if (guestName) byCabin[cabinId].guests.add(guestName);
  }

  const notice = document.getElementById("cabanas-notice");
  if (notice) notice.hidden = unassigned === 0;

  const fallbackCatalog = [
    { id: 1, label: "Cabaña 1 (Azul)" },
    { id: 2, label: "Cabaña 2 (Roja)" },
    { id: 3, label: "Cabaña 3 (Verde)" },
    { id: 4, label: "Casa AvA (Negra)" }
  ];
  const cabinCatalog = cabins.length
    ? cabins
        .filter((c) => Number(c.id) >= 1 && Number(c.id) <= 4)
        .map((c) => ({ id: c.id, label: c.short_code || c.name || `#${c.id}` }))
    : [...fallbackCatalog];
  for (const id of Object.keys(byCabin).map(Number)) {
    if (id < 1 || id > 4) continue;
    if (!cabinCatalog.some((c) => c.id === id)) cabinCatalog.push({ id, label: `Cabaña ${id}` });
  }
  const cabinIds = cabinCatalog.map((c) => c.id);
  const cabinLabels = cabinCatalog.map((c) => c.label);

  if (cabinIds.length === 0) {
    renderPieChart("cabanas-chart-reservations", [{ label: "Sin datos", value: 1 }]);
    renderBarChart("cabanas-chart-nights", { labels: ["-"], values: [0] }, "Noches", "#60a5fa");
    renderBarChart("cabanas-chart-revenue", { labels: ["-"], values: [0] }, "Ingresos", "#34d399");
    renderBarChart("cabanas-chart-occupancy", { labels: ["-"], values: [0] }, "Ocupación %", "#a78bfa");
  } else {
    const nightsData = cabinIds.map((id) => byCabin[id]?.nights || 0);
    const revenueData = cabinIds.map((id) => byCabin[id]?.revenue || 0);
    const countData = cabinIds.map((id) => byCabin[id]?.count || 0);
    const daysInRange = Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);
    const occupancyData = cabinIds.map((id) => Math.min(100, Math.round(((byCabin[id]?.nights || 0) / daysInRange) * 100)));

    renderBarChart("cabanas-chart-nights", { labels: cabinLabels, values: nightsData }, "Noches", "#60a5fa");
    renderBarChart("cabanas-chart-revenue", { labels: cabinLabels, values: revenueData }, "Ingresos", "#34d399");
    renderPieChart("cabanas-chart-reservations", countData.some((v) => v > 0) ? cabinLabels.map((l, i) => ({ label: l, value: countData[i] })) : [{ label: "Sin datos", value: 1 }]);
    renderBarChart("cabanas-chart-occupancy", { labels: cabinLabels, values: occupancyData }, "Ocupación %", "#a78bfa");
  }

  const tbody = document.getElementById("cabanas-dash-table-body");
  if (tbody) {
    tbody.innerHTML = cabinIds.map((id, i) => {
      const d = byCabin[id] || { count: 0, nights: 0, revenue: 0, guests: new Set() };
      const guestNames = Array.from(d.guests || []);
      const guestsSummary = guestNames.length === 0
        ? "-"
        : guestNames.length <= 3
          ? guestNames.join(", ")
          : `${guestNames.slice(0, 3).join(", ")} (+${guestNames.length - 3})`;
      const daysInRange = Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);
      const occ = Math.min(100, Math.round((d.nights / daysInRange) * 100));
      return `<tr><td>${cabinLabels[i]}</td><td>${d.count}</td><td>${guestsSummary}</td><td>${d.nights}</td><td>${money.format(d.revenue)}</td><td>${occ}%</td></tr>`;
    }).join("") || "<tr><td colspan='6'>Sin datos</td></tr>";
  }
}

/* Setup dashboards and integration */
var refreshGastosDash = setupSectionDashboard("gastos-dash", renderGastosDash);
var refreshReservasDash = setupSectionDashboard("reservas-dash", renderReservasDash);
var refreshCabanasDash = setupSectionDashboard("cabanas-dash", renderCabanasDash);
