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

function getChannelPaymentValue(source, paymentMethod) {
  const src = String(source || "").toLowerCase();
  const pay = String(paymentMethod || "").toLowerCase();
  if (src === "direct" && pay === "transfer") return "transfer";
  if (src === "web") return "web";
  if (src === "airbnb") return "airbnb";
  if (src === "booking") return "booking";
  return "";
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
  const breadcrumbCurrent = document.querySelector(".breadcrumb__current");
  const DEFAULT_PANEL = "#section-availability";

  const setActivePanel = (id) => {
    panels.forEach((panel) => panel.classList.toggle("is-active", `#${panel.id}` === id));
    navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === id));
    if (breadcrumbCurrent) {
      const activeLink = navLinks.find((link) => link.getAttribute("href") === id);
      breadcrumbCurrent.textContent = activeLink?.textContent?.trim() || "Panel";
    }
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
  // Resetear sale-modal si fue abierto como "Abonar"
  if (modal.id === "sale-modal") {
    const title = modal.querySelector(".modal__header h3");
    const debtInfo = document.getElementById("sale-debt-info");
    const categoryInput = document.querySelector("#sale-form [name='category']");
    if (title) title.textContent = "Registrar venta";
    if (debtInfo) { debtInfo.hidden = true; debtInfo.innerHTML = ""; }
    if (categoryInput) {
      categoryInput.disabled = false;
      categoryInput.style.pointerEvents = "";
      categoryInput.style.opacity = "";
    }
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
        const title = modal?.querySelector(".modal__header h3");
        if (title) title.textContent = "Registrar gasto";
        if (form) {
          form.reset();
          const idEl = form.querySelector('[name="id"]');
          if (idEl) idEl.value = "";
          const monthInput = form.querySelector('[name="expense_month"]');
          if (monthInput) monthInput.value = new Date().toISOString().slice(0, 7);
        }
      }
      if (modalId === "reservation-modal") {
        resetReservationForm();
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

function deleteButton(type, id, label = "Eliminar") {
  return `<button type="button" class="btn-delete" data-delete-type="${type}" data-id="${id}">${label}</button>`;
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

function saleMatchesPeriod(row, from, to) {
  const effectiveDate = toDateKey(row?.reservation_check_out || row?.effective_period_date || row?.sale_date);
  if (effectiveDate) {
    if (from && effectiveDate < from) return false;
    if (to && effectiveDate > to) return false;
    return true;
  }
  return inDateRange(row?.sale_date, from, to);
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
  const totalEl = document.getElementById("expenses-kpi-total");
  const countEl = document.getElementById("expenses-kpi-count");
  if (totalEl) totalEl.textContent = money.format(total);
  if (countEl) countEl.textContent = String(count);
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
        <td>
          <button type="button" class="btn btn--sm btn--ghost btn-edit-expense" data-expense-id="${row.id}">Editar</button>
          ${deleteButton("expenses", row.id)}
        </td>
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
  return checkIn <= targetDay && targetDay <= checkOut;
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
        dateKey <= toDateKey(r.check_out)
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
    return checkIn && checkOut && checkIn <= dateKey && dateKey <= checkOut;
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
    return checkIn && checkOut && checkIn <= dateKey && dateKey <= checkOut;
  });
}

function getCabinColor(cabin) {
  if (!cabin) return "#94a3b8";
  const defaults = getCabinVisualDefaults(cabin);
  return cabin.color_hex || defaults.color;
}

