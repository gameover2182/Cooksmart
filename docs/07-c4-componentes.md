# C4 — Nivel Componentes: CookSmart

## 1. Propósito

Esta vista representa los principales componentes lógicos identificados
dentro de los contenedores **CookSmart Web** y **CookSmart API**.

Los componentes se identifican a partir de las funciones y módulos
implementados en el código fuente del proyecto.

La vista representa la arquitectura actual después de la migración completa
hacia PostgreSQL y la autenticación propia mediante JWT.

---
## 2. Contenedor: CookSmart Web

**Tecnología:** HTML, CSS y JavaScript.

**Responsabilidad:** proporcionar la interfaz web y ejecutar la lógica
necesaria para consultar, filtrar, mostrar y gestionar recetas, favoritos,
inventario, historial y sesión del usuario.

Para esta vista se seleccionan los flujos principales de recetas,
autenticación y gestión de información del usuario, porque permiten establecer
trazabilidad directa entre arquitectura y código fuente.

### 2.1 Diagrama C4 de Componentes — CookSmart Web

```text
                         ┌──────────────────────┐
                         │       Usuario        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │       CookSmart Web          │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │ Gestor autenticación   │  │
                    │  │ auth-sync.js           │  │
                    │  └───────────┬────────────┘  │
                    │              │ fetch         │
                    │              ▼               │
                    │  ┌────────────────────────┐  │
                    │  │ Adaptador de API       │  │
                    │  │ fetch / HTTP REST      │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │  ┌───────────▼────────────┐  │
                    │  │ Gestor de recetas      │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │  ┌───────────▼────────────┐  │
                    │  │ Gestor de filtros      │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │  ┌───────────▼────────────┐  │
                    │  │ Gestor de favoritos    │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │  ┌───────────▼────────────┐  │
                    │  │ Gestor de inventario   │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │  ┌───────────▼────────────┐  │
                    │  │ Gestor de historial    │  │
                    │  └────────────────────────┘  │
                    └──────────────┬───────────────┘
                                   │
                                   │ HTTP / REST + JWT
                                   ▼
                            CookSmart API
```

### 2.2 Componentes identificados

#### 2.2.1 Gestor de autenticación (`auth-sync.js`)

**Responsabilidad:** registrar usuarios, iniciar y cerrar sesión, conservar
la sesión y adjuntar el JWT a las solicitudes autenticadas.

**Código:** `auth-sync.js`.

**Operaciones principales:**

- `cookSmartRegistrar()`
- `cookSmartLogin()`
- `cookSmartLogout()`
- `_guardarSesion()`
- `_apiFetch()`

**Trazabilidad:** utiliza `/api/auth/registro` y `/api/auth/login`.
Las solicitudes posteriores incluyen `Authorization: Bearer <token>`.

---

#### 2.2.2 Adaptador de API

**Responsabilidad:** encapsular las solicitudes HTTP que el frontend realiza
hacia la API y adaptar las respuestas para su utilización en la interfaz.

**Código:** `recetas-loader.js` y funciones de acceso mediante `fetch`.

Para recetas, `recetas-loader.js` consulta `/api/recetas` y adapta la respuesta
al formato utilizado por las páginas del frontend.

---

#### 2.2.3 Gestor de recetas

**Responsabilidad:** generar las tarjetas de recetas, mostrar información
de la receta, calcular información visual y cargar las recetas obtenidas
desde la API.

**Código:** páginas de recetas y funciones JavaScript de la interfaz.

**Trazabilidad:** utiliza la información entregada por el adaptador de API.

---

#### 2.2.4 Gestor de filtros

**Responsabilidad:** aplicar preferencias y restricciones del usuario sobre
el conjunto de recetas disponible.

**Código:** funciones de filtrado de las páginas de recetas.

**Trazabilidad:** trabaja sobre los datos recibidos desde la API y aplica
los criterios de categoría, tipo de comida y demás filtros disponibles.

---

#### 2.2.5 Gestor de favoritos

**Responsabilidad:** agregar y eliminar recetas favoritas, actualizar el
estado visual y sincronizar las operaciones con la API.

**Trazabilidad:** utiliza los endpoints:

```text
GET    /api/usuarios/:idUsuario/favoritos
POST   /api/usuarios/:idUsuario/favoritos
DELETE /api/usuarios/:idUsuario/favoritos
```

Los favoritos persistentes ya no dependen de Firebase; la persistencia principal
se realiza mediante PostgreSQL a través de la API.

---

#### 2.2.6 Gestor de inventario

