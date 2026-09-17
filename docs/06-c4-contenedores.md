# C4 — Nivel Contenedores: CookSmart

## 1. Propósito

Esta vista representa la arquitectura de CookSmart a nivel de contenedores,
mostrando las principales partes del sistema, sus responsabilidades,
tecnologías y relaciones.

La vista se construye a partir de la implementación actualmente disponible
en el repositorio y representa el estado actual posterior a la migración
completa hacia PostgreSQL.

## 2. Arquitectura actual

CookSmart está compuesto hoy por tres contenedores principales:

1. **CookSmart Web**: HTML, CSS y JavaScript que se ejecutan en el navegador.
2. **CookSmart API**: servicio Node.js/Express, organizado en capas
   (rutas → controladores → servicios → repositorios).
3. **PostgreSQL**: base de datos relacional propia del proyecto.

La autenticación y persistencia actuales se realizan mediante la API propia
y PostgreSQL. Firebase no forma parte del flujo de ejecución actual.

## 3. Diagrama C4 de Contenedores

```text
                                    ┌──────────────────┐
                                    │      Usuario      │
                                    └────────┬──────────┘
                                             │ Navegador web
                                             ▼
                           ┌──────────────────────────────┐
                           │        CookSmart Web         │
                           │   HTML + CSS + JavaScript    │
                           │  Interfaz y lógica cliente   │
                           └──────────────┬───────────────┘
                                          │
                                          │ HTTP / REST
                                          │ Bearer JWT
                                          ▼
                           ┌──────────────────────────────┐
                           │        CookSmart API         │
                           │                              │
                           │ Node.js + Express            │
                           │ Routes                       │
                           │ Controllers                  │
                           │ Services                     │
                           │ Repositories                 │
                           └──────────────┬───────────────┘
                                          │
                                          │ SQL / pg
                                          ▼
                           ┌──────────────────────────────┐
                           │          PostgreSQL          │
                           │                              │
                           │ Usuarios                     │
                           │ Recetas                      │
                           │ Ingredientes                 │
                           │ Inventario                   │
                           │ Favoritos                    │
                           │ Historial                    │
                           └──────────────────────────────┘
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

- `index.html`
- `recetas.html`
- `mi-nevera.html`
- `favoritos.html`
- `perfil.html`
- `receta-detalle.html`
- `login.html`
- `registro.html`

La aplicación utiliza JavaScript para comunicarse con la API mediante
solicitudes HTTP.

---

### 4.2 CookSmart API

**Tecnología:** Node.js, Express, `pg`, `jsonwebtoken`, `bcryptjs`, `dotenv`.

**Ubicación:** `Docker/Postgre/backend/src`.

**Responsabilidad:**

Expone los datos y operaciones de CookSmart mediante una API HTTP, organizada
en capas:

- `routes/` — definición de endpoints.
- `controllers/` — manejo de la petición/respuesta HTTP.
- `services/` — lógica de negocio.
- `repositories/` — acceso a datos mediante consultas SQL sobre PostgreSQL.
- `middlewares/` — autenticación, autorización y manejo de errores.
- `config/` — configuración de acceso a PostgreSQL.

**Endpoints principales:**

| Ruta | Responsabilidad | Autenticación |
|---|---|---|
| `POST /api/auth/registro` | Registro | Ninguna |
| `POST /api/auth/login` | Inicio de sesión | Ninguna |
| `GET /api/auth/me` | Usuario autenticado | JWT propio |
| `GET /api/recetas` | Consulta de recetas | Según ruta |
| `GET /api/recetas/:id` | Consulta de receta | Según ruta |
| `GET /api/categorias-receta` | Catálogo de categorías | Ninguna |
| `GET /api/tipos-cocina` | Catálogo de tipos de cocina | Ninguna |
| `GET /api/categorias-ingrediente` | Catálogo de ingredientes | Ninguna |
| `GET /api/ingredientes` | Consulta de ingredientes | Ninguna |
| `GET/POST/DELETE /api/usuarios/:idUsuario/inventario` | Gestión de inventario | JWT propio |
| `GET/POST/DELETE /api/usuarios/:idUsuario/historial` | Gestión de historial | JWT propio |
| `GET/POST/DELETE /api/usuarios/:idUsuario/favoritos` | Gestión de favoritos | JWT propio |
| `GET /health` | Verificación del servicio y DB | Ninguna |

### 4.3 PostgreSQL

**Tecnología:** PostgreSQL 16 (`postgres:16-alpine`), orquestado con Docker Compose.

**Ubicación:**

- `Docker/Postgre/docker-compose.yml`
- `Docker/Postgre/init/01_schema.sql`
- `Docker/Postgre/init/02_seed.sql`

**Responsabilidad:**

Persistir de forma relacional los datos del sistema:

- usuarios;
- recetas;
- ingredientes;
- categorías;
- inventario del usuario;
- historial de recetas preparadas;
- favoritos;
- etiquetas;
- restricciones y relaciones asociadas.

**Tablas principales:**

`usuario`, `receta`, `ingrediente`, `categoria_receta`,
`categoria_ingrediente`, `tipo_cocina`, `inventario_usuario`,
`historial_receta`, `favorito`, `etiqueta`, `restriccion`,
`receta_ingrediente`, `receta_etiqueta` y `receta_restriccion`.

La conexión desde la API se realiza mediante el driver `pg`.

## 5. Relaciones

### Usuario → CookSmart Web

El usuario accede a CookSmart mediante un navegador web e interactúa con
las diferentes páginas de la aplicación.

### CookSmart Web → CookSmart API

El frontend realiza solicitudes HTTP/REST hacia la API propia para consultar
y modificar información del sistema.

Las operaciones autenticadas incluyen el JWT mediante:

```text
Authorization: Bearer <token>
```

### CookSmart API → PostgreSQL

La capa de repositorios ejecuta consultas SQL sobre PostgreSQL mediante el
pool definido en `src/config/db.js`.

### CookSmart Web → PostgreSQL

No existe acceso directo.

Todas las operaciones persistentes pasan por la API.

## 6. Trazabilidad C4 ↔ código

| Elemento | Código real | Evidencia |
|---|---|---|
| CookSmart Web | Archivos `.html`, JavaScript y CSS de la raíz | Implementación de la interfaz y lógica |
| CookSmart API | `Docker/Postgre/backend/src/server.js` | Servidor Express |
| Rutas | `Docker/Postgre/backend/src/routes/*.js` | Endpoints HTTP |
| Controllers | `Docker/Postgre/backend/src/controllers/*.js` | Adaptación HTTP → negocio |
| Services | `Docker/Postgre/backend/src/services/*.js` | Lógica de negocio |
| Repositories | `Docker/Postgre/backend/src/repositories/*.js` | Acceso a PostgreSQL |
| Autenticación | `src/middlewares/authMiddleware.js`, `auth-sync.js` | JWT propio |
| PostgreSQL | `Docker/Postgre/init/01_schema.sql`, `docker-compose.yml` | Esquema y contenedor |
| Consulta de recetas | `recetas-loader.js` + `/api/recetas` | Consumo de API |
| Infraestructura | `Docker/Postgre/docker-compose.yml` | PostgreSQL + API + Adminer |

## 7. Validación contra el código

La revisión de la arquitectura permite comprobar:

1. CookSmart Web sigue siendo HTML, CSS y JavaScript ejecutado en el navegador.
2. Existe una API propia Node.js/Express.
3. La API está organizada por rutas, controladores, servicios y repositorios.
4. Existe PostgreSQL como persistencia principal.
5. La API accede a PostgreSQL mediante `pg`.
6. La autenticación actual utiliza JWT propio.
7. Las operaciones autenticadas se realizan mediante Bearer token.
8. El frontend no accede directamente a PostgreSQL.
9. Firebase no forma parte de los contenedores activos del sistema actual.

## 8. Integraciones no activas

El repositorio puede contener archivos preparados para integraciones externas,
como `themealdb.js`, pero no se consideran contenedores activos mientras no
exista una página o flujo de ejecución que los utilice.

De igual manera, Redis, un motor de IA y una arquitectura de microservicios
se mantienen fuera del modelo `as-is` porque corresponden a trabajo futuro
o a la arquitectura inicialmente propuesta.

## 9. Corrección producida por la migración

La versión anterior describía una convivencia entre Firebase y PostgreSQL.

La arquitectura actual se corrige para representar un único flujo de persistencia:

```text
CookSmart Web
      ↓
CookSmart API
      ↓
PostgreSQL
```

También se elimina del modelo la coexistencia de dos mecanismos de autenticación.
La autenticación actual se realiza mediante JWT propio de la API.

## 10. Audiencia y propósito

| Audiencia | Propósito |
|---|---|
| Equipo de desarrollo | Comprender la organización actual de CookSmart |
| Docente / evaluador | Verificar la correspondencia entre arquitectura y código |
| Integrantes del proyecto | Identificar responsabilidades y dependencias entre Web, API y DB |
| Futuros desarrolladores | Comprender el flujo completo de la aplicación |

La vista de contenedores permite pasar del contexto general del sistema al
detalle de sus principales partes y sirve como base para la vista C4 de
componentes.