function getCalendarCabinPalette(cabin, idx = 0) {
  const rawName = String(cabin?.name || "").trim();
  const rawCode = String(cabin?.short_code || "").trim().toUpperCase();
  const normalized = `${rawCode} ${rawName}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const paletteByKey = {
    "1": { className: "is-a", bg: "rgba(37, 99, 235, 0.95)", soft: "rgba(37, 99, 235, 0.18)", text: "#eff6ff", border: "#2563eb", code: rawCode || "1" },
    "2": { className: "is-b", bg: "rgba(220, 38, 38, 0.95)", soft: "rgba(220, 38, 38, 0.18)", text: "#fef2f2", border: "#dc2626", code: rawCode || "2" },
    "3": { className: "is-p", bg: "rgba(22, 163, 74, 0.95)", soft: "rgba(22, 163, 74, 0.18)", text: "#f0fdf4", border: "#16a34a", code: rawCode || "3" },
    casa: { className: "is-c", bg: "rgba(234, 179, 8, 0.95)", soft: "rgba(234, 179, 8, 0.22)", text: "#111827", border: "#eab308", code: rawCode || "C" }
  };

  if (normalized.includes("casa")) return paletteByKey.casa;
  if (/\b3\b/.test(normalized) || normalized.includes("refugio 3") || normalized.includes("cabana 3")) return paletteByKey["3"];
  if (/\b2\b/.test(normalized) || normalized.includes("refugio 2") || normalized.includes("cabana 2")) return paletteByKey["2"];
  if (/\b1\b/.test(normalized) || normalized.includes("refugio 1") || normalized.includes("cabana 1")) return paletteByKey["1"];

  return idx === 0 ? paletteByKey["1"] : idx === 1 ? paletteByKey["2"] : idx === 2 ? paletteByKey["3"] : paletteByKey.casa;
}

function getDayGuestLines(activeReservations, cabins) {
  const cabinById = new Map((cabins || []).map((c) => [Number(c.id), c]));
  return activeReservations
    .filter((row) => String(row.guest_name || "").trim())
    .map((row) => {
      const name = String(row.guest_name || "").trim().toUpperCase();
      const guests = Number(row.guests_count) || 1;
      const cabin = cabinById.get(Number(row.cabin_id));
      const cabinIndex = (cabins || []).findIndex((item) => Number(item.id) === Number(row.cabin_id));
      const palette = getCalendarCabinPalette(cabin, cabinIndex);
      return { label: `${name} X${guests}`, color: palette.border, status: row.status, palette };
    });
}

function renderDayCabinChips(cabins, activeReservations) {
  const occupied = new Set(activeReservations.map((r) => r.cabin_id).filter((id) => Number.isInteger(id)));
  return cabins
    .map((cabin, idx) => {
      const palette = getCalendarCabinPalette(cabin, idx);
      const code = palette.code ? String(palette.code).charAt(0) : idx === 0 ? "1" : idx === 1 ? "2" : idx === 2 ? "3" : "C";
      const colorClass = palette.className;
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
              return `<span class="calendar-guest-row${confirmedClass}" style="background:${line.palette.bg};color:${line.palette.text};border-left:4px solid ${line.palette.border}">${line.label}</span>`;
            }
            return `<span class="calendar-guest-row" style="border-left-color:${line.palette.border};background:${line.palette.soft}">${line.label}</span>`;
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

function getMonthRange(yy, mm) {
  const firstDay = new Date(Date.UTC(yy, mm - 1, 1));
  const lastDay = new Date(Date.UTC(yy, mm, 0));
  const startKey = firstDay.toISOString().slice(0, 10);
  const endKey = lastDay.toISOString().slice(0, 10);
  const daysInMonth = lastDay.getUTCDate();
  return { startKey, endKey, daysInMonth };
}

function clampReservationToRange(reservation, rangeStartKey, rangeEndKey) {
  const start = toDateKey(reservation.check_in);
  const end = toDateKey(reservation.check_out);
  if (!start || !end) return null;
  // Intersección (rangos inclusivos, consistente con el calendario actual)
  const clampedStart = start < rangeStartKey ? rangeStartKey : start;
  const clampedEnd = end > rangeEndKey ? rangeEndKey : end;
  if (clampedEnd < rangeStartKey || clampedStart > rangeEndKey) return null;
  if (clampedEnd < clampedStart) return null;
  return { start: clampedStart, end: clampedEnd };
}

function dateKeyDiffDays(fromKey, toKey) {
  const fromTs = Date.parse(`${fromKey}T00:00:00Z`);
  const toTs = Date.parse(`${toKey}T00:00:00Z`);
  if (!Number.isFinite(fromTs) || !Number.isFinite(toTs)) return 0;
  return Math.round((toTs - fromTs) / 86400000);
}

function packTimelineRows(items) {
  // items: [{ startIdx, endIdx, ... }], rangos inclusivos
  const rows = []; // lastEndIdx por fila
  const placed = [];
  const sorted = [...items].sort((a, b) => a.startIdx - b.startIdx || a.endIdx - b.endIdx || (a.id || 0) - (b.id || 0));

  for (const item of sorted) {
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i] < item.startIdx) {
        rowIndex = i;
        break;
      }
    }
    if (rowIndex === -1) {
      rowIndex = rows.length;
      rows.push(item.endIdx);
    } else {
      rows[rowIndex] = item.endIdx;
    }
    placed.push({ ...item, rowIndex });
  }

  return { rowsCount: Math.max(1, rows.length), placed };
}

function renderCalendarTimeline(reservations) {
  const mount = document.getElementById("calendar-timeline");
  if (!mount) return;

  const [yy, mm] = (state.calendarMonth || new Date().toISOString().slice(0, 7)).split("-").map(Number);
  const { startKey, endKey, daysInMonth } = getMonthRange(yy, mm);
  const dayW = 28;
  const rowH = 26;
  const totalDays = daysInMonth;
  const totalWidth = totalDays * dayW;

  const cabins = getCalendarCabins(state.cabins);
  const cabinById = new Map(cabins.map((c) => [Number(c.id), c]));

  const scoped = (reservations || []).filter((r) => {
    if (!r) return false;
    if (r.status === "cancelled") return false;
    const hit = clampReservationToRange(r, startKey, endKey);
    return Boolean(hit);
  });

  const nullCabinReservations = scoped.filter((r) => !Number.isInteger(r.cabin_id));
  const lanes = [
    ...cabins.map((c) => ({ id: Number(c.id), name: c.name || `Cabaña #${c.id}`, cabin: c })),
    ...(nullCabinReservations.length > 0 ? [{ id: null, name: "Sin cabaña", cabin: null }] : [])
  ];

  const headerDaysHtml = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    return `<div class="cal-tl__day">${d}</div>`;
  }).join("");

  const laneHtml = lanes
    .map((lane) => {
      const laneId = lane.id;
      const laneReservations = scoped.filter((r) => (laneId == null ? !Number.isInteger(r.cabin_id) : Number(r.cabin_id) === laneId));

      const items = laneReservations
        .map((r) => {
          const hit = clampReservationToRange(r, startKey, endKey);
          if (!hit) return null;
          const startIdx = dateKeyDiffDays(startKey, hit.start);
          const endIdx = dateKeyDiffDays(startKey, hit.end);
          if (endIdx < 0 || startIdx > daysInMonth - 1) return null;
          return { ...r, startIdx, endIdx };
        })
        .filter(Boolean);

      const { rowsCount, placed } = packTimelineRows(items);
      const heightPx = rowsCount * rowH;

      const meta = lane.cabin
        ? `${lane.cabin.size_category === "large" ? "Casa · " : "Refugio · "}${getCabinCapacity(lane.cabin)} pax`
        : "Reservas sin cabaña asignada";

      const bars = placed
        .map((r) => {
          const left = r.startIdx * dayW;
          const width = Math.max(dayW, (r.endIdx - r.startIdx + 1) * dayW);
          const top = r.rowIndex * rowH + 3;
          const guest = String(r.guest_name || "").trim() || "Sin nombre";
          const pax = Number(r.guests_count) || 1;
          const label = `${guest.toUpperCase()} X${pax}`;

          const cabin = lane.cabin || cabinById.get(Number(r.cabin_id));
          const cabinIndex = cabins.findIndex((c) => Number(c.id) === Number(r.cabin_id));
          const palette = cabin ? getCalendarCabinPalette(cabin, cabinIndex) : null;
          const bg = palette?.soft || "rgba(148, 163, 184, 0.14)";
          const border = palette?.border || "rgba(148, 163, 184, 0.22)";
          const text = palette?.text || "rgba(226, 232, 240, 0.9)";

          const classes = ["cal-tl__res"];
          if (!Number.isInteger(r.cabin_id)) classes.push("is-muted");
          if (r.status === "cancelled") classes.push("is-cancelled");

          const title = `#${r.id} · ${formatDate(r.check_in)} → ${formatDate(r.check_out)}`;
          return `<div class="${classes.join(" ")}" data-res-id="${r.id}"
            style="left:${left}px;top:${top}px;width:${width}px;background:${bg};border-color:${border};color:${text}"
            title="${title}">${label}</div>`;
        })
        .join("");

      return `
        <div class="cal-tl__lane-label">
          <span>${lane.name}</span>
          <span class="cal-tl__lane-meta">${meta}</span>
        </div>
        <div class="cal-tl__lane-track">
          <div class="cal-tl__lane-inner" style="width:${totalWidth}px;min-height:${heightPx}px">
            ${bars}
          </div>
        </div>
      `;
    })
    .join("");

  mount.innerHTML = `
    <div class="cal-tl">
      <div class="cal-tl__spacer">Reservas · ${MONTH_NAMES[mm - 1]} ${yy}</div>
      <div class="cal-tl__days"><div class="cal-tl__day-row" style="width:${totalWidth}px">${headerDaysHtml}</div></div>
      <div class="cal-tl__lanes">${laneHtml}</div>
    </div>
  `;

  // Scroll sync (header + lanes)
  const daysScroller = mount.querySelector(".cal-tl__days");
  const laneScrollers = [...mount.querySelectorAll(".cal-tl__lane-track")];
  if (daysScroller && laneScrollers.length > 0) {
    let syncing = false;
    const syncTo = (left) => {
      if (syncing) return;
      syncing = true;
      daysScroller.scrollLeft = left;
      laneScrollers.forEach((el) => {
        el.scrollLeft = left;
      });
      syncing = false;
    };
    daysScroller.addEventListener("scroll", () => syncTo(daysScroller.scrollLeft));
    laneScrollers.forEach((el) => el.addEventListener("scroll", () => syncTo(el.scrollLeft)));
  }

  // Click abre editor (si existe)
  mount.querySelectorAll(".cal-tl__res[data-res-id]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = Number(el.dataset.resId);
      if (!Number.isInteger(id) || id <= 0) return;
      if (typeof openReservationEditor === "function") {
        openReservationEditor(id);
        return;
      }
      const any = scoped.find((r) => Number(r.id) === id);
      if (any?.check_in) {
        state.availabilityDate = toDateKey(any.check_in);
        const dateInput = document.getElementById("availability-date");
        if (dateInput) dateInput.value = state.availabilityDate;
        loadAll();
      }
    });
  });
}

