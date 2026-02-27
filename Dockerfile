# Multi-stage build para optimizar el tamaño de la imagen
FROM node:24-alpine3.22 AS builder

WORKDIR /usr/src/app

# Copiar archivos de dependencias primero (mejora caché de Docker)
COPY package-lock.json package.json ./
COPY prisma ./prisma/

# Instalar dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar el resto del código
COPY . .

RUN npx prisma generate && npm run build

# Stage de producción
FROM node:24-alpine3.22 AS production

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package-lock.json package.json ./
COPY prisma ./prisma/

COPY Docker/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

# Instalar deps de producción + herramientas necesarias en runtime:
# - prisma: CLI necesario para `prisma migrate deploy` en el entrypoint
# - ts-node + typescript: necesarios para ejecutar seed.ts
RUN npm install --omit=dev && npm install prisma ts-node typescript && \
    npm cache clean --force

# Copiar el cliente de Prisma generado (binario linux-musl) desde el builder
# El builder genera los binarios para linux-musl-openssl-3.0.x requeridos en Alpine
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Instalar Chromium y sus dependencias
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    tini

# Configurar variables de entorno para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copiar archivos compilados desde el builder
COPY --from=builder /usr/src/app/dist ./dist

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /usr/src/app

USER nestjs

# Cloud Run usa la variable de entorno PORT automáticamente
# Tu aplicación ya está configurada para leer process.env.PORT
EXPOSE 8080


# Comando para iniciar la aplicación
# Agregar logs para debugging
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["./entrypoint.sh"]

