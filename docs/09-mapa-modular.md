# Mapa modular — CookSmart

## 1. Propósito

Este documento presenta el mapa modular de la aplicación CookSmart, identificando los principales módulos funcionales del sistema, sus responsabilidades, componentes internos y relaciones.

El objetivo es mostrar cómo se organiza internamente el backend y cómo se separan las responsabilidades para facilitar el mantenimiento, evolución y trazabilidad de la aplicación.

La propuesta corresponde a una arquitectura de **monolito modular por capas**, donde los módulos forman parte de una misma aplicación backend, pero mantienen responsabilidades diferenciadas.

---

# 2. Visión general

CookSmart es una aplicación web que permite a los usuarios gestionar ingredientes disponibles, consultar recetas, administrar favoritos, consultar historial y administrar su información y preferencias.

La arquitectura actual está compuesta principalmente por:

* **Frontend web:** HTML, CSS y JavaScript.
* **Backend:** Node.js + Express.
* **Base de datos:** PostgreSQL.
* **API REST:** expuesta mediante rutas HTTP.
* **Autenticación:** gestionada desde el backend mediante mecanismos de autenticación y autorización.
* **Persistencia:** implementada mediante repositorios.

El backend funciona como una aplicación monolítica organizada internamente mediante módulos y capas.

---

# 3. Mapa modular

```text
                              ┌─────────────────────────┐
                              │       USUARIO           │
                              │                         │
                              │ Consulta y administra   │
                              │ sus recetas e           │
                              │ información personal    │
                              └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │       FRONTEND          │
                              │                         │
                              │ HTML / CSS / JavaScript │
                              └────────────┬────────────┘
                                           │
                                           │ HTTP / JSON
                                           ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         COOKSMART BACKEND                                │
│                         Node.js + Express                                 │
│                                                                           │
│  ┌──────────────────┐      ┌──────────────────┐                          │
│  │ Módulo           │      │ Módulo           │                          │
│  │ Autenticación    │      │ Usuarios         │                          │
│  │                  │      │                  │                          │
│  │ Registro         │      │ Perfil           │                          │
│  │ Login            │      │ Preferencias     │                          │
│  │ Sesión           │      │ Inventario       │                          │
│  └────────┬─────────┘      └────────┬─────────┘                          │
│           │                         │                                    │
│           └────────────┬────────────┘                                    │
│                        │                                                 │
│                        ▼                                                 │
│  ┌──────────────────┐      ┌──────────────────┐                          │
│  │ Módulo           │      │ Módulo           │                          │
│  │ Recetas          │      │ Favoritos        │                          │
│  │                  │      │                  │                          │
│  │ Consultar        │      │ Consultar        │                          │
│  │ recetas          │      │ Agregar          │                          │
│  │ Detalle          │      │ Eliminar         │                          │
│  └────────┬─────────┘      └────────┬─────────┘                          │
│           │                         │                                    │
│           └────────────┬────────────┘                                    │
│                        │                                                 │
│                        ▼                                                 │
│  ┌──────────────────┐      ┌──────────────────┐                          │
│  │ Módulo           │      │ Módulo           │                          │
│  │ Catálogos        │      │ Historial        │                          │
│  │                  │      │                  │                          │
│  │ Categorías       │      │ Consultar        │                          │
│  │ Tipos de cocina  │      │ Registrar        │                          │
│  │ Ingredientes     │      │                  │                          │
│  └────────┬─────────┘      └────────┬─────────┘                          │
│           │                         │                                    │
│           └────────────┬────────────┘                                    │
│                        │                                                 │
│                        ▼                                                 │
│               ┌─────────────────────┐                                    │
│               │ PostgreSQL          │                                    │
│               │                     │                                    │
│               │ Persistencia de     │                                    │
│               │ información         │                                    │
│               └─────────────────────┘                                    │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

# 4. Módulos principales

## 4.1 Módulo de autenticación

### Responsabilidad

Gestionar el acceso de los usuarios al sistema y validar las operaciones que requieren autenticación.

### Funcionalidades

* Registro de usuarios.
* Inicio de sesión.
* Consulta de usuario autenticado.
* Actualización de información personal.
* Actualización de preferencias.
* Cambio de contraseña.
* Protección de rutas.

### Rutas principales

```text
POST   /api/auth/registro
POST   /api/auth/login
GET    /api/auth/me
PATCH  /api/auth/me
PATCH  /api/auth/me/preferencias
PATCH  /api/auth/me/password
```

### Componentes identificados

```text
routes/auth.routes.js
controllers/auth.controller.js
services/auth.service.js
middlewares/auth.middleware.js
repositories/Usuarios.repository.js
```

---

# 5. Módulo de usuarios

## Responsabilidad

Gestionar la información relacionada con el usuario y las operaciones personales de la aplicación.

Dentro de este módulo se encuentran funcionalidades relacionadas con:

* Inventario de ingredientes.
* Historial de recetas.
* Favoritos.
* Información asociada al usuario.

### Componentes

```text
controllers/inventario.controller.js
controllers/historial.controller.js
controllers/favoritos.controller.js