function renderCalendar(reservations) {
  const container = document.getElementById("calendar-days");
  const timeline = document.getElementById("calendar-timeline");
  const titleEl = document.getElementById("calendar-title");
  const gridEl = document.getElementById("calendar-grid");
  if (!titleEl) return;

  if (gridEl) gridEl.hidden = state.calendarView === "timeline";
  if (timeline) timeline.hidden = state.calendarView !== "timeline";
  if (state.calendarView === "timeline") {
    renderCalendarTimeline(reservations);
    return;
  }
  if (!container) return;

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
      const nextLabelByView = {
        panel: "Vista timeline",
        timeline: "Vista PDF",
        pdf: "Vista panel"
      };
      viewBtn.textContent = nextLabelByView[state.calendarView] || "Vista timeline";
    };
    applyLabel();
    viewBtn.addEventListener("click", () => {
      const order = ["panel", "timeline", "pdf"];
      const idx = Math.max(0, order.indexOf(state.calendarView));
      state.calendarView = order[(idx + 1) % order.length];
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
  const filteredSales = (state.periodFrom || state.periodTo)
    ? sales.filter((row) => saleMatchesPeriod(row, state.periodFrom, state.periodTo))
    : sales;
  const filteredExpenses = expenses;
  const filteredDocuments = filterRows(documents, "issue_date");
  const filteredGuests = state.periodFrom || state.periodTo
    ? guests.filter((row) => inDateRange(row.reservation_check_in, state.periodFrom, state.periodTo))
    : guests;

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
        ${row.status && row.status !== "confirmed" ? chip(`Estado ${row.status}`, row.status === "cancelled" ? "badge--ghost" : "badge--info") : ""}
        ${chip(`Canal/Pago ${formatChannelPaymentLabel(row.source, row.payment_method)}`)}
        ${chip(`Llega ${formatDate(row.check_in)}${row.check_in_time ? " " + String(row.check_in_time).slice(0, 5) : ""}`)}
        ${chip(`Sale ${formatDate(row.check_out)}${row.checkout_time ? " " + String(row.checkout_time).slice(0, 5) : ""}`)}
        ${row.nights != null ? chip(`${row.nights} noche${Number(row.nights) === 1 ? "" : "s"}`) : ""}
        ${Number(row.total_amount) === 0 ? chip("Sin monto — editar", "debt-pending") : chip(`Total ${money.format(row.total_amount)}`)}
        <button type="button" class="chip chip--btn" id="abono-btn-${row.id}" onclick="togglePaymentHistory(${row.id})">
          Abonado ${money.format(row.paid_amount || 0)} ▾
        </button>
        ${Number(row.total_amount) > 0 ? chip(debtLabel(row.debt_status, row.amount_due), debtClass(row.debt_status)) : ""}
      </div>
      <div id="payment-history-${row.id}" class="payment-history" hidden></div>
      <div class="record-actions">
        ${row.debt_status !== "paid" ? `<button type="button" class="btn btn--sm btn--primary" onclick="openSaleModalForReservation(${row.id}, ${Number(row.amount_due || 0)}, '${(row.guest_name || "").replace(/'/g, "\\'")}')">Abonar</button>` : ""}
        ${row.paid_amount == 0 && Number(row.total_amount) > 0 ? `<button type="button" class="btn btn--sm btn--ghost" onclick="migrateReservationPayment(${row.id}, '${(row.guest_name || "").replace(/'/g, "\\'")}')" title="Marcar como pagada (reserva antigua)">Migrar pago</button>` : ""}
        <button type="button" class="btn btn--sm btn--ghost btn-edit-reservation" data-reservation-id="${row.id}">Editar</button>
        ${deleteButton("reservations", row.id, "Cancelar")}
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
        ${row.status && row.status !== "issued" ? chip(`Estado ${row.status}`, "badge--ghost") : ""}
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
}

function refreshMonthlyReportTables() {
  if (!state.sales || !state.expenses) return;
  const { from, to } = getSalesPeriod();
  if (!from || !to) return;
  const sales = (state.sales || []).filter((r) => saleMatchesPeriod(r, from, to));
  const expenses = (state.expenses || []).filter((r) => inDateRange(r.expense_date, from, to));
  renderMonthlyTables(from, to, sales, expenses);
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
      const canDelete = !(Number.isInteger(cabin.id) && cabin.id >= 1 && cabin.id <= 4);
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
          ${canDelete ? deleteButton("cabins", cabin.id) : `<span class="chip badge--ghost" title="Cabañas operativas (1-4) no se eliminan.">Protegida</span>`}
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

function resetReservationForm() {
  const modal = document.getElementById("reservation-modal");
  const form = document.getElementById("reservation-form");
  if (!modal || !form) return;

  form.reset();
  const title = modal.querySelector(".modal__header h3");
  if (title) title.textContent = "Nueva reserva";

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.textContent = "Guardar reserva";

  const reservationIdInput = form.querySelector('input[name="reservation_id"]');
  const guestIdInput = form.querySelector('input[name="guest_id"]');
  if (reservationIdInput) reservationIdInput.value = "";
  if (guestIdInput) guestIdInput.value = "";

  const noRutCheckbox = form.querySelector("#no-rut-checkbox");
  const documentInput = form.querySelector('input[name="guest_document_id"]');
  if (noRutCheckbox) noRutCheckbox.checked = false;
  if (documentInput) {
    documentInput.disabled = false;
    documentInput.required = true;
  }

  setReservationGuestStatus("Ingresa RUT para buscar huésped.");
}

function openReservationEditor(reservationId) {
  const reservation = (state.reservations || []).find((row) => Number(row.id) === Number(reservationId));
  if (!reservation) {
    setStatus("No se pudo cargar la reserva para editar.", "error");
    return;
  }

  const modal = document.getElementById("reservation-modal");
  const form = document.getElementById("reservation-form");
  if (!modal || !form) return;

  resetReservationForm();

  const guest = (state.guests || []).find((row) => Number(row.id) === Number(reservation.guest_id)) || null;
  const setFieldValue = (selector, value) => {
    const field = form.querySelector(selector);
    if (field) field.value = value ?? "";
  };

  const title = modal.querySelector(".modal__header h3");
  if (title) title.textContent = `Editar reserva #${reservation.id}`;

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.textContent = "Guardar cambios";

  setFieldValue('[name="reservation_id"]', String(reservation.id));
  setFieldValue('[name="guest_id"]', String(reservation.guest_id || ""));
  setFieldValue('[name="guest_document_id"]', reservation.guest_document || "");
  setFieldValue('[name="guest_full_name"]', reservation.guest_name || guest?.full_name || "");
  setFieldValue('[name="guest_email"]', guest?.email || "");
  setFieldValue('[name="guest_phone"]', guest?.phone || "");
  setFieldValue('[name="channel_payment"]', getChannelPaymentValue(reservation.source, reservation.payment_method));
  setFieldValue('[name="cabin_id"]', String(reservation.cabin_id || ""));
  setFieldValue('[name="nightly_rate"]', String(reservation.nightly_rate ?? ""));
  setFieldValue('[name="check_in"]', toDateKey(reservation.check_in) || "");
  setFieldValue('[name="check_out"]', toDateKey(reservation.check_out) || "");
  setFieldValue('[name="check_in_time"]', reservation.check_in_time ? String(reservation.check_in_time).slice(0, 5) : "");
  setFieldValue('[name="checkout_time"]', reservation.checkout_time ? String(reservation.checkout_time).slice(0, 5) : "");
  setFieldValue('[name="guests_count"]', String(reservation.guests_count || 1));
  setFieldValue('[name="nights"]', String(reservation.nights || ""));
  setFieldValue('[name="additional_charge"]', String(reservation.additional_charge || 0));
  setFieldValue('[name="tax_document_type"]', guest?.tax_document_type || "sii");
  setFieldValue('[name="total_amount"]', String(reservation.total_amount || 0));
  setFieldValue('[name="notes"]', reservation.notes || "");

  const noRutCheckbox = form.querySelector("#no-rut-checkbox");
  const documentInput = form.querySelector('input[name="guest_document_id"]');
  const isNoRut = !String(reservation.guest_document || "").trim();
  if (noRutCheckbox) noRutCheckbox.checked = isNoRut;
  if (documentInput) {
    documentInput.disabled = isNoRut;
    documentInput.required = !isNoRut;
  }

  setReservationGuestStatus(`Editando reserva de ${reservation.guest_name || "huésped"} (#${reservation.id}).`, "ok");
  openModal(modal);

  setTimeout(() => {
    const cabinSelect = document.getElementById("reservation-cabin");
    if (cabinSelect) cabinSelect.dispatchEvent(new Event("change"));
  }, 0);
}

function bindReservationForm() {
  const form = document.getElementById("reservation-form");
  if (!form) return;
  const nightlyRateInput = form.querySelector('input[name="nightly_rate"]');
  let isSubmitting = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    const payload = normalize(toPayload(form));
    const reservationId = Number(payload.reservation_id || 0);
    const isEditing = Number.isInteger(reservationId) && reservationId > 0;
    delete payload.reservation_id;
    const noRutCheckbox = form.querySelector('#no-rut-checkbox');
    const isNoRut = noRutCheckbox && noRutCheckbox.checked;

    const rut = isNoRut ? null : normalizeDocumentId(payload.guest_document_id);
    payload.guest_document_id = rut;

    if (!rut && !isNoRut) {
      setStatus("Debes ingresar RUT del huésped", "error");
      setReservationGuestStatus("Debes ingresar RUT válido.", "error");
      return;
    }

    const nightlyRateValue = Number(payload.nightly_rate);
    const hasNightlyRate = Number.isFinite(nightlyRateValue) && nightlyRateValue > 0;
    if (!hasNightlyRate) {
      const shouldContinueWithoutRate = window.confirm(
        "Actualmente no hay una tarifa por noche configurada. Desea continuar igualmente?"
      );
      if (!shouldContinueWithoutRate) {
        setStatus("Debes ingresar una tarifa por noche o confirmar continuar con tarifa 0.", "error");
        if (nightlyRateInput) {
          nightlyRateInput.focus();
          nightlyRateInput.select?.();
        }
        return;
      }
      payload.nightly_rate = 0;
    }

    setStatus("Guardando...", "");
    try {
      let guestId = Number(payload.guest_id);
      if (!Number.isInteger(guestId) || guestId <= 0) {
        if (isEditing) {
          throw new Error("La reserva no tiene un huésped válido para editar.");
        }
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

      if (isEditing) {
        delete reservationPayload.guest_id;
        delete reservationPayload.guest_name;
        delete reservationPayload.guest_document;
        delete reservationPayload.guest_email;
        delete reservationPayload.guest_phone;
        delete reservationPayload.tax_document_type;
        await api(`/api/reservations/${reservationId}`, { method: "PATCH", body: JSON.stringify(reservationPayload) });
      } else {
        await api("/api/reservations", { method: "POST", body: JSON.stringify(reservationPayload) });
      }
      form.reset();
      setReservationGuestStatus("Ingresa RUT para buscar huésped.");
      await loadAll();
      closeModal(form.closest(".form-modal"));
      setStatus(isEditing ? "Reserva actualizada" : "Reserva guardada", "ok");
    } catch (error) {
      setStatus(error.message, "error");
      setReservationGuestStatus(error.message, "error");
    } finally {
      isSubmitting = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function bindReservationPricing() {
  const form = document.getElementById("reservation-form");
  if (!form) return;
  const checkInInput = form.querySelector('input[name="check_in"]');
  const checkOutInput = form.querySelector('input[name="check_out"]');
  const nightsInput = document.getElementById("reservation-nights");
  const nightlyRateInput = document.getElementById("reservation-nightly-rate");
  const totalAmountInput = form.querySelector('input[name="total_amount"]');
  const additionalChargeInput = form.querySelector('input[name="additional_charge"]');
  const totalSuggestion = document.getElementById("reservation-total-suggestion");
  if (!checkInInput || !checkOutInput || !nightsInput || !nightlyRateInput || !totalAmountInput || !totalSuggestion) return;

  let totalEditedManually = false;

  const formatMoneyValue = (value) => money.format(Number(value || 0));
  const updateSuggestedTotal = () => {
    const nights = Number(nightsInput.value || 0);
    const nightlyRate = Number(nightlyRateInput.value || 0);
    const hasSuggestion = Number.isFinite(nights) && nights > 0 && Number.isFinite(nightlyRate) && nightlyRate > 0;

    if (!hasSuggestion) {
      totalSuggestion.textContent = "Completa noches y tarifa para sugerir un total.";
      totalAmountInput.dataset.lastSuggestedTotal = "";
      return;
    }

    const additionalCharge = Math.max(0, Number(additionalChargeInput?.value || 0));
    const baseTotal = Math.round(nights * nightlyRate);
    const suggestedTotal = baseTotal + additionalCharge;
    const suggestionText = additionalCharge > 0
      ? `Sugerencia: ${formatMoneyValue(suggestedTotal)} (${nights} noches x ${formatMoneyValue(nightlyRate)} + adicional ${formatMoneyValue(additionalCharge)}).`
      : `Sugerencia: ${formatMoneyValue(suggestedTotal)} (${nights} noches x ${formatMoneyValue(nightlyRate)}).`;
    totalSuggestion.textContent = suggestionText;

    const previousSuggestedTotal = totalAmountInput.dataset.lastSuggestedTotal || "";
    const currentTotalValue = String(totalAmountInput.value || "").trim();
    const shouldAutofill =
      !currentTotalValue || !totalEditedManually || currentTotalValue === previousSuggestedTotal;

    totalAmountInput.dataset.lastSuggestedTotal = String(suggestedTotal);
    if (shouldAutofill) {
      totalAmountInput.value = String(suggestedTotal);
      totalEditedManually = false;
    }
  };

  const recomputeNights = () => {
    const ci = checkInInput.value;
    const co = checkOutInput.value;
    if (ci && co) {
      const d1 = new Date(ci);
      const d2 = new Date(co);
      const diff = Math.max(0, Math.round((d2 - d1) / 86400000));
      nightsInput.value = String(diff);
    }
    updateSuggestedTotal();
  };

  nightsInput.addEventListener("input", updateSuggestedTotal);
  nightsInput.addEventListener("change", updateSuggestedTotal);
  nightlyRateInput.addEventListener("input", updateSuggestedTotal);
  nightlyRateInput.addEventListener("change", updateSuggestedTotal);
  totalAmountInput.addEventListener("input", () => {
    const currentTotalValue = String(totalAmountInput.value || "").trim();
    totalEditedManually = currentTotalValue !== "" && currentTotalValue !== (totalAmountInput.dataset.lastSuggestedTotal || "");
    if (!currentTotalValue) totalEditedManually = false;
  });
  form.addEventListener("reset", () => {
    totalEditedManually = false;
    totalAmountInput.dataset.lastSuggestedTotal = "";
    totalSuggestion.textContent = "Completa noches y tarifa para sugerir un total.";
  });
  checkInInput.addEventListener("change", recomputeNights);
  checkOutInput.addEventListener("change", recomputeNights);
  additionalChargeInput?.addEventListener("input", updateSuggestedTotal);
  additionalChargeInput?.addEventListener("change", updateSuggestedTotal);
  updateSuggestedTotal();
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
    const guestRow = (state.guests || []).find((row) => Number(row.id) === guestId) || null;
    const guestAliasIds = Array.isArray(guestRow?.guest_alias_ids)
      ? guestRow.guest_alias_ids.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
      : [guestId];

    const modal = document.getElementById("guest-history-modal");
    const title = document.getElementById("guest-history-title");
    const list = document.getElementById("guest-history-list");
    if (!modal || !list) return;

    if (title) title.textContent = `Historial de reservas: ${guestName}`;
    list.innerHTML = "<li class=\"record-item\">Cargando historial...</li>";
    openModal(modal);

    try {
      // Usamos el filtro guest_id que añadimos al backend
      const params = new URLSearchParams();
      params.set("guest_id", String(guestId));
      if (guestAliasIds.length > 0) params.set("guest_ids", guestAliasIds.join(","));
      const history = await api(`/api/reservations?${params.toString()}`);
      
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

function bindReservationEditButtons() {
  document.body.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-edit-reservation");
    if (!button) return;

    const reservationId = Number(button.dataset.reservationId);
    if (!Number.isInteger(reservationId) || reservationId <= 0) return;
    openReservationEditor(reservationId);
  });
}

function openExpenseEditor(expenseId) {
  const id = Number(expenseId);
  if (!Number.isInteger(id) || id <= 0) return;
  const row = (state.expenses || []).find((r) => Number(r.id) === id);
  if (!row) {
    setStatus(`Gasto #${id} no encontrado en memoria. Recargando...`, "");
    loadAll();
    return;
  }

  const modal = document.getElementById("expense-modal");
  const form = document.getElementById("expense-form");
  if (!modal || !form) return;

  const title = modal.querySelector(".modal__header h3");
  if (title) title.textContent = `Editar gasto #${id}`;

  const monthKey = toDateKey(row.expense_date).slice(0, 7);
  const setValue = (name, value) => {
    const el = form.querySelector(`[name="${name}"]`);
    if (el) el.value = value == null ? "" : String(value);
  };

  setValue("id", id);
  setValue("expense_month", monthKey);
  setValue("category", row.category || "");
  setValue("payment_method", row.payment_method || "");
  setValue("amount", row.amount != null ? Number(row.amount) : "");
  setValue("supplier", row.supplier || "");
  setValue("description", row.description || "");

  openModal(modal);
}

function bindExpenseEditButtons() {
  document.body.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-edit-expense");
    if (!button) return;
    const id = Number(button.dataset.expenseId);
    openExpenseEditor(id);
  });
}

function bindExpenseForm() {
  const form = document.getElementById("expense-form");
  const modal = document.getElementById("expense-modal");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = normalize(toPayload(form));
    const expenseId = Number(payload.id);
    delete payload.id;

    const isEdit = Number.isInteger(expenseId) && expenseId > 0;
    const endpoint = isEdit ? `/api/expenses/${expenseId}` : "/api/expenses";
    const method = isEdit ? "PATCH" : "POST";

    setStatus(isEdit ? "Actualizando gasto..." : "Guardando gasto...", "");

    try {
      await api(endpoint, { method, body: JSON.stringify(payload) });
      form.reset();
      if (modal) {
        const title = modal.querySelector(".modal__header h3");
        if (title) title.textContent = "Registrar gasto";
      }
      await loadAll();
      closeModal(form.closest(".form-modal"));
      setStatus(isEdit ? "Gasto actualizado" : "Gasto registrado", "ok");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
}

function bindDeleteButtons() {
  document.body.addEventListener("click", async (event) => {
    const button = event.target.closest(".btn-delete");
    if (!button) return;

    const { deleteType, id } = button.dataset;
    if (!deleteType || !id) return;

    const actionLabel =
      deleteType === "reservations"
        ? "Cancelar"
        : deleteType === "documents"
          ? "Anular"
          : "Eliminar";
    const warning =
      deleteType === "reservations"
        ? "La reserva quedará en estado cancelled (recuperable)."
        : deleteType === "documents"
          ? "El documento quedará en estado voided (trazable)."
          : "Esta accion no se puede deshacer.";
    const confirmed = window.confirm(`${actionLabel} registro #${id}? ${warning}`);
    if (!confirmed) return;

    setStatus(`${actionLabel}...`, "");

    try {
      await api(`/api/${deleteType}/${id}`, { method: "DELETE" });
      await loadAll();
      const doneLabel =
        deleteType === "reservations"
          ? "cancelada"
          : deleteType === "documents"
            ? "anulado"
            : "eliminado";
      setStatus(`Registro #${id} ${doneLabel}`, "ok");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
}

function bindPeriodControls() {
  /* Filtro período movido a Ventas (sección separada) */
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
    if (categoryInput) {
      categoryInput.value = "abono";
      categoryInput.style.pointerEvents = "none";
      categoryInput.style.opacity = "0.6";
    }
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

  if (modalTitle) modalTitle.textContent = `Registrar abono — Reserva #${reservationId}`;

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

function getSalesPeriod() {
  const typeEl = document.getElementById("sales-period-type");
  const yearEl = document.getElementById("monthly-report-year");
  const monthEl = document.getElementById("monthly-report-month");
  const quarterEl = document.getElementById("sales-quarter");
  const semesterEl = document.getElementById("sales-semester");
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
  const cobrosBtn = document.getElementById("sales-export-cobros");
  if (cobrosBtn) {
    cobrosBtn.addEventListener("click", async () => {
      try {
        const { from, to } = getSalesPeriod();
        const q = `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
        await downloadExport(`/api/exports/cobros.csv${q}`, `cobros_${from}_${to}.csv`);
        setStatus("Cobros exportados", "ok");
      } catch (e) {
        setStatus(e.message || "Error al exportar", "error");
      }
    });
  }

  const expensesBtn = document.getElementById("expenses-export-btn");
  if (expensesBtn) {
    expensesBtn.addEventListener("click", async () => {
      try {
        const { from, to } = getSalesPeriod();
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

  const ventasPdfBtn = document.getElementById("sales-export-pdf");
  if (ventasPdfBtn) {
    ventasPdfBtn.addEventListener("click", () => {
      const { from, to } = getSalesPeriod();
      exportSectionAsPdf("section-sales", "Ventas · Informes y exportación", getPeriodLabel(from, to));
    });
  }
}

for (const [formId, endpoint, message] of [
  ["sale-form", "/api/sales", "Venta registrada"],
  ["document-form", "/api/documents", "Documento registrado"]
]) {
  bindForm(formId, endpoint, message);
}

bindExpenseForm();
bindGuestForm();
bindReservationGuestLookup();
bindReservationForm();
bindReservationPricing();
bindGuestEditButtons();
bindGuestHistoryButtons();
bindReservationEditButtons();
bindExpenseEditButtons();
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
bindExportButtons();
setupSalesSection();

const monthlyCharts = {};

function setupSalesSection() {
  const periodType = document.getElementById("sales-period-type");
  const monthSelect = document.getElementById("monthly-report-month");
  const yearSelect = document.getElementById("monthly-report-year");
  const quarterSelect = document.getElementById("sales-quarter");
  const semesterSelect = document.getElementById("sales-semester");
  const monthWrap = document.getElementById("sales-month-wrap");
  const quarterWrap = document.getElementById("sales-quarter-wrap");
  const semesterWrap = document.getElementById("sales-semester-wrap");

  const guestFilter = document.getElementById("sales-filter-guest");
  const cabinFilter = document.getElementById("sales-filter-cabin");
  const categoryFilter = document.getElementById("sales-filter-category");

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
    const { from, to } = getSalesPeriod();
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

  // Agrupar sales por reservation_id para mostrar suplemento como sub-fila
  const grouped = new Map();
  for (const row of sales) {
    const key = row.reservation_id != null ? `r_${row.reservation_id}` : `m_${row.id}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }

  const buildMainRow = (row) => {
    const desc = row.description || row.reservation_notes || "-";
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
      <td>${formatDate(row.effective_period_date || row.reservation_check_out || row.sale_date)}</td>
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
      <td title="${desc}" style="cursor:help; font-size:0.85em;">${short}</td>
      <td>
        <div style="display:flex; gap:4px;">
          <button class="btn btn--ghost btn--sm" onclick="alert('${desc.replace(/'/g, "\\'")}')" title="Ver nota completa">Ver</button>
          ${deleteButton("sales", row.id)}
        </div>
      </td>
    </tr>`;
  };

  const buildSubRow = (row) => {
    const desc = row.description || "-";
    const short = desc.length > 28 ? desc.slice(0, 28) + "..." : desc;
    const isAbono = row.category === "abono";
    const color = isAbono ? "var(--color-success, #22c55e)" : "var(--color-warning, #f59e0b)";
    const icon = isAbono ? "💰" : "📌";
    const label = isAbono ? "Abono" : "Cobro adicional";
    return `
    <tr style="background: color-mix(in srgb, ${color} 6%, transparent); border-top: none;">
      <td></td>
      <td colspan="6" style="padding-left:2rem; font-size:0.82em; color: var(--color-text-muted, #888); border-top:none;">
        <span style="border-left: 3px solid ${color}; padding-left: 0.5rem;">
          ${icon} <em>${label}</em>
        </span>
        <span style="margin-left:0.5rem; font-size:0.9em;" title="${desc}">${short}</span>
      </td>
      <td><strong style="color: ${color};">${isAbono ? "-" : "+"}${money.format(row.amount)}</strong></td>
      <td colspan="2"></td>
      <td></td>
      <td>
        <div style="display:flex; gap:4px;">
          <button class="btn btn--ghost btn--sm" onclick="alert('${desc.replace(/'/g, "\\'")}')" title="Ver nota completa">Ver</button>
          ${deleteButton("sales", row.id)}
        </div>
      </td>
    </tr>`;
  };

  const rowsHtml = [];
  for (const [, group] of grouped) {
    const main = group.find(r => r.category === "lodging") || group[0];
    const subs = group.filter(r => r !== main && (r.category === "suplemento" || r.category === "abono"));
    rowsHtml.push(buildMainRow(main));
    for (const sub of subs) rowsHtml.push(buildSubRow(sub));
    // ventas manuales sin categoría lodging/suplemento/abono en el mismo grupo
    for (const other of group.filter(r => r !== main && r.category !== "suplemento" && r.category !== "abono")) {
      rowsHtml.push(buildMainRow(other));
    }
  }

  salesBody.innerHTML = rowsHtml.join("") || "<tr><td colspan='12'>Sin ventas en este mes</td></tr>";

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

// ── UI helpers: confirm modal & toast ───────────────────────────────────────

let _confirmCallback = null;

function showConfirm({ title = "Confirmar acción", body = "", okLabel = "Confirmar", okClass = "btn--primary" } = {}, onConfirm) {
  const modal = document.getElementById("confirm-modal");
  const titleEl = document.getElementById("confirm-modal-title");
  const bodyEl = document.getElementById("confirm-modal-body");
  const okBtn = document.getElementById("confirm-modal-ok");
  if (!modal) return;
  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.textContent = body;
  if (okBtn) {
    okBtn.className = `btn ${okClass}`;
    okBtn.textContent = okLabel;
    okBtn.onclick = () => { closeConfirm(); onConfirm(); };
  }
  _confirmCallback = onConfirm;
  modal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeConfirm() {
  const modal = document.getElementById("confirm-modal");
  if (modal) modal.hidden = true;
  _confirmCallback = null;
  if (!document.querySelector(".form-modal:not([hidden])")) {
    document.body.classList.remove("modal-open");
  }
}

let _toastTimer = null;
function showToast(message, type = "") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  if (_toastTimer) clearTimeout(_toastTimer);
  toast.textContent = message;
  toast.className = `toast${type ? ` toast--${type}` : ""}`;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("toast--visible"));
  _toastTimer = setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => { toast.hidden = true; }, 220);
  }, 3500);
}

// ── Historial de pagos por reserva ──────────────────────────────────────────

async function togglePaymentHistory(reservationId) {
  const panel = document.getElementById(`payment-history-${reservationId}`);
  const btn = document.getElementById(`abono-btn-${reservationId}`);
  if (!panel) return;

  if (!panel.hidden) {
    panel.hidden = true;
    if (btn) btn.classList.remove("is-open");
    return;
  }

  if (btn) btn.classList.add("is-open");
  panel.hidden = false;
  panel.innerHTML = `<span class="payment-history__empty">Cargando…</span>`;

  try {
    const res = await fetch(`/api/sales/by-reservation/${reservationId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    if (!res.ok) throw new Error("Error al cargar historial");
    const payments = await res.json();

    const abonos = payments.filter(p => p.category === "abono");

    if (!abonos.length) {
      panel.innerHTML = `<span class="payment-history__empty">Sin abonos registrados.</span>`;
      return;
    }

    const abonoChips = abonos.map(p => `
      <span class="payment-history__item">
        <span>${formatDate(p.sale_date)}</span>
        <strong>${money.format(p.amount)}</strong>
        <button class="payment-history__delete" onclick="deleteAbono(${p.id}, ${reservationId})" title="Eliminar abono">✕</button>
      </span>`).join("");

    panel.innerHTML = `<span class="payment-history__label">Abonos:</span>${abonoChips}`;
  } catch {
    panel.innerHTML = `<span class="payment-history__empty" style="color:var(--danger)">Error al cargar.</span>`;
  }
}

function deleteAbono(saleId, reservationId) {
  showConfirm(
    { title: "Eliminar abono", body: "¿Eliminar este abono? Esta acción no se puede deshacer.", okLabel: "Eliminar", okClass: "btn--danger" },
    async () => {
      try {
        const res = await fetch(`/api/sales/${saleId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        const data = await res.json();
        if (!res.ok) {
          showToast(data.error || "Error al eliminar el abono", "error");
          return;
        }
        showToast("Abono eliminado", "ok");
        await loadAll();
      } catch {
        showToast("Error de red al eliminar el abono", "error");
      }
    }
  );
}

function migrateReservationPayment(reservationId, guestName) {
  showConfirm(
    {
      title: "Migrar pago",
      body: `¿Marcar la reserva #${reservationId} (${guestName}) como pagada? Esto crea un abono de migración por el total de la reserva. Úsalo solo si la reserva ya estaba pagada.`,
      okLabel: "Sí, migrar",
      okClass: ""
    },
    async () => {
      try {
        const res = await fetch(`/api/reservations/migrate-payments`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getAuthToken()}`, "Content-Type": "application/json" }
        });
        const data = await res.json();
        if (!res.ok) {
          showToast(data.error || "Error en la migración", "error");
          return;
        }
        showToast(data.message || "Migración completada", "ok");
        await loadAll();
      } catch {
        showToast("Error de red en la migración", "error");
      }
    }
  );
}

warmupAndStart();
