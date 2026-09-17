# Atributos de calidad, QAs y Trade Off

Con base en los requisitos no funcionales y en la implementación actualmente verificable de CookSmart, se actualizan los escenarios de calidad para representar el sistema **as-is**.

> **Alcance arquitectónico:** esta versión describe únicamente la arquitectura actualmente implementada: frontend web, API Node.js/Express y PostgreSQL. Firebase, Redis, API Gateway, microservicios independientes y motor de IA no se presentan como infraestructura activa.

| Atributo | Soporte |
|---|---|
| **Seguridad** | RNF02 - Protección de datos personales, autenticación y autorización |
| **Rendimiento** | RNF04 - Recetas e ingredientes en máximo 3 segundos; k6 utiliza además P95 < 500 ms como criterio experimental |
| **Disponibilidad** | RNF03 - Disponibilidad mínima del 95% |
| **Mantenibilidad** | RNF06 - Organización modular y arquitectura por capas |

---

# Escenarios de calidad (QAs)

Los escenarios se expresan mediante las seis partes tradicionales:

**Fuente del estímulo → Estímulo → Artefacto → Ambiente → Respuesta → Medida de respuesta.**

La arquitectura evaluada puede resumirse así:

```text
                           ┌──────────────────────┐
                           │       Usuario        │
                           └──────────┬───────────┘
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │    CookSmart Web     │
                           │   HTML / CSS / JS    │
                           └──────────┬───────────┘
                                      │
                                      │ HTTP / REST + JWT
                                      ▼
                    ┌─────────────────────────────────────┐
                    │          CookSmart API              │
                    │                                     │
                    │ Routes → Controllers → Services     │
                    │             → Repositories          │
                    └─────────────────┬───────────────────┘
                                      │ SQL / pg
                                      ▼
                           ┌──────────────────────┐
                           │      PostgreSQL      │
                           └──────────────────────┘
```

## Seguridad

| # | Fuente | Estímulo | Artefacto | Ambiente | Respuesta | Medida |
|---|---|---|---|---|---|---|
| **PSeg01** | Usuario no autenticado | Envía correo o contraseña incorrectos | API de autenticación | Operación normal | Rechazar las credenciales y no crear una sesión válida | HTTP 401 y ausencia de token; prueba específica pendiente |
| **PSeg02** | Usuario autenticado | Intenta acceder a información de otro usuario modificando el identificador | Middleware JWT, API, servicios y repositorios | Sesión autenticada | Validar identidad y autorización antes de acceder al recurso | 0 accesos no autorizados; prueba específica pendiente |
| **PSeg03** | Cliente | Envía JWT inválido, alterado o expirado | Middleware de autenticación | Endpoint protegido | Rechazar la solicitud antes de procesar el recurso | HTTP 401; prueba específica pendiente |
| **PSeg04** | Cliente malicioso | Envía contenido destinado a manipular consultas o ejecutar código | API, validaciones y repositories | Operación normal | Tratar la entrada como dato y evitar ejecución no autorizada | 0 ejecuciones no autorizadas; prueba específica pendiente |

> Los escenarios de seguridad no quedan validados por los experimentos k6 actuales, porque `diagnostico.js` y `load-test.js` comprueban principalmente respuestas funcionales válidas.

---

# Rendimiento

## PR01 - Diagnóstico de `GET /api/recetas`

**Script:** `k6-demo/diagnostico.js`

| Campo | Descripción |
|---|---|
| **Fuente** | 50 usuarios virtuales generados por k6 |
| **Estímulo** | Solicitudes concurrentes a `GET /api/recetas` |
| **Artefacto** | API Node.js/Express + capas internas + PostgreSQL |
| **Ambiente** | Ejecución local contra `http://localhost:3000` durante 20 s |
| **Respuesta** | HTTP 200 y respuesta JSON válida |
| **Medida** | `http_req_failed < 1%`, P95 HTTP < 500 ms y P95 de recetas < 500 ms |

### Resultado

| Métrica | Resultado | Criterio | Estado |
|---|---:|---:|---|
| VUs máximos | **50** | 50 | **Ejecutado** |
| Solicitudes HTTP | **6.349** | - | **Ejecutado** |
| Errores HTTP | **0,00%** | < 1% | **Cumple** |
| Checks | **100%** | - | **Cumple** |
| P95 HTTP | **232,94 ms** | < 500 ms | **Cumple** |
| P95 recetas | **234 ms** | < 500 ms | **Cumple** |

