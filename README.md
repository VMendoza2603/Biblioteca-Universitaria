# 📚 Sistema de Gestión de Biblioteca Universitaria

Aplicación web moderna para la administración del inventario bibliográfico de una biblioteca universitaria. Desarrollada con **React 19**, **Node.js**, **Express** y **MongoDB Atlas**.

## Características

- **Autenticación JWT**: Registro, inicio de sesión y protección de rutas privadas.
- **Dashboard**: Estadísticas en tiempo real (total de libros, disponibles, categorías, usuarios).
- **CRUD de Libros**: Crear, consultar, editar y eliminar libros con búsqueda, filtros y paginación.
- **CRUD de Categorías**: Administración completa de categorías.
- **Gestión de Usuarios**: Visualización de usuarios registrados.
- **Responsive Design**: Optimizado para 320px a 1440px (Mobile First).
- **Diseño profesional**: Panel administrativo tipo SaaS con CSS puro y variables semánticas.

## Tecnologías

### Frontend
- React 19 + Vite
- React Router DOM v7
- Axios
- Context API
- CSS Custom Properties (Flexbox)

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT + bcrypt
- express-validator

## Estructura del proyecto

```
biblioteca-universitaria/
├── client/                  # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── context/         # Context API (Auth)
│   │   ├── hooks/           # Custom hooks
│   │   ├── layouts/         # Layouts (MainLayout, AuthLayout)
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── routes/          # Configuración de rutas
│   │   ├── services/        # Servicios Axios
│   │   ├── styles/          # CSS modular con variables
│   │   └── utils/           # Utilidades
│   └── ...
├── server/                  # Backend Express
│   ├── config/              # Configuración (DB, entorno)
│   ├── controllers/         # Controladores
│   ├── middlewares/          # Middlewares (auth, validación, errores)
│   ├── models/              # Modelos Mongoose
│   ├── routes/              # Rutas REST
│   ├── services/            # Lógica de negocio
│   ├── utils/               # Utilidades
│   ├── validators/          # Validaciones (express-validator)
│   └── seed.js              # Población de datos iniciales
├── .gitignore
├── postman_collection.json  # Colección Postman
└── README.md
```

## Requisitos previos

- Node.js >= 18
- npm >= 9
- Cuenta en MongoDB Atlas
- (Opcional) Postman para pruebas de API

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/biblioteca-universitaria.git
cd biblioteca-universitaria
```

### 2. Configurar variables de entorno

#### Backend

```bash
cp server/.env.example server/.env
```

Editar `server/.env` con tus credenciales de MongoDB Atlas y JWT.

#### Frontend

```bash
cp client/.env.example client/.env
```

### 3. Instalar dependencias

```bash
cd server && npm install
cd ../client && npm install
```

### 4. Poblar la base de datos (opcional)

```bash
cd server && npm run seed
```

Esto creará:
- Admin: `admin@biblioteca.com` / `admin123`
- User: `user@biblioteca.com` / `user123`
- 7 categorías y 12 libros de ejemplo

## Ejecución

### Backend (puerto 5000)

```bash
cd server
npm run dev
```

### Frontend (puerto 5173)

```bash
cd client
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Variables de entorno

### Backend (`server/.env`)

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (default: 5000) |
| `MONGODB_URI` | URI de conexión a MongoDB Atlas |
| `JWT_SECRET` | Secreto para firmar tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token |
| `FRONTEND_URL` | URL del frontend para CORS |

### Frontend (`client/.env`)

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base de la API (default: http://localhost:5000/api) |

## Licencia

MIT
