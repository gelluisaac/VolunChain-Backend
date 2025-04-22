# Usa la imagen oficial de Node.js
FROM node:18

# Instala el cliente de PostgreSQL para que pg_isready esté disponible
RUN apt-get update && apt-get install -y postgresql-client

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos de dependencias primero para optimizar la caché
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Copia y da permisos al entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Genera el cliente de Prisma
RUN npx prisma generate

# Expone el puerto 3000
EXPOSE 3000

# Usa el entrypoint en lugar de CMD
ENTRYPOINT ["/app/entrypoint.sh"]
