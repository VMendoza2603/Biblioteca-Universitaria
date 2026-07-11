# Guía de Despliegue

## Backend → Railway

1. Crear cuenta en [Railway](https://railway.app)
2. Conectar repo de GitHub o usar `railway up`
3. Variables de entorno en Railway:
   - `PORT` → 5000 (Railway lo asigna automáticamente)
   - `MONGODB_URI` → URI de MongoDB Atlas
   - `JWT_SECRET` → Secreto seguro
   - `JWT_EXPIRES_IN` → 7d
   - `FRONTEND_URL` → URL de Vercel (ej: https://biblioteca.vercel.app)
4. Railway asigna una URL tipo `https://biblioteca-api.up.railway.app`

## Frontend → Vercel

1. Crear cuenta en [Vercel](https://vercel.com)
2. Conectar repo de GitHub o usar `vercel --prod`
3. Variables de entorno en Vercel:
   - `VITE_API_URL` → URL de Railway + `/api` (ej: https://biblioteca-api.up.railway.app/api)
4. El `vercel.json` ya está configurado para SPA rewrites

## MongoDB Atlas

1. Crear cluster free tier (M0)
2. Network Access → Allow All (0.0.0.0/0) o IP de Railway
3. Database Access → Crear usuario con permisos de lectura/escritura
4. Get connection string → Reemplazar en `MONGODB_URI`
