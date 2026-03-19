# Refugios MVP

MVP operativo para cabañas con foco en:
- Ventas
- Gastos
- Reservas
- Datos de huéspedes
- Boletas y facturas
- Origen de reserva (web, Airbnb, Booking, etc.)
- Forma de pago
- Migración histórica (año anterior)

## Requisitos
- Node.js 20+
- PostgreSQL (Neon recomendado)
- Docker (opcional)

La app está pensada para ejecutarse en **Red Hat Linux** (RHEL, CentOS, Rocky, etc.): los comandos con `make` y scripts en `bash` son los estándar en ese entorno. En Windows (PowerShell) usa `;` en lugar de `&&` para encadenar comandos, o ejecuta cada comando por separado.

**Rutas relativas**: Todos los comandos se ejecutan desde la raíz del repo o desde `apps/refugios-mvp`. Usa siempre rutas relativas (`apps/refugios-mvp` o `apps\refugios-mvp` en Windows) — no rutas absolutas del sistema.

### Ejecución desde la raíz del repo
Los comandos con `--prefix` permiten operar desde la raíz sin cambiar de directorio:
```bash
npm --prefix apps/refugios-mvp run start
npm run start:refugios-mvp   # alias que usa --prefix apps/refugios-mvp
```
Para entrar a la carpeta de la app:
```bash
cd apps/refugios-mvp         # Linux/Mac
cd apps\refugios-mvp         # Windows CMD/PowerShell
```

## Verificar la base de datos
Si la app responde 503 o "base de datos sin migrar", desde `apps/refugios-mvp`:
```bash
npm run db:check
```
Comprueba que `DATABASE_URL` esté en `.env`, que Postgres esté en marcha y que las migraciones estén aplicadas. También puedes llamar a `GET /api/health/db` con la app levantada para ver el estado en JSON.

## Exports PDF (ventas y reservas)
- `GET /api/exports/ventas.pdf?year=YYYY&month=M`
- `GET /api/exports/reservas.pdf?year=YYYY&month=M`

Estas rutas están protegidas por JWT (middleware global de `/api`). Usa `Authorization: Bearer <token>`.

Comparación visual (pagina de referencia vs pagina generada):
```bash
npm run pdf:compare -- ventas 2026 1
npm run pdf:compare -- reservas 2026 1
```
Salida en `apps/refugios-mvp/tmp/pdf-compare/<tipo>-<year>-<month>/` con:
- `generated.pdf`
- `generated-page1.png`
- `reference-page<month>.png`
- `generated-page1.txt`
- `reference-page<month>.txt`

Plan por PDF y por pagina (2025/2026):
```bash
npm run pdf:plan
```
Genera `docs/PDF_ACTION_PLAN_2025_2026.md` con checklist mensual para ventas y reservas.

## Inicio rápido (sin Docker)
```bash
cp .env.example .env
# completar DATABASE_URL
make bootstrap
make dev
```

Panel: `http://localhost:3000`
UI: `v0.9.6` (visible en el panel)

## Inicio rápido (con Docker)
```bash
cp .env.example .env
# completar DATABASE_URL
make docker-build
make docker-up
```

Panel: `http://localhost:3000`

### En Red Hat Linux (RHEL / CentOS / Rocky)
Mismo flujo: desde el directorio `apps/refugios-mvp` (o con `make` en la raíz del repo si está configurado):
```bash
cd apps/refugios-mvp
cp .env.example .env
# Editar .env y completar DATABASE_URL
npm install
npm run db:migrate
npm run start
# o: make migrate && make dev
```

### En Windows (PowerShell)

**Instalar dependencias** (elegir una opción):

- **Desde la raíz del repo** (recomendado para que `node_modules` quede en `apps/refugios-mvp`):
  ```powershell
  npm run install:refugios-mvp
  ```
- **Desde la carpeta de la app:**
  ```powershell
  cd apps\refugios-mvp
  .\run-windows.ps1 install
  ```
  El script comprueba que exista `node_modules\pg` tras instalar.

