# ADR-001 - Estilo arquitectónico

- **Estado:** Aceptado
- **Fecha:** 2026-09-17
- **Decisión:** Arquitectura monolítica modular por capas
- **Sistema:** CookSmart

---

# 1. Contexto

CookSmart cuenta actualmente con un frontend web que se comunica mediante HTTP/REST con una API propia desarrollada en Node.js/Express.

La persistencia actual utiliza PostgreSQL.

```text
Usuario
   ↓
CookSmart Web
   ↓ HTTP / REST
CookSmart API
   ↓
PostgreSQL
```

Dentro de la API se mantiene una separación por capas:

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

La prioridad arquitectónica del equipo es mantener claro el límite de comunicación entre la API y la base de datos.

---

# 2. Problema

El sistema necesita organizar la lógica de presentación HTTP, negocio y persistencia sin que el frontend ni las capas superiores dependan directamente de PostgreSQL.

También es necesario que la arquitectura actual sea coherente con los experimentos de rendimiento realizados con k6.

Los experimentos muestran:

| Experimento | Resultado principal |
|---|---|
| `diagnostico.js` | 50 VUs, 6.349 solicitudes, 0% errores, P95 HTTP 232,94 ms |
| `load-test.js` | 50 VUs, 500 solicitudes, 0% errores, P95 global 9,72 s |

El segundo experimento evidencia degradación de latencia bajo un recorrido concurrente completo. La causa no se atribuye de forma exclusiva a PostgreSQL; puede involucrar autenticación, consultas, pool de conexiones, servicios u otras capas.

---

# 3. Decisión

Se adopta como estilo arquitectónico actual una:

> **Arquitectura monolítica modular organizada por capas.**

El flujo principal es:

```text
┌──────────────┐
│    Routes    │
└──────┬───────┘
       ▼
┌──────────────┐
│ Controllers  │
└──────┬───────┘
       ▼
┌──────────────┐
│   Services   │
└──────┬───────┘
       ▼
┌──────────────┐
│ Repositories │
└──────┬───────┘
       │ SQL / pg
       ▼
┌──────────────┐
│  PostgreSQL  │
└──────────────┘
```

El frontend consume la API y no accede directamente a PostgreSQL.

---

# 4. Reglas arquitectónicas

| Regla | Descripción |
|---|---|
| **R1** | El frontend se comunica con el backend mediante HTTP/REST |
| **R2** | Las routes definen los endpoints HTTP |
| **R3** | Los controllers adaptan solicitudes y respuestas HTTP |
| **R4** | Los services concentran la lógica de negocio |
| **R5** | Los repositories encapsulan la persistencia |
| **R6** | PostgreSQL se accede desde la capa de persistencia |
| **R7** | La autenticación protegida utiliza JWT |
| **R8** | El flujo de dependencias debe mantenerse dirigido hacia la persistencia |

---

# 5. Implementación actual

La estructura relevante del backend se organiza alrededor de:

```text
src/
├── config/
├── controllers/
├── middlewares/
├── repositories/
├── routes/
├── services/
└── server.js
```

La configuración de PostgreSQL se utiliza mediante el pool y el driver correspondiente.

El acceso de los clientes sigue:

```text
Cliente Web
    │
    │ HTTP/REST
    ▼
Routes
    ▼
Controllers
    ▼
Services
    ▼
Repositories
    ▼
PostgreSQL
```

---

# 6. Relación con los experimentos k6

Los experimentos permiten observar el comportamiento desde el punto de entrada HTTP de la API.

## PR01 - Diagnóstico

| Métrica | Resultado |
|---|---:|
| VUs | **50** |
| Solicitudes | **6.349** |
| Errores | **0,00%** |
| P95 HTTP | **232,94 ms** |
| P95 recetas | **234 ms** |

El escenario concentrado cumple los umbrales experimentales definidos.

## PR02 - Recorrido completo

| Métrica | Resultado |
|---|---:|
| VUs | **50** |
| Iteraciones | **50** |
| Solicitudes | **500** |
| Errores | **0,00%** |
| Checks | **100%** |
| P95 global | **9,72 s** |
| P95 login | **17,93 s** |

El recorrido funciona correctamente desde el punto de vista HTTP, pero presenta degradación de latencia.

> El resultado no permite concluir que PostgreSQL sea por sí solo la causa de la latencia. El análisis debe seguir el flujo completo API → services → repositories → PostgreSQL y las operaciones de autenticación.

---

# 7. Alternativas consideradas

| Alternativa | Relación con el estado actual |
|---|---|
| Microservicios | No corresponde a la implementación actualmente documentada |
| API Gateway independiente | No corresponde a la implementación actualmente documentada |
| Firebase como persistencia activa | Corresponde a una línea histórica, no al estado actual |
| Redis como infraestructura activa | No se documenta como componente activo actual |
| Arquitectura monolítica modular por capas | Corresponde al backend actualmente documentado |

---

# 8. Consecuencias

## Positivas

- Separación clara de responsabilidades.
- Comunicación centralizada con PostgreSQL.
- Menor acoplamiento entre HTTP y persistencia.
- Facilita pruebas por capa.
- Facilita el seguimiento de una solicitud desde la API hasta la base de datos.
- Mantiene una estructura compatible con el tamaño actual del proyecto.

## Costos

- Las solicitudes atraviesan varias capas.
- La latencia puede verse afectada por operaciones realizadas en diferentes capas.
- La separación requiere mantener interfaces y responsabilidades claras.

---

# 9. Relación con C4

La decisión es consistente con el modelo C4 actual:

```text
Contexto
   ↓
Contenedores
   ↓
Componentes
```

En el nivel de componentes, la API mantiene el flujo:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
DB Config
   ↓
PostgreSQL
```

---

# 10. Resumen de la decisión

CookSmart se documenta actualmente como un **monolito modular por capas**, con PostgreSQL como persistencia y una API Node.js/Express como punto de comunicación entre el frontend y la base de datos.

La comunicación **API → PostgreSQL** constituye un límite arquitectónico central y debe conservarse explícitamente en la evolución del sistema.
