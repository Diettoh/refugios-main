# Cabanas MVP - Boilerplate Factory

Generador de boilerplates para proyectos listos para deploy.

## Soporte inicial
- Template: `express-api`
- Proveedores: `render`, `vercel`, `neon`, `trycloudflare`

## Crear un proyecto
```bash
npm run new -- --name refugios-api --template express-api --providers render,vercel,neon,trycloudflare
```

## Opciones
- `--name` nombre del proyecto (obligatorio)
- `--template` plantilla base (default: `express-api`)
- `--providers` lista separada por comas
- `--out` ruta de salida (default: directorio actual)

## Branding
Cada proyecto generado incluye:
- `branding/brand.json`
- `branding/README.md` para colocar `branding/logo.png`

## Notificaciones WhatsApp
Scripts incluidos:
- `tools/notify-whatsapp.sh` para enviar mensaje directo.
- `tools/codex-run-and-notify.sh` para ejecutar un comando y notificar al finalizar.

Guia completa: `docs/whatsapp-notifications.md`

Ejemplo rapido:
```bash
source .env.notifications.example
# ajusta variables reales
PROJECT_NAME=refugios ./tools/codex-run-and-notify.sh "npm run new -- --name test-api"
```

## Notificaciones y túnel

- Usa `scripts/run-with-notify-template.sh` para validar el puerto, compilar/ejecutar el servicio y notificar el estado a Discord y Telegram.  
- Copia `.env_discord.example` y `.env_telegram.example` a `~/.env_discord` y `~/.env_telegram` antes de ejecutar los scripts y reemplaza los placeholders por los valores reales.
- Usa `./scripts/setup-notify-env.sh` (desde este repo o la copia del template) para copiar los ejemplos a tu home y luego reemplazar los placeholders con tus claves.
- El wrapper y la plantilla notifican `⛓️ Tunnel listo…` al arrancar y `🔒 Tunnel cerrado…` al terminar para que siempre sepas qué enlaces están activos.
- Define `DISCORD_WEBHOOK_URL` (obligatorio) en `~/.env_discord`; si quieres Telegram agrega `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` en `~/.env_telegram`.  
- El script también lanza `cloudflared tunnel --url http://localhost:$SERVICE_PORT` (si el binario está instalado) y publica el enlace público a través de los mismos webhooks. Puedes omitir el túnel exportando `CLOUDFLARED_DISABLED=1`.  
- Para probarlo, ejecuta:

```bash
./scripts/start.sh
```

Puedes sobrescribir `SERVICE_*` o ejecutar `scripts/run-with-notify-template.sh` por separado si necesitas cambiar puertos o comandos.

Si necesitas copiar esta plantilla a otros repositorios, ejecuta `scripts/apply-notify-template.sh /ruta/al/otro-repo` desde este repo para instalar la versión más reciente y pegar el snippet sugerido en su README.

## Deploy
El proyecto generado incluye `DEPLOY.md` con pasos por proveedor.

### URLs
- Web (Render): `https://refugios.onrender.com/`

## Versionado UI
- `UI_VERSION` actual: `0.8.4`
- Ubicacion en codigo: `apps/refugios-mvp/public/main.js`
- Indicador visible en UI: footer (`#ui-version`).

### Regla operativa
Cuando haya cambios visibles en frontend:
1. Actualizar `UI_VERSION` en `apps/refugios-mvp/public/main.js`.
2. Reflejar el mismo valor en este `README.md`.
3. Incluir la version en el mensaje de deploy/entrega.
