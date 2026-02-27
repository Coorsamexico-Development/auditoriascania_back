# Multi-stage build para optimizar el tamaño de la imagen
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copiar archivos de dependencias primero (mejora caché de Docker)
COPY package-lock.json package.json ./
COPY prisma ./prisma/

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar el resto del código
COPY . .

# Generar el cliente de Prisma y compilar la aplicación
RUN npx prisma generate && npm run build

# =======================================================
# Stage de producción
# =======================================================
FROM node:22-alpine AS production

WORKDIR /usr/src/app

# Instalar tini para gestión correcta de señales
RUN apk add --no-cache tini

# Copiar archivos de dependencias
COPY package-lock.json package.json ./
COPY prisma ./prisma/

# Copiar el script de inicio
COPY Docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Instalar dependencias de producción + herramientas necesarias en runtime:
# - prisma: CLI necesario para ejecutar `prisma migrate deploy` en el entrypoint
# - ts-node + typescript: necesarios para ejecutar seed.ts en el entrypoint
RUN npm install --omit=dev && \
    npm install prisma ts-node typescript && \
    npm cache clean --force

# Copiar el cliente de Prisma generado desde el builder
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Copiar archivos compilados desde el builder
COPY --from=builder /usr/src/app/dist ./dist

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /usr/src/app

USER nestjs

# Cloud Run usa la variable de entorno PORT automáticamente
EXPOSE 8080

# tini como init para manejo correcto de señales POSIX
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["./entrypoint.sh"]
