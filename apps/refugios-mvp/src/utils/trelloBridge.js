function isBridgeEnabled() {
  const value = String(process.env.TRELLO_BRIDGE_ENABLED || "").trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

function bridgeUrl() {
  const base = String(process.env.TRELLO_BRIDGE_BASE_URL || "http://localhost:3400").replace(/\/+$/, "");
  const path = String(process.env.TRELLO_BRIDGE_CREATE_CARD_PATH || "/v1/cards");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function buildCardDescription({ reservation, guestName }) {
  const lines = [
    "Reserva creada desde Refugios MVP",
    `Reserva ID: ${reservation.id}`,
    `Huésped: ${guestName}`,
    `Canal: ${reservation.source}`,
    `Check-in: ${reservation.check_in}`,
    `Check-out: ${reservation.check_out}`,
    `Huéspedes: ${reservation.guests_count}`,
    `Monto total: ${reservation.total_amount}`,
    `Etapa comercial: ${reservation.lead_stage || "-"}`
  ];
  if (reservation.checkout_time) lines.push(`Hora salida: ${String(reservation.checkout_time).slice(0, 5)}`);
  if (reservation.follow_up_at) lines.push(`Próximo seguimiento: ${reservation.follow_up_at}`);
  return lines.join("\n");
}

export async function notifyReservationCreatedToTrello({ reservation, guestName }) {
  if (!isBridgeEnabled()) return;

  const idList = String(process.env.TRELLO_BRIDGE_DEFAULT_LIST_ID || "").trim() || undefined;
  const payload = {
    name: `Reserva #${reservation.id} · ${guestName}`,
    desc: buildCardDescription({ reservation, guestName }),
    idList
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(bridgeUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message = body?.error || `HTTP ${response.status}`;
      throw new Error(`Trello bridge rechazó la solicitud: ${message}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