### Interpretación

El diagnóstico mantuvo respuestas HTTP válidas y JSON correcto bajo 50 VUs. El escenario cumple los umbrales definidos para esta prueba.

---

## PR02 - Recorrido completo de la API

**Script:** `k6-demo/load-test.js`

El recorrido implementado es:

```text
┌──────────┐
│  LOGIN   │
└────┬─────┘
     ▼
┌──────────┐
│  PERFIL  │
└────┬─────┘
     ▼
┌──────────┐
│ RECETAS  │
└────┬─────┘
     ▼
┌──────────────┐
│ DETALLE      │
└────┬─────────┘
     ▼
┌──────────────┐
│ CATEGORÍAS   │
└────┬─────────┘
     ▼
┌──────────────┐
│ TIPOS COCINA │
└────┬─────────┘
     ▼
┌──────────────┐
│ INGREDIENTES │
└────┬─────────┘
     ▼
┌──────────────┐
│ FAVORITOS    │
└────┬─────────┘
     ▼
┌──────────────┐
│ HISTORIAL    │
└────┬─────────┘
     ▼
┌──────────────┐
│ INVENTARIO   │
└──────────────┘
```

| Campo | Descripción |
|---|---|
| **Fuente** | 50 usuarios virtuales generados por k6 |
| **Estímulo** | Recorrido completo autenticado y consultas de catálogo |
| **Artefacto** | API Node.js/Express + PostgreSQL |
| **Ambiente** | Ejecución local durante 20 s, con pausas entre operaciones |
| **Respuesta** | Completar las operaciones con respuestas HTTP válidas |
| **Medida** | Errores HTTP < 1%; P95 global < 500 ms; P95 login < 2 s |

### Resultado registrado

| Métrica | Resultado | Criterio | Estado |
|---|---:|---:|---|
| VUs máximos | **50** | 50 | **Ejecutado** |
| Iteraciones | **50** | - | **Ejecutado** |
| Solicitudes HTTP | **500** | - | **Ejecutado** |
| Errores HTTP | **0,00%** | < 1% | **Cumple** |
| Checks | **100%** | - | **Cumple** |
| P95 HTTP global | **9,72 s** | < 500 ms | **No cumple** |
| P95 login | **17,93 s** | < 2 s | **No cumple** |
| P95 perfil | **1,29 s** | < 500 ms | **No cumple** |
| P95 recetas | **1,20 s** | < 500 ms | **No cumple** |
| P95 detalle | **1,59 s** | < 500 ms | **No cumple** |
| P95 categorías | **1,16 s** | < 500 ms | **No cumple** |
| P95 tipos cocina | **1,08 s** | < 500 ms | **No cumple** |
| P95 ingredientes | **1,14 s** | < 500 ms | **No cumple** |
| P95 favoritos | **1,04 s** | < 500 ms | **No cumple** |
| P95 historial | **1,16 s** | < 500 ms | **No cumple** |
| P95 inventario | **300,75 ms** | < 500 ms | **Cumple** |

### Interpretación

El flujo completo terminó correctamente: **0,00% de errores HTTP y 100% de checks exitosos**. El incumplimiento corresponde a tiempos de respuesta bajo concurrencia.

El mayor valor fue el login, con P95 de **17,93 segundos**. También se observa degradación en las operaciones posteriores. Inventario fue el único endpoint de las métricas específicas del recorrido que mantuvo P95 inferior a 500 ms.

El resultado no demuestra por sí solo que PostgreSQL, bcrypt, el pool o una capa específica sea la única causa. La comunicación **API → PostgreSQL** debe analizarse conjuntamente con el resto del backend.

> **Importante:** 50 VUs no equivalen a 50 solicitudes por segundo, porque el script incluye pausas entre operaciones.

## PR03 - Relación con RNF04

El RNF04 establece máximo 3 segundos para consultas de recetas y visualización de ingredientes.

En el recorrido de 50 VUs:

| Operación | P95 obtenido | RNF04 | Resultado frente a RNF04 |
|---|---:|---:|---|
| Recetas | **1,20 s** | < 3 s | **Dentro del límite** |
| Ingredientes | **1,14 s** | < 3 s | **Dentro del límite** |

