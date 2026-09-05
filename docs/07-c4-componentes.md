# C4 — Nivel Componentes: CookSmart

## 1. Propósito

Esta vista representa los principales componentes lógicos identificados
dentro de los contenedores **CookSmart Web** y **CookSmart API**.

Los componentes se identifican a partir de las funciones y módulos
actualmente implementados en el código fuente del proyecto, en el commit
`846dacb` de la rama `main`.

> **Nota de auditoría (Módulo 3):** esta versión corrige la anterior, que
> describía el catálogo de recetas como un archivo `recetas-db.js` con un
> arreglo `RECETAS_DB` embebido. Ese archivo fue eliminado del repositorio el
> 28 de agosto de 2026 (commit `f3d3931`) y reemplazado por `recetas-loader.js`,
> que consume la nueva API propia. También se agrega, por primera vez, la
> vista de componentes del contenedor **CookSmart API**, que no existía al
> escribirse la primera versión de este documento. El contenido de
> `08-validacion-c4-codigo.md` (documento que no debe entregarse por separado)
> quedó incorporado como registro de correcciones en la sección 8.

---

## 2. Contenedor: CookSmart Web

**Tecnología:** HTML, CSS y JavaScript.

**Responsabilidad:** proporcionar la interfaz web y ejecutar la lógica
necesaria para consultar, filtrar, mostrar y gestionar recetas, favoritos y
sesión del usuario.

Para esta vista se selecciona el flujo principal de recetas y favoritos,
porque contiene funciones claramente identificables en el código y permite
establecer trazabilidad directa entre arquitectura y código fuente.

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
                    │  │ Adaptador de catálogo  │  │
                    │  │ recetas-loader.js      │  │
                    │  │ _cargarRecetasDesdeAPI │  │
                    │  └───────────┬────────────┘  │
                    │              │ fetch          │
                    │              ▼               │
                    │  ┌────────────────────────┐  │
                    │  │ Gestor de recetas      │  │
                    │  │                        │  │
                    │  │ renderRecetas()        │  │
                    │  │ cargarRecetasPopulares()│ │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │              ▼               │
                    │  ┌────────────────────────┐  │
                    │  │ Gestor de filtros      │  │
                    │  │                        │  │
                    │  │ filtrarPorRestricciones│ │
                    │  │ aplicarFiltros()       │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │              ▼               │
                    │  ┌────────────────────────┐  │
                    │  │ Gestor de favoritos    │  │
                    │  │                        │  │
                    │  │ toggleFav()            │  │
                    │  │ updateNavBadge()       │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │              ▼               │
                    │  ┌────────────────────────┐  │
                    │  │ Persistencia local     │  │
                    │  │                        │  │
                    │  │ localStorage           │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │              ▼               │
                    │  ┌────────────────────────┐  │
                    │  │ Sincronizador Firebase │  │
                    │  │                        │  │
                    │  │ syncFavoritosToFirebase│  │
                    │  │ loadFavoritosFromFirebase││
                    │  └───────────┬────────────┘  │
                    └──────────────┼───────────────┘
                                   │
                    ┌──────────────┴───────────────┐
                    ▼                              ▼
         ┌──────────────────────┐        ┌──────────────────────┐
         │ CookSmart API         │        │ Firebase              │
         │ GET /api/recetas      │        │ Authentication +       │
         └──────────────────────┘        │ Realtime Database      │
                                          └──────────────────────┘
