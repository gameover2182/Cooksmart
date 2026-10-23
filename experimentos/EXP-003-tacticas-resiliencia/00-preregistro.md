# EXP-003 — Tácticas de resiliencia: antes/después — Pre-registro

> **Se commitea ANTES de implementar y medir.** Motivado por EXP-002 (`../EXP-002-crecimiento-10x/03-resultados-y-veredicto.md`): a 10× el login (bcrypt en el único hilo de la API) colapsa y arrastra al resto; PostgreSQL está ocioso.

## 1. Tácticas que se comparan (en la misma medición — nivel avanzado del módulo)

| ID | Táctica | Familia | Qué hace | Parámetros (fijos) |
|---|---|---|---|---|
| **base** | Sin táctica | — | Comportamiento actual | — |
| **T1** | **Bulkhead + degradación del login** | Aislamiento (bulkhead) + timeout de cola + *load shedding* | Como máximo N logins en proceso a la vez; los demás esperan en cola un tiempo máximo; si se excede, `503 Retry-After: 1` inmediato | `LOGIN_MAX_CONCURRENTES=2`, `LOGIN_ESPERA_MAX_MS=1000`, `LOGIN_COLA_MAX=20` |
| **T2** | **Caché del catálogo** | Caché | Respuestas `200` de `GET /recetas`, `/recetas/:id`, `/categorias-receta`, `/tipos-cocina`, `/categorias-ingrediente`, `/ingredientes` en memoria | `CACHE_TTL_MS=60000` |

Ambas detrás de variables de entorno (`LOGIN_BULKHEAD`, `CACHE_CATALOGO`), **apagadas por defecto**.

## 2. Hipótesis (a 500 VUs = 10×)

Métricas de `scripts/recorrido-tacticas.js` (mismo recorrido que EXP-002 + métricas agregadas): `op_sin_login` (P95 de las 9 operaciones que no son login), `fallo_sin_login`, `login_rechazo_controlado`, `login_rechazo_duracion`, `op_login` y su tasa de fallo.

**T1 — bulkhead del login**
- **H-T1a (protección, principal):** la mediana del P95 de `op_sin_login` es **≥ 50 % menor** que en base, con `fallo_sin_login ≤ 1 %`.
- **H-T1b (falla rápida):** el P95 de `login_rechazo_duracion` es **≤ 1 500 ms** (en lugar de esperar hasta el *timeout* de 60 s).
- **H-T1c (no pierde capacidad útil):** los **logins exitosos por segundo** con T1 son **≥ 80 %** de los de base.

**T2 — caché del catálogo**
- **H-T2 (principal):** la mediana del P95 de `op_sin_login` es **≥ 30 % menor** que en base.

**Postura previa declarada:** el equipo espera que **T1 sí** proteja al resto y que **T2 no** alcance el 30 %, porque EXP-002 mostró que PostgreSQL está ocioso y el cuello es la CPU del login. T2 se incluye precisamente para comprobar con datos si la táctica "por defecto" del curso sirve en este sistema.

## 3. Regla de veredicto por táctica

| Veredicto | T1 | T2 |
|---|---|---|
| **VALIDADA** | H-T1a, H-T1b y H-T1c se cumplen | H-T2 se cumple |
| **AJUSTADA** | H-T1a se cumple pero falla H-T1b o H-T1c | reducción entre 10 % y 30 % |
| **RECHAZADA** | H-T1a no se cumple | reducción < 10 % |

Cálculos: `Δ = 1 − (mediana P95 táctica / mediana P95 base)`. Logins exitosos/s = `count(op_login) × (1 − fallo_login) / duración`, con duración = `http_reqs.count / http_reqs.rate`.

## 4. Protocolo

| Parámetro | Valor |
|---|---|
| Carga | **500 VUs** constantes, 60 s, `gracefulStop` 30 s |
| Corridas | por configuración: 1 calentamiento (descartado) + **3 corridas**; mediana |
| Orden | base → T1 → T2; la API se **recrea** con sus variables antes de cada configuración (`docker compose up -d api`) |
| Commit | **el mismo** para las tres configuraciones (el commit de implementación posterior a este) |
| Instrumento | `scripts/recorrido-tacticas.js`, fijado en este commit |
| Comando | `bash experimentos/EXP-003-tacticas-resiliencia/scripts/ejecutar.sh` |
| Máquina | la misma de EXP-002 |

## 5. Alcance

**Se puede modificar:** archivo nuevo `middlewares/bulkheadLogin.js`, archivo nuevo `middlewares/cacheCatalogo.js`, `routes/auth.routes.js` (solo `POST /login`), `routes/recetas.routes.js` y `routes/catalogos.routes.js` (aplicar la caché), `docker-compose.yml` (pasar las dos variables con defecto `off`).

**No se modifica:** servicios, repositorios, esquema, pool, costo de bcrypt, middlewares de autenticación, rutas de `/usuarios` y `/auth/me` (la caché **nunca** se aplica a datos de un usuario), el instrumento k6 después de este commit.

## 6. Riesgo de diseño revisado antes de commitear

El router de catálogos está montado en `/api`; un `router.use(cacheCatalogo)` habría cacheado también `/api/usuarios/…` y `/api/auth/me` (datos privados servidos a otro usuario). Por eso la caché se aplica **ruta por ruta** en ese router.
