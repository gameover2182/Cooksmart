# C4 - Diagrama de Contexto de CookSmart

## 1. Propósito de la vista

Esta vista representa el contexto actual de CookSmart, identificando el sistema,
sus usuarios y los sistemas externos con los que interactúa.

La vista corresponde a la arquitectura real implementada y no incluye componentes
de la arquitectura propuesta como trabajo futuro.

> **Nota de actualización:** esta versión actualiza la documentación para reflejar
> la migración completa de persistencia y autenticación hacia la infraestructura
> propia de CookSmart. PostgreSQL constituye la base de datos actual y la API
> Node.js/Express constituye el backend del sistema. Firebase ya no forma parte
> del flujo actual del sistema.

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
- Una API propia en Node.js/Express.
- Una base de datos PostgreSQL propia del proyecto.

La API expone las operaciones relacionadas con recetas, catálogos, autenticación,
usuarios, inventario, historial y favoritos.

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

### No se identifican sistemas externos activos como dependencia obligatoria

La arquitectura actual concentra autenticación y persistencia en los componentes
propios de CookSmart.

- La autenticación se realiza mediante JWT generado por la API propia.
- Las contraseñas se gestionan en el backend utilizando `bcryptjs`.
- La persistencia se realiza en PostgreSQL.
- El frontend consume la API mediante HTTP/REST.

Firebase Authentication y Firebase Realtime Database corresponden a la arquitectura
anterior y no forman parte del contexto actual.

Integraciones como TheMealDB, Redis o un motor de IA pueden mantenerse como
elementos preparados o de trabajo futuro, pero no se representan como sistemas
externos activos del `as-is` mientras no exista un flujo implementado que los utilice.

## 6. Relaciones

| Origen | Destino | Relación |
|---|---|---|
| Usuario final | CookSmart | Utiliza la aplicación web |
| CookSmart Web | CookSmart API | Consume operaciones mediante HTTP/REST |
| CookSmart API | PostgreSQL | Consulta y persiste los datos mediante SQL |

## 7. Límites del sistema

El sistema evaluado corresponde a la implementación actualmente disponible
en el repositorio.

Incluye:

- HTML, CSS y JavaScript del frontend.
- API propia en Node.js/Express (`Docker/Postgre/backend`).
- Autenticación propia mediante JWT.
- Base de datos PostgreSQL propia del proyecto.
- Lógica de negocio y acceso a datos organizados por capas.

No se consideran parte del sistema actual:

- Firebase Authentication.
- Firebase Realtime Database.
- Redis.
- Motor de IA/Claude.
- API Gateway.
- Malla de microservicios independientes.
- Servicio independiente de notificaciones.

Estos elementos corresponden a la arquitectura inicial, integraciones evaluadas
o trabajo futuro y no forman parte de la arquitectura actualmente implementada.

## 8. Validación contra el código

El contexto se valida contra la implementación actual del repositorio.

- La existencia de la API propia se evidencia mediante
  `Docker/Postgre/backend/src/server.js`, sus rutas, controladores, servicios
  y repositorios.
- La autenticación propia se implementa mediante las rutas de `/api/auth/*`
  y middleware de JWT.
- La existencia de PostgreSQL se evidencia mediante
  `Docker/Postgre/init/01_schema.sql`, `Docker/Postgre/backend/src/config/db.js`
  y `Docker/Postgre/docker-compose.yml`.
- El frontend está implementado mediante archivos HTML, CSS y JavaScript
  ubicados en la raíz del repositorio.
- `auth-sync.js` consume la API propia para registro, login, logout y operaciones
  autenticadas mediante Bearer token.

## 9. Decisiones y correcciones

El diagrama representa únicamente la arquitectura actual (`as-is`).

La principal corrección frente a versiones anteriores consiste en retirar
Firebase como dependencia arquitectónica activa y representar PostgreSQL y la
API propia como los elementos responsables de autenticación, lógica de negocio
y persistencia.

La arquitectura de microservicios descrita en el documento inicial se conserva
como referencia histórica, pero no se representa como la implementación actual:
el backend vigente corresponde a una única aplicación Node.js/Express organizada
por capas.

## 10. Trazabilidad del contexto al código

| Elemento del contexto | Evidencia en el repositorio | Responsabilidad |
|---|---|---|
| Usuario final | `login.html`, `registro.html`, `index.html`, `mi-nevera.html`, `recetas.html`, `favoritos.html`, `perfil.html` | Permitir al usuario interactuar con las funcionalidades de CookSmart |
| CookSmart Web | Archivos HTML, JavaScript y CSS de la raíz | Implementar la interfaz y la lógica de interacción de la aplicación web |
| CookSmart API | `Docker/Postgre/backend/src/server.js`, `src/routes/*.js` | Exponer las operaciones HTTP del sistema |
| Autenticación JWT | `src/routes/auth.routes.js`, `src/middlewares/authMiddleware.js`, `auth-sync.js` | Registrar, autenticar y autorizar usuarios |
| Servicios de negocio | `src/services/*.js` | Implementar reglas de negocio |
| Persistencia | `src/repositories/*.js`, `src/config/db.js` | Ejecutar operaciones sobre PostgreSQL |
| PostgreSQL | `Docker/Postgre/init/01_schema.sql`, `docker-compose.yml` | Persistir de forma relacional los datos del sistema |

### Evidencia de la migración

La implementación actual establece un flujo de persistencia propio:

```text
Usuario
   ↓
CookSmart Web
   ↓ HTTP/REST + JWT
CookSmart API
   ↓
Routes → Controllers → Services → Repositories
   ↓ SQL
PostgreSQL
```

Este flujo reemplaza el modelo anterior basado en Firebase para las funciones
que ahora son gestionadas por la API propia y PostgreSQL.