**Responsabilidad:** permitir al usuario consultar, agregar y eliminar
ingredientes de su inventario.

**Trazabilidad:** utiliza:

```text
GET    /api/usuarios/:idUsuario/inventario
POST   /api/usuarios/:idUsuario/inventario
DELETE /api/usuarios/:idUsuario/inventario
```

Las operaciones persistentes terminan en PostgreSQL.

---

#### 2.2.7 Gestor de historial

**Responsabilidad:** registrar y consultar las recetas preparadas por el usuario.

**Trazabilidad:** utiliza:

```text
GET  /api/usuarios/:idUsuario/historial
POST /api/usuarios/:idUsuario/historial
```

El historial se almacena en PostgreSQL.

---

#### 2.2.8 Gestor de interfaz

**Responsabilidad:** controlar elementos visuales de interacción como mensajes,
modales, navegación, botones y actualización de componentes de la interfaz.

**Código:** funciones JavaScript distribuidas en las páginas HTML.

---

## 3. Contenedor: CookSmart API

**Tecnología:** Node.js, Express, capas `routes → controllers → services →
repositories`, `pg`, `jsonwebtoken` y `bcryptjs`.

**Responsabilidad:** exponer las operaciones del sistema, aplicar autenticación
y autorización, ejecutar la lógica de negocio y acceder a PostgreSQL.

### 3.1 Diagrama C4 de Componentes — CookSmart API

```text
   Cliente (CookSmart Web)
            │
            ▼
 ┌────────────────────────────────────────────┐
 │ Routes (src/routes/*.js)                   │
 │ recetas · catalogos · usuarios · auth      │
 └────────────────────┬───────────────────────┘
                      ▼
 ┌────────────────────────────────────────────┐
 │ Middlewares                                │
 │ JWT · autorización · manejo de errores     │
 └────────────────────┬───────────────────────┘
                      ▼
 ┌────────────────────────────────────────────┐
 │ Controllers (src/controllers/*.js)         │
 └────────────────────┬───────────────────────┘
                      ▼
 ┌────────────────────────────────────────────┐
 │ Services (src/services/*.js)               │
 └────────────────────┬───────────────────────┘
                      ▼
 ┌────────────────────────────────────────────┐
 │ Repositories (src/repositories/*.js)       │
 └────────────────────┬───────────────────────┘
                      │ SQL / pg
                      ▼
                 PostgreSQL
```

### 3.2 Componentes identificados

#### 3.2.1 Capa de rutas

**Responsabilidad:** definir los endpoints HTTP expuestos por la API.

**Código:** `src/routes/recetas.routes.js`, `catalogos.routes.js`,
`usuarios.routes.js`, `me.routes.js` y `auth.routes.js`, según la
organización vigente del backend.

Las rutas separan las operaciones por dominio funcional.

---

#### 3.2.2 Middleware de autenticación y autorización

**Responsabilidad:** validar el JWT, identificar al usuario autenticado
y proteger las operaciones que modifican o consultan información privada.

**Código:** `src/middlewares/authMiddleware.js`.

El flujo actual no requiere verificación de tokens Firebase.

---

#### 3.2.3 Controladores

**Responsabilidad:** recibir solicitudes HTTP, extraer parámetros, invocar
los servicios y construir las respuestas HTTP.

**Código:** `src/controllers/*.controller.js`.

Entre los dominios identificados se encuentran:

- autenticación;
- recetas;
- catálogos;
- favoritos;
- historial;
- inventario.

---

#### 3.2.4 Servicios

**Responsabilidad:** contener la lógica de negocio y coordinar las operaciones
entre controladores y repositorios.

**Código:** `src/services/*.service.js`.

Los servicios desacoplan la lógica de negocio de los detalles HTTP y SQL.

---

#### 3.2.5 Repositorios

**Responsabilidad:** encapsular las consultas y operaciones de persistencia
sobre PostgreSQL.

**Código:** `src/repositories/*.repository.js`.

Los repositorios utilizan la configuración de base de datos y el driver `pg`.

---

#### 3.2.6 Configuración de acceso a datos

**Código:** `src/config/db.js`.

**Responsabilidad:** establecer y administrar el pool de conexiones hacia
PostgreSQL.

---

#### 3.2.7 Autenticación y generación de JWT

**Responsabilidad:** validar credenciales, utilizar `bcryptjs` para las
contraseñas y generar tokens JWT para las sesiones autenticadas.

**Trazabilidad:** rutas `/api/auth/registro`, `/api/auth/login` y
`/api/auth/me`.

---

## 4. Relaciones entre componentes

