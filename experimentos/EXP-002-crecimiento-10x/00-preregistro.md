# EXP-002 — Crecimiento 10× — Pre-registro

> **Se commitea ANTES de medir.** Cualquier cambio posterior a hipótesis, criterios o instrumento se registra como desviación en `03-resultados-y-veredicto.md`.

## 1. Pregunta del módulo

*"El sistema crece 10 veces en usuarios. ¿Qué falla primero: base de datos, API, red, autenticación, consultas, despliegue, equipo o monitoreo?"* — se responde ejecutando la medición de M2 con carga aumentada, no con argumentos.

## 2. Medición de M2 que se re-ejecuta

**PR02 — recorrido completo** (`docs/02-Escenarios-de-calidad.md`), script `k6-demo/load-test.js` en el commit `3da63ea`: 50 VUs, login en cada iteración + 9 consultas, pausas de 1 s (2 s al final). Resultado registrado en M2: P95 login ≈ 17,93 s, resto de operaciones 0,30–1,59 s, 0 % errores.

El instrumento `scripts/recorrido.js` conserva el **mismo recorrido, el mismo usuario y las mismas pausas**. Cambios declarados: (a) VUs y duración parametrizables; (b) duración 60 s en lugar de 20 s, para que haya más de una iteración por VU; (c) el tiempo se toma de `res.timings.duration` (k6) en lugar de `Date.now()`; (d) un login fallido termina la iteración en lugar de abortar k6.

## 3. Niveles de carga

| Nivel | VUs | Factor |
|---|---:|---|
| Línea base | 50 | 1× (M2) |
| | 100 | 2× |
| | 250 | 5× |
| Crecimiento | **500** | **10×** |

## 4. Definición de "falla" de una operación en un nivel

Una operación **falla** en un nivel si la **mediana de las 3 corridas** cumple al menos una:
- P95 de la operación **> 3000 ms** (RNF04: máximo 3 s), o
- tasa de error de la operación (`fallo_<op>`) **> 1 %**.

Un **componente** (API, base de datos) se considera **saturado** en un nivel si la mediana de su CPU muestreada durante la corrida (`docker stats`) es **≥ 90 %** (100 % = un núcleo; Node ejecuta JavaScript en un solo hilo).

## 5. Hipótesis (falsables)

Predicción del equipo a partir de M2 (login P95 ≈ 17,9 s con solo 50 VUs) y del riesgo R-02:

- **H-A (qué falla primero):** la **autenticación (login)** es la primera operación que falla según §4, y lo hace en un nivel **≤ 250 VUs**.
- **H-B (dónde):** en el primer nivel donde falla alguna operación, la **API está saturada** (CPU ≥ 90 %) mientras **PostgreSQL** tiene mediana de CPU **≤ 50 %**. Es decir: el cuello de botella es el proceso de la API, no la base de datos.
- **H-C (contagio):** a 500 VUs, las operaciones que **no** usan bcrypt (recetas, detalle, catálogos, favoritos, historial, inventario, perfil) tienen una mediana de P95 **al menos 5× mayor** que a 50 VUs.

Cada hipótesis se declara **confirmada** o **refutada** por separado aplicando exactamente estos umbrales.

## 6. Protocolo

| Parámetro | Valor |
|---|---|
| Corridas | 1 calentamiento a 50 VUs (descartada) + **3 corridas por nivel**; se reporta la **mediana** |
| Duración | 60 s por corrida, `gracefulStop` 30 s, 10 s de enfriamiento entre corridas |
| Recursos | `docker stats` (CPU/memoria de `cooksmart-api` y `cooksmart`) y conexiones activas a PostgreSQL, muestreados continuamente durante cada corrida |
| Commit medido | el commit de este pre-registro (sin cambios de código) |
| Comando | `bash experimentos/EXP-002-crecimiento-10x/scripts/ejecutar.sh` |
| Máquina | la misma del Spike 1 (`experimentos/spike-01-integracion/01-condiciones.md`); k6 corre en el mismo equipo que los contenedores (limitación declarada) |

## 7. Qué NO se modifica

Código de la API, esquema, *seed*, pool de PostgreSQL, costo de bcrypt (12), configuración de Docker Compose. Este experimento **solo observa**; la táctica de resiliencia se prueba en un experimento separado (EXP-003) con su propio pre-registro.

## 8. Verificación del instrumento (no es dato)

Antes de este commit se ejecutó una corrida de humo de **1 VU × 5 s** (fuera del repo) solo para verificar que el script funciona: 10/10 checks correctos; un login aislado tardó ≈ 525 ms. No se ejecutó ninguna corrida con carga.