Estos valores están por debajo de 3 segundos, aunque superan el criterio adicional de P95 < 500 ms utilizado por el experimento.

---

# Disponibilidad

## PA01 - Operación normal

| Elemento | Descripción |
|---|---|
| Fuente | Usuarios |
| Estímulo | Acceso normal a recetas y datos de usuario |
| Artefacto | API y PostgreSQL |
| Ambiente | Operación normal |
| Respuesta | Atender solicitudes correctamente |
| Medida | RNF03: disponibilidad ≥ 95% |

**Estado:** Pendiente de medición prolongada.

## PA02 - Carga concurrente

| Elemento | Descripción |
|---|---|
| Fuente | Usuarios virtuales |
| Estímulo | 50 VUs ejecutando el recorrido |
| Artefacto | API y PostgreSQL |
| Ambiente | Carga concurrente |
| Respuesta | Mantener respuestas válidas |
| Medida | 0,00% de errores HTTP en el recorrido ejecutado |

**Estado:** Observado parcialmente. Este resultado no demuestra por sí solo el cumplimiento de una disponibilidad del 95% durante un periodo prolongado.

---

# Mantenibilidad

## PM01 - Separación de responsabilidades

| Elemento | Descripción |
|---|---|
| Fuente | Equipo de desarrollo |
| Estímulo | Necesidad de modificar una funcionalidad de la API |
| Artefacto | Routes, Controllers, Services, Repositories y configuración de DB |
| Ambiente | Evolución normal del sistema |
| Respuesta | Modificar la capa correspondiente sin introducir dependencias innecesarias entre capas |
| Medida | Mantener el flujo de dependencias `Routes → Controllers → Services → Repositories → PostgreSQL` |

**Estado:** Implementado como criterio arquitectónico.

---

# Estado de los escenarios

| Escenario | Tipo | Estado actual |
|---|---|---|
| PSeg01 - PSeg04 | Seguridad | Pendiente de pruebas específicas |
| PR01 - Diagnóstico de recetas | Rendimiento | **Ejecutado y cumple** |
| PR02 - Recorrido completo | Rendimiento | **Ejecutado; funcionalmente correcto, con incumplimientos de latencia** |
| PR03 - RNF04 | Rendimiento | **Recetas e ingredientes dentro de 3 s en el recorrido registrado** |
| PA01 - Disponibilidad prolongada | Disponibilidad | Pendiente |
| PA02 - Carga concurrente | Disponibilidad | Observado parcialmente |
| PM01 - Separación de responsabilidades | Mantenibilidad | Implementado como criterio arquitectónico |

---

# Experimento histórico

El experimento `experimentos/EXP-001-linea-base/` corresponde a una **línea base histórica con Firebase Realtime Database**.

No debe utilizarse como evidencia de rendimiento actual de PostgreSQL. Su valor es comparativo e histórico, ya que evaluó un sistema anterior con Firebase.

---

# Trade Offs

| Se mejora | Se puede afectar | Justificación |
|---|---|---|
| Seguridad | Rendimiento | La autenticación, autorización, hashing y validaciones agregan trabajo por solicitud. |
| Rendimiento | Mantenibilidad | Optimizaciones específicas pueden aumentar la complejidad del código y de las consultas. |
| Disponibilidad | Complejidad | Mecanismos adicionales de redundancia y monitoreo aumentan la complejidad operativa. |
| Mantenibilidad | Rendimiento | La separación estricta por capas puede introducir pasos adicionales entre la solicitud HTTP y la persistencia. |

> En la arquitectura actual, el principal punto de análisis es el flujo **API → Repositories → PostgreSQL**, sin atribuir de antemano la latencia observada a un único componente.

# Conclusión

Los experimentos actuales muestran dos comportamientos distintos:

1. `diagnostico.js` obtiene P95 de aproximadamente **233 ms** bajo 50 VUs y 0% de errores.
2. `load-test.js` completa el recorrido funcional con **0% de errores y 100% de checks**, pero presenta degradación de latencia bajo concurrencia.

Por tanto, los resultados deben interpretarse junto con la arquitectura actual y utilizarse para investigar el comportamiento de las distintas capas, especialmente la comunicación **API → PostgreSQL**, autenticación y acceso a datos.
