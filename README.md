# CookSmart

CookSmart es una plataforma web que genera recetas personalizadas usando exclusivamente los ingredientes disponibles en la nevera del usuario, con el fin de reducir el desperdicio de alimentos en hogares de Bogotá.

## Equipo

| Integrante | Rol en el dossier |
|---|---|
| Juan Manuel Bermúdez Rodríguez | Contexto y base ejecutable |
| Miguel Ángel Santamaría Cuero | Escenarios de calidad |
| Leonardo Juan Pablo Leon Robelto | Medición ejecutable (k6), C4, decisión de estilo arquitectónico |

## Sistema base — arquitectura actual

- **Repositorio:** [https://github.com/gameover2182/Cooksmart.git](https://github.com/gameover2182/Cooksmart.git)

- **Commit/versión de referencia:** el último commit de `main` (`git log -1`)

- **Stack real (verificado en la documentación y evidencia disponible del proyecto):** HTML, CSS, JavaScript y un backend propio en Node.js/Express con PostgreSQL como persistencia. La base de datos está levantada con Docker Compose (`Docker/Postgre/`). La arquitectura actual se organiza como un monolito modular por capas: routes, controllers, services y repositories, con PostgreSQL como límite de persistencia. La autenticación del backend utiliza JWT y bcrypt.

- **Semana actual:** Semana 10 (Módulo 5 — Dominio, APIs, eventos e integración)

> **Nota importante:** existe un documento del proyecto en fase inicial (`Proyecto_Arquitectura_de_software.pdf`) que describe una arquitectura de microservicios con API Gateway, Redis y base de datos relacional, además de un plan de pruebas extenso. Esa arquitectura **no está implementada** en el sistema actual. Para la versión actual, se documenta como antecedente arquitectónico y no como parte del sistema base. El sistema base que documentamos es el actual: frontend estático + API propia (Node/Express) + PostgreSQL, organizada como monolito modular por capas (ver `docs/adr/ADR-001-estilo-arquitectonico.md`).

## Estado del trabajo: ejecutado vs. pendiente

### Ya ejecutado

| Trabajo | Evidencia |
|---|---|
| Medición por endpoint con k6 sobre la API propia (`GET /api/recetas`, 50 VUs × 20 s) | `k6-demo/diagnostico.js`, sección "Medición ejecutable" |
| Recorrido completo autenticado con métricas por operación (50 VUs × 20 s) | Versión de `k6-demo/load-test.js` del commit `3da63ea` (ver nota de trazabilidad abajo) |
| Carga progresiva hasta 500 VUs | `k6-demo/load-test.js` actual (commit `a57e7d9`); **resultados aún no registrados** en el dossier |
| Módulo 5: dominio, Context Map, contrato API, Spike 1, ADR-003, análisis CQRS/eventos | Ver `docs/m5-auditoria-evidencia.md` |

### Pendiente / Roadmap

- Pruebas automatizadas funcionales y de seguridad (PSeg01–PSeg04 siguen sin prueba específica).
- Registrar resultados de la carga progresiva hasta 500 VUs con su propio protocolo (condiciones + ≥ 3 corridas).
- Diagnóstico por capa del login (bcrypt vs. consulta vs. pool), riesgo R-02. Candidato a Spike 2 (opcional).
- Automatizar como *fitness function* las reglas de dependencia de `docs/adr/ADR-002-limites-modulos-dependencias.md` y la verificación del contrato `docs/integracion/openapi-v1.yaml`.
- Corregir el contrato de `GET /api/recetas` para incluir `ingredientes` (cambio compatible v1.1, `docs/integracion/09-api-eventos-integracion.md` §4.4).

## Evidencia del Módulo 5 — dónde auditarla

Todo está en la rama `main` (PR #33 y #34). Enlaces directos:

| # | Evidencia que pide M5 | Archivo |
|---|---|---|
| 1 | Mapa de dominio: subdominios y contextos acotados | [docs/dominio/mapa-dominio.md](https://github.com/gameover2182/Cooksmart/blob/main/docs/dominio/mapa-dominio.md) |
| 1 | Context Map con relaciones justificadas en el código | [docs/dominio/context-map.md](https://github.com/gameover2182/Cooksmart/blob/main/docs/dominio/context-map.md) |
| 2 | Contrato API + decisión síncrono/asíncrono + catálogo de eventos filtrado | [docs/integracion/09-api-eventos-integracion.md](https://github.com/gameover2182/Cooksmart/blob/main/docs/integracion/09-api-eventos-integracion.md) |
| 2 | Contrato OpenAPI 3.0.3 versionado (nivel avanzado) | [docs/integracion/openapi-v1.yaml](https://github.com/gameover2182/Cooksmart/blob/main/docs/integracion/openapi-v1.yaml) |
| 2 | Auditoría de eventos propuestos por IA (reales / redundantes / inventados) | [docs/ia/auditoria-eventos-m5.md](https://github.com/gameover2182/Cooksmart/blob/main/docs/ia/auditoria-eventos-m5.md) |
| 3 | Spike 1: pre-registro, condiciones, resultados crudos, veredicto | [experimentos/spike-01-integracion/](https://github.com/gameover2182/Cooksmart/tree/main/experimentos/spike-01-integracion) |
| 3 | Veredicto del Spike 1 (AJUSTADA) | [03-veredicto.md](https://github.com/gameover2182/Cooksmart/blob/main/experimentos/spike-01-integracion/03-veredicto.md) |
| 4 | ADR-003 con referencia explícita al spike | [docs/adr/ADR-003-integracion-entre-contextos.md](https://github.com/gameover2182/Cooksmart/blob/main/docs/adr/ADR-003-integracion-entre-contextos.md) |
| 5 | Aplicabilidad de CQRS, Event Sourcing, eventos y consistencia eventual | [docs/integracion/aplicabilidad-cqrs-eventos.md](https://github.com/gameover2182/Cooksmart/blob/main/docs/integracion/aplicabilidad-cqrs-eventos.md) |
| — | Auditoría de evidencia (medición vs. spike, trazabilidad Git, preguntas de defensa) | [docs/m5-auditoria-evidencia.md](https://github.com/gameover2182/Cooksmart/blob/main/docs/m5-auditoria-evidencia.md) |

Cadena del Spike 1: **hipótesis pre-registrada** (`914a9ab`) → **cambio experimental** (`87728bf`) → **ejecución, 3 corridas por modo** (`3f3455f`) → **veredicto + ADR-003** (`8777b67`) → **reversión del código** (`95de6b7`). Ver la sección "Trazabilidad del Spike 1" más abajo.

## Cómo levantar el sistema

El sistema tiene ahora dos partes que se levantan por separado:

**1. Frontend estático** (raíz del repo):

```bash
git clone https://github.com/gameover2182/Cooksmart.git

# Abrir index.html directamente en el navegador
# No requiere build para el frontend estático
```

**2. Backend (API + PostgreSQL, en Docker):**

```bash
cd Docker/Postgre

cp .env.example .env

# completar las variables requeridas en .env

docker compose up --build
```

- La API queda expuesta en `http://localhost:3000` (healthcheck en `GET /health`, verifica también la conexión a PostgreSQL).

- Adminer (administración de la base de datos) queda expuesto en `http://localhost:5433`.

- El esquema (`init/01_schema.sql`) y los datos semilla (`init/02_seed.sql`) se cargan automáticamente al levantar el contenedor de PostgreSQL por primera vez.

- Las rutas protegidas utilizan autenticación mediante JWT en el header `Authorization: Bearer <token>`.

- La persistencia principal de recetas, inventario, favoritos, historial y demás datos del backend se realiza actualmente mediante PostgreSQL.

## Estructura del dossier y del repositorio (actualizada)

| Documento | Ruta real en el repo | Módulo |
|---|---|---|
| Contexto y drivers | `docs/01-contexto-y-drivers.md` | M1 |
| Escenarios de calidad | `docs/02-Escenarios-de-calidad.md` | M2 |
| Experimento de línea base (k6) | `experimentos/EXP-001-linea-base/` y `experimentos/condiciones.md` | M2 |
| C4 — Contexto | `docs/05-c4-contexto.md` | M3 |
| C4 — Contenedores | `docs/06-c4-contenedores.md` | M3 |
| C4 — Componentes | `docs/07-c4-componentes.md` | M3 |
| Validación C4 vs. código | `docs/08-validacion-c4-codigo.md` | M3 |
| ADR 1 — Estilo arquitectónico | `docs/adr/ADR-001-estilo-arquitectonico.md` | M4 |
| ADR 2 — Límites de módulos y dependencias | `docs/adr/ADR-002-limites-modulos-dependencias.md` | M4 |
| Mapa de dominio (subdominios y contextos acotados) | `docs/dominio/mapa-dominio.md` | M5 |
| Context Map | `docs/dominio/context-map.md` | M5 |
| API, eventos e integración (sync vs async, contrato) | `docs/integracion/09-api-eventos-integracion.md` | M5 |
| Contrato OpenAPI v1 | `docs/integracion/openapi-v1.yaml` | M5 |
| Aplicabilidad de CQRS / eventos / Event Sourcing | `docs/integracion/aplicabilidad-cqrs-eventos.md` | M5 |
| Auditoría de eventos propuestos por IA | `docs/ia/auditoria-eventos-m5.md` | M5 |
| Spike 1 — integración síncrona vs asíncrona | `experimentos/spike-01-integracion/` | M5 |
| ADR 3 — Integración entre contextos | `docs/adr/ADR-003-integracion-entre-contextos.md` | M5 |
| Auditoría de evidencia de M5 (índice, medición vs. spike, trazabilidad Git) | `docs/m5-auditoria-evidencia.md` | M5 |
| Backend propio (API + PostgreSQL) | `Docker/Postgre/` | Sistema actual |

## Medición ejecutable (k6)

Se mantienen dos scripts de medición principales:

| Script | Propósito | Configuración | Resultado |
|---|---|---|---|
| `k6-demo/diagnostico.js` | Diagnóstico concentrado de `GET /api/recetas` | 50 VUs durante 20 s | P95 HTTP **232,94 ms**, 0 % de errores |
| `k6-demo/load-test.js` | Recorrido completo autenticado de la API | 50 VUs durante 20 s | 0 % de errores, P95 global **9,72 s** |

### `k6-demo/diagnostico.js`

- 50 VUs
- 20 s
- 6.349 solicitudes HTTP
- 0,00 % de errores
- 100 % de checks exitosos
- P95 HTTP: 232,94 ms
- P95 `GET /api/recetas`: 234 ms

### `k6-demo/load-test.js`

El recorrido completo ejecuta:

```text
LOGIN
→ PERFIL
→ RECETAS
→ DETALLE
→ CATEGORÍAS
→ TIPOS DE COCINA
→ INGREDIENTES
→ FAVORITOS
→ HISTORIAL
→ INVENTARIO
```

Resultados registrados:

| Métrica | Resultado |
|---|---:|
| VUs máximos | **50** |
| Iteraciones | **50** |
| Solicitudes HTTP | **500** |
| Errores HTTP | **0,00 %** |
| Checks | **100 %** |
| P95 HTTP global | **9,72 s** |
| P95 login | **17,93 s** |
| P95 perfil | **1,29 s** |
| P95 recetas | **1,20 s** |
| P95 detalle | **1,59 s** |
| P95 categorías | **1,16 s** |
| P95 tipos de cocina | **1,08 s** |
| P95 ingredientes | **1,14 s** |
| P95 favoritos | **1,04 s** |
| P95 historial | **1,16 s** |
| P95 inventario | **300,75 ms** |

> El recorrido completo incluye pausas entre operaciones. Por ello, 50 VUs no equivalen a 50 solicitudes por segundo.

> **Cómo leer el "P95 HTTP global = 9,72 s":** es el percentil 95 de **todas** las solicitudes HTTP del recorrido mezcladas (login + 9 consultas), **no** el tiempo de respuesta de un endpoint ni de la API en general. En esa versión del script cada iteración hacía su propio login, así que los logins eran el 10 % de las 500 solicitudes; como el P95 mira el 5 % más lento, ese valor cae dentro de la distribución del login (P95 ≈ 17,93 s). Las demás operaciones tuvieron P95 entre 0,30 s y 1,59 s.

> **Trazabilidad de estos números:** la tabla anterior se obtuvo con la versión de `k6-demo/load-test.js` del commit `3da63ea` (`vus: 50`, `duration: '20s'`, login en cada iteración). El script **actual** (commit `a57e7d9`) es distinto: hace el login **una sola vez** en `setup()` y aplica carga progresiva hasta 500 VUs. Por eso **no reproduce** estos números y sus resultados no deben compararse directamente con ellos. Para reproducir la tabla: `git show 3da63ea:k6-demo/load-test.js > /tmp/load-test-50vu.js && k6 run /tmp/load-test-50vu.js`.

## Estado de calidad

| Atributo | Evidencia actual | Estado |
|---|---|---|
| Seguridad | JWT, autenticación y separación de acceso; pruebas específicas de seguridad aún pendientes | Parcial |
| Rendimiento | `diagnostico.js` cumple el criterio experimental de P95 < 500 ms; `load-test.js` presenta degradación de latencia en el recorrido completo | Parcial |
| Disponibilidad | RNF03 exige una disponibilidad mínima del 95 %; todavía no se cuenta con una medición prolongada que lo demuestre | Pendiente |
| Mantenibilidad | Arquitectura organizada por capas y reglas explícitas de dependencia | Implementado |

El RNF04 establece máximo 3 segundos para las consultas de recetas y la visualización de ingredientes. En el recorrido registrado, sus P95 fueron **1,20 s** y **1,14 s**, respectivamente.

## Trazabilidad del Spike 1 (Módulo 5)

El orden de los commits demuestra que la hipótesis se registró **antes** de implementar y medir:

| Paso | Commit | Comando para mostrarlo |
|---|---|---|
| 1. Pre-registro (hipótesis, criterio, alcance, instrumento k6) | `914a9ab` | `git show --stat 914a9ab` |
| 2. Cambio experimental (escritura asíncrona detrás de `FAVORITOS_MODO`) | `87728bf` | `git show 87728bf` |
| 3. Ejecución (calentamiento + 3 corridas por modo) y datos crudos | `3f3455f` | `git show --stat 3f3455f` |
| 4. Veredicto (AJUSTADA), ADR-003, análisis CQRS/eventos | `8777b67` | `git show --stat 8777b67` |
| 5. Reversión del código experimental | `95de6b7` | `git show 95de6b7` |

Vista completa con fecha y hora: `git log --date=iso --format="%h %ad %s" 914a9ab^..95de6b7`

## Convención de commits

Usamos Conventional Commits para los mensajes de commit:

- `feat:` una nueva característica para el usuario

- `fix:` arregla un bug que afecta al usuario

- `docs:` cambios en la documentación

- `refactor:` refactorización del código (sin cambiar comportamiento)

- `style:` cambios de formato que no afectan al usuario

- `test:` añade o refactoriza tests

- `perf:` cambios que mejoran el rendimiento

- `build:` cambios en el sistema de build o despliegue

- `ci:` cambios en integración continua

Ejemplo: `docs: agregar contexto y drivers arquitectónicos preliminares`

## Trazabilidad Git

Cada integrante trabaja en su propia rama y abre un Pull Request hacia `main` antes de fusionar. El historial completo de PRs fusionados queda visible en la pestaña **Pull Requests** del repositorio: [https://github.com/gameover2182/Cooksmart/pulls?q=is%3Apr+is%3Aclosed](https://github.com/gameover2182/Cooksmart/pulls?q=is%3Apr+is%3Aclosed)
