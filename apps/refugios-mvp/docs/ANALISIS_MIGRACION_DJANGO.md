# Análisis del sistema Refugios MVP para migración a Django

Este documento describe la arquitectura actual (Node/Express + PostgreSQL) y mapea cada componente al modelo equivalente en Django.

---

## 1. Arquitectura actual

- **Backend:** Node.js + Express (ES modules)
- **Base de datos:** PostgreSQL (Neon o local)
- **Frontend:** HTML estático + CSS + vanilla JS (SPA-like con fetch)
- **Integración:** Trello bridge (HTTP POST opcional)

---

## 2. Modelos de datos (PostgreSQL → Django ORM)

### 2.1 app_users

| Campo      | Tipo        | Django Field                |
|------------|-------------|-----------------------------|
| id         | SERIAL PK   | AutoField (por defecto)     |
| full_name  | TEXT        | CharField(max_length=255)   |
| email      | TEXT UNIQUE | EmailField(unique=True)     |
| role       | TEXT CHECK  | CharField(choices=ROLES)    |
| is_active  | BOOLEAN     | BooleanField(default=True)  |
| created_at | TIMESTAMPTZ | DateTimeField(auto_now_add=True) |

**Valores de `role`:** `admin`, `operator`, `viewer`

---

### 2.2 guests

| Campo      | Tipo        | Django Field                   |
|------------|-------------|--------------------------------|
| id         | SERIAL PK   | AutoField                      |
| full_name  | TEXT        | CharField(max_length=255)      |
| email      | TEXT        | EmailField(null=True, blank=True) |
| phone      | TEXT        | CharField(null=True, blank=True)  |
| document_id| TEXT        | CharField(null=True, blank=True)  |
| notes      | TEXT        | TextField(null=True, blank=True)  |
| created_at | TIMESTAMPTZ | DateTimeField(auto_now_add=True)  |

---

### 2.3 reservations

| Campo        | Tipo        | Django Field                          |
|--------------|-------------|----------------------------------------|
| id           | SERIAL PK   | AutoField                              |
| guest_id     | FK guests   | ForeignKey(Guest, on_delete=RESTRICT)  |
| source       | TEXT CHECK  | CharField(choices=SOURCES)             |
| payment_method | TEXT CHECK| CharField(choices=PAYMENT_METHODS)     |
| status       | TEXT CHECK  | CharField(choices=STATUSES)            |
| check_in     | DATE        | DateField                              |
| check_out    | DATE        | DateField                              |
| check_in_time| TEXT (HH:MM)| CharField(null=True, blank=True, max_length=5) |
| checkout_time| TEXT (HH:MM)| CharField(null=True, blank=True, max_length=5) |
| lead_stage   | TEXT        | CharField(choices=LEAD_STAGES, default='lead_new') |
| follow_up_at | TIMESTAMPTZ | DateTimeField(null=True, blank=True)  |
| guests_count | INT         | IntegerField(default=1)                |
| total_amount | NUMERIC     | DecimalField(max_digits=12, decimal_places=2) |
| notes        | TEXT        | TextField(null=True, blank=True)       |
| created_at   | TIMESTAMPTZ | DateTimeField(auto_now_add=True)       |

**Valores de `source`:** `web`, `airbnb`, `booking`, `phone`, `walkin`, `other`  
**Valores de `payment_method`:** `cash`, `card`, `transfer`, `mercadopago`, `other`  
**Valores de `status`:** `pending`, `confirmed`, `cancelled`, `completed`  
**Valores de `lead_stage`:** `lead_new`, `quoted`, `pending_deposit`, `confirmed`, `completed`, `cancelled`

---

### 2.4 sales

| Campo          | Tipo        | Django Field                            |
|----------------|-------------|------------------------------------------|
| id             | SERIAL PK   | AutoField                                |
| reservation_id | FK nullable | ForeignKey(Reservation, null=True, on_delete=SET_NULL) |
| category       | TEXT        | CharField(default='lodging')             |
| amount         | NUMERIC     | DecimalField(max_digits=12, decimal_places=2) |
| payment_method | TEXT CHECK  | CharField(choices=PAYMENT_METHODS)       |
| sale_date      | DATE        | DateField(default=date.today)            |
| description    | TEXT        | TextField(null=True, blank=True)         |
| created_at     | TIMESTAMPTZ | DateTimeField(auto_now_add=True)         |

---

### 2.5 expenses

| Campo          | Tipo        | Django Field                    |
|----------------|-------------|----------------------------------|
| id             | SERIAL PK   | AutoField                        |
| category       | TEXT        | CharField(max_length=255)        |
| amount         | NUMERIC     | DecimalField(max_digits=12, decimal_places=2) |
| payment_method | TEXT CHECK  | CharField(choices=PAYMENT_METHODS) |
| expense_date   | DATE        | DateField(default=date.today)    |
| supplier       | TEXT        | CharField(null=True, blank=True) |
| description    | TEXT        | TextField(null=True, blank=True) |
| created_at     | TIMESTAMPTZ | DateTimeField(auto_now_add=True) |