| Origen | Destino | Relación |
|---|---|---|
| Gestor de autenticación | CookSmart API | Registro e inicio de sesión |
| Gestor de recetas | Adaptador de API | Obtiene recetas |
| Gestor de favoritos | CookSmart API | CRUD de favoritos |
| Gestor de inventario | CookSmart API | CRUD de inventario |
| Gestor de historial | CookSmart API | CRUD de historial |
| Adaptador de API | Routes | Solicitudes HTTP/REST |
| Routes | Middlewares | Aplican autenticación/autorización cuando corresponde |
| Middlewares | Controllers | Solicitud validada |
| Controllers | Services | Delegan lógica de negocio |
| Services | Repositories | Delegan acceso a datos |
| Repositories | PostgreSQL | Ejecutan SQL mediante `pg` |

### 4.1 Walking Skeleton Trace

El Walking Skeleton representa un recorrido funcional de extremo a extremo
a través de los principales elementos arquitectónicos de CookSmart.

Para el estado actual del proyecto se selecciona como flujo principal la
**consulta del catálogo de recetas**.

#### Flujo E2E: Consulta del catálogo de recetas

```text
┌──────────────────────┐
│       Usuario        │
│ Consulta recetas     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│       CookSmart Web          │
│ Gestor de recetas            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Adaptador de API             │
│ recetas-loader.js / fetch    │
└──────────┬───────────────────┘
           │
           │ GET /api/recetas
           ▼
┌──────────────────────────────┐
│       CookSmart API          │
│ Routes                       │
│      ↓                       │
│ Controllers                  │
│      ↓                       │
│ Services                     │
│      ↓                       │
│ Repositories                 │
└──────────┬───────────────────┘
           │
           │ SQL
           ▼
┌──────────────────────────────┐
│         PostgreSQL           │
│ Persistencia de recetas      │
└──────────┬───────────────────┘
           │ resultado
           ▼
┌──────────────────────────────┐
│       CookSmart API          │
│ Respuesta HTTP JSON          │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Adaptador de API             │
│ Adapta respuesta             │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│       CookSmart Web          │
│ Renderizado de recetas       │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────┐
│       Usuario        │
│ Recetas mostradas    │
└──────────────────────┘
```

#### Trazabilidad del recorrido

| Paso | Elemento | Evidencia en código | Relación |
|---|---|---|---|
| 1 | Usuario | Interfaz HTML de CookSmart | Usuario → Web |
| 2 | Gestor de recetas | Páginas y JS de recetas | Web → adaptador |
| 3 | Adaptador de API | `recetas-loader.js` | Adaptador → API |
| 4 | Endpoint | `src/routes/recetas.routes.js` | Web → `GET /api/recetas` |
| 5 | Controller | `src/controllers` | Routes → Controllers |
| 6 | Service | `src/services` | Controllers → Services |
| 7 | Repository | `src/repositories` | Services → Repositories |
| 8 | Persistencia | `src/config/db.js`, PostgreSQL | Repository → DB |
| 9 | Respuesta | `fetch()` | API → Web |
| 10 | Renderizado | JS de la interfaz | Datos → Usuario |

#### Estado de verificación

El recorrido representa el flujo arquitectónico actual: frontend → API →
capas de negocio → repositorios → PostgreSQL y retorno mediante HTTP/JSON.

La persistencia del catálogo y de la información de usuario corresponde a
PostgreSQL; no se utiliza Firebase como mecanismo de persistencia.

---

## 5. Tabla de trazado C4

