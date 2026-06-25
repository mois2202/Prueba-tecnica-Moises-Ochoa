# Proyecto de Gestión de Proyectos y Tareas (Monorepo)

Este es un monorepositorio que contiene la aplicación de **Gestión de Proyectos y Tareas** desarrollada con una arquitectura limpia y modular.

---

## 🛠️ Stack Tecnológico

### Backend (`/backend`)
* **Framework**: [Express](https://expressjs.com/) (TypeScript) con arquitectura de rutas y controladores estructurados
* **Base de Datos**: [MongoDB](https://www.mongodb.com/) alojado en **Railway** con **Mongoose** como ORM
* **Seguridad**: Autenticación basada en **JWT** (JSON Web Tokens) y hasheo de contraseñas con **bcrypt** mediante un middleware de autenticación personalizado
* **Validación**: Validaciones de datos de entrada mediante DTOs declarativos (`class-validator` y `class-transformer`) ejecutados en un middleware de validación personalizado

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
├── backend/                  # Proyecto Express + TypeScript (migrado desde NestJS)
│   ├── src/
│   │   ├── auth/             # Módulo de usuarios, JWT Auth, controladores, rutas y modelos
│   │   ├── projects/         # Módulo CRUD de proyectos y gestión de columnas Kanban (controladores, rutas, modelos)
│   │   ├── tasks/            # Módulo de gestión de tareas paginadas, filtros (controladores, rutas, modelos)
│   │   ├── reports/          # Módulo de analíticas y reportes agregados (controladores, rutas)
│   │   ├── middleware/       # Middlewares personalizados (auth, validación con DTOs, control de errores)
│   │   ├── app.ts            # Configuración de Express (CORS, prefijos de API y middlewares globales)
│   │   └── main.ts           # Punto de entrada (conexión Mongoose, bootstrap, inyección de dependencias)
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

### 2. Variables de Entorno (Pre-configuradas)
Los archivos `.env` **ya se encuentran incluidos y configurados en el repositorio** para facilitar una evaluación inmediata y directa. Están listos para conectar el backend con una base de datos MongoDB activa en la nube (Railway).

* **Backend (`/backend/.env`)**:
  ```env
  PORT=3000
  NODE_ENV=development
  MONGO_URI=mongodb://mongo:JybqEyyqGZZKASUMWQhyLIHAnBmVBDhq@acela.proxy.rlwy.net:17613/project_management?authSource=admin
  JWT_SECRET=development_secret_key_change_me
  ```

* **Frontend (`/frontend/.env`)**:
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

## 📋 Funcionalidades Especiales Implementadas

1. **Tablero Kanban con Columnas Dinámicas y Estatus Personalizados**:
   * Permite añadir columnas personalizadas a cada proyecto (guardadas en la base de datos).
   * Arrastrar y soltar (Drag & Drop) interactivo para actualizar de inmediato el estado de la tarea en la base de datos con persistencia optimista.
   * Eliminación de columnas (excepto la columna obligatoria `"sin iniciar"`), moviendo automáticamente las tareas huérfanas de regreso a `"sin iniciar"`.
   * Navegación fluida: acceso directo al tablero haciendo clic en el nombre del proyecto o en el enlace "Administrar proyecto".

2. **Generación y Descarga de Reportes PDF (`@react-pdf/renderer`)**:
   * Módulo de reportes independiente integrado en la barra lateral con descargas directas en el navegador.
   * **Resumen Ejecutivo de Proyectos**: PDF estructurado con métricas de KPIs agregadas de progreso y tablas detalladas por proyecto.
   * **Reporte Detallado de Tareas**: PDF tabulado que agrupa las tareas del espacio de trabajo por su proyecto correspondiente, mostrando fecha de vencimiento, prioridad y estado.

3. **Manejo Global de Expiración de Sesión (401)**:
   * Interceptores Axios globales en el cliente que detectan si la sesión expiró o es inválida, borrando automáticamente el store Zustand y redirigiendo al usuario a la pantalla de login para garantizar la seguridad.


---

## 🛡️ Decisiones de Arquitectura y Límites
1. **Inversión de Control**: Los componentes gráficos ubicados en `presentation` son "tontos" y reutilizables. Solo procesan datos recibidos de hooks de `application` y delegan sus interacciones mediante callbacks.
2. **Procesamiento de Reportes**: De acuerdo con las pautas del proyecto, todos los reportes agregados y cálculos de productividad histórica se procesan enteramente en el backend mediante agregaciones de Mongoose, protegiendo al cliente frontend de cálculos pesados de negocio.
3. **Manejo de Sesión**: La sesión se gestiona con persistencia automatizada en `localStorage` mediante Zustand en el frontend y se valida en cada petición de la API mediante cabeceras HTTP Bearer JWT validados en el backend.

---

## 🏛️ Patrón Arquitectónico Detallado (Clean Architecture + FSD + Atomic Design)

El frontend de esta aplicación fue desarrollado siguiendo un enfoque híbrido que combina la robustez y desacoplamiento de **Clean Architecture** (Puertos y Adaptadores) junto a la modularidad y escalabilidad de **Feature-Sliced Design (FSD)**:

### 1. Desacoplamiento en Capas (Clean Architecture)
Cada módulo de negocio está estrictamente separado en 4 capas de responsabilidad:
* **`domain` (Capa de Dominio)**: Contiene los contratos de validación puros de Zod y los tipos TypeScript que modelan el negocio. Es 100% agnóstica de librerías visuales o HTTP.
* **`adapters` (Capa de Adaptadores)**: Contiene los mappers encargados de normalizar y transformar las respuestas crudas de la base de datos (Backend) hacia los contratos de tipos de dominio del cliente.
* **`application` (Capa de Aplicación)**: Centraliza los Custom Hooks de React y los Stores de Zustand encargados de orquestar la obtención de datos de red, estados reactivos locales y peticiones HTTP.
* **`presentation` (Capa de Presentación)**: Contiene la interfaz de usuario. Al ser componentes presentacionales ("tontos"), no hacen peticiones directas de red ni manipulan lógica de negocio; solo renderizan datos limpios inyectados vía `props` y emiten eventos a través de callbacks.

### 2. Organización por Módulos (FSD)
El código de negocio está agrupado en directorios independientes bajo `/src/modules/`:
* `auth`: Login, registro y control de sesión persistente.
* `projects`: CRUD de proyectos y gestión de estatus.
* `tasks`: Gestión, filtros cruzados y paginación de tareas.
* `kanban`: Tablero Kanban dinámico e interactivo (cruce entre proyectos y tareas).
* `reports`: Métricas analíticas en pantalla y generación de PDF.
* *El código transversal (clientes HTTP, layout base, etc.) se aísla en `/src/core`.*

### 3. Anatomía Visual (Atomic Design)
La capa visual de presentación (`presentation`) estructura sus elementos en niveles incrementales de complejidad:
* **Átomos (`/atoms`)**: Elementos gráficos mínimos e indivisibles (ej. `TaskBadge.tsx`, `TaskCheckbox.tsx`, `ReportCard.tsx`).
* **Moléculas (`/molecules`)**: Elementos interactivos simples combinados (ej. `KanbanTaskCard.tsx`, `TaskFilterSelect.tsx`).
* **Organismos (`/organisms`)**: Estructuras funcionales de negocio complejas (ej. `KanbanColumn.tsx`, `ProjectTable.tsx`, `ProductivityChart.tsx`).
* **Plantillas (`/templates`)**: El wireframe o estructura genérica que define el layout de la pantalla (ej. `DashboardTemplate.tsx`, `TasksTemplate.tsx`).
* **Páginas (`/pages`)**: El punto de entrada que inicializa el hook orquestador de aplicación e inyecta las propiedades a la plantilla.