**Configurar y arrancar:**
```powershell
cd apps\refugios-mvp
copy .env.example .env
# Editar .env y poner DATABASE_URL (con Docker: postgresql://refugios:refugios_qa@localhost:5433/refugios)
docker compose up -d db   # si tienes Docker; si no, usa una URL de Neon u otro Postgres
npm run db:migrate
npm run db:check          # opcional: verifica conexión y tablas
npm run start
```
Si la app devuelve 503 o errores de BD, ejecuta `npm run db:check` para ver el motivo (conexión rechazada, tablas faltantes, etc.).
O desde la raíz: `npm run migrate:refugios-mvp` y `npm run start:refugios-mvp`.

**Script todo-en-uno** (solo si ya estás en `apps\refugios-mvp`):
```powershell
cd apps\refugios-mvp
.\run-windows.ps1 full    # install + DB con Docker + migrate
.\run-windows.ps1 start   # inicia servidor
```
Validar sintaxis: `npm run check` (desde `apps\refugios-mvp`).

## Compartir demo por Cloudflare Tunnel

### Opción A: Solo app (app ya corriendo)
Con la app corriendo local (normal o docker):
```bash
make tunnel
# o: cloudflared tunnel --url http://localhost:3000
```
Cloudflare imprime una URL variable (ej. `https://xxx.trycloudflare.com`) que cambia cada vez.

### Opción B: DB + app + tunnel en Docker (Windows)
Levanta todo en un solo comando (PostgreSQL, app, migraciones y tunnel):
```powershell
cd apps\refugios-mvp
.\start-tunnel.ps1
```
Requiere: Docker Desktop y cloudflared (`winget install Cloudflare.cloudflared`).
La URL pública cambia cada vez que reinicias el tunnel. El frontend se conecta automáticamente porque se sirve desde la misma URL (mismo origen).

## Verificar deploy sin entrar a Render
Desde la raiz del repo:
```bash
./tools/check-render-deploy.sh https://tu-app.onrender.com
```

Push + esperar deploy OK:
```bash
./tools/push-and-wait-render.sh https://tu-app.onrender.com
```

Disparar Deploy Hook + esperar deploy OK:
```bash
export RENDER_DEPLOY_HOOK_URL='https://api.render.com/deploy/srv-...?key=...'
./tools/deploy-and-wait-render.sh https://tu-app.onrender.com
```

Opcional (estado del ultimo deploy por API de Render):
```bash
export RENDER_API_KEY=...
export RENDER_SERVICE_ID=srv-...
./tools/check-render-deploy.sh https://tu-app.onrender.com
```

## Migraciones
- SQL versionado en `db/migrations`
- Tabla de control `schema_migrations`
- Seed histórico desde staging de ventas 2026: `db/migrations/014_seed_ventas_2026_from_staging.sql`
- Reparación idempotente de filas faltantes: `db/migrations/015_fix_seed_ventas_2026_missing_rows.sql`

Comandos:
```bash
make migrate
make seed
```

Incluye migración de usuarios de prueba en `002_seed_test_users.sql`.

Validación rápida post-migración (calidad de reportes):
```sql
SELECT COUNT(*) FROM reservations WHERE notes LIKE 'ASSET_PDF_VENTAS_2026 | key=%';
SELECT COUNT(*) FROM sales WHERE description LIKE 'ASSET_PDF_VENTAS_2026 | key=%';
SELECT to_char(sale_date,'YYYY-MM') AS ym, COUNT(*) AS rows, SUM(amount) AS total
FROM sales
WHERE description LIKE 'ASSET_PDF_VENTAS_2026 | key=%'
GROUP BY 1
ORDER BY 1;
```

## Importar históricos (reservas/ventas)
Formato CSV simple (ejemplos incluidos):
- `db/samples_reservations.csv`
- `db/samples_sales.csv`

Ejecución desde `apps/refugios-mvp` (rutas relativas):
```bash
npm run db:import -- db/samples_reservations.csv db/samples_sales.csv
```

Importar desde PDF y Excel (Gastos, Ventas, Reservas):
```bash
npm run db:import-pdf-excel gastos "Gastos AvA Refugios 2026.xlsx"
npm run db:import-pdf-excel ventas "Ventas AvA 2026.pdf" 2026
npm run db:import-pdf-excel reservas "RESERVAS 2026.pdf" 2026
```