---

### 2.6 documents

| Campo          | Tipo        | Django Field                            |
|----------------|-------------|------------------------------------------|
| id             | SERIAL PK   | AutoField                                |
| reservation_id | FK nullable | ForeignKey(Reservation, null=True, on_delete=SET_NULL) |
| sale_id        | FK nullable | ForeignKey(Sale, null=True, on_delete=SET_NULL) |
| document_type  | TEXT CHECK  | CharField(choices=[('boleta','Boleta'), ('factura','Factura')]) |
| document_number| TEXT        | CharField(null=True, blank=True)         |
| issue_date     | DATE        | DateField(default=date.today)            |
| amount         | NUMERIC     | DecimalField(max_digits=12, decimal_places=2) |
| status         | TEXT CHECK  | CharField(choices=[('issued','Emitido'), ('voided','Anulado')], default='issued') |
| created_at     | TIMESTAMPTZ | DateTimeField(auto_now_add=True)         |

---

### 2.7 cabin_images

| Campo             | Tipo        | Django Field                          |
|-------------------|-------------|----------------------------------------|
| id                | SERIAL PK   | AutoField                              |
| cabin_number      | INT CHECK   | IntegerField(validators=[MinValueValidator(1)]) |
| image_data_base64 | TEXT        | TextField()                            |
| caption           | TEXT        | CharField(null=True, blank=True)       |
| sort_order        | INT         | IntegerField(default=0)                |
| created_at        | TIMESTAMPTZ | DateTimeField(auto_now_add=True)       |

---

### 2.8 schema_migrations (control de migraciones)

Django gestiona migraciones con su propio sistema (`django_migrations`). No hace falta replicar esta tabla.

---

## 3. API REST (endpoints actuales → Django REST / Views)

| Método | Ruta                            | Descripción                    | Django equivalente                |
|--------|----------------------------------|--------------------------------|-----------------------------------|
| GET    | /health                          | Estado del servicio            | View o decorator simple           |
| GET    | /api/users                       | Lista usuarios                 | APIView / ViewSet                 |
| GET    | /api/guests                      | Lista huéspedes + última reserva + deuda | ViewSet con serializer custom |
| GET    | /api/guests/by-document/:id      | Buscar huésped por RUT         | Action o view custom              |
| POST   | /api/guests                      | Crear huésped                  | CreateModelMixin                  |
| DELETE | /api/guests/:id                  | Eliminar huésped               | DestroyModelMixin                 |
| GET    | /api/reservations                | Lista reservas + deuda         | ViewSet con serializer custom     |
| GET    | /api/reservations/funnel         | Embudo comercial               | @action(detail=False)             |
| POST   | /api/reservations                | Crear reserva (con validaciones) | CreateModelMixin + validators   |
| PATCH  | /api/reservations/:id/stage      | Cambiar lead_stage             | @action(detail=True)              |
| PATCH  | /api/reservations/:id/release    | Liberar cabaña (completar)     | @action(detail=True)              |
| DELETE | /api/reservations/:id            | Eliminar reserva               | DestroyModelMixin                 |
| GET    | /api/cabins/images               | Imágenes por cabaña            | APIView custom                    |
| PATCH  | /api/cabins/:number/images       | Reemplazar imágenes cabaña     | APIView custom                    |
| GET    | /api/sales                       | Lista ventas                   | ViewSet                           |
| POST   | /api/sales                       | Crear venta                    | CreateModelMixin                  |
| DELETE | /api/sales/:id                   | Eliminar venta                 | DestroyModelMixin                 |
| GET    | /api/expenses                    | Lista gastos                   | ViewSet                           |
| POST   | /api/expenses                    | Crear gasto                    | CreateModelMixin                  |
| DELETE | /api/expenses/:id                | Eliminar gasto                 | DestroyModelMixin                 |
| GET    | /api/documents                   | Lista documentos               | ViewSet                           |
| POST   | /api/documents                   | Crear documento                | CreateModelMixin                  |
| DELETE | /api/documents/:id               | Eliminar documento             | DestroyModelMixin                 |
| GET    | /api/dashboard/summary           | Resumen (totales, docs, fuentes) | APIView custom                 |

---

## 4. Reglas de negocio a implementar en Django

1. **Reserva requiere huésped existente:** ForeignKey obligatorio.
2. **Catálogos:** Usar `choices` en los campos.
3. **No eliminar huésped con reservas:** `on_delete=RESTRICT` o validación en `delete()`.
4. **Reserva sin solapamiento del mismo huésped:** `clean()` en el modelo o en el serializer.
5. **Capacidad de cabañas:** Variable `TOTAL_CABINS` (settings) para validar ocupación.
6. **Normalización de RUT:** Función `normalizeDocumentId` (quitar puntos, guiones, mayúsculas).
7. **Trello bridge:** Tarea asíncrona (Celery) o llamada HTTP en `post_save` de Reservation (opcional).

---

## 5. Frontend actual

