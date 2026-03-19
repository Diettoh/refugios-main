const API_BASE = "https://api.trello.com/1";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    const error = new Error(`Falta variable de entorno requerida: ${name}`);
    error.status = 503;
    throw error;
  }
  return value;
}

function authQuery() {
  const key = requiredEnv("TRELLO_API_KEY");
  const token = requiredEnv("TRELLO_TOKEN");
  return `key=${encodeURIComponent(key)}&token=${encodeURIComponent(token)}`;
}

async function trelloRequest(path, { method = "GET", body } = {}) {
  const url = `${API_BASE}${path}${path.includes("?") ? "&" : "?"}${authQuery()}`;

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || `Error Trello ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

export async function createCard({ name, desc = "", idList, due = null, labels = [] }) {
  return trelloRequest("/cards", {
    method: "POST",
    body: {
      name,
      desc,
      idList,
      due,
      idLabels: Array.isArray(labels) ? labels.join(",") : ""
    }
  });
}

export async function moveCard({ cardId, idList }) {
  return trelloRequest(`/cards/${encodeURIComponent(cardId)}`, {
    method: "PUT",
    body: { idList }
  });
}

export async function addComment({ cardId, text }) {
  return trelloRequest(`/cards/${encodeURIComponent(cardId)}/actions/comments`, {
    method: "POST",
    body: { text }
  });
}
