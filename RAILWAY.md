# Guía de Despliegue en Railway 🚀

Esta guía detalla paso a paso cómo desplegar este monorepositorio en **Railway**. Al ser un monorepositorio, desplegaremos dos servicios independientes (Frontend y Backend) apuntando al mismo repositorio de GitHub, además de un servicio de base de datos MongoDB.

---

## Paso 1: Crear e Inicializar el Proyecto en Railway

1. Inicia sesión en [Railway.app](https://railway.app).
2. Haz clic en **New Project** (Nuevo proyecto).
3. Selecciona **Provision MongoDB** para crear la base de datos de manera automática dentro de tu proyecto.

---

## Paso 2: Desplegar el Backend (`/backend`)

1. Haz clic en **New** (Nuevo) en el dashboard de tu proyecto y selecciona **GitHub Repo**.
2. Elige este repositorio.
3. Se creará un nuevo servicio. Haz clic sobre él para abrir su panel de configuración.
4. Dirígete a la pestaña **Settings** (Configuración):
   * Ve a la sección **General**.
   * En **Root Directory** (Directorio raíz), escribe: `backend`. Esto le indica a Railway que este servicio debe ejecutarse exclusivamente dentro de la subcarpeta del backend.
5. Dirígete a la pestaña **Variables** (Variables de entorno) y añade las siguientes:
   * `MONGO_URI`: `mongodb://${{MongoDB.MONGO_USER}}:${{MongoDB.MONGO_PASSWORD}}@${{MongoDB.MONGO_HOST}}:${{MongoDB.MONGO_PORT}}/${{MongoDB.MONGO_DATABASE}}?authSource=admin` (o simplemente usa la referencia directa de Railway `${{MongoDB.MONGO_URL}}` si creaste la base de datos en el Paso 1).
   * `JWT_SECRET`: Una clave secreta segura para firmar los tokens JWT (ej. `clave_secreta_super_segura_produccion`).
   * `NODE_ENV`: `production`.
6. Dirígete a la pestaña **Settings** (Configuración) -> **Public Networking** (Redes públicas):
   * Haz clic en **Generate Domain** (Generar dominio) para asignarle una dirección pública.
   * **Copia este dominio generado** (por ejemplo: `https://backend-production-xxxx.up.railway.app`), ya que lo necesitarás en el paso del Frontend.

---

## Paso 3: Desplegar el Frontend (`/frontend`)

1. Haz clic de nuevo en **New** (Nuevo) en el dashboard de tu proyecto y selecciona de nuevo **GitHub Repo**.
2. Vuelve a seleccionar este mismo repositorio.
3. Se creará un segundo servicio. Haz clic sobre él.
4. Dirígete a la pestaña **Settings** (Configuración):
   * Ve a la sección **General**.
   * En **Root Directory** (Directorio raíz), escribe: `frontend`. Esto le indica a Railway que compile y sirva únicamente la subcarpeta del frontend.
5. Dirígete a la pestaña **Variables** (Variables de entorno) y añade la siguiente variable **antes de que comience el despliegue** (es crítica porque se compila en el cliente a nivel de compilación/Vite build):
   * `VITE_API_URL`: Pega el dominio público generado del backend en el Paso 2 (por ejemplo: `https://backend-production-xxxx.up.railway.app`). Asegúrate de que no termine con una barra inclinada `/`.
6. Dirígete a la pestaña **Settings** (Configuración) -> **Public Networking** (Redes públicas):
   * Haz clic en **Generate Domain** (Generar dominio) para crear el dominio público del frontend.

---

## 🛠️ ¿Cómo funciona bajo el capó en Railway?

* **Backend**: Nixpacks (el constructor automático de Railway) detecta que es un proyecto de Node.js, ejecuta `npm install` en la subcarpeta `backend`, compila el código TypeScript con `npm run build` (`tsc`) y finalmente lo levanta en producción con el comando `npm run start` (`node dist/src/main.js`).
* **Frontend**: Nixpacks detecta la configuración, inyecta la variable de entorno `VITE_API_URL` para que Vite la incorpore en el bundle final, ejecuta `npm run build` (`tsc -b && vite build`) y arranca el servidor de vista previa de producción nativo con el comando `npm run start` (`vite preview --port $PORT --host 0.0.0.0`). Este servidor web de producción de Vite se encarga de servir los archivos de la carpeta `dist/` en el puerto asignado y de gestionar las redirecciones de la Single Page Application (SPA) para evitar errores 404 al recargar.