- **Una sola página HTML** (`index.html`) con secciones ocultas/mostradas por JS.
- **main.js (~1200 líneas):** Fetch a `/api/*`, renderizado DOM, modales, filtros, paginación, tema claro/oscuro.
- **styles.css:** Tema oscuro/claro con variables CSS.
- **Sin framework frontend:** Vanilla JS. Para Django se puede:
  - Mantener el mismo frontend (servir HTML estático desde `static/`).
  - O migrar a Django Templates + HTMX / Alpine.js.
  - O construir un SPA con React/Vue consumiendo la misma API.

**Endpoints consumidos por el frontend:**

- `/api/guests`
- `/api/guests` POST (crear)
- `/api/guests/by-document/:documentId`
- `/api/reservations`
- `/api/reservations` POST (crear)
- `/api/reservations/:id/release` PATCH
- `/api/cabins/images`
- `/api/cabins/:number/images` PATCH
- `/api/sales`
- `/api/sales` POST
- `/api/expenses`
- `/api/expenses` POST
- `/api/documents`
- `/api/documents` POST
- `/api/dashboard/summary`
- DELETE en guests, reservations, sales, expenses, documents

---

## 6. Variables de entorno

| Variable                   | Uso                                      |
|----------------------------|------------------------------------------|
| DATABASE_URL               | Conexión PostgreSQL (obligatoria)        |
| PORT                       | Puerto del servidor (default 3000)       |
| TOTAL_CABINS               | Capacidad de cabañas (default 4/6)       |
| TRELLO_BRIDGE_ENABLED      | true/1/yes para activar                  |
| TRELLO_BRIDGE_BASE_URL     | URL del bridge (ej. http://localhost:3400) |
| TRELLO_BRIDGE_CREATE_CARD_PATH | Path (ej. /v1/cards)                 |
| TRELLO_BRIDGE_DEFAULT_LIST_ID | ID de lista Trello destino           |

---

## 7. Scripts operativos

| Script                 | Propósito                          | Django equivalente                    |
|------------------------|------------------------------------|----------------------------------------|
| migrate.mjs            | Ejecutar migraciones SQL           | `python manage.py migrate`             |
| seed.mjs               | Datos demo (1 huésped, reserva, etc) | Management command o fixture          |
| import-historical.mjs  | Importar CSV reservas/ventas       | Management command `import_historical` |
| 003_seed_demo_historical.sql | Datos demo 2024–2026          | Fixture JSON o management command      |

---

## 8. Códigos de error PostgreSQL mapeados

| Código  | Significado              | HTTP | Respuesta actual                      |
|---------|--------------------------|------|----------------------------------------|
| 42P01   | Tabla no existe          | 503  | "Base de datos sin migrar"             |
| 23502   | Not null violation       | 400  | "Faltan campos obligatorios"           |
| 23503   | Foreign key violation    | 400  | "Referencia inválida"                  |
| 23514   | Check constraint         | 400  | "Dato fuera de catálogo"               |
| 22P02   | Invalid text repr        | 400  | "Formato de dato inválido"             |
| 28P01   | Auth failed              | 503  | "Credenciales inválidas"               |
| ENOTFOUND, ECONNREFUSED | Red/DB | 503 | "No se pudo conectar a la base de datos" |
| MISSING_DATABASE_URL    | Config | 503 | "Servicio no configurado"              |

En Django: manejar `IntegrityError`, `OperationalError`, etc. en middleware o en `exceptions.py` y devolver JSON equivalente.

---

## 9. Índices actuales

```sql
idx_reservations_dates ON reservations(check_in, check_out)
idx_reservations_source ON reservations(source)
idx_sales_date ON sales(sale_date)
idx_expenses_date ON expenses(expense_date)
idx_documents_type_date ON documents(document_type, issue_date)
idx_cabin_images_cabin ON cabin_images(cabin_number)
```

En Django: `Meta.indexes` o `db_index=True` en los campos correspondientes.

---

## 10. Estructura sugerida del proyecto Django

```
refugios/
├── manage.py
├── refugios/           # proyecto Django
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── core/               # app principal
│   ├── models.py       # Guest, Reservation, Sale, Expense, Document, CabinImage, AppUser
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── admin.py
│   ├── management/
│   │   └── commands/
│   │       ├── seed_demo.py
│   │       └── import_historical.py
│   └── services/
│       └── trello_bridge.py
├── static/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
├── templates/
│   └── index.html
├── requirements.txt
└── .env
```

---

## 11. Checklist de migración

- [ ] Crear proyecto Django y app `core`
- [ ] Definir modelos (Guest, Reservation, Sale, Expense, Document, CabinImage, AppUser)
- [ ] Migraciones iniciales
- [ ] API REST (DRF o views + JSON) con la misma estructura de respuesta
- [ ] Validaciones de reserva (solapamiento, capacidad)
- [ ] Integración Trello (opcional)
- [ ] Servir frontend estático (HTML, CSS, JS)
- [ ] Management commands: seed, import_historical
- [ ] Variables de entorno y settings
- [ ] Deploy (Render, etc.) con PostgreSQL
