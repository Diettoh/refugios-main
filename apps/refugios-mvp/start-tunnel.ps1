# Levanta DB + app en Docker y expone por Cloudflare Tunnel (TryCloudflare).
# La URL del tunnel cambia cada vez (variable). El frontend se conecta por esa URL.
# Requiere: Docker Desktop, cloudflared (winget install Cloudflare.cloudflared)

$ErrorActionPreference = "Stop"
$AppDir = $PSScriptRoot
Push-Location $AppDir

Write-Host "=== Refugios MVP - Tunnel Cloudflare ===" -ForegroundColor Cyan
Write-Host ""

# 1. Levantar DB + app
Write-Host "[1/3] Levantando DB y app con Docker..." -ForegroundColor Yellow
docker compose -f docker-compose.tunnel.yml up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al levantar contenedores." -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "Esperando a que la app este lista..." -ForegroundColor Gray
Start-Sleep -Seconds 8

# 2. Migraciones
Write-Host "[2/3] Ejecutando migraciones..." -ForegroundColor Yellow
docker compose -f docker-compose.tunnel.yml exec -T app npm run db:migrate 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  (migraciones ya aplicadas o error)" -ForegroundColor Gray }

# 3. Tunnel (URL variable - se imprime al conectar)
Write-Host "[3/3] Iniciando Cloudflare Tunnel..." -ForegroundColor Yellow
Write-Host "La URL publica cambia cada vez. Copia la URL que aparece abajo." -ForegroundColor Gray
Write-Host "Para detener: Ctrl+C (los contenedores siguen con: docker compose -f docker-compose.tunnel.yml down)" -ForegroundColor Gray
Write-Host ""

& cloudflared tunnel --protocol http2 --url http://localhost:3000

Pop-Location
