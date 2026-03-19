# SRS IEEE 830 - Refugios Malalcahuello MVP

## 1. Introduccion
### 1.1 Proposito
Definir los requisitos funcionales y no funcionales del sistema Refugios Malalcahuello MVP para gestion de cabanas, reservas, huespedes, ventas, gastos y reportes operativos.

### 1.2 Alcance
El sistema permite:
- Gestionar cabanas y su disponibilidad.
- Registrar y administrar reservas por rango de fechas.
- Mantener registro de huespedes con datos acumulados.
- Controlar ventas/gastos y visualizar indicadores.
- Emitir y gestionar documentos tributarios (boleta/factura).

### 1.3 Definiciones
- Check-in: fecha/hora de ingreso del huesped.
- Check-out: fecha/hora de salida del huesped.
- Ocupacion por cabana: porcentaje de dias reservados de una cabana en un periodo.
- Documento tributario: boleta o factura asociada a una venta/documento.

### 1.4 Referencias
- IEEE Std 830-1998 (Software Requirements Specification).
- Codigo fuente en `apps/refugios-mvp`.
- Migraciones en `apps/refugios-mvp/db/migrations`.

### 1.5 Historial de revision
- 2026-02-19: actualizacion de requisitos para operacion real del cliente.
  - Dashboard inicial centrado en ventas/gastos/utilidad y check-in/check-out semanal.
  - Calendario de disponibilidad por cabana.
  - Acumulacion de informacion de huespedes y edicion de datos.
  - Acumulacion de informacion comercial en reservas (canal, pagos, boleta/factura).
  - Normalizacion operacional de cabanas visibles (1, 2, 3 y Casa AvA).

## 2. Descripcion general
### 2.1 Perspectiva del producto
Aplicacion web con backend Express + PostgreSQL y frontend web SPA estatico.

### 2.2 Funciones del producto
- Panel operativo con KPIs y estado de operacion.
- Disponibilidad y calendario de reservas.
- CRUD de huespedes, reservas, cabanas, ventas, gastos y documentos.
- Reportes: gastos, reservas y cabanas.

### 2.3 Tipos de usuario
- Administrador/operador: gestiona toda la operacion.
- Usuario de consulta (futuro): visualiza reportes.

### 2.4 Restricciones
- Persistencia en PostgreSQL con migraciones versionadas.
- Reglas de integridad para evitar duplicados y sobreventa de fechas/cabanas.
- Campos controlados por catalogo (source, payment_method, document_type, status).

## 3. Requisitos especificos
### 3.1 Requisitos funcionales
- RF-01: El sistema debe listar cabanas operativas y su estado de ocupacion para una fecha seleccionada.
- RF-02: El sistema debe mostrar un calendario mensual por cabana para identificar dias ocupados/disponibles.
- RF-03: El sistema debe permitir navegar el calendario por mes y seleccionar fecha para detalle.
- RF-04: El sistema debe registrar reservas con: huesped, cabana, check-in, check-out, cantidad de huespedes y monto total.
- RF-05: El sistema debe impedir reservas superpuestas en la misma cabana para fechas intersectadas.
- RF-06: El sistema debe almacenar canal de llegada de la reserva (`web`, `airbnb`, `booking`, `phone`, `walkin`, `other`).
- RF-07: El sistema debe almacenar metodo de pago asociado (`cash`, `card`, `transfer`, `mercadopago`, `other`).
- RF-08: El sistema debe acumular estado financiero de reserva (pagado, parcial, pendiente) en base a pagos registrados.
- RF-09: El sistema debe permitir registrar necesidad/gestion de documento tributario (boleta/factura) a traves del modulo de documentos.
- RF-10: El sistema debe mantener ficha de huesped acumulando datos personales y ultima informacion de reserva relacionada.
- RF-11: El sistema debe permitir editar datos de huesped persistiendo cambios en base de datos.
- RF-12: El dashboard inicial debe mostrar como minimo ventas del mes, gastos del mes, utilidad del mes, check-in de la semana y check-out de la semana.
- RF-13: El informe de cabanas debe reportar reservas, huespedes, noches, ingresos y ocupacion por cabana.
- RF-14: El sistema debe soportar mapeo operacional: Cabanas 1/2/3 (4 huespedes c/u) y Casa AvA (8 huespedes).

### 3.2 Requisitos de datos
- RD-01: `guests` debe almacenar identificacion y contacto (nombre, email, telefono, documento, notas).
- RD-02: `reservations` debe almacenar fechas, cabana, estado, canal, pago, huespedes y monto.
- RD-03: `sales` debe registrar abonos/pagos para calcular deuda de reserva.
- RD-04: `documents` debe registrar documento tributario con `document_type` en {`boleta`, `factura`}.
- RD-05: Migraciones deben ser idempotentes cuando corresponda y mantener trazabilidad historica.

### 3.3 Requisitos de interfaz
- RI-01: Seccion Disponibilidad con selector de fecha, calendario y tarjetas de cabana.
- RI-02: Seccion Huespedes con listado, filtros y accion de edicion.
- RI-03: Seccion Reservas con filtros por canal/estado y detalle financiero.
- RI-04: Secciones de reportes con graficos y tabla resumen legible en desktop y mobile.

### 3.4 Requisitos no funcionales
- RNF-01: El sistema debe responder operaciones de lectura comunes en tiempo percibido bajo para uso operativo diario.
- RNF-02: Las validaciones de negocio criticas deben ejecutarse en backend (fechas, solapes, ids validos).
- RNF-03: Los errores deben retornar mensajes comprensibles para operador.
- RNF-04: Debe existir versionado de esquema por migraciones SQL.
- RNF-05: El sistema debe permitir despliegue en Render para entorno compartible.

## 4. Casos de uso criticos
- CU-01 (Gestionar disponibilidad): seleccionar fecha/mes, revisar ocupacion y detectar cabanas libres.
- CU-02 (Registrar reserva): crear reserva validando disponibilidad de cabana y fechas.
- CU-03 (Actualizar huesped): editar datos de contacto y mantener historial operativo asociado.
- CU-04 (Controlar cobranza): registrar pagos y visualizar saldo pendiente por reserva.
- CU-05 (Cierre comercial): verificar necesidad de boleta/factura y estado documental.

## 5. Criterios de aceptacion (resumen)
- CA-01: El calendario por cabana muestra claramente ocupado/disponible por dia.
- CA-02: El listado de huespedes conserva informacion acumulada y admite edicion persistente.
- CA-03: Cada reserva muestra canal de origen, metodo/avance de pago y soporte documental.
- CA-04: Dashboard inicial presenta ventas, gastos, utilidad mensual y check-ins/check-outs semanales.
- CA-05: Reporte por cabana entrega metricas utiles para decidir operacion (ocupacion/ingresos/reservas).

## 6. Fuera de alcance (MVP)
- Integracion contable/fiscal externa automatica.
- Motor de precios dinamicos avanzado.
- Multi-sede con reglas diferenciadas por establecimiento.
