# Ejecutar Refugios MVP en Windows (PowerShell)
# Uso: .\run-windows.ps1 [ install | db-up | migrate | start | dev | full ]
# Ejecutar siempre desde: cd apps\refugios-mvp  luego  .\run-windows.ps1 install

$ErrorActionPreference = "Stop"
$AppDir = $PSScriptRoot
Push-Location $AppDir

function Assert-InAppDir {
    if (-not (Test-Path "package.json")) {
        Write-Host "Error: package.json no encontrado. Ejecuta este script desde apps\refugios-mvp (ruta relativa desde la raíz del repo)." -ForegroundColor Red
        Pop-Location
        exit 1
    }
    $norm = $AppDir -replace '/', '\'
    if (-not ($norm -match 'apps\\refugios-mvp$')) {
        Write-Host "Error: Este script debe ejecutarse desde apps\refugios-mvp. Directorio actual: $($AppDir)" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}

function Ensure-Env {
    if (-not (Test-Path ".env")) {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Host "Creado .env desde .env.example. Revisa DATABASE_URL si usas DB local." -ForegroundColor Yellow
        } else {
            Write-Host "No existe .env ni .env.example. Crea .env con DATABASE_URL." -ForegroundColor Red
            Pop-Location
            exit 1
        }
    }
}

function Run-Install {
    Assert-InAppDir
    Write-Host "Directorio de trabajo: $(Get-Location)" -ForegroundColor Gray
    Write-Host "Instalando dependencias (npm install)..." -ForegroundColor Cyan
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Fallo npm install. Revisa Node.js y conexion." -ForegroundColor Red
        Pop-Location
        exit 1
    }
    if (-not (Test-Path "node_modules\pg")) {
        Write-Host "Error: node_modules no contiene 'pg'. La instalacion no fue correcta." -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "Dependencias instaladas correctamente (node_modules existe)." -ForegroundColor Green
}

function Run-DbUp {
    Write-Host "Levantando PostgreSQL con Docker..." -ForegroundColor Cyan
    & docker compose up -d db
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker no disponible o fallo. Usa DATABASE_URL en .env (ej. Neon) o instala Docker Desktop." -ForegroundColor Yellow
        return
    }
    Write-Host "Esperando a que la DB acepte conexiones..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
}

function Run-Migrate {
    Ensure-Env
    Write-Host "Ejecutando migraciones (npm run db:migrate)..." -ForegroundColor Cyan
    & npm run db:migrate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Fallo migracion. Comprueba DATABASE_URL y que la base este levantada." -ForegroundColor Red
        Pop-Location
        exit 1
    }
}

function Run-Start {
    Ensure-Env
    Write-Host "Iniciando servidor (npm run start)..." -ForegroundColor Cyan
    & npm run start
}

function Run-Dev {
    Ensure-Env
    Write-Host "Iniciando servidor en modo desarrollo (npm run dev)..." -ForegroundColor Cyan
    & npm run dev
}

try {
    $cmd = $args[0]
    if (-not $cmd) { $cmd = "full" }

    switch ($cmd) {
        "install"  { Run-Install }
        "db-up"   { Run-DbUp }
        "migrate" { Run-Migrate }
        "start"   { Run-Start }
        "dev"     { Run-Dev }
        "full"    {
            Run-Install
            Ensure-Env
            Run-DbUp
            Run-Migrate
            Write-Host "Listo. Para arrancar: .\run-windows.ps1 start  o  .\run-windows.ps1 dev" -ForegroundColor Green
        }
        default {
            Write-Host "Uso: .\run-windows.ps1 [ install | db-up | migrate | start | dev | full ]" -ForegroundColor Yellow
            exit 1
        }
    }
} finally {
    Pop-Location
}
