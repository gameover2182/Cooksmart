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
- **Commit/versión evaluada:** Primer commit del repositorio (aún no realizado al momento de escribir este documento — actualizar hash real al hacer el commit)
- **Stack real (verificado en el repo):** HTML, CSS, JavaScript, Firebase Auth, Firebase Realtime Database. Sin backend propio, sin base de datos relacional, sin tests, sin CI.
- **Semana actual:** Semana 4

> ⚠️ **Nota importante:** existe un documento de proyecto (fase inicial) (`Proyecto_Arquitectura_de_software.pdf`) que describe una arquitectura de microservicios con API Gateway, Redis y base de datos relacional, y un plan de pruebas extenso. Esa arquitectura **no está implementada** en el repositorio actual. **Decisión de equipo:** esa arquitectura se documenta como Roadmap / Trabajo futuro, no como el sistema evaluado en Semana 4. El sistema base evaluado es el actual: estático + Firebase.

## Roadmap / Trabajo futuro

<!-- Aquí va la arquitectura de microservicios del proyecto (fase inicial), dejada explícitamente como
     dirección planeada y NO como arquitectura implementada. Mover el contenido del PDF
     (diagrama de componentes, diagrama de despliegue, plan de QA) a esta sección si se
     conserva en el repo, dejando claro que es propuesta, no evidencia actual. -->

## Cómo levantar el sistema

El sistema no requiere instalación: los archivos `.html` se abren directamente en el navegador y funcionan contra Firebase (Auth + Realtime Database) como backend.

```bash
# Clonar el repositorio
git clone <URL-del-repo>
# Abrir index.html directamente en el navegador
# No requiere servidor local, build ni dependencias adicionales
```

<!-- Falta confirmar: ¿las credenciales/config de Firebase están hardcodeadas en firebase-sync.js
     o requieren alguna variable de entorno / archivo de config aparte? -->

## Estructura del dossier

| Documento | Ruta | Estado |
|---|---|---|
| Contexto y drivers | `dossier/01-contexto-y-drivers.md` | En progreso |
| Escenarios de calidad | `docs/02-escenarios-de-calidad.md` | Pendiente |
| Evidencia ejecutable | `docs/04-evidencia-ejecutable.md` | Pendiente |
| Experimento línea base | `experimentos/EXP-001-linea-base/` | Pendiente |

## Trazabilidad Git

<!-- Enlace a los Pull Requests fusionados, uno por integrante -->