services/inventario.service.js
services/historial.service.js
services/favoritos.service.js

repositories/inventario.repository.js
repositories/historial.repository.js
repositories/favoritos.repository.js
```

### Relación

```text
Usuario
   │
   ├── Inventario
   │
   ├── Favoritos
   │
   └── Historial
```

---

# 6. Módulo de recetas

## Responsabilidad

Gestionar la consulta y recuperación de recetas disponibles en CookSmart.

### Funcionalidades

* Obtener recetas.
* Consultar una receta específica.
* Procesar la información relacionada con recetas.
* Acceder a la persistencia de recetas.

### Rutas

```text
GET /api/recetas
GET /api/recetas/:id
```

### Componentes

```text
routes/recetas.routes.js
controllers/recetas.controller.js
services/recetas.service.js
repositories/recetas.repository.js
```

### Flujo

```text
Frontend
   │
   ▼
recetas.routes.js
   │
   ▼
recetas.controller.js
   │
   ▼
recetas.service.js
   │
   ▼
recetas.repository.js
   │
   ▼
PostgreSQL
```

---

# 7. Módulo de favoritos

## Responsabilidad

Permitir al usuario guardar y administrar recetas que desea consultar posteriormente.

### Funcionalidades

* Consultar favoritos.
* Agregar una receta a favoritos.
* Eliminar una receta de favoritos.

### Rutas

```text
GET    /api/usuarios/:idUsuario/favoritos
POST   /api/usuarios/:idUsuario/favoritos
DELETE /api/usuarios/:idUsuario/favoritos
```

### Componentes

```text
controllers/favoritos.controller.js
services/favoritos.service.js
repositories/favoritos.repository.js
```

### Flujo

```text
Usuario
   │
   ▼
Frontend
   │
   ▼
API
   │
   ▼
Favoritos Controller
   │
   ▼
Favoritos Service
   │
   ▼
Favoritos Repository
   │
   ▼
