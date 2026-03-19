# Plan de Accion PDF 1:1 (2025-2026)

Generado: 2026-03-17T19:37:23.515Z

## Alcance
- PDF de ventas: `Ventas AvA 2025.pdf` y `Ventas AvA 2026.pdf`.
- PDF de reservas: `RESERVAS 2025.pdf` y `RESERVAS 2026.pdf`.
- Cada pagina/mes contiene checklist de migracion para no perder campos ni reglas.

## Reglas Transversales
1. Huespedes: upsert por documento y por alias de nombre normalizado para evitar duplicados.
2. Reservas: persistir siempre `check_in`, `check_out`, `nights`, `guests_count`, `source`, `reservation_document_type`.
3. Cobros/ventas: cada pago debe enlazar `reservation_id` cuando exista y conservar notas comerciales (`abono`, `boleta`, `factura`).
4. Filtros obligatorios en sistema: categoria gasto, medio de pago, check-in/out (desde/hasta), noches min/max, estado deuda y documento.
5. Exportadores PDF: validar pixel-match mensual contra PDF historico antes de cerrar cada mes.

## Ventas AvA 2025.pdf

Objetivo: conservar 1:1 columnas de planilla/PDF (NOMBRE, R/C, T/P/A/B, PAX, PAX Ad, NOCHES, PRECIO POR NOCHE, SUPLEMENTO, TOTAL POR NOCHE, TOTAL ESTADIA, UTILIDAD, ABONOS, BOLETAS).

### Página 1 (Enero)
- Datos detectados: filas=9, total_estadia=2.070.000, total_utilidad=4.194.424, total_pdf=4.194.424, noches_pdf=26.
- Calidad extracción: flagged=4, missing_numeric=4, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 1 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 4 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Confirmar que la ausencia de ABONOS en página 1 coincide con el original.

### Página 2 (Febrero)
- Datos detectados: filas=19, total_estadia=6.675.000, total_utilidad=8.038.339, total_pdf=8.038.339, noches_pdf=36.
- Calidad extracción: flagged=4, missing_numeric=4, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 2 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 4 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Confirmar que la ausencia de ABONOS en página 2 coincide con el original.

### Página 3 (Marzo)
- Datos detectados: filas=5, total_estadia=1.350.000, total_utilidad=1.751.520, total_pdf=1.751.520, noches_pdf=11.
- Calidad extracción: flagged=1, missing_numeric=1, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=2, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 3 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 1 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Confirmar que la ausencia de ABONOS en página 3 coincide con el original.

### Página 4 (Abril)
- Datos detectados: filas=6, total_estadia=2.300.000, total_utilidad=2.479.909, total_pdf=2.479.909, noches_pdf=9.
- Calidad extracción: flagged=1, missing_numeric=1, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 4 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 1 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Confirmar que la ausencia de ABONOS en página 4 coincide con el original.

### Página 5 (Mayo)
- Datos detectados: filas=6, total_estadia=1.259.999, total_utilidad=1.716.670, total_pdf=1.716.670, noches_pdf=9.
- Calidad extracción: flagged=2, missing_numeric=2, missing_product_code=2, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=3, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 5 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 2 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Confirmar que la ausencia de ABONOS en página 5 coincide con el original.

### Página 6 (Junio)
- Datos detectados: filas=19, total_estadia=8.593.600, total_utilidad=11.083.179, total_pdf=11.083.179, noches_pdf=43.
- Calidad extracción: flagged=5, missing_numeric=5, missing_product_code=1, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=12, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 6 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 5 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Confirmar que la ausencia de ABONOS en página 6 coincide con el original.

### Página 7 (Julio)
- Datos detectados: filas=25, total_estadia=11.575.500, total_utilidad=18.786.260, total_pdf=18.786.260, noches_pdf=47.
- Calidad extracción: flagged=12, missing_numeric=11, missing_product_code=10, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=25, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 7 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 12 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Confirmar que la ausencia de ABONOS en página 7 coincide con el original.

### Página 8 (Agosto)
- Datos detectados: filas=24, total_estadia=10.006.400, total_utilidad=14.172.419, total_pdf=14.172.419, noches_pdf=48.
- Calidad extracción: flagged=6, missing_numeric=6, missing_product_code=6, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=23, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 8 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 6 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Confirmar que la ausencia de ABONOS en página 8 coincide con el original.

