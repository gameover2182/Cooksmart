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

- **Semana actual:** Semana 8 (Módulo 4 — Estilos arquitectónicos)

> **Nota importante:** existe un documento del proyecto en fase inicial (`Proyecto_Arquitectura_de_software.pdf`) que describe una arquitectura de microservicios con API Gateway, Redis y base de datos relacional, además de un plan de pruebas extenso. Esa arquitectura **no está implementada** en el sistema actual. Para la versión actual, se documenta como antecedente arquitectónico y no como parte del sistema base. El sistema base que documentamos es el actual: frontend estático + API propia (Node/Express) + PostgreSQL, organizada como monolito modular por capas (ver `docs/ADR-001-estilo-arquitectonico.md`).

## Roadmap / Trabajo futuro

- Fortalecer las pruebas automatizadas y ampliar la cobertura de pruebas funcionales y de seguridad.

- Ampliar los experimentos de rendimiento con k6 a escenarios de mayor duración, distintas cargas y medición por endpoint.

- Automatizar como *fitness function* las reglas de dependencia entre módulos definidas en `docs/ADR-002-limites-modulos-dependencias.md`.

- Continuar con la optimización y diagnóstico del recorrido completo de la API, especialmente en la comunicación API → PostgreSQL, autenticación y acceso a datos.

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
| ADR 1 — Estilo arquitectónico | `docs/ADR-001-estilo-arquitectonico.md` | M4 |
| ADR 2 — Límites de módulos y dependencias | `docs/ADR-002-limites-modulos-dependencias.md` | M4 |
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

## Estado de calidad

| Atributo | Evidencia actual | Estado |
|---|---|---|
| Seguridad | JWT, autenticación y separación de acceso; pruebas específicas de seguridad aún pendientes | Parcial |
| Rendimiento | `diagnostico.js` cumple el criterio experimental de P95 < 500 ms; `load-test.js` presenta degradación de latencia en el recorrido completo | Parcial |
| Disponibilidad | RNF03 exige una disponibilidad mínima del 95 %; todavía no se cuenta con una medición prolongada que lo demuestre | Pendiente |
| Mantenibilidad | Arquitectura organizada por capas y reglas explícitas de dependencia | Implementado |

El RNF04 establece máximo 3 segundos para las consultas de recetas y la visualización de ingredientes. En el recorrido registrado, sus P95 fueron **1,20 s** y **1,14 s**, respectivamente.

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