```

### 2.2 Componentes identificados

#### 2.2.1 Adaptador de catálogo (recetas-loader.js)

**Responsabilidad:** obtener el catálogo de recetas desde la API propia y
exponerlo con la misma forma (`shape`) que usaba el antiguo `RECETAS_DB`, para
minimizar cambios en el resto de la aplicación.

**Código:** `recetas-loader.js` — funciones `_cargarRecetasDesdeAPI()`,
`_adaptarReceta(receta)`; variables `window.RECETAS_DB`,
`window.recetasDBListo`; evento `recetasDBReady`.

**Trazabilidad:** hace `fetch(COOKSMART_API_BASE + '/recetas')`, transforma
cada receta al formato plano que las páginas ya sabían leer, y llena
`window.RECETAS_DB` de forma asíncrona (dispara `recetasDBReady` cuando
termina). Reemplaza directamente al antiguo `recetas-db.js`.

**Estado real de adopción:** solo `login.html`, `registro.html` y
`vegetariano.html` cargan este archivo (ver sección 8).

---

#### 2.2.2 Gestor de recetas

**Responsabilidad:** generar las tarjetas de recetas, calcular el porcentaje
de coincidencia con los ingredientes del usuario, mostrar nombre/imagen/tiempo/
dificultad, determinar si una receta es favorita y cargar recomendaciones.

**Código:** `index.html` — `renderRecetas(recetas, gridId)`,
`cargarRecetasPopulares()`.

**Trazabilidad:** ambas funciones leen de `RECETAS_DB` (hoy poblado por
`recetas-loader.js` en las páginas migradas, o `undefined`/inexistente en las
páginas que aún referencian `recetas-db.js`, ver sección 8).

---

#### 2.2.3 Gestor de filtros

**Responsabilidad:** aplicar las preferencias y restricciones del usuario
sobre el conjunto de recetas disponibles.

**Código:** `index.html` — `filtrarPorRestricciones(recetas)`;
`recetas.html` — `aplicarFiltros()`.

**Trazabilidad:** `filtrarPorRestricciones()` lee `localStorage`
(`cookSmartRestricciones`, `cookSmartGustos`); `aplicarFiltros()` trabaja
sobre `RECETAS_DB` filtrando por ingredientes, tiempo, dificultad y categoría.

---

#### 2.2.4 Gestor de favoritos

**Responsabilidad:** agregar/eliminar una receta de favoritos, actualizar el
estado visual del botón, guardar los favoritos localmente y actualizar el
contador.

**Código:** `index.html` / `recetas.html` — `toggleFav(e, id, btnElement)`,
`updateNavBadge()`.

**Trazabilidad:** `toggleFav()` busca la receta en `RECETAS_DB`, modifica el
arreglo de favoritos y lo guarda con
`localStorage.setItem('cooksmart_favoritos', ...)`.

---

#### 2.2.5 Persistencia local

**Responsabilidad:** mantener en el navegador información necesaria para el
funcionamiento de la aplicación: `cooksmart_favoritos`,
`cookSmartIngredientes`, `cookSmartGustos`, `cookSmartRestricciones`.

**Código:** operaciones `localStorage.getItem(...)` / `setItem(...)` en
varias páginas HTML.

**Trazabilidad:** sirve como punto de integración con el sincronizador de
Firebase (sección 2.2.6).

---

#### 2.2.6 Sincronizador Firebase

**Responsabilidad:** integrar la aplicación con Firebase y sincronizar los
favoritos del usuario autenticado.

**Código:** `firebase-sync.js` — `syncFavoritosToFirebase(favs)`,
`loadFavoritosFromFirebase(uid)`, `firebase.auth()`, `firebase.database()`.

**Trazabilidad:** guarda en `fbDB.ref('usuarios/' + uid + '/favoritos').set(...)`
y recupera con `.get()`; escucha `fbAuth.onAuthStateChanged(...)`.

---

#### 2.2.7 Gestor de interfaz

**Responsabilidad:** controlar elementos visuales de interacción.

**Código:** `index.html` — `mostrarToast()`, `abrirModal(receta)`,
`cerrarModal()`, `scrollRecom(direccion)`.

---

## 3. Contenedor: CookSmart API

**Tecnología:** Node.js, Express, capas `routes → controllers → services →
repositories`.

**Responsabilidad:** exponer recetas, catálogos, usuarios, inventario,
historial y favoritos sobre PostgreSQL, con dos mecanismos de autenticación
(JWT propio y verificación de token Firebase).

### 3.1 Diagrama C4 de Componentes — CookSmart API

```text
   Cliente (CookSmart Web)
        │
        ▼
 ┌────────────────────────────────────────────┐
 │  Rutas (src/routes/*.js)                    │
 │  recetas · catalogos · usuarios · me · auth │
 └───────────────┬──────────────────────────────┘
                 ▼
 ┌────────────────────────────────────────────┐
 │  Middlewares                                │
 │  authMiddleware (JWT) ·                     │
 │  firebaseAuthMiddleware (token Firebase)    │
 └───────────────┬──────────────────────────────┘
                 ▼
 ┌────────────────────────────────────────────┐
 │  Controllers (src/controllers/*.js)         │
 └───────────────┬──────────────────────────────┘
                 ▼
 ┌────────────────────────────────────────────┐
 │  Services (src/services/*.js)               │
 └───────────────┬──────────────────────────────┘
                 ▼
 ┌────────────────────────────────────────────┐
 │  Repositories (src/repositories/*.js)       │
 └───────────────┬──────────────────────────────┘
                 ▼
            PostgreSQL
```

### 3.2 Componentes identificados

#### 3.2.1 Capa de rutas

**Responsabilidad:** definir los endpoints HTTP expuestos por la API.

**Código:** `src/routes/recetas.routes.js`, `catalogos.routes.js`,
`usuarios.routes.js`, `me.routes.js`, `auth.routes.js`.

#### 3.2.2 Middlewares de autenticación

**Responsabilidad:** proteger rutas verificando credenciales.

**Código:** `src/middlewares/authMiddleware.js` (JWT propio,
`soloElMismoUsuario`), `src/middlewares/firebaseAuthMiddleware.js`
(verificación de ID token de Firebase + aprovisionamiento just-in-time del
usuario en PostgreSQL), `src/middlewares/errorHandler.js`.

#### 3.2.3 Controladores, servicios y repositorios

**Responsabilidad:** controladores traducen HTTP↔dominio; servicios
contienen la lógica de negocio; repositorios ejecutan SQL contra PostgreSQL.

**Código:** `src/controllers/{recetas,catalogos,auth,favoritos,historial,inventario}.controller.js`,
`src/services/{recetas,catalogos,auth,favoritos,historial,inventario}.service.js`,
`src/repositories/{recetas,catalogos,favoritos,historial,inventario,Usuarios}.repository.js`.

#### 3.2.4 Configuración de acceso a datos y Firebase Admin

**Código:** `src/config/db.js` (pool de conexión a PostgreSQL vía `pg`),
`src/config/firebaseAdmin.js` (inicialización del SDK de administración de
Firebase para verificar tokens).

---

## 4. Relaciones entre componentes

| Origen | Destino | Relación |
|---|---|---|
| Adaptador de catálogo | CookSmart API (rutas) | `fetch` a `GET /api/recetas` |
| Gestor de recetas | Adaptador de catálogo | Lee `window.RECETAS_DB` una vez poblado |
| Gestor de filtros | Adaptador de catálogo | Filtra sobre `RECETAS_DB` |
| Gestor de recetas | Gestor de favoritos | Consulta si una receta está marcada como favorita |
| Gestor de favoritos | Persistencia local | Guarda/lee `cooksmart_favoritos` |
| Persistencia local | Sincronizador Firebase | `firebase-sync.js` intercepta cambios y sincroniza |
| Sincronizador Firebase | Firebase Realtime Database | `fbDB.ref('usuarios/{uid}/favoritos')` |
| Sincronizador Firebase | Firebase Authentication | Usa el usuario autenticado para identificar los datos |
| Rutas (API) | Middlewares | Aplican JWT o verificación Firebase antes del controlador |
| Controllers | Services | Delegan la lógica de negocio |
| Services | Repositories | Delegan el acceso a datos |
| Repositories | PostgreSQL | Ejecutan SQL vía `src/config/db.js` |

---

## 5. Tabla de trazado C4

| ID | Nivel C4 | Elemento C4 | Responsabilidad | Archivo/módulo real | Clase/símbolo/configuración verificable | Relación verificada | Estado | Observación/corrección |
|---|---|---|---|---|---|---|---|---|
| T-01 | Nivel 1 (Contexto) | CookSmart (sistema) | Gestionar recetas e ingredientes del usuario | Repositorio completo | — | Usuario final → CookSmart | Verificado | — |
| T-02 | Nivel 1 (Contexto) | Firebase Authentication | Autenticar usuarios | `firebase-sync.js`, `firebaseAuthMiddleware.js` | `firebase.auth()`, `verifyIdToken()` | CookSmart → Firebase Authentication | Verificado | — |
| T-03 | Nivel 1 (Contexto) | Firebase Realtime Database | Persistir favoritos | `firebase-sync.js` | `fbDB.ref('usuarios/{uid}/favoritos')` | CookSmart → Firebase Realtime Database | Verificado | — |
| T-04 | Nivel 2 (Contenedor) | CookSmart Web | Interfaz y lógica de cliente | Archivos `.html`, `.css`, `.js` de la raíz | — | Usuario → CookSmart Web | Verificado | — |
| T-05 | Nivel 2 (Contenedor) | CookSmart API | Exponer recetas/catálogos/usuarios vía HTTP | `Docker/Postgre/backend/src/server.js` | `app.listen(...)`, rutas `/api/*` | CookSmart Web → CookSmart API | Verificado | Contenedor agregado en esta auditoría; no existía en la versión anterior del documento |
| T-06 | Nivel 2 (Contenedor) | PostgreSQL | Persistencia relacional | `Docker/Postgre/init/01_schema.sql`, `docker-compose.yml` | Tablas `usuario`, `receta`, `favorito`, etc. | CookSmart API → PostgreSQL | Verificado | Contenedor agregado en esta auditoría |
| T-07 | Nivel 2 (Contenedor) | Catálogo de recetas — `RECETAS_DB` en `recetas-db.js` | Contener el catálogo estático de recetas | `recetas-db.js` | `const RECETAS_DB = [...]` | CookSmart Web → RECETAS_DB | **Eliminado** | Archivo borrado en el commit `f3d3931` (28 ago 2026); ya no existe en el repositorio. Se documentaba como vigente en la versión anterior de este C4; se retira del modelo |
| T-08 | Nivel 3 (Componente) | Adaptador de catálogo | Reemplazar a `RECETAS_DB` consumiendo la API | `recetas-loader.js` | `_cargarRecetasDesdeAPI()`, evento `recetasDBReady` | Adaptador → CookSmart API | Verificado | Componente nuevo; corrige/reemplaza a T-07 |
| T-09 | Nivel 3 (Componente) | Gestor de recetas | Renderizar y recomendar recetas | `index.html` | `renderRecetas()`, `cargarRecetasPopulares()` | Gestor de recetas → Adaptador de catálogo | Verificado | — |
| T-10 | Nivel 3 (Componente) | Gestor de filtros | Aplicar restricciones/preferencias | `index.html`, `recetas.html` | `filtrarPorRestricciones()`, `aplicarFiltros()` | Gestor de filtros → Adaptador de catálogo | Verificado | — |
| T-11 | Nivel 3 (Componente) | Gestor de favoritos | Agregar/eliminar favoritos | `index.html`, `recetas.html` | `toggleFav()`, `updateNavBadge()` | Gestor de favoritos → Persistencia local | Verificado | — |
| T-12 | Nivel 3 (Componente) | Persistencia local | Guardar preferencias/favoritos en el navegador | HTML/JS varios | `localStorage.getItem/setItem` | Persistencia local → Sincronizador Firebase | Verificado | — |
| T-13 | Nivel 3 (Componente) | Sincronizador Firebase | Sincronizar favoritos con Firebase | `firebase-sync.js` | `syncFavoritosToFirebase()`, `loadFavoritosFromFirebase()` | Sincronizador → Firebase Realtime Database | Verificado | — |
| T-14 | Nivel 3 (Componente) | Gestor de interfaz | Mensajes y modales de la UI | `index.html` | `mostrarToast()`, `abrirModal()`, `cerrarModal()`, `scrollRecom()` | — | Verificado | — |
| T-15 | Nivel 3 (Componente) | Integración TheMealDB | Consultar API pública externa | `themealdb.js` | `buscarTheMealDB()` | Ninguna (no se carga desde ninguna página) | Verificado (como inactivo) | No es un componente activo; ninguna página lo carga |
| T-16 | Nivel 3 (Componente) | Capa de rutas (API) | Definir endpoints HTTP | `src/routes/*.js` | `router.get/post/delete(...)` | Rutas → Middlewares | Verificado | Componente nuevo del contenedor CookSmart API |
| T-17 | Nivel 3 (Componente) | Middleware JWT propio | Autenticar con JWT emitido por la API | `src/middlewares/authMiddleware.js` | `requireAuth`, `soloElMismoUsuario` | Middleware → Controllers | Verificado | Coexiste con T-18 (dos mecanismos de auth) |
| T-18 | Nivel 3 (Componente) | Middleware de verificación Firebase | Validar ID token de Firebase y aprovisionar usuario en Postgres | `src/middlewares/firebaseAuthMiddleware.js` | `requireFirebaseAuth`, `verifyIdToken`, `usuariosRepo.createFromFirebase` | Middleware → Firebase Authentication; Middleware → PostgreSQL | Verificado | Patrón de aprovisionamiento just-in-time |
| T-19 | Nivel 3 (Componente) | Controllers/Services/Repositories | Lógica de negocio y acceso a datos de la API | `src/controllers`, `src/services`, `src/repositories` | p. ej. `recetas.controller.js` → `recetas.service.js` → `recetas.repository.js` | Controllers → Services → Repositories → PostgreSQL | Verificado | — |
| T-20 | Nivel 3 (Componente) | Páginas no migradas al nuevo catálogo | Consultar recetas | `index.html`, `recetas.html`, `desayunos.html`, `almuerzos.html`, `cenas.html`, `rapido.html`, `mi-nevera.html`, `favoritos.html`, `perfil.html`, `receta-detalle.html` | `<script src="recetas-db.js">` | Página → archivo inexistente | **Corregido (documentado, código pendiente)** | El script referenciado ya no existe en el repositorio (ver T-07). Queda como hallazgo de la auditoría; se recomienda actualizar el `<script src>` a `recetas-loader.js` en estas 10 páginas |

---

## 6. Validación de la arquitectura

La identificación de los componentes se realizó revisando el código existente
del repositorio en el commit `846dacb`. Se verificó que:

1. `recetas-db.js` **no existe** en el repositorio actual (fue eliminado).
2. `recetas-loader.js` reemplaza su función, consumiendo `GET /api/recetas`.
3. Solo `login.html`, `registro.html` y `vegetariano.html` cargan
   `recetas-loader.js`; las demás páginas referencian el script eliminado.
4. `index.html` implementa funciones de renderizado, filtrado y favoritos que
   siguen operando sobre `window.RECETAS_DB`, sin que importe si esa variable
   la llenó el script viejo o el nuevo — pero hoy solo el nuevo existe.
5. `firebase-sync.js` sincroniza los favoritos con Firebase Realtime Database.
6. Existe una API propia completa (`Docker/Postgre/backend`) con rutas,
   controladores, servicios y repositorios, respaldada por PostgreSQL.
7. La API implementa dos mecanismos de autenticación (JWT propio y
   verificación de token de Firebase) que conviven en rutas distintas.

## 7. Limitaciones

Esta vista no representa como componentes activos funcionalidades que no se
pudieron comprobar en el código revisado. `themealdb.js` no se incluye como
componente activo porque ninguna página lo carga (T-15).

## 8. Registro de correcciones y eliminaciones (auditoría Módulo 3)

Este documento reemplaza además al archivo `08-validacion-c4-codigo.md`
existente en el repositorio, cuyo contenido de validación por componente se
incorpora aquí. **Ese archivo debe eliminarse del repositorio (o dejarse
fuera de la entrega en AVATA)**, ya que el enunciado exige exactamente tres
artefactos (`05-c4-contexto.md`, `06-c4-contenedores.md`,
`07-c4-componentes.md`).

Correcciones realizadas frente al modelo documentado el 28 de agosto de 2026
(mañana):

1. **Eliminado del modelo:** el contenedor/componente "Catálogo de recetas —
   `RECETAS_DB` en `recetas-db.js`" (T-07). Evidencia: el archivo fue borrado
   en el commit `f3d3931` ("agregada base PostgreSQL en docker, modificación
   en implementación existente de Firebase Auth y generación de seed").
2. **Agregado al modelo:** el contenedor CookSmart API y sus componentes
   internos (rutas, middlewares, controllers/services/repositories), y el
   contenedor PostgreSQL (T-05, T-06, T-08, T-16 a T-19). Evidencia: commits
   `28a5237`, `079ffab`, `18436a3`, `45d29b4`, `a8ebbdd`, todos del 28 de
   agosto de 2026 en horario posterior a la primera versión de este documento.
3. **Documentado como hallazgo, sin corregir en el código:** 10 de 13 páginas
   HTML referencian un script (`recetas-db.js`) que ya no existe (T-20). No se
   modificó el código como parte de esta auditoría documental; se deja
   registrado para que el equipo decida si lo corrige antes de la entrega o
   lo asume como deuda técnica conocida.

## 9. Audiencia y propósito

| Audiencia | Propósito |
|---|---|
| Equipo de desarrollo | Comprender la organización interna de CookSmart Web y CookSmart API |
| Docente | Verificar la correspondencia entre componentes y código, incluyendo lo corregido/eliminado |
| Integrantes del proyecto | Identificar responsabilidades y dependencias, y el estado real de la migración al backend |
| Futuros desarrolladores | Terminar la migración pendiente (T-20) y evolucionar el sistema |

Esta vista permite relacionar directamente cada componente arquitectónico con
las funciones y archivos que implementan su responsabilidad, y deja
constancia auditable de qué cambió entre la primera versión del modelo y el
estado real del código.
