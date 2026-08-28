# CookSmart

CookSmart es una plataforma web que genera recetas personalizadas usando exclusivamente los ingredientes disponibles en la nevera del usuario, con el fin de reducir el desperdicio de alimentos en hogares de Bogotá.

## Equipo

| Integrante | Rol en el dossier |
|---|---|
| Juan Manuel Bermúdez Rodríguez | Contexto y base ejecutable |
| Miguel Ángel Santamaría Cuero | Escenarios de calidad |
| Leonardo Juan Pablo Leon Robelto | Medición ejecutable (k6), C4, decisión de estilo arquitectónico |

## Sistema base

- **Repositorio:** https://github.com/gameover2182/Cooksmart.git
- **Commit/versión evaluada:** ver el último commit de `main` en el momento de la entrega (`git log -1`)
- **Stack real (verificado en el repo):** HTML, CSS, JavaScript, Firebase Auth, Firebase Realtime Database. Sin backend propio, sin base de datos relacional, sin tests automatizados.
- **Semana actual:** Semana 8 (Módulo 4 — Estilos arquitectónicos)

> ⚠️ **Nota importante:** existe un documento del proyecto en fase inicial (`Proyecto_Arquitectura_de_software.pdf`) que describe una arquitectura de microservicios con API Gateway, Redis y base de datos relacional, y un plan de pruebas extenso. Esa arquitectura **no está implementada** en el repositorio actual. **Decisión de equipo (M1 y ratificada en M4):** esa arquitectura se documenta como Roadmap / Trabajo futuro, no como el sistema evaluado. El sistema base evaluado es el actual: estático + Firebase, organizado como monolito modular por capas (ver `Docs/08-decision-estilo-arquitectonico.md`).

## Roadmap / Trabajo futuro

- Arquitectura de microservicios del PDF original (Auth, Usuarios, Inventario, Recomendación, Notificaciones detrás de API Gateway).
- Migración de parte de la lógica a Firebase Cloud Functions (evaluado y descartado del alcance actual en `Docs/08-decision-estilo-arquitectonico.md`, sección 2).
- Automatizar como *fitness function* las reglas de dependencia entre módulos definidas en `Docs/adr/ADR-002-limites-modulos-dependencias.md`.

## Cómo levantar el sistema

El sistema no requiere instalación: los archivos `.html` se abren directamente en el navegador y funcionan contra Firebase (Auth + Realtime Database) como backend.

```bash
# Clonar el repositorio
git clone https://github.com/gameover2182/Cooksmart.git
# Abrir index.html directamente en el navegador
# No requiere servidor local, build ni dependencias adicionales
```

Las credenciales de configuración de Firebase están en `firebase-sync.js`. Para el experimento de medición (`experimentos/EXP-001-linea-base/`), la autenticación de prueba usa variables de entorno (`FIREBASE_API_KEY`, `FIREBASE_TEST_EMAIL`, `FIREBASE_TEST_PASSWORD`) en lugar de credenciales hardcodeadas en el script.

## Estructura del dossier

| Documento | Ruta real en el repo | Módulo |
|---|---|---|
| Contexto y drivers | `Docs/01-contexto-y-drivers.md` | M1 |
| Escenarios de calidad | `Docs/02-Escenarios-de-calidad.md` | M2 |
| Experimento de línea base (k6) | `experimentos/EXP-001-linea-base/` y `experimentos/condiciones.md` | M2 |
| C4 — Contexto | `Docs/05-c4-contexto.md` | M3 |
| C4 — Contenedores | `Docs/06-c4-contenedores.md` | M3 |
| C4 — Componentes | `Docs/07-c4-componentes.md` | M3 |
| Validación C4 vs. código | `Docs/08-validacion-c4-codigo.md` | M3 |
| Decisión de estilo arquitectónico | `Docs/08-decision-estilo-arquitectonico.md` | M4 |
| ADR 1 — Estilo arquitectónico | `Docs/adr/ADR-001-estilo-arquitectonico.md` | M4 |
| ADR 2 — Límites de módulos y dependencias | `Docs/adr/ADR-002-limites-modulos-dependencias.md` | M4 |

## Convención de commits

El equipo usa Conventional Commits para los mensajes de commit:

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

Cada integrante trabaja en su propia rama y abre un Pull Request hacia `main` antes de fusionar. El historial completo de PRs fusionados queda visible en la pestaña **Pull Requests** del repositorio: https://github.com/gameover2182/Cooksmart/pulls?q=is%3Apr+is%3Aclosed