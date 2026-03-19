# Continuidad: Agendamiento / Reservas (Cabanas MVP)

Fecha de registro: 2026-02-16
Proyecto: `/home/rreyes/projects/cabanas-mvp`
Feature foco: `4.1 dashboard-negocio-domingo` + `agendamiento/reservas` (ideas inspiradas en Boxmagic)

## 1) Objetivo de negocio
Construir un flujo de agendamiento de reservas que sea simple para operación diaria y permita control comercial similar a Boxmagic (captura de oportunidad, confirmación, pago y seguimiento de ocupación).

## 2) Estado actual confirmado
- Existe módulo de reservas funcional en backend (`apps/refugios-mvp/src/routes/reservations.js`).
- Validaciones ya implementadas:
  - formato de fechas
  - check_out > check_in
  - bloqueo de solapamiento por huésped
  - control de capacidad total (`TOTAL_CABINS`, default 4)
- Existe módulo de disponibilidad y liberación de cabaña en frontend (`apps/refugios-mvp/public/main.js`).
- Formulario de reserva actual:
  - RUT huésped + creación automática de huésped
  - canal (`web`, `airbnb`, `booking`, `phone`, `walkin`, `other`)
  - medio de pago
  - fechas check-in/check-out
  - checkout_time opcional
  - huéspedes y monto total

## 3) Estado actual (actualizado)
### Fase A completada
- Etapa comercial implementada: `lead_stage`.
- Seguimiento comercial implementado: `follow_up_at`.
- Embudo implementado:
  - `GET /api/reservations/funnel`
  - tarjetas en UI + filtro por etapa.
- Filtros de período por sección:
  - `Reservas`, `Ventas`, `Gastos`, `Huéspedes`, `Dashboard` con memoria local.
- Atajos en Reservas:
  - botón `Hoy`
  - botón `Esta semana`

### Integración Trello implementada (pendiente de despliegue final)
- Backend Refugios:
  - `apps/refugios-mvp/src/utils/trelloBridge.js`
  - Hook en creación de reservas (`POST /api/reservations`).
- Servicio dedicado:
  - `trello-agent-integration/`
  - API base (`/v1/cards`, `/v1/cards/:cardId/move`, `/v1/cards/:cardId/comments`).
- Comportamiento:
  - sincronización no bloqueante: si Trello falla, la reserva se guarda igual.

## 4) Próximo foco (siguiente sesión)
### Fase B (operación)
1. Registro de abono inicial y saldo pendiente por reserva.
2. Acciones rápidas de cambio de etapa desde lista (sin abrir modal).
3. Historial simple de cambios por reserva (quién/cuándo).
4. Confirmar despliegue estable de Trello bridge en Render.

## 5) Criterios de éxito (estado)
### Fase A
- Operador puede distinguir reservas confirmadas vs oportunidades en seguimiento.
- Se ve el embudo por canal (web/airbnb/booking/teléfono/etc.).
- Se identifican seguimientos vencidos sin revisar manualmente todo el listado.

### Trello bridge
- Crear reserva nueva genera tarjeta en lista Trello destino.
- Si bridge está caído, reserva se guarda y queda warning en logs.

## 6) Riesgos y mitigación
- Riesgo: romper compatibilidad con datos actuales.
  - Mitigación: migración con valores por defecto para registros existentes.
- Riesgo: complejizar demasiado el flujo.
  - Mitigación: mantener Fase A minimalista y orientada a operación diaria.

## 7) Archivos clave a tocar en la próxima sesión
- `apps/refugios-mvp/src/routes/reservations.js`
- `apps/refugios-mvp/src/utils/trelloBridge.js`
- `apps/refugios-mvp/public/main.js`
- `apps/refugios-mvp/README.md`
- `trello-agent-integration/src/app.js`
- `trello-agent-integration/README.md`

## 8) Checklist de retoma
- [x] Definir estados comerciales de reservas.
- [x] Crear migración DB (estado + follow_up_at).
- [x] Extender API reservas (crear/listar/actualizar etapa).
- [x] Implementar funnel API.
- [x] Incorporar componentes de embudo en UI.
- [x] Actualizar `UI v0.9.5` y README.
- [ ] Deploy de `trello-agent-integration` en Render (health OK).
- [ ] Configurar `TRELLO_BRIDGE_BASE_URL` en `refugios` a URL real del bridge.
- [ ] Validar tarjeta Trello creada desde reserva real.

## 9) Nota de continuidad
Este documento deja base para retomar sin pérdida de contexto. Al volver, comenzar por Fase A y cerrar primero funcionalidad completa antes de pasar a mejoras de Fase B.
