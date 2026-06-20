# Proyecto de Gestión de Proyectos y Tareas (Monorepo)

Este es un monorepositorio que contiene la aplicación de **Gestión de Proyectos y Tareas** desarrollada con una arquitectura limpia y modular.

---

## 🛠️ Stack Tecnológico

### Backend (`/backend`)
* **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
* **Base de Datos**: [MongoDB Atlas](https://www.mongodb.com/atlas/database) con **Mongoose** como ORM
* **Seguridad**: Autenticación basada en **JWT** (JSON Web Tokens) y hasheo de contraseñas con **bcrypt**
* **Validación**: Validaciones automáticas en la capa de transporte (DTOs) mediante `class-validator` y `class-transformer`

### Frontend (`/frontend`)
* **Framework / Entorno**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Gestión de Estado**: [Zustand](https://github.com/pmndrs/zustand) (con persistencia local automatizada)
* **Validación de Formularios**: [Zod](https://zod.dev/) para esquemas rigurosos en el cliente
* **Enrutamiento**: [React Router Dom v6](https://reactrouter.com/) con rutas protegidas e interceptores HTTP
* **Estilos**: Vanilla CSS con variables de diseño personalizadas, glassmorphism, modo oscuro por defecto y micro-animaciones interactivas
* **Gráficos**: Gráficos analíticos renderizados mediante SVG interactivo nativo

---

## 📁 Estructura del Monorepo

```
Prueba-tecnica-Moises-Ochoa/
├── package.json              # Configuración del monorepo y scripts concurrentes
├── backend/                  # Proyecto NestJS
│   ├── src/
│   │   ├── auth/             # Módulo de usuarios y JWT Auth
│   │   ├── projects/         # Módulo CRUD de proyectos
│   │   ├── tasks/            # Módulo de gestión de tareas paginadas y filtradas
│   │   └── reports/          # Módulo de analíticas y reportes agregados
│   ├── .env                  # Variables de entorno del backend (MONGO_URI, PORT, etc.)
│   └── package.json          
├── frontend/                 # Proyecto React + Vite
│   ├── src/
│   │   ├── core/             # Código transversal compartible (Zustand store, api Axios, layout)
│   │   ├── modules/          # Módulos de negocio (auth, projects, tasks, reports)
│   │   │   └── [modulo]/
│   │   │       ├── presentation/
│   │   │       │   ├── pages/        # Vistas principales
│   │   │       │   └── components/   # Componentes tontos/desacoplados de UI
│   │   │       └── ...
│   │   ├── App.tsx           # Configuración del enrutamiento y guardias de navegación
│   │   └── main.tsx
│   ├── .env                  # Variables de entorno del frontend (VITE_API_URL, PORT)
│   └── package.json
```

---

## 🚀 Inicialización y Uso Local

### 1. Requisitos Previos
Asegúrate de tener instalados:
* [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
* [NPM](https://www.npmjs.com/) (incluido con Node.js)

### 2. Configurar Variables de Entorno
Copia los archivos `.env.template` y renómbralos a `.env` en sus respectivas carpetas:

* **Para el Backend (`/backend/.env`)**:
  ```env
  PORT=3000
  NODE_ENV=development
  MONGO_URI=mongodb+srv://mois2202:<db_password>@cluster0.0pvnv0j.mongodb.net/project_management?appName=Cluster0
  JWT_SECRET=development_secret_key_change_me
  ```
  *(Reemplaza `<db_password>` por la contraseña correspondiente de la base de datos)*

* **Para el Frontend (`/frontend/.env`)**:
  ```env
  VITE_API_URL=http://localhost:3000
  PORT=5173
  ```

### 3. Levantar Ambos Proyectos a la Vez
Desde la **raíz del monorepositorio**, ejecuta los siguientes comandos:

```bash
# 1. Instalar dependencias en todo el monorepo (raíz, backend y frontend)
npm run install:all

# 2. Levantar el Backend y Frontend de manera concurrente en modo desarrollo
npm run dev
```

El servidor web del frontend iniciará en `http://localhost:5173` y el del backend en `http://localhost:3000`.

---

## 🛡️ Decisiones de Arquitectura y Límites
1. **Inversión de Control**: Los componentes gráficos ubicados en `presentation` son "tontos" y reutilizables. Solo procesan datos recibidos de hooks de `application` y delegan sus interacciones mediante callbacks.
2. **Procesamiento de Reportes**: De acuerdo con las pautas del proyecto, todos los reportes agregados y cálculos de productividad histórica se procesan enteramente en el backend mediante agregaciones de Mongoose, protegiendo al cliente frontend de cálculos pesados de negocio.
3. **Manejo de Sesión**: La sesión se gestiona con persistencia automatizada en `localStorage` mediante Zustand en el frontend y se valida en cada petición de la API mediante cabeceras HTTP Bearer Bearer JWT validados en el backend.