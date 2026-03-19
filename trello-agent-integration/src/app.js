import express from "express";
import { addComment, createCard, moveCard } from "./trello/client.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "trello-agent-integration", ts: new Date().toISOString() });
});

app.post("/v1/cards", async (req, res, next) => {
  try {
    const {
      name,
      desc = "",
      idList = process.env.TRELLO_DEFAULT_LIST_ID || "",
      due = null,
      labels = []
    } = req.body || {};

    if (!name || !idList) {
      return res.status(400).json({ error: "Campos requeridos: name, idList (o TRELLO_DEFAULT_LIST_ID)" });
    }

    const card = await createCard({ name, desc, idList, due, labels });
    return res.status(201).json({ ok: true, card });
  } catch (error) {
    return next(error);
  }
});

app.patch("/v1/cards/:cardId/move", async (req, res, next) => {
  try {
    const cardId = String(req.params.cardId || "").trim();
    const { idList } = req.body || {};

    if (!cardId || !idList) {
      return res.status(400).json({ error: "Campos requeridos: cardId (URL), idList" });
    }

    const card = await moveCard({ cardId, idList });
    return res.json({ ok: true, card });
  } catch (error) {
    return next(error);
  }
});

app.post("/v1/cards/:cardId/comments", async (req, res, next) => {
  try {
    const cardId = String(req.params.cardId || "").trim();
    const text = String(req.body?.text || "").trim();

    if (!cardId || !text) {
      return res.status(400).json({ error: "Campos requeridos: cardId (URL), text" });
    }

    const result = await addComment({ cardId, text });
    return res.status(201).json({ ok: true, comment: result });
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  const status = Number.isInteger(error?.status) ? error.status : 500;
  const message = error?.message || "Error interno del servidor";
  res.status(status).json({ error: message });
});

export default app;