PostgreSQL
```

---

# 8. Módulo de inventario

## Responsabilidad

Gestionar los ingredientes disponibles para cada usuario.

El inventario representa los productos o ingredientes que el usuario tiene disponibles y que pueden utilizarse como parte de la lógica de CookSmart.

### Funcionalidades

* Consultar inventario.
* Agregar ingredientes.
* Eliminar ingredientes.

### Rutas

```text
GET    /api/usuarios/:idUsuario/inventario
POST   /api/usuarios/:idUsuario/inventario
DELETE /api/usuarios/:idUsuario/inventario
```

### Componentes

```text
controllers/inventario.controller.js
services/inventario.service.js
repositories/inventario.repository.js
```

---

# 9. Módulo de historial

## Responsabilidad

Registrar y consultar las recetas o acciones relacionadas con el historial del usuario.

### Funcionalidades

* Consultar historial.
* Registrar elementos en el historial.

### Rutas

```text
GET  /api/usuarios/:idUsuario/historial
POST /api/usuarios/:idUsuario/historial
```

### Componentes

```text
controllers/historial.controller.js
services/historial.service.js
repositories/historial.repository.js
```

---

# 10. Módulo de catálogos

## Responsabilidad

Proporcionar información de referencia utilizada por la aplicación.

### Catálogos disponibles

* Categorías de recetas.
* Tipos de cocina.
* Categorías de ingredientes.
* Ingredientes.

### Rutas

```text
GET /api/categorias-receta
GET /api/tipos-cocina
GET /api/categorias-ingrediente
GET /api/ingredientes
```

### Componentes

```text
routes/catalogos.routes.js
controllers/catalogos.controller.js
services/catalogos.service.js
repositories/catalogos.repository.js
```

---

# 11. Organización interna de cada módulo

Los módulos del backend utilizan una separación por responsabilidades.

```text
                  ┌─────────────────────────┐
                  │         ROUTE           │
                  │                         │
                  │ Define endpoints HTTP   │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │       CONTROLLER        │
                  │                         │
                  │ Recibe la petición      │
                  │ y genera la respuesta   │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │         SERVICE         │
                  │                         │
                  │ Contiene la lógica      │
                  │ de aplicación           │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │       REPOSITORY        │
                  │                         │
                  │ Gestiona el acceso      │
                  │ a los datos             │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │       PostgreSQL        │
                  └─────────────────────────┘
```

Esta separación evita que las rutas manejen directamente la persistencia y permite mantener las responsabilidades diferenciadas.

---

# 12. Reglas de dependencia

Las dependencias principales deben seguir el siguiente sentido:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
PostgreSQL
```

Se busca evitar dependencias directas como:

```text
Routes ───────────────► PostgreSQL
Controllers ─────────► PostgreSQL
Frontend ────────────► Repository
```

La intención es que cada capa utilice la responsabilidad de la capa siguiente y no conozca detalles innecesarios de implementación.

---

# 13. Relaciones entre módulos

Las principales relaciones funcionales son:

```text
                 ┌───────────────┐
                 │ Autenticación │
                 └───────┬───────┘
                         │
                         ▼
                  ┌────────────┐
                  │  Usuarios  │
                  └─────┬──────┘
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
    ┌──────────┐  ┌───────────┐  ┌───────────┐
    │Inventario│  │ Favoritos │  │ Historial │
    └────┬─────┘  └─────┬─────┘  └─────┬─────┘
         │              │              │
         └──────────────┼──────────────┘
                        │
                        ▼
                  ┌────────────┐
                  │  Recetas   │
                  └─────┬──────┘
                        │
                        ▼
                  ┌────────────┐
                  │ Catálogos  │
                  └────────────┘
```

---

# 14. Mapa de responsabilidades

| Módulo        | Responsabilidad principal           | Componentes                                 |
| ------------- | ----------------------------------- | ------------------------------------------- |
| Autenticación | Registro, login, sesión y seguridad | Controller, Service, Middleware, Repository |
| Usuarios      | Gestión de información del usuario  | Controller, Service, Repository             |
| Inventario    | Gestión de ingredientes del usuario | Controller, Service, Repository             |
| Recetas       | Consulta de recetas                 | Controller, Service, Repository             |
| Favoritos     | Gestión de recetas favoritas        | Controller, Service, Repository             |
| Historial     | Registro y consulta del historial   | Controller, Service, Repository             |
| Catálogos     | Información de referencia           | Controller, Service, Repository             |

---

# 15. Trazabilidad con el código real

El mapa modular se puede verificar directamente en la estructura del backend.

| Módulo        | Archivo principal                      | Evidencia                                          |
| ------------- | -------------------------------------- | -------------------------------------------------- |
| Autenticación | `routes/auth.routes.js`                | Endpoints de registro, login y usuario autenticado |
| Recetas       | `routes/recetas.routes.js`             | Endpoints para consultar recetas                   |
| Catálogos     | `routes/catalogos.routes.js`           | Endpoints de catálogos                             |
| Usuarios      | `routes/usuarios.routes.js`            | Operaciones asociadas al usuario                   |
| Inventario    | `controllers/inventario.controller.js` | Gestión de inventario                              |
| Favoritos     | `controllers/favoritos.controller.js`  | Gestión de favoritos                               |
| Historial     | `controllers/historial.controller.js`  | Gestión del historial                              |
| Persistencia  | `repositories/`                        | Acceso a PostgreSQL                                |
| Configuración | `config/db.js`                         | Configuración de conexión a PostgreSQL             |
| Aplicación    | `server.js`                            | Inicialización de Express y rutas                  |