### Página 9 (Septiembre)
- Datos detectados: filas=18, total_estadia=22.007.000, total_utilidad=22.895.921, total_pdf=20.049.447, noches_pdf=100.
- Calidad extracción: flagged=2, missing_numeric=2, missing_product_code=2, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 9 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 2 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Confirmar que la ausencia de ABONOS en página 9 coincide con el original.

### Página 10 (Octubre)
- Datos detectados: filas=2, total_estadia=880.000, total_utilidad=1.213.764, total_pdf=1.213.764, noches_pdf=4.
- Calidad extracción: flagged=1, missing_numeric=1, missing_product_code=1, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 10 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 1 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Confirmar que la ausencia de ABONOS en página 10 coincide con el original.

### Página 11 (Noviembre)
- Datos detectados: filas=0, total_estadia=0, total_utilidad=0, total_pdf=0, noches_pdf=0.
- Calidad extracción: flagged=0, missing_numeric=0, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 11 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mantener mes sin datos con grilla completa vacía, totales en 0 y footer de NOCHES igual al PDF.

### Página 12 (Diciembre)
- Datos detectados: filas=2, total_estadia=2.167.000, total_utilidad=2.101.990, total_pdf=2.101.990, noches_pdf=3.
- Calidad extracción: flagged=0, missing_numeric=0, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 12 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Validar cuadratura mensual: suma de filas == total PDF y noches == footer PDF.
5. Confirmar que la ausencia de ABONOS en página 12 coincide con el original.

## Ventas AvA 2026.pdf

Objetivo: conservar 1:1 columnas de planilla/PDF (NOMBRE, R/C, T/P/A/B, PAX, PAX Ad, NOCHES, PRECIO POR NOCHE, SUPLEMENTO, TOTAL POR NOCHE, TOTAL ESTADIA, UTILIDAD, ABONOS, BOLETAS).

### Página 1 (Enero)
- Datos detectados: filas=6, total_estadia=1.730.000, total_utilidad=1.686.500, total_pdf=1.686.500, noches_pdf=10.
- Calidad extracción: flagged=1, missing_numeric=0, missing_product_code=0, placeholders=1, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=4, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 1 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 1 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Confirmar que la ausencia de ABONOS en página 1 coincide con el original.

### Página 2 (Febrero)
- Datos detectados: filas=20, total_estadia=6.924.800, total_utilidad=7.548.020, total_pdf=7.548.020, noches_pdf=57.
- Calidad extracción: flagged=1, missing_numeric=1, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=4, notas_boletas=17, columna_abonos_en_pdf=si.
- Plan de acción:
1. Congelar layout visual de la página 2 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 1 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Normalizar ABONOS/BOLETAS a campos estructurados y exponer filtros por estado documental en ventas/reservas.

### Página 3 (Marzo)
- Datos detectados: filas=0, total_estadia=0, total_utilidad=0, total_pdf=0, noches_pdf=0.
- Calidad extracción: flagged=0, missing_numeric=0, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 3 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mantener mes sin datos con grilla completa vacía, totales en 0 y footer de NOCHES igual al PDF.

### Página 4 (Abril)
- Datos detectados: filas=1, total_estadia=216.000, total_utilidad=216.000, total_pdf=216.000, noches_pdf=3.
- Calidad extracción: flagged=0, missing_numeric=0, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 4 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Validar cuadratura mensual: suma de filas == total PDF y noches == footer PDF.
5. Confirmar que la ausencia de ABONOS en página 4 coincide con el original.

### Página 5 (Mayo)
- Datos detectados: filas=0, total_estadia=0, total_utilidad=0, total_pdf=0, noches_pdf=0.
- Calidad extracción: flagged=0, missing_numeric=0, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 5 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mantener mes sin datos con grilla completa vacía, totales en 0 y footer de NOCHES igual al PDF.

### Página 6 (Junio)
- Datos detectados: filas=0, total_estadia=0, total_utilidad=0, total_pdf=0, noches_pdf=0.
- Calidad extracción: flagged=0, missing_numeric=0, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 6 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mantener mes sin datos con grilla completa vacía, totales en 0 y footer de NOCHES igual al PDF.

