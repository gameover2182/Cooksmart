# CookSmart

CookSmart es una plataforma web que genera recetas personalizadas usando exclusivamente los ingredientes disponibles en la nevera del usuario, con el fin de reducir el desperdicio de alimentos en hogares de Bogotá.

## Equipo

| Integrante | Rol en el dossier |
|---|---|
| Juan Manuel Bermúdez Rodríguez | Contexto y base ejecutable |
| Miguel Ángel Santamaría Cuero | Escenarios de calidad |
| Leonardo Juan Pablo Leon Robelto | Medición ejecutable (k6) |

## Sistema base

- **Repositorio:** https://github.com/gameover2182/Cooksmart.git
- **Commit/versión evaluada:** ver historial de commits del repo (actualizar aquí con el hash exacto antes de la entrega final)
- **Stack real (verificado en el repo):** HTML, CSS, JavaScript, Firebase Auth, Firebase Realtime Database. Sin backend propio, sin base de datos relacional, sin tests, sin CI.
- **Semana actual:** Semana 4

> ⚠️ **Nota importante:** existe un documento del proyecto en fase inicial (`Proyecto_Arquitectura_de_software.pdf`) que describe una arquitectura de microservicios con API Gateway, Redis y base de datos relacional, y un plan de pruebas extenso. Esa arquitectura **no está implementada** en el repositorio actual. **Decisión de equipo:** esa arquitectura se documenta como Roadmap / Trabajo futuro, no como el sistema evaluado en Semana 4. El sistema base evaluado es el actual: estático + Firebase.

## Roadmap / Trabajo futuro

> **Pendiente:** mover aquí el contenido del PDF del proyecto en fase inicial (diagrama de componentes, diagrama de despliegue, plan de QA), dejando explícito que es una dirección planeada y no la arquitectura implementada hoy.

## Cómo levantar el sistema

El sistema no requiere instalación: los archivos `.html` se abren directamente en el navegador y funcionan contra Firebase (Auth + Realtime Database) como backend.

```bash
# Clonar el repositorio
git clone https://github.com/gameover2182/Cooksmart.git
# Abrir index.html directamente en el navegador
# No requiere servidor local, build ni dependencias adicionales
```

> **Pendiente:** confirmar si las credenciales/config de Firebase están hardcodeadas en `firebase-sync.js` o requieren alguna variable de entorno / archivo de config aparte.

## Estructura del dossier

| Documento | Ruta real en el repo | Estado |
|---|---|---|
| Contexto y drivers | `01-contexto-y-drivers.md` (raíz) | Completo |
| Escenarios de calidad | `Docs/02-Escenarios-de-calidad.md` | Completo |
| Evidencia ejecutable | Pendiente de definir ruta | Pendiente |
| Experimento línea base | Pendiente de definir ruta | Pendiente |

> ⚠️ **Nota de estructura para el equipo:** actualmente `01-contexto-y-drivers.md` está en la raíz del repo y `02-Escenarios-de-calidad.md` está dentro de `Docs/` (con mayúscula). Antes de seguir agregando documentos, el equipo debe decidir una sola convención (por ejemplo, todo dentro de `docs/` en minúscula) y mover los archivos existentes para que coincidan, o el profesor va a encontrar rutas inconsistentes al revisar el repo.

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

> **Pendiente:** cada integrante debe abrir su propio Pull Request para su parte del dossier y enlazarlo aquí una vez fusionado.