### Staging recomendado antes de migrar datos iniciales
Para evitar perder trazabilidad de datos iniciales, primero extrae a dataset versionable y luego genera migraciones SQL desde ese dataset:
```bash
npm run db:extract-ventas-staging -- "../../assets/Ventas AvA 2026.pdf" 2026
```
Salida:
- `db/staging/ventas_ava_2026.normalized.json`
- `db/staging/ventas_ava_2026.normalized.csv`
- `db/staging/ventas_ava_2026.summary.md`

### Sincronizar todos los PDF/Excel de una carpeta
Coloca en `apps/refugios-mvp/data` (o en la carpeta que indiques) los archivos con nombres que contengan **ventas**, **reservas** o **gastos** (y opcionalmente el año, ej. 2026). Luego ejecuta:
```bash
npm run db:sync-pdf
# o con carpeta y año explícitos:
node scripts/sync-pdfs.mjs ./ruta/a/carpeta 2026
```
Se importan automáticamente los PDF de ventas/reservas y los Excel de gastos detectados por nombre.

## Endpoints
- `GET /api/users`
- `GET/POST/DELETE /api/guests`
- `GET/POST/DELETE /api/reservations`
- `GET /api/reservations/funnel`
- `PATCH /api/reservations/:id/stage`
- `GET/POST/DELETE /api/sales`
- `GET/POST/DELETE /api/expenses`
- `GET/POST/DELETE /api/documents`
- `GET /api/dashboard/summary`

## Documentación de uso
- **Manual de usuario extenso**: `docs/MANUAL_USUARIO.md` — guía completa de todas las secciones, flujos y solución de problemas.

## UX actual
- Mobile-first real para uso en telefono.
- Breadcrumb y navegacion rapida por secciones.
- Tema claro/oscuro con toggle persistente.
- Botones de eliminar por registro (con confirmacion).

## Deploy
### Render
1. Conectar repo
2. Deploy con Docker desde `apps/refugios-mvp/Dockerfile` o usar `render.yaml`
3. En Render Dashboard -> Environment, definir `DATABASE_URL` (Neon/Postgres)
4. Redeploy manual

Si `DATABASE_URL` falta, la app inicia pero los endpoints `/api/*` responderan `503`.

### Vercel
1. Importar repo
2. Definir `DATABASE_URL`
3. `vercel.json` enruta a `api/index.js`

### Neon
1. Crear DB PostgreSQL
2. Copiar `DATABASE_URL`
3. Ejecutar `make migrate`

## Integración opcional con Trello (bridge)
Este backend puede notificar la creación de reservas al servicio `trello-agent-integration`.

Variables en `apps/refugios-mvp/.env`:
- `TRELLO_BRIDGE_ENABLED=true`
- `TRELLO_BRIDGE_BASE_URL=http://localhost:3400`
- `TRELLO_BRIDGE_CREATE_CARD_PATH=/v1/cards`
- `TRELLO_BRIDGE_DEFAULT_LIST_ID=<LIST_ID_DESTINO>`

Comportamiento:
- Si Trello bridge está disponible, crea una tarjeta por reserva nueva.
- Si Trello bridge falla, la reserva igual se guarda (fallback no bloqueante).

## Ciclo de vida y releases
Esta guia usa releases para seguimiento operativo del avance, manteniendo el SRS como base de requisitos.

Marco comercial del proyecto:
- Presupuesto acordado: `450.000 CLP`.
- Ventana de ejecucion objetivo: `2 a 3 semanas`.
- Criterio de gestion: priorizar entregables MVP cerrados por release para evitar desborde de alcance.

Fases actuales:
- `Analisis`: completado (SRS base definido).
- `Diseno`: completado para MVP inicial.
- `Construccion`: en curso (iteraciones por modulo).
- `Pruebas`: en curso (validacion funcional por release).
- `Deploy`: en curso (Render como canal principal).

## Politica de versionado
- Esquema: `MAJOR.MINOR.PATCH` (SemVer).
- `MAJOR`: cambios incompatibles.
- `MINOR`: nuevas capacidades compatibles.
- `PATCH`: correcciones sin cambio funcional mayor.
- Formato sugerido de release: `vX.Y.Z - YYYY-MM-DD`.

## Historial de releases
### v0.9.6 - 2026-03-16
Objetivo:
- Alinear UI del panel a PDFs operativos del cliente (calendario + planilla ventas).

