# Decisión de Estilo Arquitectónico — CookSmart

## 1. Propósito

Este documento compara alternativas de estilo arquitectónico para CookSmart,
selecciona una de forma justificada contra los drivers priorizados y define
el mapa modular objetivo que debe guiar la organización del código.

La decisión se basa en el estado real del repositorio, que actualmente
incluye un frontend web, un backend Node.js con Express y una base de datos
PostgreSQL.

El objetivo es mantener una arquitectura que pueda ser desarrollada y
mantenida por un equipo pequeño, evitando complejidad innecesaria y
permitiendo evolución futura.

---

## 2. Contexto actual del sistema

CookSmart es una plataforma web que permite consultar recetas, gestionar
ingredientes disponibles, administrar preferencias y guardar información
relacionada con el usuario.

El repositorio actual contiene:

* Frontend web en HTML, CSS y JavaScript.
* Backend Node.js con Express.
* PostgreSQL como sistema de persistencia.
* Autenticación mediante el backend.
* Integración con servicios externos de recetas.
* Docker Compose para facilitar el entorno de ejecución.

El backend se encuentra organizado mediante rutas, controladores, servicios
y repositorios.

---

## 3. Drivers de calidad

La decisión arquitectónica considera los siguientes drivers:

* **Seguridad:** proteger la información de los usuarios y controlar el
  acceso a sus datos.
* **Usabilidad:** mantener una experiencia sencilla para el usuario.
* **Rendimiento:** responder adecuadamente a las solicitudes del sistema.
* **Disponibilidad:** reducir puntos de falla innecesarios.
* **Compatibilidad:** mantener una solución compatible con el entorno actual
  del proyecto.
* **Mantenibilidad:** facilitar que el equipo pueda modificar y extender
  el sistema.
* **Costo:** evitar infraestructura y complejidad que no estén justificadas
  por las necesidades actuales.

---

## 4. Estilos arquitectónicos evaluados

Se evaluaron las siguientes alternativas:

1. Monolito modular por capas.
2. Arquitectura hexagonal o limpia.
3. Microservicios.

---

## 5. Comparación de alternativas

| Estilo                              | Ventajas                                                                                                        | Desventajas                                                                                 | Adecuación actual                |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------- |
| **Monolito modular por capas**      | Menor complejidad operativa, despliegue sencillo, separación de responsabilidades y facilidad de mantenimiento. | Los módulos comparten el mismo despliegue y requieren disciplina para mantener sus límites. | **Alta**                         |
| **Arquitectura hexagonal o limpia** | Mayor aislamiento del dominio frente a infraestructura y facilidad para cambiar adaptadores.                    | Requiere más abstracciones, interfaces y estructura de código.                              | **Media**                        |
| **Microservicios**                  | Escalamiento y despliegue independiente de servicios.                                                           | Mayor complejidad de infraestructura, comunicación, monitoreo, despliegue y operación.      | **Baja para el contexto actual** |

---

## 6. Decisión de estilo arquitectónico

Se adopta un:

> **Monolito modular por capas**

Esta decisión significa que CookSmart se mantiene como una única aplicación
desplegable, pero internamente se organiza en módulos con responsabilidades
claras y dependencias controladas.

La arquitectura se organiza de la siguiente manera:

```text
┌──────────────────────────────────────────────────────────┐
│                    PRESENTACIÓN                           │
│                                                          │
│              HTML / CSS / JavaScript                     │
│                                                          │
│  index.html, login.html, perfil.html, mi-nevera.html,    │
│  favoritos.html, recetas.html, receta-detalle.html,      │
│  desayunos.html, almuerzos.html, cenas.html, rapido.html │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                         API HTTP                          │
│                                                          │
│                    Node.js / Express                     │
│                                                          │
│  server.js                                               │
│  routes/                                                  │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                    MÓDULOS DE NEGOCIO                    │
│                                                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │   Auth     │ │  Usuarios  │ │  Recetas   │            │
│  └────────────┘ └────────────┘ └────────────┘            │
│                                                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │ Inventario │ │ Favoritos  │ │ Historial  │            │
│  └────────────┘ └────────────┘ └────────────┘            │
│                                                          │
│                    ┌────────────┐                        │
│                    │ Catálogos  │                        │
│                    └────────────┘                        │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                       PERSISTENCIA                        │
│                                                          │
│              Repositories / PostgreSQL                   │
│                                                          │
│  config/db.js                                            │
│  repositories/                                            │
└──────────────────────────────────────────────────────────┘
```

---

## 7. Organización interna del backend

El backend se organiza mediante las siguientes capas:

### 7.1. Rutas

Ubicación:

```text
Docker/Postgre/backend/src/routes/
```

Responsabilidad:

* Definir los endpoints.
* Recibir solicitudes HTTP.
* Dirigir las solicitudes al controlador correspondiente.

Archivos principales:

* `auth.routes.js`
* `usuarios.routes.js`
* `recetas.routes.js`
* `catalogos.routes.js`

---

### 7.2. Controladores

Ubicación:

```text
Docker/Postgre/backend/src/controllers/
```

Responsabilidad:

* Recibir las solicitudes desde las rutas.
* Obtener los datos de entrada.
* Invocar la lógica correspondiente.
* Construir las respuestas HTTP.

Archivos principales:

* `auth.controller.js`
* `catalogos.controller.js`
* `favoritos.controller.js`
* `historial.controller.js`
* `inventario.controller.js`
* `recetas.controller.js`

---

### 7.3. Servicios

Ubicación:

```text
Docker/Postgre/backend/src/services/
```

Responsabilidad:

* Contener la lógica de negocio.
* Coordinar operaciones entre módulos.
* Aplicar reglas funcionales.
* Evitar que los controladores concentren toda la lógica.

Archivos principales:

* `auth.service.js`
* `catalogos.service.js`
* `favoritos.service.js`
* `historial.service.js`
* `inventario.service.js`
* `recetas.service.js`

---

### 7.4. Repositorios

Ubicación:

```text
Docker/Postgre/backend/src/repositories/
```

Responsabilidad:

* Encapsular el acceso a PostgreSQL.
* Ejecutar consultas.
* Persistir y recuperar información.
* Evitar que los controladores accedan directamente a la base de datos.

Archivos principales:

* `Usuarios.repository.js`
* `catalogos.repository.js`
* `favoritos.repository.js`
* `historial.repository.js`
* `inventario.repository.js`
* `recetas.repository.js`

---

### 7.5. Configuración y middleware

Ubicación:

```text
Docker/Postgre/backend/src/config/
Docker/Postgre/backend/src/middlewares/
```

Responsabilidad:

* Configuración de la conexión a PostgreSQL.
* Autenticación y autorización.
* Manejo de errores.
* Configuración general del servidor.

Archivos principales:

* `config/db.js`
* `middlewares/authMiddleware.js`
* `middlewares/errorHandler.js`

---

## 8. Módulos funcionales

### 8.1. Autenticación

**Responsabilidad:**

Gestionar el registro, inicio de sesión, validación de identidad y
operaciones relacionadas con la cuenta.

**Componentes principales:**

```text
routes/auth.routes.js
controllers/auth.controller.js
services/auth.service.js
middlewares/authMiddleware.js
```

**No debe encargarse de:**

* Gestionar recetas.
* Gestionar ingredientes.
* Gestionar favoritos.

---

### 8.2. Usuarios

**Responsabilidad:**

Gestionar la información del usuario, su perfil y sus preferencias.

**Componentes relacionados:**

```text
routes/usuarios.routes.js
controllers/auth.controller.js
services/auth.service.js
```

**No debe encargarse de:**

* Generar recetas.
* Administrar directamente la base de datos.
* Gestionar la interfaz.

---

### 8.3. Recetas

**Responsabilidad:**

Gestionar la consulta y procesamiento de información relacionada con recetas.

**Componentes principales:**

```text
routes/recetas.routes.js
controllers/recetas.controller.js
services/recetas.service.js
repositories/recetas.repository.js
```

**No debe encargarse de:**

* Autenticar usuarios.
* Gestionar directamente el frontend.
* Administrar favoritos.

---

### 8.4. Inventario

**Responsabilidad:**

Gestionar los ingredientes disponibles de los usuarios.

**Componentes principales:**

```text
controllers/inventario.controller.js
services/inventario.service.js
repositories/inventario.repository.js
```

**No debe encargarse de:**

* Generar recetas.
* Gestionar autenticación.
* Administrar favoritos.

---

### 8.5. Favoritos

**Responsabilidad:**

Gestionar las recetas que el usuario marca como favoritas.

**Componentes principales:**

```text
controllers/favoritos.controller.js
services/favoritos.service.js
repositories/favoritos.repository.js
```

**No debe encargarse de:**

* Gestionar autenticación.
* Administrar ingredientes.
* Modificar la información principal de una receta.

---

### 8.6. Historial

**Responsabilidad:**

Gestionar el registro de recetas o acciones relacionadas con el historial
del usuario.

**Componentes principales:**

```text
controllers/historial.controller.js
services/historial.service.js
repositories/historial.repository.js
```

**No debe encargarse de:**

* Gestionar autenticación.
* Administrar directamente el frontend.
* Gestionar la información principal de las recetas.

---

### 8.7. Catálogos

**Responsabilidad:**

Gestionar información de referencia utilizada por el sistema.

Puede incluir:

* Categorías de recetas.
* Tipos de cocina.
* Categorías de ingredientes.
* Ingredientes disponibles.

**Componentes principales:**

```text
routes/catalogos.routes.js
controllers/catalogos.controller.js
services/catalogos.service.js
repositories/catalogos.repository.js
```

