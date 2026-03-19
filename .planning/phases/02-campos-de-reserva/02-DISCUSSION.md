# Phase 2 — Discuss (Campos de Reserva)

**Fecha:** 2026-03-16  
**Referencia comercial:** Cotización `COT-2026-CV-AVA-003` (emisión 2026-02-17) + `propuesta-cotizacion.md`

## Objetivo de la fase
Completar los “campos comerciales” por reserva que aparecen en la operación (Excel VENTAS) y que también están reflejados en la cotización: canal/origen, tipo de documento, suplemento de limpieza y clasificación de temporada.

## Mapeo cotización → roadmap

La cotización incluye (resumen):
- **Gestión de Reservas** (2.2): fechas, huéspedes, cabaña, estado.
- **Canales de Reserva** (2.6): Booking, Airbnb, web propia, directa, otros.
- **Métodos de Pago** (2.5): forma de pago y estado pagado/pendiente/parcial.
- **Calendario mensual** (2.1) e **indicadores/reportes** (2.3): quedan para fases posteriores del roadmap (dashboard/calendario/reportes).

Esta fase (Phase 2) se enfoca en el subset más acotado y habilitante para migración y reportes:
- `cleaning_supplement` (suplemento limpieza)
- `source` (canal/origen)
- `season_type` (tipo de temporada)
- `reservation_document_type` (tipo documento emitido)

## Decisiones y aclaraciones

### 1) Canales de reserva (source)
La cotización menciona explícitamente `Booking`, `Airbnb`, `Página web propia`, `Reserva directa`, `Otros`.

Decisión: mantener el campo `source` en `reservations` pero ajustar su catálogo para soportar:
- `booking`, `airbnb`, `web`, `direct`, `other`

Compatibilidad con datos existentes:
- Valores legacy `phone` y `walkin` se backfillean a `direct`.

### 2) Documento emitido
Aunque la cotización no lista boleta/factura en “Canales”, sí aparece como alcance en `propuesta-cotizacion.md` y en el Excel financiero.

Decisión: agregar `reservation_document_type` en `reservations` (nullable) con catálogo:
- `boleta`, `factura`, `booking`, `ninguno`

### 3) Temporada
Decisión: agregar `season_type` (nullable) con catálogo:
- `alta`, `baja`, `temporada`, `permanente`

### 4) Limpieza
Decisión: agregar `cleaning_supplement` (nullable) como `NUMERIC(12,2)` en CLP (monto por reserva, separado del total y del precio/noche).

### 5) Nota de dependencia (Phase 1)
La UI ya expone `nightly_rate` y `nights`, pero hoy no se persisten en DB. Para que Phase 2 y la migración histórica funcionen sin inconsistencias:
- Se agrega en la migración de Phase 2 el soporte a columnas `nightly_rate` y `nights` en `reservations` (nullable) y su persistencia en `POST`/`PATCH`.

## Resultado esperado al cerrar Phase 2
- API permite crear y editar reservas con los 4 campos nuevos.
- UI permite seleccionar/editar los 4 campos, y los muestra en cards/detalle.
- El catálogo de `source` refleja los canales de la cotización.

