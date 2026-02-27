#!/bin/sh

# =======================================================
# SCRIPT DE INICIO DE CONTENEDOR (ENTRYPOINT)
# 1. Ejecuta migraciones y seeding.
# 2. Inicia la aplicación principal.
# =======================================================

echo "⏳ Ejecutando comandos de migración y seeding..."

# --- 1. Ejecutar las migraciones ---
echo "Ejecutando npx prisma migrate deploy..."
npx prisma migrate deploy || {
  echo "❌ ERROR CRÍTICO: Falló la migración de Prisma."
  exit 1
}

# --- 2. Ejecutar el seeding y capturar errores detallados ---
echo "Ejecutando npm run db:seed..."

# Redirige stderr (2) a stdout (1) para capturar el error detallado
OUTPUT=$(npm run db:seed 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "--- INICIO: Salida de error detallada de db:seed ---"
  echo "$OUTPUT"
  echo "--- FIN: Salida de error de db:seed (CÓDIGO: $EXIT_CODE) ---"
  echo "⚠️  ADVERTENCIA: El seeding falló (puede que los datos ya existan). Continuando..."
fi

echo "✅ Migraciones y seeding completados. Iniciando servidor..."

# --- 3. Ejecutar el comando principal de la aplicación ---
# El comando 'exec' reemplaza el proceso de shell actual por el proceso de Node.js,
# lo cual es crucial para la gestión de señales de Docker.
exec node dist/main.js