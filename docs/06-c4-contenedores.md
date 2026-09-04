# C4 — Nivel Contenedores: CookSmart

## 1. Propósito

Esta vista representa la arquitectura de CookSmart a nivel de contenedores,
mostrando las principales partes del sistema, sus responsabilidades,
tecnologías y relaciones.

La vista se construye a partir de la implementación actualmente disponible
en el repositorio (commit `846dacb`, rama `main`).

> **Nota de auditoría (Módulo 3):** la versión anterior de este documento
> describía a CookSmart como una aplicación puramente estática (HTML/CSS/JS +
> Firebase), con un catálogo `RECETAS_DB` embebido en `recetas-db.js` y sin
> backend propio. Esa descripción corresponde al estado del repositorio antes
> del 28 de agosto de 2026 en la tarde. Desde entonces existe una API propia
> con PostgreSQL, documentada aquí. Ver sección 9 para el detalle de la
> corrección y sección 10 para un hallazgo pendiente (migración incompleta).

## 2. Arquitectura actual

CookSmart está compuesto hoy por tres contenedores principales:

1. **CookSmart Web**: HTML, CSS y JavaScript que se ejecutan en el navegador.
2. **CookSmart API**: servicio Node.js/Express, organizado en capas
   (rutas → controladores → servicios → repositorios), que expone recetas,
   catálogos, usuarios, inventario, historial y favoritos.
3. **PostgreSQL**: base de datos relacional propia del proyecto.

Adicionalmente, la aplicación sigue usando Firebase para:

* autenticación de usuarios desde el navegador;
* gestión del estado de sesión en el cliente;
* persistencia y sincronización de favoritos vía Firebase Realtime Database.

La **CookSmart API** también verifica el token de identidad de Firebase para
las rutas bajo `/api/me/*`, y adicionalmente ofrece su propio mecanismo de
autenticación por JWT (`/api/auth/registro`, `/api/auth/login`) para las
rutas bajo `/api/usuarios/:idUsuario/*`. Es decir, conviven dos mecanismos de
autenticación hacia el backend (ver sección 4.3).

## 3. Diagrama C4 de Contenedores

```text
                                   ┌──────────────────┐
                                   │      Usuario      │
                                   └────────┬──────────┘
                                            │ Navegador web
                                            ▼
                          ┌──────────────────────────────┐
                          │        CookSmart Web         │
                          │   HTML + CSS + JavaScript     │
                          │  Interfaz y lógica de cliente │
                          └───────┬───────────┬──────────┘
                                  │           │
                     recetas-loader.js /      │  firebase-sync.js
                     fetch a la API           │  (favoritos, sesión)
                                  │           │
                                  ▼           ▼
                  ┌───────────────────┐   ┌───────────────────────────┐
                  │   CookSmart API   │   │ Firebase Authentication + │
                  │  Node.js/Express  │──▶│    Firebase Realtime DB   │
                  │  (JWT + verif.    │   └───────────────────────────┘
                  │   Firebase token) │
                  └─────────┬─────────┘
                            │ SQL (pg)
                            ▼
                  ┌───────────────────┐
                  │    PostgreSQL     │
                  │  (docker-compose) │
                  └───────────────────┘
```

## 4. Contenedores

### 4.1 CookSmart Web

**Tecnología:** HTML, CSS y JavaScript.

**Responsabilidad:**

Es la aplicación web con la que interactúa directamente el usuario. Contiene
las páginas y la lógica necesaria para consultar recetas, aplicar filtros,
gestionar Mi Nevera, visualizar favoritos, consultar el perfil y realizar
autenticación.

**Archivos principales:**

* `index.html`, `recetas.html`, `desayunos.html`, `almuerzos.html`,
  `cenas.html`, `vegetariano.html`, `rapido.html`, `mi-nevera.html`,
  `favoritos.html`, `perfil.html`, `receta-detalle.html`, `login.html`,
  `registro.html`.

---

### 4.2 CookSmart API

**Tecnología:** Node.js, Express, `pg` (driver de PostgreSQL), `jsonwebtoken`,
`bcryptjs`, `firebase-admin`.

**Ubicación:** `Docker/Postgre/backend/src`.

**Responsabilidad:**

Expone los datos y operaciones de CookSmart mediante una API HTTP, organizada
en capas:

* `routes/` — definición de endpoints.
* `controllers/` — manejo de la petición/respuesta HTTP.
* `services/` — lógica de negocio.
* `repositories/` — acceso a datos (consultas SQL sobre PostgreSQL).

