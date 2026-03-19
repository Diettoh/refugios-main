# Refugios AvA — Plataforma de Administración

## What This Is

Sistema de administración para arriendo turístico de **Refugios AvA** (Malalcahuello). Permite al dueño gestionar reservas, visualizar ocupación por unidad y monitorear métricas de negocio (ingresos, noches, utilidad). Reemplaza completamente los archivos Excel actuales (RESERVAS y VENTAS) como única fuente de verdad operacional.

**Unidades:** Cabañas 1/2/3 (2–4 pax c/u) + Casa AvA (hasta 8 pax)
**Cliente:** Germán (AvA)
**Deploy:** https://refugios.onrender.com

## Core Value

El dueño tiene visibilidad completa de su negocio — ocupación, ingresos y utilidad — desde un solo lugar, sin depender de Excel.

## Requirements

### Validated

- ✓ Autenticación con JWT y roles (admin/usuario) — v0.x
- ✓ CRUD de reservas con estado lead (lead_new → quoted → confirmed → completed) — v0.x
- ✓ Registro de huéspedes (nombre, email, teléfono recolectado al crear reserva) — v0.9.1
- ✓ Auto-creación de venta de alojamiento al confirmar reserva — v0.9.1
- ✓ Registro de ventas/cobros vinculados a reservas — v0.x
- ✓ Registro de gastos (tabla expenses) — v0.x
- ✓ Dashboard básico con métricas resumen — v0.x
- ✓ CRUD de unidades (cabañas) — v0.x
- ✓ Export CSV de datos — v0.x
- ✓ Notificación a Trello al crear reserva (fire-and-forget) — v0.x
- ✓ Scripts de importación PDF/Excel (`scripts/import-pdf-excel.mjs`, `sync-pdfs.mjs`) — v0.x

### Active

- [ ] Tarifa flexible por noche + override manual de noches por reserva (cambios uncommitted)
- [ ] Importar/migrar datos históricos de 2025 y 2026 desde los PDFs en `assets/`
- [ ] Abonos — pagos parciales por reserva (tracking del saldo pendiente)
- [ ] Suplemento limpieza como campo separado por reserva
- [ ] Fuente de reserva (booking.com / directo / otro)
- [ ] Cálculo de utilidad neta (fórmula a definir con Germán)
- [ ] Tipo de temporada por reserva (Alta / Baja / Temporada / Permanente)
- [ ] Boleta/Factura — tipo de documento emitido por reserva
- [ ] Calendario visual de ocupación — vista mensual tipo "agenda" (como los Excel de RESERVAS)
- [ ] Métricas mensuales completas: noches vendidas (Casa vs Refugios), ingresos, utilidad, tasa de ocupación
- [ ] Historial completo de reservas pasadas con filtros

### Out of Scope

- Comunicación directa con huéspedes (WhatsApp / email automático) — fuera del scope de gestión del dueño
- Portal de autoservicio para huéspedes — no es prioridad solicitada
- Conexión API directa con Booking.com / Airbnb / Channels — complejidad alta, no solicitada
- Sistema multipropiedad o multiempresa — es un negocio de una sola operación

## Context

**Origen del proyecto:** El dueño opera con dos Excel maestros:
1. **RESERVAS** — calendario visual mensual (nombre huésped + N° pax por día en cada unidad)
2. **VENTAS** — planilla financiera mensual (R/C, PAX, noches, precio/noche, supl. limpieza, total estadía, utilidad, abonos, tipo de boleta)

El número después del nombre en el calendario indica pax: `JUAN X2` = Juan con 2 pax, `SEBASTIAN X8` = Casa AvA completa con 8 pax.

**Estado de los datos:** 2025 completo y 2026 parcial están solo en PDF (`assets/RESERVAS 2025.pdf`, `RESERVAS 2026.pdf`, `Ventas AvA 2026.pdf`). La app actual no tiene estos datos históricos. El cliente quiere migrar todo y dejar de usar Excel.

**Scripts existentes:** `scripts/import-pdf-excel.mjs` y `scripts/sync-pdfs.mjs` ya existen para importación, pero no han sido ejecutados con los datos actuales.

**Uncommitted changes:** `apps/refugios-mvp/src/routes/reservations.js` y frontend tienen cambios sin commitear: tarifa flexible por noche y override de número de noches.

**Tech stack:** Node.js/Express + PostgreSQL (pg), Vanilla JS SPA sin bundler, JWT auth, 19 migraciones aplicadas. Deploy en Render vía `render.yaml`.

## Constraints

- **Stack:** Node.js/Express + PostgreSQL — no cambiar; cliente en producción desde v0.x
- **Frontend:** Vanilla JS SPA — mantener para evitar refactoring masivo del cliente JS existente
- **Deploy:** Render.com — no cambiar plataforma ni proceso de build
- **Data source:** Los datos históricos están en PDF, no en Excel nativo. Parsing con `pdf-parse` (ya instalado)
- **Definición pendiente:** Fórmula exacta de UTILIDAD debe ser acordada con Germán antes de implementar

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Sin precios base por cabaña — tarifa siempre manual por reserva | El dueño no quiere precios pre-fijados; cada reserva parte en $0 | — Pending |
| Abonos como tabla separada (`reservation_payments`) linked a `reservations` | Múltiples abonos por reserva; saldo calculado on-the-fly | — Pending |
| Utilidad: no implementar hasta confirmar fórmula con Germán | El Excel muestra diferencia entre TOTAL y UTILIDAD; puede ser comisión Booking o gasto fijo | — Pending |
| Migración histórica vía script Node (no UI manual) | 2 años de datos; carga manual es inviable | — Pending |
| Calendario visual como vista frontend (sin nueva dependencia JS) | Vanilla JS ya presente; consistencia con stack actual | — Pending |

---
*Last updated: 2026-03-16 after initialization*
