# Manual de Usuario — Refugios Malalcahuello

**Versión del documento:** 1.1  
**Versión de la UI:** 0.9.1  
**Fecha:** Marzo 2026

---

## Índice

1. [Introducción](#1-introducción)
2. [Requisitos y acceso](#2-requisitos-y-acceso)
3. [Inicio de sesión](#3-inicio-de-sesión)
4. [Interfaz general](#4-interfaz-general)
5. [Dashboard (Panel operativo)](#5-dashboard-panel-operativo)
6. [Disponibilidad](#6-disponibilidad)
7. [Huéspedes](#7-huéspedes)
8. [Reservas](#8-reservas)
9. [Cabañas](#9-cabañas)
10. [Ventas](#10-ventas)
11. [Gastos](#11-gastos)
12. [Documentos](#12-documentos)
13. [Exportaciones](#13-exportaciones)
14. [Configuración y preferencias](#14-configuración-y-preferencias)
15. [Solución de problemas](#15-solución-de-problemas)

---

## 1. Introducción

**Refugios Malalcahuello** es un sistema de gestión integral para cabañas ubicadas en Malalcahuello. Permite administrar reservas, huéspedes, ventas, gastos, disponibilidad de cabañas y documentos tributarios desde un único panel web.

### ¿Qué permite hacer el sistema?

- **Reservas**: Crear y gestionar reservas con fechas, cabaña, canal de origen y forma de pago.
- **Huéspedes**: Registrar huéspedes con RUT/documento y asociarlos a reservas.
- **Cabañas**: Definir cabañas con tarifas, capacidad, amenidades e imágenes.
- **Disponibilidad**: Ver calendario de ocupación y liberar cabañas.
- **Ventas**: Registrar ingresos con categoría, medio de pago y fecha.
- **Gastos**: Registrar gastos operativos con categoría y medio de pago.
- **Documentos**: Subir boletas, facturas y notas de crédito.
- **Analytics**: Dashboard con gráficos de ventas vs gastos, ocupación y alertas críticas.

---

## 2. Requisitos y acceso

### Requisitos técnicos

- **Navegador**: Chrome, Firefox, Edge o Safari (versiones recientes).
- **Conexión**: Internet estable.
- **Dispositivo**: PC, tablet o móvil (diseño mobile-first).

### Acceso al panel

1. Abre el navegador y ve a la URL del panel (ej. `https://tu-app.onrender.com` o `http://localhost:3000`).
2. Si el servidor está en modo “sleep” (Render), verás el mensaje *“Despertando servidor…”*. Espera unos segundos.
3. Cuando aparezca el formulario de login, ingresa tu **email** y **contraseña**.
4. Haz clic en **“Entrar al panel”**.

### Sesión expirada

Si tu sesión expira, verás el mensaje *“Sesión expirada. Vuelve a iniciar sesión.”* y el formulario de login. Ingresa de nuevo tus credenciales.

---

## 3. Inicio de sesión

### Pantalla de login

- **Email**: Dirección de correo del usuario registrado.
- **Contraseña**: Contraseña asignada.
- **Botón**: “Entrar al panel” (se habilita cuando el servidor está listo).

### Mensajes durante el arranque

| Mensaje | Significado |
|--------|-------------|
| Despertando servidor… | El servidor está iniciando (p. ej. en Render). |
| Despertando servidor… (intento N) | Reintentos automáticos de conexión. |
| Servidor listo. Ingresa tus credenciales. | Puedes iniciar sesión. |
| No se pudo conectar al servidor. Reintenta en unos segundos. | Error de conexión; usa el botón “Reintentar”. |

### Credenciales incorrectas

Si el email o la contraseña son incorrectos, verás un mensaje de error debajo del formulario. Revisa que no haya errores de tipeo y que el usuario exista en el sistema.

---

## 4. Interfaz general

### Barra lateral (sidebar)

Menú de navegación fijo a la izquierda:

- **Principal**
  - **Dashboard**: Resumen operativo y gráficos.
  - **Disponibilidad**: Calendario y estado de cabañas.
- **Operaciones**
  - **Huéspedes**: Registro de huéspedes.
  - **Reservas**: Gestión de reservas.
  - **Cabañas**: Catálogo de cabañas.
- **Finanzas**
  - **Ventas**: Ingresos.
  - **Gastos**: Egresos.
  - **Documentos**: Boletas y facturas.

### Barra superior (topbar)

- **Menú hamburguesa** (móvil): Abre/cierra el sidebar.
- **Breadcrumb**: Ruta actual (Inicio / Operación / Panel).
- **Búsqueda**: Campo para buscar reserva, huésped o módulo.
- **Notificaciones**: Icono de campana.
- **Mensajes**: Icono de chat.
- **Tema**: Botón para alternar tema claro/oscuro.
- **Avatar**: Iniciales del usuario.

### Modo de foco

Al hacer clic en una sección del menú, se muestra solo esa sección y se ocultan las demás. Esto facilita el uso en móvil y evita desplazamientos largos.

### Estado del sistema

En el pie del sidebar verás:

- **Sistema operativo**: Indicador de estado.
- **Tunnel** (si aplica): Enlace para compartir la URL pública (Cloudflare).
- **UI v0.8.0**: Versión de la interfaz.

---

## 5. Dashboard (Panel operativo)

### Descripción

El Dashboard muestra un resumen diario de reservas, pagos y operación de Refugios Malalcahuello.

### Tarjetas KPI (resumen)

| Indicador | Descripción |
|-----------|-------------|
| **Ventas** | Total de ventas en el período seleccionado. |
| **Gastos** | Total de gastos en el período. |
| **Utilidad** | Diferencia entre ventas y gastos. |
| **Reservas** | Cantidad de reservas en el período. |

### Gráficos

- **Ventas vs Gastos por mes**: Barras comparativas mensuales.
- **Ocupación mensual (%)**: Línea de tendencia de ocupación.

### Alertas críticas

Si hay alertas (baja ocupación, gastos altos, margen negativo, cabañas desocupadas), aparecen en una sección dedicada con título y mensaje.

### Tarjetas informativas

- **Operaciones en vivo**: Número de cabañas y flujos.
- **Alertas críticas**: Cantidad de alertas activas.
- **Radar financiero**: Total de ventas del período.

### Filtro por período

- **Desde** / **Hasta**: Fechas de inicio y fin.
- **Aplicar**: Aplica el rango y actualiza todos los datos.
- **Limpiar**: Quita el filtro y muestra el histórico acumulado.

El indicador *“Período: Histórico acumulado”* o *“Período: DD/MM/AAAA - DD/MM/AAAA”* muestra el rango activo.

---

## 6. Disponibilidad

### Objetivo

Ver la capacidad de cabañas por fecha y liberar cabañas cuando corresponda.

### Controles

- **Fecha**: Selector de fecha para ver disponibilidad.
- **Cabañas**: Total de cabañas y enlace a “Gestionar” (sección Cabañas).

### Calendario

- **Navegación**: Flechas para mes anterior/siguiente.
- **Días**: Cada día muestra un indicador de ocupación:
  - **Disponible** (verde): Sin ocupación.
  - **Parcial** (amarillo): Ocupación parcial.
  - **Ocupado** (rojo): Ocupación total.
- **Leyenda**: Explicación de los colores debajo del calendario.

Al hacer clic en un día, se actualiza la fecha seleccionada y la vista de disponibilidad.

### Estadísticas

- **Ocupadas**: Número de cabañas ocupadas en la fecha.
- **Disponibles**: Número de cabañas libres.
- **Ocupación**: Porcentaje de ocupación.

### Grid de cabañas

Cada cabaña se muestra con:

- Imagen principal (si existe).
- Nombre y código.
- Botones: **Ver galería**, **Editar imágenes**.
- Estado: ocupada o disponible según la fecha.

### Reservas activas

Lista de reservas activas para la fecha seleccionada:

- Cabaña, huésped, fechas de llegada/salida.
- Canal y estado.
- **Liberar cabaña**: Finaliza la reserva y libera la cabaña (con confirmación).

---

## 7. Huéspedes

### Listado

Muestra todos los huéspedes con:

- Nombre completo.
- ID interno.
- Canal, fechas de llegada/salida, forma de pago.
- Estado de deuda (Pendiente, Parcial, Pagado).

### Filtros

- **Estado de deuda**: Todos, Pendiente, Parcial, Pagado.
- **Buscar nombre**: Filtra por nombre.

### Crear huésped

1. Clic en **“Nuevo huésped”**.
2. Completa:
   - **Nombre completo** (obligatorio).
   - **RUT / Documento** (obligatorio).
3. Clic en **“Guardar”**.

### Eliminar huésped

Clic en **“Eliminar”** en la fila del huésped. Confirma en el diálogo. No se puede eliminar un huésped con reservas asociadas.

### Exportar CSV

Clic en **“Exportar CSV”** para descargar el listado de huéspedes.

---

## 8. Reservas

### Listado

Cada reserva muestra:

- Nombre del huésped.
- ID de reserva.
- Canal, fechas de llegada/salida, forma de pago.
- Total, abonado y estado de deuda.

### Filtros

- **Canal**: Todos, Web, Airbnb, Booking, Teléfono, Mostrador, Otro.
- **Estado de deuda**: Todos, Pendiente, Parcial, Pagado.
- **Buscar huésped**: Filtra por nombre.

### Crear reserva

1. Clic en **“Agregar reserva”**.
2. **RUT huésped**: Ingresa el RUT. Al salir del campo se busca el huésped.
   - Si existe: se completa el nombre.
   - Si no existe: escribe el nombre para crearlo al guardar.
3. **Nombre huésped**: Se completa automáticamente o se escribe si es nuevo.
4. **Canal**: Web, Airbnb, Booking, Teléfono, Mostrador, Otro.
5. **Medio de pago**: Transferencia, Tarjeta, Efectivo, MercadoPago, Otro.
6. **Cabaña**: Selecciona la cabaña (muestra tarifa por noche).
7. **Check-in** / **Check-out**: Fechas.
8. **Hora llegada** / **Hora salida**: Opcionales.
9. **Huéspedes**: Cantidad de personas.
10. **Monto total**: Se calcula automáticamente (noches × tarifa) o se puede editar.

El sistema muestra un mensaje tipo: *“Monto calculado: X noches × $Y = $Z”*.

11. Clic en **“Guardar reserva”**.

### Eliminar reserva

Clic en **“Eliminar”** en la fila de la reserva y confirma.

### Exportar próximas

Clic en **“Exportar próximas”** para descargar las reservas de los próximos 14 días en CSV.

---

## 9. Cabañas

### Listado

Cada cabaña muestra:

- Miniatura de imagen.
- Nombre, código, tipo, capacidad.
- Tarifa por noche.
- Botones: **Editar**, **Galería**, **Imágenes**, **Eliminar**.

### Crear cabaña

1. Clic en **“Nueva cabaña”**.
2. Completa:
   - **Nombre** (obligatorio).
   - **Descripción** (opcional).
   - **Orden**: Número para ordenar (0, 1, 2…).
   - **Tarifa por noche (CLP)** (obligatorio).
   - **Tipo**: Pequeña o Grande.
   - **Capacidad (pax máx)**.
   - **Código corto** (ej. A, B, P).
   - **Color (hex)** (ej. #3B82F6).
   - **Icono** (opcional, ej. 🏠).
   - **Amenities**: Piscina, Desayuno, Wi-Fi, Estacionamiento, Mascotas, Tinaja/Jacuzzi, Chimenea, Calefacción.
3. Clic en **“Guardar”**.

### Editar cabaña

Clic en **“Editar”** en la cabaña. Se abre el mismo formulario con los datos actuales. Modifica y guarda.

### Galería

Clic en **“Galería”** para ver las imágenes de la cabaña en un modal.

### Editar imágenes

1. Clic en **“Imágenes”** (o “Editar imágenes”).
2. Sube imágenes (máx. 10 por cabaña).
3. Usa el botón × para quitar una imagen.
4. Clic en **“Guardar imágenes”**.

Las imágenes se guardan en base64 en la base de datos.

### Eliminar cabaña

Clic en **“Eliminar”** y confirma. Verifica que no tenga reservas activas.

---

## 10. Ventas

### Criterio oficial de montos (planillas cliente 2026)

Para los datos importados desde planillas/PDF del cliente en 2026, el sistema usa este criterio:

- **Monto de venta = `UTILIDAD`** cuando la utilidad está informada.
- Si no hay utilidad, usa **`TOTAL Estadía`**.

Esto se definió para cuadrar con los totales de control del cliente (ej. Enero 2026: `1.686.500`, Febrero 2026: `8.190.020`).

### Control de duplicados

- El sistema conserva una sola fuente canónica de ventas seed 2026 (`ASSET_PDF_VENTAS_2026 | key=...`).
- Registros duplicados de importaciones antiguas fueron depurados para evitar inflación de totales.

### Columnas de respaldo (SII / Boletas)

- Marcas como `SII`, `X`, `factura`, `booking` en planillas del cliente se tratan como **estado documental/nota**, no como monto.
- Estas marcas no alteran los cálculos de ventas.

### Listado

Tabla con:

- Fecha, categoría, medio de pago.
- Reserva asociada (si existe).
- Monto.
- Botón Eliminar.

### Filtros

- **Período**: Desde / Hasta + Aplicar / Limpiar.
- **Medio de pago**: Todos, Transferencia, Tarjeta, Efectivo, MercadoPago, Otro.
- **Categoría**: Texto libre para filtrar.

### KPIs

- **Total ventas**: Suma del período filtrado.
- **Transacciones**: Cantidad de registros.
- **Promedio**: Promedio por transacción.

### Registrar venta

1. Clic en **“Registrar venta”**.
2. Completa:
   - **Fecha** (obligatorio).
   - **Categoría** (obligatorio).
   - **Medio de pago** (obligatorio).
   - **Monto** (obligatorio).
   - **Reserva asociada** (opcional, número de reserva).
3. Clic en **“Guardar venta”**.

### Paginación

- **Anterior** / **Siguiente** para cambiar de página.
- **Filas por página**: 10, 20 o 50.

### Exportar CSV

Clic en **“Exportar CSV”** para descargar el listado de ventas (respeta el filtro de período).

---

## 11. Gastos

### Origen de datos (dato duro)

Para el dataset cliente 2026, los gastos válidos quedan trazados con descripción:

- `ASSET_XLSX_GASTOS|2026|...`

Registros demo/manuales fuera de ese patrón fueron limpiados para evitar distorsión de reportes.

### Listado

Tabla con:

- Fecha, categoría, medio de pago.
- Monto.
- Botón Eliminar.

### Filtros

- **Medio de pago**: Todos, Transferencia, Tarjeta, Efectivo, MercadoPago, Otro.
- **Categoría**: Texto libre.

### KPIs

- **Total gastos**: Suma del período.
- **Registros**: Cantidad.
- **Promedio**: Promedio por registro.

### Registrar gasto

1. Clic en **“Registrar gasto”**.
2. Completa:
   - **Fecha** (obligatorio).
   - **Categoría** (obligatorio).
   - **Medio de pago** (obligatorio).
   - **Monto** (obligatorio).
3. Clic en **“Guardar gasto”**.

### Paginación

Igual que en Ventas: Anterior/Siguiente y filas por página.

### Exportar CSV

Clic en **“Exportar CSV”** para descargar gastos (respeta el filtro de período).

---

## 12. Documentos

### Listado

Cada documento muestra:

- Tipo (BOLETA, FACTURA, etc.) y número.
- Fecha de emisión.
- Monto.
- Reserva y/o venta asociada.
- Botón Eliminar.

### Filtros

- **Tipo**: Todos, Boleta, Factura, Nota de crédito, Otro.

### Subir documento

1. Clic en **“Subir documento”**.
2. Completa:
   - **Tipo**: Boleta, Factura, Nota de crédito, Otro.
   - **Número** (opcional).
   - **Fecha emisión** (obligatorio).
   - **Monto** (obligatorio).
   - **Reserva asociada** (opcional).
   - **Venta asociada** (opcional).
3. Clic en **“Guardar documento”**.

---

## 13. Exportaciones

### Formatos disponibles

| Sección | Botón | Archivo generado |
|---------|-------|------------------|
| Huéspedes | Exportar CSV | huéspedes.csv |
| Reservas | Exportar próximas | reservas-proximas.csv |
| Ventas | Exportar CSV | cobros.csv |
| Gastos | Exportar CSV | gastos.csv |

### Parámetros

- **Ventas y Gastos**: Usan el filtro de período (Desde/Hasta) si está aplicado.
- **Reservas próximas**: Incluye las reservas de los próximos 14 días.

La descarga se inicia automáticamente. Si la sesión expiró, se mostrará el formulario de login.

---

## 14. Configuración y preferencias

### Tema claro/oscuro

- Clic en el botón **“Tema claro”** o **“Tema oscuro”** en la barra superior.
- La preferencia se guarda en el navegador y se mantiene al recargar.

### Modales

- **Abrir**: Clic en los botones que abren formularios (Nuevo huésped, Agregar reserva, etc.).
- **Cerrar**: Clic en ×, en “Cancelar” o fuera del modal. También con la tecla **Escape**.

### Búsqueda global

El campo de búsqueda en la barra superior permite buscar reservas, huéspedes o módulos (funcionalidad en desarrollo).

---

## 15. Solución de problemas

### El servidor no responde

- **Causa**: Servidor en sleep (p. ej. Render) o caído.
- **Solución**: Espera el mensaje “Despertando servidor…” o usa “Reintentar”. Si persiste, contacta al administrador.

### Sesión expirada

- **Causa**: Token JWT vencido o inválido.
- **Solución**: Vuelve a iniciar sesión con email y contraseña.

### Error 503 o “Base de datos sin migrar”

- **Causa**: Base de datos no configurada o migraciones no aplicadas.
- **Solución**: El administrador debe configurar `DATABASE_URL` y ejecutar `npm run db:migrate`.

### No se encuentra el huésped por RUT

- **Causa**: RUT no registrado o formato incorrecto.
- **Solución**: Escribe el nombre completo para crear el huésped al guardar la reserva. Verifica que el RUT sea válido (ej. 12345678-9).

### El monto de la reserva no se calcula

- **Causa**: La cabaña no tiene tarifa o las fechas son incorrectas.
- **Solución**: Asigna una tarifa por noche a la cabaña y revisa que check-out sea posterior a check-in.

### No puedo eliminar un huésped

- **Causa**: Tiene reservas asociadas.
- **Solución**: Elimina primero las reservas o asigna otro huésped a esas reservas.

### Las imágenes de la cabaña no se ven

- **Causa**: No hay imágenes subidas o hubo un error al guardar.
- **Solución**: Usa “Editar imágenes” para subir de nuevo (máx. 10 por cabaña).

### Los gráficos no se muestran

- **Causa**: Falta el endpoint de analytics o hay error de conexión.
- **Solución**: Verifica que el backend exponga `/api/dashboard/analytics`. Revisa la consola del navegador para errores.

---

## Anexo: Catálogos de referencia

### Canales de reserva

| Código | Etiqueta |
|--------|----------|
| web | Web |
| airbnb | Airbnb |
| booking | Booking |
| phone | Teléfono |
| walkin | Mostrador |
| other | Otro |

### Medios de pago

| Código | Etiqueta |
|--------|----------|
| transfer | Transferencia |
| card | Tarjeta |
| cash | Efectivo |
| mercadopago | MercadoPago |
| other | Otro |

### Estados de deuda

| Estado | Significado |
|--------|-------------|
| pending | Pendiente (debe todo) |
| partial | Parcial (abonó algo) |
| paid | Pagado (no debe) |

### Tipos de documento

| Código | Etiqueta |
|--------|----------|
| boleta | Boleta |
| factura | Factura |
| nota_credito | Nota de crédito |
| otro | Otro |

---

*Documento generado para Refugios Malalcahuello. Para soporte técnico o consultas sobre el sistema, contacta al administrador del proyecto.*