**Endpoints principales identificados:**

| Ruta | Archivo | Autenticación |
|---|---|---|
| `GET /api/recetas`, `GET /api/recetas/:id` | `routes/recetas.routes.js` | Ninguna |
| `GET /api/categorias-receta`, `/tipos-cocina`, `/categorias-ingrediente`, `/ingredientes` | `routes/catalogos.routes.js` | Ninguna |
| `POST /api/auth/registro`, `POST /api/auth/login`, `GET /api/auth/me` | `routes/auth.routes.js` | JWT propio |
| `GET/POST/DELETE /api/usuarios/:idUsuario/inventario`, `/historial`, `/favoritos` | `routes/usuarios.routes.js` | JWT propio (`requireAuth` + `soloElMismoUsuario`) |
| `GET/POST/DELETE /api/me/inventario`, `/historial`, `/favoritos` | `routes/me.routes.js` | Token de Firebase (`requireFirebaseAuth`) |
| `GET /health` | `server.js` | Ninguna (verifica proceso + conexión a Postgres) |

**Nota sobre autenticación:** el middleware `firebaseAuthMiddleware.js`
aprovisiona automáticamente ("just-in-time") en PostgreSQL al usuario que se
autenticó por primera vez con Firebase, para no duplicar el registro entre
los dos sistemas.

---

### 4.3 PostgreSQL

**Tecnología:** PostgreSQL 16 (imagen `postgres:16-alpine`), orquestado con
Docker Compose.

**Ubicación:** `Docker/Postgre/docker-compose.yml`,
`Docker/Postgre/init/01_schema.sql`, `Docker/Postgre/init/02_seed.sql`.

**Responsabilidad:**

Persistir de forma relacional los datos del sistema: usuarios, recetas,
ingredientes, categorías, inventario del usuario, historial de recetas
preparadas y favoritos.

**Tablas principales (evidencia en `01_schema.sql`):** `usuario`, `receta`,
`ingrediente`, `categoria_receta`, `categoria_ingrediente`, `tipo_cocina`,
`inventario_usuario`, `historial_receta`, `favorito`, `etiqueta`,
`restriccion`, y sus tablas de relación (`receta_ingrediente`,
`receta_etiqueta`, `receta_restriccion`).

---

### 4.4 Firebase Authentication

**Tecnología:** Firebase Authentication.

**Responsabilidad:**

Gestiona la autenticación de los usuarios desde el navegador: registro,
inicio de sesión por correo/contraseña, inicio de sesión con Google,
recuperación de contraseña, consulta del estado de autenticación y cierre de
sesión.

**Evidencia en el código:** `firebase-sync.js` (`firebase.auth()`,
`onAuthStateChanged(...)`), y `Docker/Postgre/backend/src/middlewares/firebaseAuthMiddleware.js`
(verifica el ID token con `admin.auth().verifyIdToken(idToken)`).

---

### 4.5 Firebase Realtime Database

**Tecnología:** Firebase Realtime Database.

**Responsabilidad:**

Proporciona persistencia remota para los favoritos del usuario, sincronizados
desde el cliente.

**Evidencia en el código:** `firebase-sync.js`
(`fbDB.ref('usuarios/' + uid + '/favoritos')`).

---

## 5. Relaciones

### Usuario → CookSmart Web
El usuario accede a CookSmart mediante un navegador web e interactúa con las
diferentes páginas de la aplicación.

### CookSmart Web → CookSmart API
`recetas-loader.js` consulta `GET /api/recetas` para poblar `window.RECETAS_DB`
en tiempo de carga.

### CookSmart API → PostgreSQL
La capa de repositorios (`src/repositories/*.js`) ejecuta consultas SQL sobre
PostgreSQL mediante el pool definido en `src/config/db.js`.

### CookSmart API → Firebase Authentication
Las rutas bajo `/api/me/*` verifican el token de identidad de Firebase antes
de atender la petición.

### CookSmart Web → Firebase Authentication
Las páginas de autenticación utilizan Firebase Authentication para registrar
usuarios, iniciar sesión, iniciar sesión con Google, recuperar contraseñas y
gestionar el estado de sesión.

### CookSmart Web → Firebase Realtime Database
La aplicación utiliza Firebase Realtime Database para almacenar y recuperar
los favoritos asociados a los usuarios autenticados por Firebase.

---

## 6. Trazabilidad C4 ↔ código

