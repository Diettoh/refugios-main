# Requirements: Refugios AvA

**Defined:** 2026-03-16
**Core Value:** El dueño tiene visibilidad completa de su negocio — ocupación, ingresos y utilidad — desde un solo lugar, sin depender de Excel.

## v1 Requirements

### Reservations — Core Fields

- [ ] **RES-01**: El dueño ingresa manualmente la tarifa por noche al crear cada reserva (no hay precio base pre-fijado por cabaña — cada reserva parte en $0)
- [ ] **RES-02**: El dueño puede indicar manualmente el número de noches de una reserva (override del cálculo automático de fechas)
- [ ] **RES-03**: El dueño puede registrar un suplemento de limpieza por reserva (monto adicional al precio de estadía)
- [ ] **RES-04**: El dueño puede registrar la fuente de una reserva (booking.com / directo / otro)
- [ ] **RES-05**: El dueño puede clasificar una reserva por tipo de temporada (Alta / Baja / Temporada / Permanente)
- [ ] **RES-06**: El dueño puede indicar el tipo de documento emitido por una reserva (boleta / factura / booking / ninguno)

### Dashboard — Metrics

- [ ] **DASH-01**: El dueño puede ver métricas mensuales: ingresos totales, noches vendidas separadas por Casa AvA y Refugios, y tasa de ocupación global y por unidad
- [ ] **DASH-02**: El dueño puede ver un calendario visual mensual de ocupación: qué unidad está ocupada cada día, con nombre del huésped y número de pax
- [ ] **DASH-03**: El dueño puede ver el historial completo de reservas pasadas con filtros por fecha y unidad
- [ ] **DASH-04**: El dueño puede ver la utilidad neta por mes (diferencia entre ingresos cobrados y descuentos de plataforma/comisiones — fórmula a validar con Germán antes de implementar)

### Data Migration

- [ ] **MIG-01**: Los datos de reservas históricas 2025 y 2026 del PDF `assets/RESERVAS 2025.pdf` y `RESERVAS 2026.pdf` son importados a la base de datos
- [ ] **MIG-02**: Los datos financieros 2026 del PDF `assets/Ventas AvA 2026.pdf` (precio/noche, noches, total estadía, suplemento limpieza, fuente, tipo de documento) son importados y vinculados a las reservas correspondientes

### Payments — Abonos

- [ ] **PAY-01**: El dueño puede registrar pagos parciales (abonos) por reserva con monto y fecha
- [ ] **PAY-02**: El sistema muestra el saldo pendiente por cada reserva (total cobrado - suma de abonos)
- [ ] **PAY-03**: El dueño puede ver un listado de reservas con saldo pendiente

> **Unblocked 2026-04-09:** Germán confirmó el flujo — la reserva pasa automáticamente a venta y se gestionan abonos desde ahí. Implementación ya existe en rama `fix/billing-total-and-duplicate-records`.

## v2 Requirements

### Expenses & Profitability

- **EXP-01**: El dueño puede registrar gastos operacionales por mes (limpieza, mantención, servicios)
- **EXP-02**: El sistema calcula utilidad real = ingresos - gastos operacionales por período
- **EXP-03**: El dueño puede ver comparativa ingresos vs gastos en el dashboard

## Out of Scope

| Feature | Reason |
|---------|--------|
| Portal de huéspedes (self-service) | No solicitado; el dueño administra todo manualmente |
| Integración API con Booking.com / Airbnb | Complejidad técnica alta; no solicitado |
| Comunicación automática con huéspedes (email/WhatsApp) | Fuera del scope de administración del dueño |
| Sistema multipropiedad o multiempresa | Es un negocio de una sola operación |
| Gestión de personal / recursos humanos | No aplica al negocio de Germán |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| RES-01 | Phase 1 | Pending |
| RES-02 | Phase 1 | Pending |
| RES-03 | Phase 2 | Pending |
| RES-04 | Phase 2 | Pending |
| RES-05 | Phase 2 | Pending |
| RES-06 | Phase 2 | Pending |
| DASH-01 | Phase 4 | Pending |
| DASH-02 | Phase 4 | Pending |
| DASH-03 | Phase 4 | Pending |
| DASH-04 | Phase 5 | Pending |
| MIG-01 | Phase 3 | Pending |
| MIG-02 | Phase 3 | Pending |
| PAY-01 | Phase 6 | Implemented in branch |
| PAY-02 | Phase 6 | Implemented in branch |
| PAY-03 | Phase 6 | Implemented in branch |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15/15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-16*
*Last updated: 2026-03-16 — traceability populated after roadmap creation*
