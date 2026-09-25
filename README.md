# 🏥 citas_medicas — Guía del esqueleto

> **Lee este README completo antes de escribir código (toma ~10 min).**
> Aquí se explica qué ya está hecho, qué falta y cómo trabajar sin romper el proyecto.

> 👥 Este README está escrito pensando en **cualquier persona que se una al equipo**,
> tenga o no experiencia previa. **No asumimos que tengas nada instalado**: en la
> [sección 2](#2-requisitos-instálalos-antes-de-empezar) está cómo instalar cada herramienta
> paso a paso (Windows, macOS y Linux).

Este repositorio es un **esqueleto** (un proyecto base) para construir el sistema de **citas médicas**.
Ya trae la estructura de carpetas, la configuración y un ejemplo funcionando de punta a punta
(la ruta `/api/users`).

 Todo lo demás lo construimos entre todos siguiendo este orden.

Después de leer esto, revisa también la **[Guía de trabajo en equipo](docs/guia-de-trabajo.md)**.

---

## 1. ¿Qué tecnología usamos y para qué?

| Carpeta       | Tecnología                           | ¿Para qué sirve?                                         |
| ------------- | ------------------------------------- | ---------------------------------------------------------- |
| `backend/`  | Node.js + Express (ES Modules)        | Es la**API REST**: recibe peticiones y responde JSON |
| `frontend/` | React 18 + Vite + Tailwind CSS        | Es la**interfaz** que el usuario ve en el navegador  |
| `database/` | PostgreSQL 16 (con Docker) + SQL puro | Guarda los datos: usuarios, médicos, citas…              |
| raíz         | npm workspaces + Turborepo            | Levanta backend y frontend con un solo comando             |

**En palabras simples:**

```
Navegador (frontend) ──pide datos──▶ API (backend) ──consulta──▶ Base de datos
                     ◀──JSON───────              ◀──filas──────
```

El frontend **nunca** habla con la base de datos directamente: siempre pasa por el backend.

---

## 2. Requisitos (instálalos antes de empezar)

> Si ya tienes alguna de estas herramientas, salta un paso.

### a) Node.js y npm (necesarios para backend y frontend)

- Comprueba si ya los tienes:

  ```bash
  node -v   # debe decir v18 o superior (el proyecto se probó con Node 24)
  npm -v    # debe decir 10 o superior
  ```
- Si no los tienes, instálalos:

  - **Windows / macOS**: descarga el instalador **LTS** desde [https://nodejs.org/es/download](https://nodejs.org/es/download) y ejecútalo.
  - **Linux (Ubuntu/Debian)**:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
- Al terminar, vuelve a comprobar con `node -v` y `npm -v`.

### b) Git

- Comprueba si lo tienes: `git --version`.
- Si no lo tienes:
  - **Windows**: [https://git-scm.com/download/win](https://git-scm.com/download/win)
  - **macOS**: `brew install git`
  - **Linux (Ubuntu/Debian)**: `sudo apt-get install -y git`

### c) Base de datos (elige UNA opción)

**Opción A — Docker + Docker Compose (recomendada, no necesitas Postgres instalado):**

- Comprueba: `docker -v` y `docker compose version`.
- Si no lo tienes, instala **Docker Desktop** desde [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
  (incluye Docker Compose). En Linux también puedes usar `sudo apt-get install -y docker.io docker-compose-v2`.

**Opción B — PostgreSQL 16 instalado en el sistema:**

- Comprueba: `psql --version`.
- Si no lo tienes:
  - **Windows**: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
  - **macOS**: `brew install postgresql@16`
  - **Linux (Ubuntu)**: `sudo apt-get install -y postgresql-16 libpq-dev`

### d) Editor (opcional pero recomendado)

- **VS Code** con las extensiones _ESLint_, _Tailwind CSS IntelliSense_ y _Prettier_.

> ✅ Cuando tengas todo instalado y funcionando, continúa con la **[sección 3](#3-instalación-solo-la-primera-vez)**.

---

## 3. Instalación (solo la primera vez)

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd citas_medicas

# 2. Instalar TODAS las dependencias (backend + frontend) desde la raíz
npm install

# 3. Crear los archivos de entorno copiando los ejemplos
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Abrir los .env y completar los datos de la base de datos
#    (con Docker basta: DB_PORT=5432, DB_USER=postgres, DB_PASSWORD=postgres, DB_NAME=citas_medicas)

# 5. Levantar la base de datos (elige UNA opción)
docker-compose up -d          # opción A: con Docker
# opción B: si ya tienes PostgreSQL 16 instalado, mira el apartado siguiente
```

> ⚠️ **Nunca subas los archivos `.env` a GitHub**: contienen contraseñas y ya están en `.gitignore`.
> Lo único que se sube al repo son los `.env.example`.

### Opción B: usar el PostgreSQL del sistema (sin Docker)

Si ya tienes PostgreSQL 16 instalado y corriendo, **no necesitas Docker**. Comprueba que responde y crea la base de datos:

```bash
# 1. ¿El servidor responde? Debe decir "accepting connections"
pg_isready -h 127.0.0.1 -p 5432

# 2. Crear la base de datos (te pedirá tu contraseña de administrador)
sudo -u postgres createdb citas_medicas

# 3. Si tu usuario "postgres" NO tiene la contraseña "postgres",
#    escribe la tuya en DB_PASSWORD dentro de .env y backend/.env
```

> ⚠️ En Docker la contraseña por defecto es `postgres`; en una instalación local es la que tú definiste.
> **Los `.env` deben reflejar cuál usas**, porque de eso depende que la API se conecte correctamente.
> Para ejecutar las migraciones usa `psql -U postgres -d citas_medicas -f database/migrations/001_....sql`
> (con Docker sería `docker exec -i citas_medicas_postgres_db psql -U postgres -d citas_medicas < archivo.sql`).

---

## 4. Cómo encender el proyecto

Todos los comandos se ejecutan **desde la raíz del proyecto**:

| Comando                  | Qué hace                                                     |
| ------------------------ | ------------------------------------------------------------- |
| `npm run dev`          | Enciende backend**y** frontend a la vez (lo habitual)   |
| `npm run dev:backend`  | Solo la API → http://localhost:4000                          |
| `npm run dev:frontend` | Solo la interfaz → http://localhost:5173                     |
| `npm run lint`         | Revisa el estilo del código de ambos proyectos               |
| `npm run test`         | Corre las pruebas (Jest en backend, Vitest en frontend)       |
| `npm run build`        | Compila el frontend para producción                          |
| `docker-compose up -d` | Levanta PostgreSQL 16 en el puerto 5432                       |
| `docker-compose down`  | Apaga la base de datos (los datos se conservan en un volumen) |

**Prueba rápida de que todo funciona:** abre http://localhost:4000/health y debe responder:

```json
{ "status": "ok", "timestamp": "2025-01-01T00:00:00.000Z" }
```

Y en http://localhost:4000/api/users debe responder `{ "message": "Listar usuarios" }`.

> ✅ **Todo lo de esta sección está verificado en el repositorio:** `npm run dev`, `npm run lint`,
> `npm run test` (3 pruebas en el backend con Jest + 1 en el frontend con Vitest) y `npm run build`
> pasan sin errores. Las pruebas de ejemplo están en `backend/src/__tests__/health.test.js` y
> `frontend/src/pages/Home.test.jsx`.
>
> ⚠️ Al correr las pruebas del backend verás `ExperimentalWarning: VM Modules`: es normal, es el aviso
> de Node por usar ESM dentro de Jest (el flag ya está incluido en el script `test`).

---

## 5. Mapa del proyecto: ¿dónde va cada cosa?

Leyenda: ✅ = ya está hecho y funciona · ⬜ = **archivo vacío, te toca llenarlo**

```
citas_medicas/
├── backend/
│   ├── package.json            ✅ Scripts (dev, test, lint) y dependencias
│   ├── .env.example            ✅ Plantilla del .env (copia a backend/.env)
│   ├── .eslintrc.json          ✅ Configuración de ESLint
│   ├── tests/                  ⬜ Carpeta alternativa para pruebas (sin usar)
│   └── src/
│       ├── index.js            ✅ Solo arranca el servidor (lee PORT y escucha)
│       ├── app.js              ✅ Crea la app Express (se importa desde las pruebas)
│       ├── __tests__/          ✅ Pruebas con Jest (health.test.js de ejemplo)
│       ├── routes/index.js     ✅ Agrupa todas las rutas bajo /api
│       ├── routes/users.js     ✅ Ejemplo: GET/POST/PUT/DELETE de /api/users
│       ├── controllers/        ✅ userController.js de ejemplo  (⬜ crea más aquí)
│       ├── services/           ⬜ Lógica del negocio (reglas, validaciones, cálculos)
│       ├── models/             ⬜ Consultas a la base de datos (User.js, Post.js vacíos)
│       ├── middleware/         ⬜ auth.js, validation.js, errorHandler.js vacíos
│       ├── config/             ⬜ index.js (variables), db.js (conexión pg), logger.js
│       └── utils/              ⬜ logger.js, validators.js (ayudas reutilizables)
├── frontend/
│   ├── index.html              ✅ HTML que carga main.jsx
│   ├── vite.config.js          ✅ Servidor de desarrollo (puerto 5173)
│   ├── tailwind.config.js      ✅ Archivos que procesa Tailwind
│   ├── postcss.config.js       ✅ Conecta Tailwind con el CSS
│   ├── vitest.config.js        ✅ Pruebas (entorno jsdom)
│   ├── .eslintrc.json          ✅ Configuración de ESLint
│   ├── public/                 ✅ Archivos estáticos (con .gitkeep)
│   └── src/
│       ├── main.jsx            ✅ Punto de entrada de React + BrowserRouter
│       ├── App.jsx             ✅ Aquí se declaran las rutas (react-router)
│       ├── assets/             ⬜ logo.svg, placeholder.png (con .gitkeep)
│       ├── pages/Home.jsx      ✅ Página de ejemplo con Tailwind (+ Home.test.jsx)
│       ├── components/         ⬜ Button.jsx, Card.jsx, Layout.jsx (interfaz reutilizable)
│       ├── hooks/              ⬜ useApi.js, useAuth.js, useLocalStorage.js
│       ├── services/           ⬜ api.js (axios) y authService.js
│       ├── store/              ⬜ Estado global (usuario logueado, etc.)
│       ├── utils/              ⬜ formatters.js (fechas) y validators.js (email, cédula)
│       └── styles/index.css    ✅ Tailwind ya configurado
├── database/
│   ├── config.js               ✅ Conexión por ambiente (dev/test/prod)
│   ├── migrations/             ⬜ 001_create_users_table.sql, 002_create_posts_table.sql
│   └── seeds/                  ⬜ Datos de prueba (usuarios, posts, etc.)
├── docs/
│   ├── api.md                  ✅ Endpoints con su estado (✅ implementado / ⬜ pendiente)
│   └── guia-de-trabajo.md      ✅ Convenciones, Git y orden de trabajo
├── docker-compose.yml          ✅ PostgreSQL 16 listo para usar
└── turbo.json                  ✅ Tareas build / dev / lint / test
```

> 📁 Las carpetas `backend/tests/` y `frontend/public/` venían **vacías** en el esqueleto. Git no guarda
> carpetas vacías, por eso llevan un archivo `.gitkeep` (igual que `database/migrations/`). Para las
> pruebas, la convención del proyecto es `backend/src/__tests__/`: no mezcles las dos ubicaciones.

**Regla de oro:** cada capa tiene UNA responsabilidad. Si tu archivo hace de todo, está mal ubicado.

---

## 6. ¿Cómo funciona una petición de punta a punta?

Ejemplo real: el frontend pide la lista de usuarios al backend.

```
GET http://localhost:4000/api/users
   │
   ├─ 1. backend/src/index.js      → "todo lo que empiece con /api lo manejan mis rutas"
   ├─ 2. routes/index.js           → "la URL empieza con /users, se la paso a users.js"
   ├─ 3. routes/users.js           → "es un GET a '/', ejecuto el controlador getAll"
   ├─ 4. controller (getAll)       → "consulto los datos y respondo JSON"
   └─ 5. middleware                 → corre ANTES: revisa el token, valida datos, captura errores
```

Y del lado del navegador:

```js
// frontend/src/services/api.js  (a implementar)
const { data } = await api.get("/users"); // axios le pega a VITE_API_URL
// data = { message: "Listar usuarios" }
```

### ¿Quién hace qué en el backend?

| Capa        | Archivo              | Su única responsabilidad                        | ❌ Nunca debe              |
| ----------- | -------------------- | ------------------------------------------------ | -------------------------- |
| Rutas       | `routes/*.js`      | Definir la URL y el método HTTP                 | Tener lógica de negocio   |
| Controlador | `controllers/*.js` | Leer`req`, llamar al servicio y responder      | Escribir SQL               |
| Servicio    | `services/*.js`    | Reglas del negocio (validar, calcular, decidir)  | Conocer`req`/`res`     |
| Modelo      | `models/*.js`      | Escribir y ejecutar las consultas SQL            | Decidir reglas del negocio |
| Middleware  | `middleware/*.js`  | Cosas que ocurren antes/después (auth, errores) | Responder cosas de negocio |

### ¿Y quién hace qué en el frontend?

| Capa       | Carpeta         | Su única responsabilidad                               |
| ---------- | --------------- | ------------------------------------------------------- |
| Página    | `pages/`      | Armar una pantalla completa y mezclar componentes       |
| Componente | `components/` | Ser reutilizable y recibir datos por`props`           |
| Hook       | `hooks/`      | Lógica de React reutilizable (`useApi`, `useAuth`) |
| Servicio   | `services/`   | Hablar con la API con axios                             |
| Store      | `store/`      | Estado compartido entre pantallas (usuario logueado)    |
| Utilidad   | `utils/`      | Funciones puras: formatear fecha, validar email         |

> **Truco para no perderse:** si tu código responde "¿de dónde vienen los datos?" es un servicio o un modelo;
> si responde "¿qué se muestra?" es un componente o una página.

---

## 7.  Crear un módulo nuevo (paso a paso)

Vamos a crear el módulo `appointments` (citas) copiando el patrón que ya existe en `users`.
**Respeta este orden: cada paso usa lo del paso anterior.**

**Paso 1 · La tabla (SQL)** → `database/migrations/003_create_appointments_table.sql`

```sql
CREATE TABLE IF NOT EXISTS appointments (
  id           SERIAL PRIMARY KEY,
  patient_id   INTEGER NOT NULL REFERENCES users(id),
  doctor_id    INTEGER NOT NULL REFERENCES users(id),
  scheduled_at TIMESTAMP NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  created_at   TIMESTAMP DEFAULT NOW()
);
```

Ejecútala dentro del contenedor:

```bash
docker exec -i citas_medicas_postgres_db \
  psql -U postgres -d citas_medicas < database/migrations/003_create_appointments_table.sql
```

**Paso 2 · El modelo** → `backend/src/models/Appointment.js` (solo SQL, nada de reglas).

**Paso 3 · El servicio** → `backend/src/services/appointmentService.js` (reglas: no permitir dos citas
a la misma hora con el mismo médico, no agendar en el pasado, etc.).

**Paso 4 · El controlador** → `backend/src/controllers/appointmentController.js`:

```js
export const getAll = (req, res) => {
  res.json({ message: "Listar citas" });
};
```

**Paso 5 · El router** → `backend/src/routes/appointments.js`:

```js
import { Router } from "express";
import { getAll } from "../controllers/appointmentController.js";

const router = Router();
router.get("/", getAll);
router.post("/", create);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
```

**Paso 6 · Registrarlo** → agrega dos líneas en `backend/src/routes/index.js`:

```js
import appointmentRoutes from "./appointments.js";
router.use("/appointments", appointmentRoutes);
```

**Paso 7 · Probarlo** con el servidor encendido (`npm run dev`):

```bash
curl http://localhost:4000/api/appointments
curl -X POST http://localhost:4000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"patient_id":1,"doctor_id":2,"scheduled_at":"2025-06-01T10:00:00"}'
```

**Paso 8 · Conectarlo al frontend** → `frontend/src/services/api.js` (axios) + una página en `pages/`

+ su `<Route>` en `App.jsx`.

**Paso 9 · Documentarlo** → añade la fila del endpoint en `docs/api.md` con su estado.

**Paso 10 · Escribir la prueba** → crea `backend/src/__tests__/appointments.test.js` importando `app`
(no `index.js`) y levanta la API en un puerto libre:

```js
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import app from "../app.js";

let server;
beforeAll(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
});
afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe("GET /api/appointments", () => {
  it("responde 200", async () => {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/appointments`);
    expect(response.status).toBe(200);
  });
});
```

> 📌 Si tu ruta responde `404`, el 90 % de las veces olvidaste el **Paso 6** (registrarla en `routes/index.js`).

---

## 8. Dependencias: qué ya está instalado

El esqueleto ya trae **todo lo necesario**, incluidas las librerías de base de datos y de autenticación
(instaladas y comprobadas):

| Ya instalado (backend)                                    | Para qué sirve                                  |
| --------------------------------------------------------- | ------------------------------------------------ |
| `express`, `cors`, `helmet`, `morgan`, `dotenv` | Servidor, seguridad, logs y variables de entorno |
| `pg`                                                    | Conectar con PostgreSQL                          |
| `bcrypt`                                                | Cifrar las contraseñas                          |
| `jsonwebtoken`                                          | Firmar y verificar los tokens JWT                |
| `nodemon`, `jest`, `eslint`                         | Recarga en caliente, pruebas y lint              |

Frontend: React, react-router-dom, axios, Vite, Tailwind, Vitest, `@testing-library/react` y ESLint.

Si más adelante necesitas algo extra, instálalo **dentro del workspace** (nunca en la raíz):

```bash
cd backend && npm install express-validator              # opcional: validar los datos de entrada
cd frontend && npm install @reduxjs/toolkit react-redux  # opcional: si usan Redux para el estado global
```

Recuerda ejecutar `npm install` **en la raíz** después de cambiar dependencias, y **sube también el
`package-lock.json`** en tu commit (está versionado a propósito): así todos los integrantes instalan
exactamente las mismas versiones.

---

## 9. ¿Qué falta por hacer? (checklist del equipo)

Marca las casillas en los **Issues / Projects de GitHub** a medida que avanzas.
El orden sugerido está explicado en [`docs/guia-de-trabajo.md`](docs/guia-de-trabajo.md#4-en-qué-orden-construimos-el-sistema).

- [ ] **Base de datos**: escribir las migraciones en `database/migrations/` (usuarios, médicos, especialidades, citas) y los datos de prueba en `database/seeds/`.
- [ ] **Conexión**: implementar `backend/src/config/db.js` con `pg` y `backend/src/config/index.js`.
- [ ] **Modelos**: `models/User.js` y `models/Appointment.js` (solo consultas SQL).
- [ ] **Servicios**: `services/authService.js` (hash + JWT) y los servicios del negocio.
- [ ] **Middlewares**: `middleware/auth.js`, `validation.js` y `errorHandler.js`.
- [ ] **Rutas**: `routes/auth.js` y `routes/appointments.js`, registradas en `routes/index.js`.
- [ ] **Frontend base**: `services/api.js` (axios + `baseURL` + interceptor de token).
- [ ] **Frontend estado**: `hooks/useAuth.js`, `hooks/useApi.js` y `store/` del usuario logueado.
- [ ] **Frontend UI**: `components/Button.jsx`, `Card.jsx`, `Layout.jsx` y las pantallas (login, registro, agenda).
- [ ] **Documentación**: actualizar `docs/api.md` con cada endpoint nuevo.
- [ ] **Calidad**: escribir pruebas de cada módulo nuevo (`npm run test` y `npm run lint` **ya están configurados** y deben seguir pasando).

> 🗑️ Nota: `Post.js` / `002_create_posts_table.sql` / `seed_posts.sql` son **ejemplos genéricos** del
> esqueleto. Cuando ya no los necesites, bórralos o reemplázalos por las tablas reales del sistema.

---

## 10. Errores comunes

| Síntoma                                  | Causa probable                               | Solución                                                   |
| ----------------------------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| `Cannot find module '.../routes/index'` | Falta la extensión`.js` en un import      | Escríbela:`"./routes/index.js"`                          |
| `EADDRINUSE ... :::4000`                | Ya hay algo corriendo en ese puerto          | Cierra el otro proceso o cambia`PORT` en `backend/.env` |
| `ECONNREFUSED 127.0.0.1:5432`           | Postgres apagado                             | `docker-compose up -d` y revisa con `docker ps`         |
| La ruta nueva responde`404`             | No la registraste en`routes/index.js`      | Revisa el Paso 6 del tutorial                               |
| Error de CORS en el navegador             | El frontend apunta a otra URL                | Verifica`VITE_API_URL` y reinicia Vite                    |
| Tailwind no aplica estilos                | Clase mal escrita o archivo fuera de`src/` | Revisa`frontend/tailwind.config.js`                       |
| Cambios del`.env` ignorados             | Vite solo lee el`.env` al arrancar         | Detén y vuelve a correr`npm run dev`                     |
| `npm run dev` no arranca nada           | Faltan dependencias                          | `npm install` **en la raíz**                       |

---