| Elemento | Código real | Evidencia |
|---|---|---|
| CookSmart Web | Archivos `.html`, JavaScript y CSS de la raíz | Implementación de la interfaz y lógica |
| CookSmart API | `Docker/Postgre/backend/src/server.js`, `src/routes/*.js` | Servidor Express con endpoints de recetas, catálogos, usuarios, auth |
| PostgreSQL | `Docker/Postgre/init/01_schema.sql`, `docker-compose.yml` | Esquema y contenedor de base de datos |
| Consulta de recetas (nueva) | `recetas-loader.js` | `fetch(COOKSMART_API_BASE + '/recetas')`, evento `recetasDBReady` |
| Consulta de recetas (páginas aún no migradas) | `index.html`, `recetas.html`, `desayunos.html`, `almuerzos.html`, `cenas.html`, `rapido.html`, `mi-nevera.html`, `favoritos.html`, `perfil.html`, `receta-detalle.html` | `<script src="recetas-db.js">` — **archivo eliminado del repositorio** |
| Firebase Authentication | `firebase-sync.js`, `firebaseAuthMiddleware.js` | Autenticación y verificación de token |
| Firebase Realtime Database | `firebase-sync.js` | Guardado y recuperación de favoritos |

## 7. Validación contra el código

Se revisaron los `<script src="...">` de las 13 páginas HTML y se comparó
contra los archivos JavaScript existentes en la raíz del repositorio y en
`Docker/Postgre/backend`. La revisión permitió comprobar que:

1. CookSmart Web sigue siendo HTML, CSS y JavaScript ejecutado en el navegador.
2. Existe una API propia completa (rutas, controladores, servicios,
   repositorios) que no estaba documentada en la versión anterior.
3. Existe una base de datos PostgreSQL con esquema y datos semilla.
4. Solo 3 de 13 páginas (`login.html`, `registro.html`, `vegetariano.html`)
   cargan `recetas-loader.js`, el archivo que consume la API nueva.
5. Las 10 páginas restantes referencian `recetas-db.js`, que **ya no existe**
   en el repositorio (fue eliminado en el commit `f3d3931`).

## 8. Integraciones no activas

El repositorio contiene el archivo `themealdb.js`, que implementa funciones
para consultar la API externa TheMealDB. Ninguna página HTML carga
`themealdb.js` ni se encontró una llamada a `buscarTheMealDB()`. Se considera
una integración preparada para una posible utilización futura, no un
contenedor activo.

## 9. Corrección producida por la auditoría

La versión anterior de este documento (28 de agosto, madrugada) afirmaba que
"no se consideran parte del sistema actual: API Gateway, microservicios,
MySQL/PostgreSQL, Redis, motor de IA" y describía `recetas-db.js` como el
catálogo activo del sistema.

Al validar contra el commit actual del repositorio se encontró que, esa misma
tarde, el equipo:

* eliminó `recetas-db.js` (commit `f3d3931`);
* agregó `Docker/Postgre/backend` con una API Express completa y PostgreSQL
  vía Docker Compose (commits `28a5237`, `079ffab`, `18436a3`, `45d29b4`,
  `a8ebbdd`).

Por lo tanto, se corrige este documento para: (a) incluir **CookSmart API** y
**PostgreSQL** como contenedores reales del sistema actual, y (b) retirar la
afirmación de que `recetas-db.js` es evidencia vigente.

## 10. Hallazgo pendiente (no resuelto en el código)

La migración del catálogo estático a la API no se completó: **10 de las 13
páginas** siguen referenciando `recetas-db.js`, un archivo que ya no existe en
el repositorio. Esto se documenta como un hallazgo de la auditoría y no se
oculta ni se "corrige" en el diagrama fingiendo que ya funciona: el diagrama
de la sección 3 representa el flujo de datos ya migrado
(`recetas-loader.js`), pero la tabla de la sección 6 dejar explícito que la
mayoría de páginas aún no lo usan.

## 11. Audiencia y propósito

| Audiencia | Propósito |
|---|---|
| Equipo de desarrollo | Comprender la organización actual de CookSmart, incluyendo el backend nuevo |
| Docente / evaluador | Verificar la correspondencia entre arquitectura y código, incluida la migración incompleta |
| Integrantes del proyecto | Identificar responsabilidades y dependencias entre Web, API y base de datos |
| Futuros desarrolladores | Comprender la estructura actual del sistema y terminar la migración pendiente |

La vista de contenedores permite pasar del contexto general del sistema al
detalle de sus principales partes y sirve como base para la vista C4 de
componentes.
