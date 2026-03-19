#!/bin/bash
# Levanta DB + app en Docker y expone por Cloudflare Tunnel (TryCloudflare).
# La URL del tunnel cambia cada vez (variable). El frontend se conecta por esa URL.
# Requiere: Docker, cloudflared

set -e
cd "$(dirname "$0")"

echo "=== Refugios MVP - Tunnel Cloudflare ==="
echo ""

echo "[1/4] Levantando DB y app con Docker..."
docker compose -f docker-compose.tunnel.yml up -d --build
sleep 8

echo "[2/4] Ejecutando migraciones..."
docker compose -f docker-compose.tunnel.yml exec -T app npm run db:migrate 2>/dev/null || true

echo "[3/4] Iniciando Cloudflare Tunnel..."
echo "La URL pública cambia cada vez que reinicias el tunnel."
echo ""

cloudflared tunnel --url http://localhost:3000 2>&1 | tee /tmp/cloudflared-tunnel.log &
TUNNEL_PID=$!
sleep 12
URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/cloudflared-tunnel.log 2>/dev/null | head -1)

echo ""
echo "[4/4] Listo."
echo ""
if [ -n "$URL" ]; then
  echo "URL publica (comparte este enlace): $URL"
  echo ""
  echo "El frontend y la API están en la misma URL. El frontend se conecta automáticamente."
else
  echo "Revisa la salida de cloudflared arriba para la URL."
fi
echo ""
echo "Ctrl+C para detener el tunnel (los contenedores siguen corriendo)."
wait $TUNNEL_PID
