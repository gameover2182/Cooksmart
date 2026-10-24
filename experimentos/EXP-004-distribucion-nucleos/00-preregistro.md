# EXP-004 — Decisión de distribución: ¿usar más núcleos del mismo host (D1) resuelve el cuello? — Pre-registro

> **Se commitea ANTES de implementar y medir.** Motivación: `docs/m6/costo-distribucion.md` §4 dejó como **inferencia no medida** que la alternativa D1 (la API usando varios núcleos del mismo host) aumenta la capacidad de login. El ADR-004 no debe apoyarse en una inferencia si puede medirse.

## 1. Cambio experimental

Variable `API_WORKERS` (por defecto `1` = comportamiento actual). Con `API_WORKERS=N`, `server.js` usa el módulo `cluster` de Node para lanzar **N procesos** de la misma API que comparten el puerto 3000 (el sistema operativo reparte las conexiones). Es la forma más simple de D1: sin balanceador externo, sin cambios en el dominio, sin cambios en la base.

| Configuración | `API_WORKERS` | Táctica |
|---|---|---|
| **w1** | 1 | ninguna (= base de EXP-003) |
| **w4** | 4 | ninguna |

N = 4: deja 8 de los 12 núcleos para PostgreSQL, k6 y el sistema.

## 2. Hipótesis (500 VUs = 10×; mismo instrumento que EXP-003)

- **H-D1a (capacidad):** los **logins exitosos por segundo** con w4 son **≥ 3×** los de w1.
- **H-D1b (errores):** la tasa de error del login con w4 es **≤ 50 %** de la de w1.
- **H-D1c (el siguiente cuello no es la base):** con w4, la mediana de CPU de PostgreSQL sigue **≤ 50 %**.

**Veredicto:** **VALIDADA** si H-D1a, H-D1b y H-D1c se cumplen; **AJUSTADA** si se cumple H-D1a pero falla H-D1b o H-D1c; **REFUTADA** si falla H-D1a.

Logins exitosos/s = `count(op_login) × (1 − fallo_login) / duración`; duración = `http_reqs.count / http_reqs.rate`.

## 3. Protocolo

| Parámetro | Valor |
|---|---|
| Instrumento | `../EXP-003-tacticas-resiliencia/scripts/recorrido-tacticas.js` (sin cambios) |
| Carga | 500 VUs, 60 s, `gracefulStop` 30 s |
| Corridas | por configuración: 1 calentamiento (descartado) + 3 corridas; mediana |
| Recursos | `docker stats` de `cooksmart-api` (con 4 *workers* puede pasar de 100 %: 100 % = un núcleo) y de `cooksmart` |
| Orden | w1 → w4; la API se recrea con `API_WORKERS` antes de cada configuración |
| Commit | el commit de implementación posterior a este |
| Comando | `bash experimentos/EXP-004-distribucion-nucleos/scripts/ejecutar.sh` |

## 4. Alcance

**Se modifica:** `Docker/Postgre/backend/src/server.js` (arranque en *cluster* si `API_WORKERS > 1`) y `docker-compose.yml` (pasar `API_WORKERS`, defecto `1`). **No se modifica:** rutas, servicios, repositorios, esquema, pool por proceso (cada *worker* tiene su propio pool de 10 → hasta 40 conexiones, por debajo de `max_connections = 100`), costo de bcrypt, tácticas T1/T2 (apagadas).

## 5. Limitación conocida

El bulkhead de T1 y la caché de T2 guardan estado **por proceso**: con N *workers*, cada uno tendría su propio límite y su propia caché. No afecta a este experimento (tácticas apagadas), pero sí a la combinación D1 + T1, que se discute en ADR-004.
