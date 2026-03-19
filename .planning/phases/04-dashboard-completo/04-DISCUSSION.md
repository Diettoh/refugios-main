# Phase 4 — Discuss (Dashboard Completo) — UI alineada a PDFs del cliente

**Fecha:** 2026-03-16  
**Referencias:** `assets/RESERVAS 2025.pdf`, `assets/RESERVAS 2026.pdf`, `assets/Ventas AvA 2026.pdf`

## Objetivo
Que el panel se “sienta” como los archivos operativos del cliente:
- Calendario mensual tipo PDF (grid simple con nombres + pax).
- Planilla de ventas mensual con columnas/etiquetas equivalentes a “VENTAS 2026”.

## Hallazgos (gap)

### Calendario (RESERVAS PDF)
El PDF muestra una grilla mensual (LU..DOM), con entradas estilo `NOMBRE X2` dentro del día.

Gap actual:
- El calendario del panel estaba orientado a “ocupación/capacidad” (ratio + chips por cabaña) y no a la vista “planilla” del PDF.

Decisión:
- Mantener la vista operativa actual y agregar un toggle “Vista PDF” que simplifica la grilla para calcar el estilo del PDF.

### Ventas (Ventas AvA PDF)
La planilla del cliente es por reservas/estadías, no por “ledger de ventas” genérico. Incluye columnas: `R/C`, `T/P/A/B`, pax, noches, precio/noche, suplemento limpieza, total estadía, boletas.

Gap actual:
- En el panel, el informe mensual era ventas/gastos por movimientos, con categorías técnicas (ej. `lodging`).

Decisiones:
- Mapear/ocultar categorías técnicas en UI (ej. `lodging` → “Alojamiento”).
- Agregar tab “Planilla” en Dashboard Ventas que genera una tabla “tipo cliente” desde reservas del período.
- Utilidad queda **pendiente** (fórmula está en Phase 5).

## Entregable esperado (Phase 4 — parte UI)
- Toggle “Vista PDF” en calendario.
- Tab “Planilla” en Dashboard Ventas con columnas equivalentes al PDF.
- UI evita mostrar “lodging” como texto al usuario.

## Pendientes (para cierre completo)
- **Definir semántica de monto** en la planilla (si debe mostrar `TOTAL ESTADÍA` o `UTILIDAD`) y normalizar el cálculo tras validación del cliente.
- **Import real RESERVAS 2025** (si el objetivo es “100% PDFs” en el panel).
- **Asignación de cabaña (cabin_id)**: el PDF RESERVAS no codifica unidad; si el cliente requiere “por cabaña”, hay que definir una fuente/mapeo.