### Página 7 (Julio)
- Datos detectados: filas=0, total_estadia=0, total_utilidad=0, total_pdf=0, noches_pdf=0.
- Calidad extracción: flagged=0, missing_numeric=0, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 7 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mantener mes sin datos con grilla completa vacía, totales en 0 y footer de NOCHES igual al PDF.

### Página 8 (Agosto)
- Datos detectados: filas=3, total_estadia=5.910.000, total_utilidad=0, total_pdf=5.910.000, noches_pdf=6.
- Calidad extracción: flagged=3, missing_numeric=0, missing_product_code=3, placeholders=0, nightly_outliers=1.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 8 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mapear cada fila a reserva+cobro real (no usar `description` como fuente primaria).
3. Persistir por fila: `product_code`, `pax`, `pax_ad`, `nights`, `nightly_price`, `cleaning_supplement`, `total_per_night`, `total_stay`, `utility`.
4. Resolver 3 filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).
5. Confirmar que la ausencia de ABONOS en página 8 coincide con el original.

### Página 9 (Septiembre)
- Datos detectados: filas=0, total_estadia=0, total_utilidad=0, total_pdf=0, noches_pdf=0.
- Calidad extracción: flagged=0, missing_numeric=0, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 9 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mantener mes sin datos con grilla completa vacía, totales en 0 y footer de NOCHES igual al PDF.

### Página 10 (Octubre)
- Datos detectados: filas=0, total_estadia=0, total_utilidad=0, total_pdf=0, noches_pdf=0.
- Calidad extracción: flagged=0, missing_numeric=0, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 10 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mantener mes sin datos con grilla completa vacía, totales en 0 y footer de NOCHES igual al PDF.

### Página 11 (Noviembre)
- Datos detectados: filas=0, total_estadia=0, total_utilidad=0, total_pdf=0, noches_pdf=0.
- Calidad extracción: flagged=0, missing_numeric=0, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 11 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mantener mes sin datos con grilla completa vacía, totales en 0 y footer de NOCHES igual al PDF.

