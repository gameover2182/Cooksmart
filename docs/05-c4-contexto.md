# C4 - Diagrama de Contexto de CookSmart

## 1. Propósito de la vista

Esta vista representa el contexto actual de CookSmart, identificando el sistema,
sus usuarios y los sistemas externos con los que interactúa.

La vista corresponde a la arquitectura real implementada y no incluye componentes
de la arquitectura propuesta como trabajo futuro.

> **Nota de auditoría (Módulo 3):** esta versión reemplaza la anterior porque,
> tras validar contra el código, se encontró que el equipo agregó un backend
> propio (API + PostgreSQL) el 28 de agosto de 2026, con posterioridad a la
> primera versión de este documento. La versión anterior excluía ese backend
> como "trabajo futuro"; esa afirmación ya no es correcta y se corrige aquí.
> Ver sección 10 para el detalle de la corrección.

## 2. Audiencia

- Profesor y evaluadores del curso de Arquitectura de Software / Arquitectura Empresarial.
- Integrantes del equipo de desarrollo.
- Personas que necesiten comprender los límites del sistema sin revisar el código.

## 3. Sistema

### CookSmart

Aplicación web que permite a los usuarios gestionar los ingredientes disponibles
en su nevera y consultar recetas personalizadas de acuerdo con dichos ingredientes.

La implementación actual está compuesta por:

- Un frontend en HTML, CSS y JavaScript ejecutado en el navegador.
- Una API propia (Node.js/Express) que expone recetas, catálogos, usuarios,
  inventario, historial y favoritos, respaldada por una base de datos PostgreSQL.

## 4. Personas

### Usuario final

Persona que utiliza CookSmart para:

- Registrarse e iniciar sesión.
- Gestionar los ingredientes disponibles en su nevera.
- Consultar recetas.
- Filtrar recetas por categorías.
- Consultar su perfil.
- Gestionar sus recetas favoritas.
- Consultar su historial de recetas preparadas.

## 5. Sistemas externos

### Firebase Authentication

Servicio externo utilizado por CookSmart para gestionar la autenticación
de los usuarios desde el navegador (registro, inicio y cierre de sesión,
inicio de sesión con Google). El backend propio también verifica el token
de identidad emitido por Firebase para las rutas que lo requieren.

### Firebase Realtime Database

Servicio externo utilizado por CookSmart para la persistencia y sincronización
de los favoritos del usuario asociados a su sesión de Firebase.

## 6. Relaciones

| Origen | Destino | Relación |
|---|---|---|
| Usuario final | CookSmart | Utiliza la aplicación web |
| CookSmart | Firebase Authentication | Gestiona registro, inicio y cierre de sesión; el backend verifica el token de identidad |
| CookSmart | Firebase Realtime Database | Consulta y persiste los favoritos sincronizados desde el cliente |

## 7. Límites del sistema

El sistema evaluado corresponde a la implementación actualmente disponible
en el repositorio.

Incluye:

- HTML, CSS y JavaScript del frontend.
- API propia en Node.js/Express (carpeta `Docker/Postgre/backend`).
- Base de datos PostgreSQL propia del proyecto.
- Firebase Authentication.
- Firebase Realtime Database.

No se consideran parte del sistema actual:

- Redis.
- Motor de IA/Claude.
- API Gateway o malla de microservicios independientes (la API actual es un
  único servicio Express, no una arquitectura de microservicios).

Estos elementos corresponden a una arquitectura propuesta o de trabajo futuro
y no forman parte de la arquitectura actualmente implementada.

## 8. Validación contra el código

El contexto fue construido a partir de la implementación real del repositorio,
en el commit `846dacb` de la rama `main`.

- La existencia de Firebase Authentication y Firebase Realtime Database se
  evidencia mediante `firebase-sync.js` y el middleware
  `Docker/Postgre/backend/src/middlewares/firebaseAuthMiddleware.js`.
- La existencia de la API propia se evidencia mediante
  `Docker/Postgre/backend/src/server.js`, sus rutas (`src/routes/*.js`) y
  `Docker/Postgre/docker-compose.yml` (servicios `db` y `api`).
- La existencia de PostgreSQL se evidencia mediante
  `Docker/Postgre/init/01_schema.sql` (tablas `usuario`, `receta`,
  `ingrediente`, `inventario_usuario`, `favorito`, `historial_receta`, entre otras)
  y `Docker/Postgre/backend/src/config/db.js`.
- Las interfaces principales del sistema están implementadas mediante archivos
  HTML, CSS y JavaScript ubicados en la raíz del repositorio.

## 9. Decisiones y correcciones

El diagrama representa únicamente la arquitectura actual (as-is). Se excluyeron
los elementos que no tienen una implementación correspondiente en el repositorio
actual (Redis, motor de IA, API Gateway/microservicios independientes).

## 10. Trazabilidad del contexto al código

| Elemento del contexto | Evidencia en el repositorio | Responsabilidad |
|---|---|---|
| Usuario final | `login.html`, `registro.html`, `index.html`, `mi-nevera.html`, `recetas.html`, `favoritos.html`, `perfil.html` | Permitir al usuario interactuar con las funcionalidades de CookSmart |
| CookSmart (frontend) | Archivos HTML, JavaScript y CSS de la raíz del repositorio | Implementar la interfaz y la lógica de interacción de la aplicación web |
| CookSmart (API propia) | `Docker/Postgre/backend/src/server.js`, `src/routes/*.js` | Exponer recetas, catálogos, usuarios, inventario, historial y favoritos |
| CookSmart (base de datos) | `Docker/Postgre/init/01_schema.sql`, `Docker/Postgre/docker-compose.yml` | Persistir de forma relacional los datos del sistema |
| Firebase Authentication | `firebase-sync.js`, `firebaseAuthMiddleware.js` | Gestionar registro, inicio y cierre de sesión; verificar identidad en el backend |
| Firebase Realtime Database | `firebase-sync.js` | Persistir y sincronizar los favoritos asociados al usuario autenticado |

### Evidencia de corrección arquitectónica

Durante la revisión de la arquitectura se comparó el modelo documentado
inicialmente (versión del 28 de agosto de 2026, mañana) con la implementación
disponible en el repositorio al momento de esta auditoría.

Se identificó que:

- El archivo `recetas-db.js` (catálogo `RECETAS_DB` hardcodeado), citado como
  evidencia en la versión anterior de este documento, **fue eliminado** del
  repositorio el 28 de agosto de 2026 (commit `f3d3931`, mensaje: *"agregada
  base PostgreSQL en docker, modificación en implementación existente de
  Firebase Auth y generación de seed"*). Ya no existe en el código y no puede
  usarse como evidencia.
- Ese mismo commit introdujo `recetas-loader.js`, que reemplaza al catálogo
  estático y consulta la nueva API propia.
- Los elementos "API Gateway, microservicios, MySQL/PostgreSQL, Redis y un
  motor de IA", que la versión anterior excluía en bloque como "trabajo
  futuro", ya no son correctos en conjunto: **PostgreSQL y una API propia sí
  existen** y están implementados (ver sección 8). Redis y el motor de IA
  siguen sin evidencia en el código y se mantienen excluidos.

Por esta razón, se corrigió el contexto para incluir la API propia y
PostgreSQL como parte del sistema actual, y se dejó constancia de esta
corrección para que sea auditable frente al historial de Git.