Alcance funcional:
- Calendario: toggle “Vista PDF” para grilla simple `NOMBRE X2` (sin ratio ni chips).
- Ventas: tab “Planilla” con columnas/etiquetas tipo “Ventas AvA 2026”.
- UI: categorías técnicas ocultas (ej. `lodging` → “Alojamiento”) y selector de categorías en el modal.

Estado:
- `Pendiente deploy` (Render).

### v0.9.5 - 2026-02-16
Objetivo:
- Habilitar sincronización mínima de reservas hacia Trello para operación comercial.

Alcance funcional:
- Integración opcional backend -> `trello-agent-integration` al crear reserva.
- Configuración por variables de entorno `TRELLO_BRIDGE_*`.
- Fallback no bloqueante para no afectar el flujo de reservas.

Estado:
- `Completado`.

### v0.9.4 - 2026-02-15
Objetivo:
- Dar independencia de período a la sección Huéspedes.

Alcance funcional:
- `Huéspedes` ahora usa su propio filtro de período (chips anual/mensual).
- El período de Huéspedes no depende de Dashboard.
- Persistencia del filtro de Huéspedes en `localStorage`.

Estado:
- `Completado`.

### v0.9.3 - 2026-02-15
Objetivo:
- Mejorar velocidad de filtrado operativo en Reservas.

Alcance funcional:
- Botones rápidos `Hoy` y `Esta semana` en la sección Reservas.
- Los filtros rápidos aplican solo al scope de Reservas y mantienen memoria en `localStorage`.

Estado:
- `Completado`.

### v0.9.2 - 2026-02-15
Objetivo:
- Mejorar lectura de desempeño mensual y persistencia de filtros por sección.

Alcance funcional:
- KPI de ventas ajustado a comparación `vs mes anterior`.
- Resumen visual de los últimos 3 meses (monto, transacciones y variación mensual).
- Filtros/períodos independientes por sección (`Dashboard`, `Reservas`, `Ventas`, `Gastos`) con memoria en `localStorage`.

Estado:
- `Completado`.

### v0.9.0 - 2026-02-15
Objetivo:
- Incorporar embudo comercial para reservas tipo agenda operativa.

Alcance funcional:
- Etapa comercial en reservas (`lead_stage`) con seguimiento (`follow_up_at`).
- Endpoint de embudo (`GET /api/reservations/funnel`) para conteos por etapa/canal.
- Endpoint para actualizar etapa comercial (`PATCH /api/reservations/:id/stage`).
- UI de reservas con métricas de embudo, filtro por etapa y alerta visual de seguimiento vencido.

Estado:
- `Completado` en Fase A base.

### v0.1.0 - 2026-02-13
Objetivo:
- Establecer baseline MVP operativo para gestion de cabañas.

Alcance funcional:
- Huespedes, reservas, ventas, gastos y documentos.
- Dashboard de resumen operativo.
- Importacion historica por CSV.
- Despliegue en Render/Vercel con `DATABASE_URL`.

Estado:
- `Completado` como baseline para siguientes iteraciones.

## Plan semanal (2-3 semanas)
### Semana 1 - Base operativa y datos
Objetivo:
- Asegurar operacion diaria estable con datos confiables.

Entregables cerrados:
- [x] CRUD operativo de huespedes, reservas, ventas, gastos y documentos.
- [x] Migraciones ejecutables en ambiente limpio.
- [x] Importacion historica CSV validada con set de prueba.

Trazabilidad principal:
- `RF-01` a `RF-11`, `RF-18`.
- `CA-01` a `CA-07`, `CA-09`, `CA-15`.

Criterio de cierre:
- [x] Operador registra y consulta datos sin bloqueos.
- [x] Base inicial lista para pruebas funcionales.

### Semana 2 - UX operativa y control de gestion
Objetivo:
- Mejorar uso diario y lectura de resultados para toma de decisiones.

Entregables cerrados:
- [x] Dashboard con metricas coherentes.
- [x] Tema claro/oscuro persistente.
- [x] Vistas con foco en tablas y filtros operativos.

Trazabilidad principal:
- `RF-07`, `RF-12`, `RF-13`, `RF-18`.
- `CA-05`, `CA-08`, `CA-10`, `CA-15`.

Criterio de cierre:
- [x] Flujo de operacion diario resuelto desde UI.
- [x] Informacion util para control comercial y financiero.

### Semana 3 (opcional segun carga) - Filtros avanzados y estabilizacion
Objetivo:
- Cerrar brechas de analitica operativa y preparar release final.

