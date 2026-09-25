# 👥 Guía de trabajo en equipo

Documento complementario al [README](../README.md). Aquí están las **reglas del código**,
el flujo de Git y el orden en que se debe construir el sistema de citas médicas.

---

## 1. Reglas para escribir código

### Backend (Node.js + Express, ES Modules)

1. **Siempre ESM, nunca CommonJS.** Usa `import ... from "..."` y `export`.

   - ✅ `import routes from "./routes/index.js";`
   - ❌ `const routes = require("./routes");`
2. **Escribe siempre la extensión `.js`** en los imports relativos. Sin ella el servidor falla con
   `Cannot find module`.
3. Cuando agregues un módulo nuevo, crea el juego completo y **regístralo en `routes/index.js`**:

   ```js
   import appointmentRoutes from "./appointments.js";
   router.use("/appointments", appointmentRoutes);
   ```
4. **Los controladores no llevan lógica pesada**: reciben `req`, llaman al servicio y responden.
   Si hay error, se lo pasan al middleware con `next(error)`.

   ```js
   export const getAll = async (req, res, next) => {
     try {
       const data = await appointmentService.list();
       res.json({ message: "Citas listadas", data });
     } catch (error) {
       next(error);
     }
   };
   ```
5. Todas las respuestas son **JSON** con la forma `{ message, data }`
   (mira `backend/src/controllers/userController.js`). Para errores: `res.status(400).json({ message })`.
6. Exportaciones: **nombradas** en controladores, servicios, utils y middlewares
   (`export const getAll = ...`); **default** en routers y modelos (`export default router`).
7. Los servicios y modelos se nombran en singular y PascalCase cuando es un modelo (`models/Appointment.js`).

### Frontend (React + Vite + Tailwind)

1. **PascalCase** para componentes y páginas: `Button.jsx`, `Home.jsx`, `AppointmentForm.jsx`.
2. **camelCase con prefijo `use`** para hooks: `useAuth.js`, `useApi.js`.
3. **Una pantalla = un archivo en `pages/`**. Los pedazos reutilizables viven en `components/`.
4. **Toda petición HTTP va en `services/`** con axios. No uses `fetch` suelto dentro de una página.
5. Los estilos son **clases de Tailwind** en `className`. No crees archivos `.css` nuevos:
   lo global vive en `src/styles/index.css`.
6. Registra cada pantalla nueva en `App.jsx`:

   ```jsx
   <Route path="/citas" element={<Appointments />} />
   ```
7. Nombra los eventos `handleLoQueSea` y los props con nombres claros (`onClick`, `label`, `variant`).

### Idioma y nombres

| Qué                                             | Regla               | Ejemplo                                             |
| ------------------------------------------------ | ------------------- | --------------------------------------------------- |
| Identificadores, funciones, tablas y columnas    | **inglés**   | `getAll`, `createAppointment`, `appointments` |
| Mensajes al usuario, comentarios, documentación | **español**  | `"Usuario no encontrado"`, `// valida el rango` |
| Carpetas del backend                             | minúscula y plural | `routes`, `controllers`, `services`           |
| Archivos de componente/página/modelo            | PascalCase          | `Card.jsx`, `User.js`                           |

> Razón: mezclar idiomas en el código confunde y rompe la convención que ya trae el esqueleto.

---

## 2. Variables de entorno

| Archivo           | Variable                                                            | Ejemplo                                       | Para qué sirve                           |
| ----------------- | ------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------- |
| `.env` (raíz)  | `DB_PORT`                                                         | `5432`                                      | Puerto que publica`docker-compose.yml`  |
| `.env` (raíz)  | `DB_NAME`, `DB_USER`, `DB_PASSWORD`                           | `citas_medicas`, `postgres`, `postgres` | Credenciales del contenedor de Postgres   |
| `backend/.env`  | `PORT`                                                            | `4000`                                      | Puerto de la API                          |
| `backend/.env`  | `NODE_ENV`                                                        | `development`                               | Ambiente de ejecución                    |
| `backend/.env`  | `JWT_SECRET`                                                      | cadena larga y secreta                        | Firmar los tokens al implementar el login |
| `backend/.env`  | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | —                                            | Conexión de la API con Postgres          |
| `frontend/.env` | `VITE_API_URL`                                                    | `http://localhost:4000/api`                 | Base de axios (`baseURL`)               |
| `frontend/.env` | `VITE_APP_NAME`                                                   | `citas_medicas`                             | Nombre visible de la aplicación          |

**Reglas:**

1. Nunca subas un `.env` al repositorio: están en `.gitignore` por seguridad.
2. Si agregas una variable nueva, **cópiala también al `.env.example`** correspondiente.
3. Vite solo lee el `.env` al arrancar: si lo cambias, reinicia `npm run dev`.