---

# 16. Estructura modular representada en el proyecto

La estructura relevante del backend puede representarse así:

```text
backend/
│
├── src/
│   │
│   ├── server.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── recetas.routes.js
│   │   ├── catalogos.routes.js
│   │   └── usuarios.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── recetas.controller.js
│   │   ├── catalogos.controller.js
│   │   ├── inventario.controller.js
│   │   ├── favoritos.controller.js
│   │   └── historial.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── recetas.service.js
│   │   ├── catalogos.service.js
│   │   ├── inventario.service.js
│   │   ├── favoritos.service.js
│   │   └── historial.service.js
│   │
│   ├── repositories/
│   │   ├── Usuarios.repository.js
│   │   ├── recetas.repository.js
│   │   ├── catalogos.repository.js
│   │   ├── inventario.repository.js
│   │   ├── favoritos.repository.js
│   │   └── historial.repository.js
│   │
│   └── middlewares/
│       ├── auth.middleware.js
│       └── errorHandler.js
│
└── package.json
```

---

# 17. Justificación del mapa modular

La organización modular permite separar las funcionalidades principales de CookSmart sin convertir cada funcionalidad en un servicio independiente.

Esta decisión resulta adecuada para el proyecto porque:

1. El sistema todavía tiene un tamaño manejable.
2. El equipo puede mantener un único backend.
3. Se reducen los problemas de comunicación entre múltiples servicios.
4. Las responsabilidades se encuentran separadas.
5. La lógica de negocio se mantiene principalmente en los servicios.
6. El acceso a PostgreSQL se concentra en los repositorios.
7. Las rutas HTTP se mantienen separadas de la persistencia.
8. En el futuro podrían extraerse módulos específicos si el crecimiento del sistema lo requiere.

El enfoque permite mantener la simplicidad operacional de un monolito mientras se mejora la separación interna del código.

---

# 18. Estado actual y evolución

El mapa representa la arquitectura actual del backend y sirve como base para continuar la evolución de CookSmart.

La arquitectura puede evolucionar posteriormente hacia módulos con límites más estrictos, donde cada módulo exponga únicamente las operaciones necesarias para otros módulos.

Como objetivo futuro se busca evitar que un módulo acceda directamente a las estructuras internas de otro módulo y favorecer interfaces o contratos explícitos entre ellos.

```text
Estado actual

Frontend
    ↓
Express API
    ↓
Routes
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
PostgreSQL


Evolución esperada

Frontend
    ↓
API
    ↓
┌──────────────────────────────────────┐
│          Monolito modular            │
│                                      │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ Usuarios│ │ Recetas │ │ Catálogos│ │
│ └─────────┘ └─────────┘ └─────────┘ │
│                                      │
│ ┌─────────┐ ┌─────────┐             │
│ │Favoritos│ │Historial│             │
│ └─────────┘ └─────────┘             │
└──────────────────────────────────────┘
                ↓
           PostgreSQL
```

---

# 19. Conclusión

El mapa modular de CookSmart identifica las principales responsabilidades del sistema y muestra cómo se organizan dentro del backend.

La arquitectura propuesta mantiene una única aplicación desplegable, pero divide internamente sus responsabilidades en módulos funcionales y capas.

Los módulos principales son:

* Autenticación.
* Usuarios.
* Inventario.
* Recetas.
* Favoritos.
* Historial.
* Catálogos.

Esta estructura proporciona una base para mantener la trazabilidad entre los requisitos funcionales, la arquitectura y el código fuente.

Además, permite que el proyecto evolucione progresivamente hacia límites modulares más fuertes sin introducir desde el inicio la complejidad de una arquitectura distribuida.