Entregables cerrados:
- [ ] Filtros de gastos por fecha/categoria.
- [ ] Filtros de ventas por periodo.
- [ ] Consulta de reservas por periodo y ocupacion porcentual.
- [ ] Ajustes finales de calidad y despliegue.

Trazabilidad principal:
- `RF-14` a `RF-17`.
- `CA-11` a `CA-14`.

Criterio de cierre:
- [ ] Reportabilidad minima completa para operacion del negocio.
- [ ] Release candidata a cierre comercial del proyecto.

Control semanal de costo/plazo:
- [x] Semana 1: registrar avance y costo consumido acumulado.
- [x] Semana 2: validar desvio vs plan y ajustar backlog.
- [ ] Semana 3: ejecutar solo si no rompe tope de `450.000 CLP` ni ventana maxima de 3 semanas.

Seguimiento diario sugerido:
- [ ] Actualizar estado de casillas al cierre del dia.
- [ ] Registrar bloqueos y decision (continuar, recortar alcance o mover a backlog).
- [ ] Registrar costo/horas acumuladas para controlar presupuesto de `450.000 CLP`.

## Metricas de avance (% y curva S)
Definicion de pesos por semana (curva S planificada):
- Semana 1: `25%` acumulado.
- Semana 2: `70%` acumulado.
- Semana 3: `100%` acumulado.

Regla de calculo de avance real:
- Avance de semana (%) = (casillas completadas de la semana / casillas totales de la semana) x 100.
- Avance real acumulado (%) = (Avance S1 x 0.25) + (Avance S2 x 0.45) + (Avance S3 x 0.30).

Carga inicial estimada al `2026-02-13`:
- `Avance S1 = 100%`, `Avance S2 = 100%`, `Avance S3 = 0%`.
- `Avance real acumulado = 70%`.

Lectura de desviacion:
- Desviacion (%) = Avance real acumulado - Avance plan acumulado.
- Si desviacion < `-10%`: activar ajuste de alcance o priorizacion.

### Tablero de seguimiento (actualizar diario)
| Corte | Plan acumulado (%) | Real acumulado (%) | Desviacion (%) | Horas acumuladas | Costo acumulado (CLP) |
|---|---:|---:|---:|---:|---:|
| Semana 1 cierre | 25 | 25 | 0 | 0 | 0 |
| Semana 2 cierre | 70 | 70 | 0 | 0 | 0 |
| Estado actual estimado (2026-02-13) | 70 | 70 | 0 | 0 | 0 |
| Semana 3 cierre (objetivo) | 100 | 70 | -30 | 0 | 0 |

### Semaforo de control
- `Verde`: desviacion mayor o igual a `-5%`.
- `Amarillo`: desviacion entre `-6%` y `-10%`.
- `Rojo`: desviacion menor a `-10%` o costo proyectado sobre `450.000 CLP`.

## Trazabilidad (Release -> SRS IEEE 830)
### v0.1.0
- Requisitos funcionales: `RF-01` a `RF-13`, `RF-18`.
- Requisitos no funcionales: `RNF-02`, `RNF-03`, `RNF-04`, `RNF-05`.
- Criterios de aceptacion: `CA-01` a `CA-10`, `CA-15`.

Nota:
- Requisitos `RF-14` a `RF-17` y criterios `CA-11` a `CA-14` quedan como foco de releases siguientes.

## Plantilla para proximas releases
Usar esta estructura en cada version:

```md
### vX.Y.Z - YYYY-MM-DD
Objetivo:
- ...

Ventana y costo:
- Semana: ...
- Horas/costo consumido estimado: ...

Cambios:
- ...

Trazabilidad:
- RF: ...
- RNF: ...
- CA: ...

Riesgos/pendientes:
- ...
```

## Control de alcance (costo/tiempo)
- Todo requerimiento nuevo fuera de `RF-01` a `RF-18` se registra como `Cambio de alcance`.
- Cada cambio de alcance debe indicar impacto en plazo (semanas) y costo (CLP) antes de implementarse.
- Si un cambio compromete la meta de `2 a 3 semanas`, pasa a backlog para una siguiente fase.

## Documento SRS (IEEE 830)
- Base de requisitos: `docs/SRS_IEEE830.md`
