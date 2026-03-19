# trello-agent-integration

Servicio dedicado para integrar Trello con agentes IA y permitir trabajo paralelo entre productos digitales.

## Objetivo
Centralizar operaciones base de Trello para que cada producto consumidor no implemente lógica duplicada.

## Alcance inicial (MVP)
- Crear tarjeta en Trello.
- Mover tarjeta entre listas.
- Agregar comentario a tarjeta.

## Endpoints
- `GET /health`
- `POST /v1/cards`
- `PATCH /v1/cards/:cardId/move`
- `POST /v1/cards/:cardId/comments`

## Variables de entorno
Ver `.env.example`.

Requeridas:
- `TRELLO_API_KEY`
- `TRELLO_TOKEN`
- `TRELLO_DEFAULT_LIST_ID` (opcional si cada request envía `idList`)

Sugeridas:
- `TRELLO_DEFAULT_BOARD_ID` (referencia operativa)

Valores de referencia usados en QA:
- Board `CRM`: `6772a87165ee2f5b747a8387`
- Lista `CRM (Paso 1: Contacto Inicial)`: `63adcb98c7f8200077ba562b`

## Ejecutar local
```bash
cp .env.example .env
# completar credenciales
npm install
npm run start
```

Health:
```bash
curl -s http://localhost:3400/health
```

## Docker
```bash
docker compose up -d --build
```

## Deploy en Render (Web Service)
Configuración recomendada:
1. Runtime: `Docker`.
2. Root Directory: `trello-agent-integration`.
3. Region: misma región que el backend consumidor.
4. Health check path: `/health`.
5. Variables:
   - `PORT=3400`
   - `TRELLO_API_KEY=...`
   - `TRELLO_TOKEN=...`
   - `TRELLO_DEFAULT_LIST_ID=63adcb98c7f8200077ba562b`

Validación post deploy:
```bash
curl -s https://<tu-servicio>.onrender.com/health
```

Prueba de creación de tarjeta:
```bash
curl -s -X POST https://<tu-servicio>.onrender.com/v1/cards \\
  -H 'content-type: application/json' \\
  -d '{\"name\":\"TEST bridge\",\"idList\":\"63adcb98c7f8200077ba562b\"}'
```

## Integración con Refugios MVP
Variables en `apps/refugios-mvp/.env`:
- `TRELLO_BRIDGE_ENABLED=true`
- `TRELLO_BRIDGE_BASE_URL=https://<tu-servicio>.onrender.com`
- `TRELLO_BRIDGE_CREATE_CARD_PATH=/v1/cards`
- `TRELLO_BRIDGE_DEFAULT_LIST_ID=63adcb98c7f8200077ba562b`

Nota:
- Si el bridge falla, Refugios mantiene fallback no bloqueante y no rompe creación de reserva.

## Historial de versiones
### v0.1.0 - 2026-02-16
- Creación de repo dedicado.
- API base para `create/move/comment` en Trello.
- Soporte de ejecución local y Docker.

### v0.1.1 - 2026-02-16
- Documentación de deploy en Render y validación operativa.
- Documentación de integración con Refugios MVP.

## SRS
- Documento base: `docs/SRS_IEEE830.md`