---

## 9. Mapa modular del backend

```text
                         ┌──────────────────────┐
                         │       FRONTEND       │
                         │    HTML / CSS / JS   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │         API          │
                         │    Node.js/Express   │
                         └──────────┬───────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌────────────┐        ┌────────────┐        ┌────────────┐
      │    Auth    │        │  Usuarios  │        │  Recetas   │
      └────────────┘        └────────────┘        └────────────┘
             │                      │                      │
             └──────────────────────┼──────────────────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌────────────┐        ┌────────────┐        ┌────────────┐
      │ Inventario │        │ Favoritos  │        │ Historial  │
      └────────────┘        └────────────┘        └────────────┘
                                    │
                                    ▼
                             ┌────────────┐
                             │ Catálogos  │
                             └──────┬─────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     PostgreSQL       │
                         └──────────────────────┘
```

---

## 10. Dependencias permitidas

Las dependencias deben seguir principalmente el siguiente sentido:

```text
Rutas
  ↓
Controladores
  ↓
Servicios
  ↓
Repositorios
  ↓
PostgreSQL
```

La API debe utilizar los módulos de negocio correspondientes.

Los controladores no deben contener consultas SQL directamente.

Los servicios deben concentrar la lógica de negocio.

Los repositorios deben concentrar el acceso a PostgreSQL.

---

## 11. Dependencias no permitidas

No se permiten:

* Rutas que ejecuten consultas SQL directamente.
* Controladores que contengan toda la lógica de negocio.
* Servicios que manipulen directamente el DOM.
* Acceso directo del frontend a PostgreSQL.
* Dependencias circulares entre módulos.
* Un módulo que modifique directamente el estado interno de otro.
* Consultas SQL repetidas en diferentes capas sin justificación.

Ejemplo de dependencia no permitida:

```text
Frontend → PostgreSQL
```

Ejemplo de organización que debe evitarse:

```text
Controller → SQL directo
```

La organización esperada es:

```text
Controller → Service → Repository → PostgreSQL
```

---

## 12. Cohesión y acoplamiento

Se busca mantener alta cohesión dentro de cada módulo.

Por ejemplo, el módulo de recetas debe concentrar responsabilidades
relacionadas con recetas y no con autenticación o inventario.

También se busca bajo acoplamiento entre módulos.

Cuando un módulo necesite información de otro, debe utilizar una interfaz,
servicio o mecanismo claramente definido.

Esto permite modificar un módulo sin afectar innecesariamente a los demás.

---

## 13. Seguridad

El monolito modular permite centralizar mecanismos de seguridad en el
backend.

Entre los controles relevantes se encuentran:

* Validación de autenticación.
* Autorización de operaciones.
* Validación de datos recibidos.
* Uso de variables de entorno para secretos.
* Acceso controlado a PostgreSQL.
* Manejo centralizado de errores.
* Evitar exposición de información sensible.

El middleware de autenticación permite controlar el acceso a rutas que
requieren identidad del usuario.

La modularidad mejora la organización del código, pero no reemplaza los
mecanismos de seguridad.

---

## 14. Alternativas descartadas

### Microservicios

Se descartan para el contexto actual porque introducirían:

* Mayor complejidad operativa.
* Despliegues independientes.
* Comunicación entre servicios.
* Mayor necesidad de monitoreo.
* Mayor cantidad de configuraciones.
* Mayor costo de mantenimiento.

Actualmente no existen drivers suficientes que justifiquen esa
complejidad.

### Arquitectura hexagonal o limpia completa

Se considera una alternativa válida para una evolución futura.

Sin embargo, para el alcance actual se prioriza una estructura por capas
más sencilla de implementar y mantener.

La decisión no significa que hexagonal o limpia sean malas arquitecturas,
sino que su costo de adopción no se considera necesario en este momento.

---

## 15. Evolución futura

Si CookSmart crece y aparecen necesidades de escalamiento independiente,
despliegues separados o equipos diferentes trabajando sobre módulos
específicos, se podrá evaluar la extracción de determinados módulos como
servicios independientes.

Esta decisión deberá basarse en evidencia y no únicamente en la
posibilidad técnica.

---

## 16. Relación con los ADR

Este documento sustenta:

* `docs/adr/ADR-001-estilo-arquitectonico.md`
* `docs/adr/ADR-002-limites-modulos-dependencias.md`

El ADR-001 formaliza la decisión de estilo.

El ADR-002 formaliza los límites y reglas de dependencia.

---

## 17. Conclusión

El monolito modular por capas es adecuado para el contexto actual de
CookSmart porque permite organizar el backend mediante responsabilidades
claras, mantener un despliegue sencillo y reducir la complejidad operativa.

La arquitectura propuesta permite que el sistema evolucione de manera
progresiva sin introducir microservicios antes de que existan drivers que
justifiquen esa decisión.
