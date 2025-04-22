#!/bin/sh
echo "Esperando a que la base de datos esté lista..."
while ! pg_isready -h db -p 5432 -U volunchain; do
  sleep 2
done

echo "Aplicando migraciones..."
npx prisma migrate deploy

echo "Iniciando la aplicación..."
npm run start