---

## 3. Flujo de trabajo con Git

```bash
# 1. Antes de empezar cualquier tarea, actualiza tu copia
git checkout main
git pull origin main

# 2. Crea una rama con el nombre de tu tarea (nunca trabajes sobre main)
git checkout -b feature/modulo-citas

# 3. Guarda cambios pequeños y frecuentes
git add .
git commit -m "feat(citas): agrega endpoint para listar citas"

# 4. Sube tu rama
git push -u origin feature/modulo-citas

# 5. Abre un Pull Request en GitHub hacia main y pide revisión a un compañero
```

### Nombres de rama

| Prefijo      | Cuándo se usa                | Ejemplo                       |
| ------------ | ----------------------------- | ----------------------------- |
| `feature/` | Funcionalidad nueva           | `feature/login-jwt`         |
| `fix/`     | Corrección de un error       | `fix/validacion-fechas`     |
| `docs/`    | Solo documentación           | `docs/actualizar-api`       |
| `chore/`   | Configuración o dependencias | `chore/configurar-postgres` |

### Mensajes de commit (Conventional Commits)

`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:` + descripción en minúscula e imperativo.

- ✅ `feat(auth): agrega registro de pacientes`
- ❌ `cambios`, `arreglado`, `asdf`

### Reglas de oro del repositorio

1. **Nadie hace `push` directo a `main`.** Todo entra por Pull Request revisado.
2. No fuerces el subir archivos ignorados (`git add -f` está prohibido para `.env`, `node_modules/`, `dist/`, `.turbo/`).
3. Un PR por tarea y pequeño. Si tocaste 30 archivos, probablemente hiciste dos tareas juntas.
4. Antes de pedir revisión, en tu máquina deben pasar `npm run lint` y `npm run test`.
5. Si hay conflictos, resuélvelos en tu rama con `git pull origin main` y luego `git push`.
6. Los `package-lock.json` están ignorados en este repo: no los agregues manualmente.

---

## 4. ¿En qué orden construimos el sistema?

Cada paso necesita al anterior. No empieces por el paso 7 sin tener listo el 1.

| #  | Paso                           | Archivos                                                       | Dependencias a instalar          |
| -- | ------------------------------ | -------------------------------------------------------------- | -------------------------------- |
| 1  | Migraciones SQL de las tablas  | `database/migrations/*.sql`                                  | —                               |
| 2  | Datos de prueba                | `database/seeds/*.sql`                                       | —                               |
| 3  | Conexión a Postgres           | `backend/src/config/db.js`, `config/index.js`              | `pg`                           |
| 4  | Modelos (solo SQL)             | `backend/src/models/*.js`                                    | —                               |
| 5  | Servicios (reglas del negocio) | `backend/src/services/*.js`                                  | `bcrypt`, `jsonwebtoken`     |
| 6  | Middlewares                    | `middleware/auth.js`, `validation.js`, `errorHandler.js` | —                               |
| 7  | Controladores y rutas          | `controllers/`, `routes/`                                  | —                               |
| 8  | Servicio HTTP del frontend     | `frontend/src/services/api.js`, `authService.js`           | —                               |
| 9  | Hooks y estado global          | `frontend/src/hooks/`, `frontend/src/store/`               | —                               |
| 10 | Componentes y páginas         | `frontend/src/components/`, `pages/`                       | —                               |
| 11 | Pruebas y documentación       | `**/*.test.js`, `docs/api.md`                              | `jest`, `vitest` (ya vienen) |

### Módulos sugeridos del dominio

| Módulo          | Prefijo de ruta       | Qué resuelve                                  |
| ---------------- | --------------------- | ---------------------------------------------- |
| `auth`         | `/api/auth`         | Registro e inicio de sesión con JWT y roles   |
| `users`        | `/api/users`        | Pacientes, médicos y administradores          |
| `specialties`  | `/api/specialties`  | Especialidades médicas                        |
| `schedules`    | `/api/schedules`    | Horarios disponibles de cada médico           |
| `appointments` | `/api/appointments` | Crear, consultar, cancelar y reprogramar citas |

### Cómo repartir el trabajo entre 2–4 personas

1. **Base de datos + backend de `auth`/`users`** (una persona).
2. **Backend de `appointments`/`schedules`** (otra persona), usando la misma estructura del paso 1.
3. **Frontend: servicios, hooks y store** (una persona).
4. **Frontend: componentes y pantallas** (otra persona).

Acuerden **primero el contrato de la API** (URLs y forma del JSON) y escríbanlo en `docs/api.md`
antes de programar: así el frontend y el backend avanzan en paralelo sin bloquearse.

---

## 5. Definición de "terminado"

Una tarea está terminada solo si:

- [ ] Corre sin errores con `npm run dev`.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npm run test` pasa y agregaste pruebas de lo nuevo si aplica.
- [ ] Las respuestas de la API respetan el formato `{ message, data }`.
- [ ] `docs/api.md` refleja los endpoints nuevos o modificados.
- [ ] El `.env.example` incluye las variables nuevas.
- [ ] El código tiene identificadores en inglés y mensajes al usuario en español.
- [ ] El PR tiene al menos una revisión aprobada de otro integrante.

---

## 6. Problemas comunes

| Síntoma                                       | Causa probable                               | Solución                                                   |
| ---------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| `Cannot find module '/src/routes/index'`     | Falta la extensión`.js` en el import      | Escríbela:`"./routes/index.js"`                          |
| `EADDRINUSE: address already in use :::4000` | Otro proceso usa el puerto                   | Ciérralo o cambia`PORT` en `backend/.env`              |
| `ECONNREFUSED 127.0.0.1:5432`                | Postgres no está levantado                  | `docker-compose up -d` y verifica con `docker ps`       |
| Nueva ruta responde`404`                     | No se registró en`routes/index.js`        | Agrega`router.use("/modulo", moduloRoutes)`               |
| CORS bloqueado                                 | El frontend apunta a otra URL                | Revisa`VITE_API_URL` en `frontend/.env` y reinicia Vite |
| Los estilos Tailwind no se ven                 | Archivo fuera de`src/` o clase mal escrita | Revisa`frontend/tailwind.config.js`                       |
| Los cambios de`.env` no aplican              | Vite solo lo lee al arrancar                 | Detén y vuelve a correr`npm run dev`                     |
| `npm run dev` no hace nada                   | Faltan dependencias                          | `npm install` en la raíz                                 |

---

## 7. Estado actual del esqueleto y pendientes

Todos deben conocer qué funciona hoy y qué falta, para no perder tiempo depurando cosas que aún no existen.

| Comando / ruta           | Estado      | Detalle                                                                       |
| ------------------------ | ----------- | ----------------------------------------------------------------------------- |
| `npm run dev:backend`  | ✅ Funciona | Imprime`🚀 Server running on http://localhost:4000`                         |
| `GET /health`          | ✅ Funciona | `{"status":"ok","timestamp":"..."}`                                         |
| `GET /api/users`       | ✅ Funciona | `{"message":"Listar usuarios"}`                                             |
| `GET /api/users/:id`   | ✅ Funciona | `{"message":"Usuario 7"}`                                                   |
| `npm run dev:frontend` | ✅ Funciona | Vite sirve en`http://localhost:5173`                                        |
| `npm run lint`         | ⚠️ Falla  | `ESLint couldn't find a configuration file` (falta crear la configuración) |
| `npm run test`         | ⚠️ Falla  | Jest:`No tests found`; Vitest termina con código 1 (aún no hay pruebas)   |

### Cómo dejar `npm run lint` funcionando

Crea el archivo `backend/.eslintrc.json` (verificado: el código actual pasa sin errores):

```json
{
  "root": true,
  "env": { "node": true, "es2022": true },
  "parserOptions": { "ecmaVersion": "latest", "sourceType": "module" },
  "extends": ["eslint:recommended"],
  "rules": {}
}
```

Para el frontend, primero instala el plugin de React y luego crea `frontend/.eslintrc.json`:

```bash
cd frontend && npm install -D eslint-plugin-react
```

```json
{
  "root": true,
  "env": { "browser": true, "es2022": true },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": { "jsx": true }
  },
  "plugins": ["react"],
  "extends": ["eslint:recommended"],
  "rules": { "react/jsx-uses-vars": "error", "react/jsx-uses-react": "error" }
}
```

Sin el plugin de React, ESLint marca como "no usadas" las variables que solo se usan dentro del JSX
(`React`, `Routes`, `Route`, `Home`), y el lint falla aunque el código esté correcto.

### Cómo dejar `npm run test` funcionando

Mientras no existan pruebas, ambos runners salen con error. Dos opciones:

1. **Recomendada:** escribir la primera prueba. Backend con Jest
   (`backend/src/__tests__/health.test.js`) y frontend con Vitest
   (`frontend/src/components/Button.test.jsx`).
2. **Temporal:** agregar `--passWithNoTests` al script `test` de cada workspace mientras el equipo arranca.

---

## 8. Documentación relacionada

- [`README.md`](../README.md) — instalación y explicación general del esqueleto.
- [`docs/api.md`](api.md) — endpoints disponibles (mantenerlo actualizado).
- [`docker-compose.yml`](../docker-compose.yml) — PostgreSQL 16.
- [`turbo.json`](../turbo.json) — tareas del monorepo.