| ID | Nivel C4 | Elemento C4 | Responsabilidad | Archivo/módulo real | Relación verificada | Estado |
|---|---|---|---|---|---|---|
| T-01 | Nivel 1 | CookSmart | Gestionar recetas e ingredientes del usuario | Repositorio completo | Usuario → CookSmart | Verificado |
| T-02 | Nivel 2 | CookSmart Web | Interfaz y lógica cliente | HTML/JS/CSS de raíz | Usuario → Web | Verificado |
| T-03 | Nivel 2 | CookSmart API | Exponer operaciones HTTP | `backend/src/server.js` | Web → API | Verificado |
| T-04 | Nivel 2 | PostgreSQL | Persistencia relacional | `01_schema.sql`, `docker-compose.yml` | API → DB | Verificado |
| T-05 | Nivel 3 | Gestor autenticación | Registro/login/sesión | `auth-sync.js` | Web → Auth API | Verificado |
| T-06 | Nivel 3 | Adaptador API | Consumir API | `recetas-loader.js` / `fetch` | Web → Routes | Verificado |
| T-07 | Nivel 3 | Gestor recetas | Mostrar recetas | HTML/JS | Web → Adaptador | Verificado |
| T-08 | Nivel 3 | Gestor filtros | Filtrar recetas | HTML/JS | UI → datos recetas | Verificado |
| T-09 | Nivel 3 | Gestor favoritos | CRUD favoritos | HTML/JS + API | Web → API | Verificado |
| T-10 | Nivel 3 | Gestor inventario | CRUD inventario | HTML/JS + API | Web → API | Verificado |
| T-11 | Nivel 3 | Gestor historial | CRUD historial | HTML/JS + API | Web → API | Verificado |
| T-12 | Nivel 3 | Routes | Definir endpoints | `src/routes/*.js` | Routes → Controllers | Verificado |
| T-13 | Nivel 3 | Middleware JWT | Autenticar/autorización | `src/middlewares/authMiddleware.js` | Middleware → Controllers | Verificado |
| T-14 | Nivel 3 | Controllers | Adaptar HTTP a negocio | `src/controllers/*.js` | Controllers → Services | Verificado |
| T-15 | Nivel 3 | Services | Lógica de negocio | `src/services/*.js` | Services → Repositories | Verificado |
| T-16 | Nivel 3 | Repositories | Persistencia | `src/repositories/*.js` | Repositories → PostgreSQL | Verificado |
| T-17 | Nivel 3 | DB config | Pool PostgreSQL | `src/config/db.js` | API → PostgreSQL | Verificado |
| T-18 | Nivel 3 | TheMealDB | Integración externa preparada | `themealdb.js` | Ninguna activa | No activo |

---

## 6. Validación de la arquitectura

La identificación de los componentes se realizó contrastando la estructura
actual del frontend y del backend.

Se verifica que:

1. CookSmart Web continúa siendo HTML, CSS y JavaScript.
2. Existe una API propia Node.js/Express.
3. La API se organiza en rutas, middlewares, controllers, services y repositories.
4. PostgreSQL constituye la persistencia principal.
5. Los repositorios ejecutan SQL mediante `pg`.
6. La autenticación actual utiliza JWT propio.
7. Las contraseñas son gestionadas mediante `bcryptjs`.
8. El frontend no accede directamente a PostgreSQL.
9. Firebase no forma parte de los componentes activos del sistema actual.
10. Integraciones no utilizadas, como TheMealDB, no se consideran componentes
    activos del `as-is`.

## 7. Limitaciones

Esta vista no representa como componentes activos funcionalidades que no se
pueden comprobar como parte del flujo actual del sistema.

`themealdb.js` puede permanecer en el repositorio como integración preparada,
pero no se considera un componente activo si ninguna página o flujo lo utiliza.

Redis, el motor de IA, un API Gateway y microservicios independientes se
mantienen fuera del modelo actual porque pertenecen a arquitectura futura
o a la propuesta inicial.

## 8. Registro de correcciones y eliminaciones

Esta versión actualiza el modelo C4 anterior para reflejar la migración completa
hacia PostgreSQL.

Correcciones principales:

1. **Eliminado del modelo activo:** Firebase Authentication.
2. **Eliminado del modelo activo:** Firebase Realtime Database.
3. **Eliminado del modelo activo:** sincronizador Firebase.
4. **Eliminada la dependencia de Firebase para favoritos.**
5. **Consolidado:** JWT propio como mecanismo de autenticación.
6. **Consolidado:** PostgreSQL como persistencia principal.
7. **Complementado:** componentes internos de la API:
   routes → middlewares → controllers → services → repositories.
8. **Complementado:** trazabilidad de inventario, favoritos e historial hacia
   la API y PostgreSQL.
9. **Mantenido:** `localStorage` únicamente como mecanismo auxiliar de estado
   del cliente cuando corresponda; no se considera la base de datos del sistema.
10. **Mantenido como no activo:** integraciones externas sin flujo ejecutable.

## 9. Audiencia y propósito

| Audiencia | Propósito |
|---|---|
| Equipo de desarrollo | Comprender la organización interna de CookSmart Web y CookSmart API |
| Docente / evaluador | Verificar la correspondencia entre arquitectura y código |
| Integrantes del proyecto | Identificar responsabilidades y dependencias |
| Futuros desarrolladores | Comprender el flujo actual y los límites de cada componente |

La vista de componentes permite pasar del nivel de contenedores al detalle
interno de la aplicación y establece la trazabilidad desde la interfaz,
pasando por la API y las capas de negocio, hasta PostgreSQL.