### Página 12 (Diciembre)
- Datos detectados: filas=0, total_estadia=0, total_utilidad=0, total_pdf=0, noches_pdf=0.
- Calidad extracción: flagged=0, missing_numeric=0, missing_product_code=0, placeholders=0, nightly_outliers=0.
- Notas comerciales: abonos_detectados=0, notas_boletas=0, columna_abonos_en_pdf=no.
- Plan de acción:
1. Congelar layout visual de la página 12 (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.
2. Mantener mes sin datos con grilla completa vacía, totales en 0 y footer de NOCHES igual al PDF.

## RESERVAS 2025.pdf

Objetivo: conservar 1:1 calendario mensual (6 semanas), nombres por celda, pax, y notas de cierre por página.

### Página 1 (Enero)
- Datos detectados: dias_ocupados=21, entradas_nombre_x_pax=45, huespedes_unicos=12, pico_simultaneo_dia=4, suma_pax=120.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (4).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 2 (Febrero)
- Datos detectados: dias_ocupados=27, entradas_nombre_x_pax=92, huespedes_unicos=24, pico_simultaneo_dia=6, suma_pax=307.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (6).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 3 (Marzo)
- Datos detectados: dias_ocupados=16, entradas_nombre_x_pax=23, huespedes_unicos=7, pico_simultaneo_dia=2, suma_pax=53.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (2).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 4 (Abril)
- Datos detectados: dias_ocupados=11, entradas_nombre_x_pax=21, huespedes_unicos=7, pico_simultaneo_dia=4, suma_pax=85.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (4).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 5 (Mayo)
- Datos detectados: dias_ocupados=9, entradas_nombre_x_pax=22, huespedes_unicos=7, pico_simultaneo_dia=5, suma_pax=104.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (5).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 6 (Junio)
- Datos detectados: dias_ocupados=23, entradas_nombre_x_pax=69, huespedes_unicos=17, pico_simultaneo_dia=6, suma_pax=317.
- Notas del mes: lineas=2.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (6).
5. Migrar NOTAS del mes a almacenamiento estructurado (`reservation_month_notes`) y renderizarlas en export PDF.

### Página 7 (Julio)
- Datos detectados: dias_ocupados=31, entradas_nombre_x_pax=119, huespedes_unicos=27, pico_simultaneo_dia=6, suma_pax=512.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (6).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 8 (Agosto)
- Datos detectados: dias_ocupados=31, entradas_nombre_x_pax=112, huespedes_unicos=27, pico_simultaneo_dia=6, suma_pax=422.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (6).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 9 (Septiembre)
- Datos detectados: dias_ocupados=30, entradas_nombre_x_pax=110, huespedes_unicos=21, pico_simultaneo_dia=6, suma_pax=369.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (6).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 10 (Octubre)
- Datos detectados: dias_ocupados=25, entradas_nombre_x_pax=72, huespedes_unicos=7, pico_simultaneo_dia=5, suma_pax=230.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (5).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 11 (Noviembre)
- Datos detectados: dias_ocupados=4, entradas_nombre_x_pax=4, huespedes_unicos=2, pico_simultaneo_dia=1, suma_pax=14.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (1).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 12 (Diciembre)
- Datos detectados: dias_ocupados=9, entradas_nombre_x_pax=13, huespedes_unicos=4, pico_simultaneo_dia=2, suma_pax=59.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (2).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

## RESERVAS 2026.pdf

Objetivo: conservar 1:1 calendario mensual (6 semanas), nombres por celda, pax, y notas de cierre por página.

### Página 1 (Enero)
- Datos detectados: dias_ocupados=17, entradas_nombre_x_pax=22, huespedes_unicos=7, pico_simultaneo_dia=2, suma_pax=65.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (2).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 2 (Febrero)
- Datos detectados: dias_ocupados=27, entradas_nombre_x_pax=87, huespedes_unicos=21, pico_simultaneo_dia=5, suma_pax=248.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (5).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 3 (Marzo)
- Datos detectados: dias_ocupados=3, entradas_nombre_x_pax=3, huespedes_unicos=1, pico_simultaneo_dia=1, suma_pax=6.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (1).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 4 (Abril)
- Datos detectados: dias_ocupados=3, entradas_nombre_x_pax=3, huespedes_unicos=1, pico_simultaneo_dia=1, suma_pax=9.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (1).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 5 (Mayo)
- Datos detectados: dias_ocupados=1, entradas_nombre_x_pax=1, huespedes_unicos=1, pico_simultaneo_dia=1, suma_pax=3.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (1).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 6 (Junio)
- Datos detectados: dias_ocupados=0, entradas_nombre_x_pax=0, huespedes_unicos=0, pico_simultaneo_dia=0, suma_pax=0.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Mantener página vacía con estructura de calendario idéntica y sección NOTAS habilitada.
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 7 (Julio)
- Datos detectados: dias_ocupados=0, entradas_nombre_x_pax=0, huespedes_unicos=0, pico_simultaneo_dia=0, suma_pax=0.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Mantener página vacía con estructura de calendario idéntica y sección NOTAS habilitada.
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 8 (Agosto)
- Datos detectados: dias_ocupados=4, entradas_nombre_x_pax=12, huespedes_unicos=1, pico_simultaneo_dia=3, suma_pax=64.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (3).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 9 (Septiembre)
- Datos detectados: dias_ocupados=29, entradas_nombre_x_pax=105, huespedes_unicos=20, pico_simultaneo_dia=6, suma_pax=346.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (6).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 10 (Octubre)
- Datos detectados: dias_ocupados=24, entradas_nombre_x_pax=72, huespedes_unicos=7, pico_simultaneo_dia=6, suma_pax=230.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (6).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 11 (Noviembre)
- Datos detectados: dias_ocupados=0, entradas_nombre_x_pax=0, huespedes_unicos=0, pico_simultaneo_dia=0, suma_pax=0.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Mantener página vacía con estructura de calendario idéntica y sección NOTAS habilitada.
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

### Página 12 (Diciembre)
- Datos detectados: dias_ocupados=5, entradas_nombre_x_pax=6, huespedes_unicos=2, pico_simultaneo_dia=2, suma_pax=48.
- Notas del mes: lineas=0.
- Plan de acción:
1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).
2. Persistir por estadía: `guest_id`, `check_in`, `check_out`, `nights`, `guests_count`, `source`, `status`.
3. Calcular y guardar `nights` en backend para soportar filtros y reporte de sumatoria de noches.
4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (2).
5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.

