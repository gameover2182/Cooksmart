# 15 · Evidencia ejecutable consolidada — dossier CookSmart (M8)

> **Pregunta del módulo:** *«El comité rechaza su arquitectura por sobreingenierizada, insegura o incapaz de crecer. ¿Qué evidencia propia tiene para responder, y qué parte de su defensa descansa solo en argumentos?»*
>
> Este documento es el índice único de **toda** la evidencia acumulada (M2 → M7). Cada fila dice: qué afirma, **si está medida o es un argumento**, el comando que la reproduce y el veredicto. La regla de honestidad del proyecto: **lo medido se marca medido; lo que es razonamiento se marca argumento, sin disfrazarlo.**

## 0. Cómo reproducir todo en vivo (para la defensa)

```bash
# 1. Levantar el sistema (API Node/Express + PostgreSQL + Adminer)
cd Docker/Postgre && docker compose up -d --build        # requiere .env (ver .env.example)

# 2. Fitness functions (rompen el PR si se viola la regla)
node fitness/reglas-capas.js                              # FF-1 capas (ADR-002)
node fitness/sin-secretos.js                              # FF-5 ningún secreto versionado (C1)
node --test Docker/Postgre/backend/test/bulkheadLogin.test.js            # FF-3 bulkhead
node --test Docker/Postgre/backend/test/seguridadObservabilidad.test.js  # FF-6 controles M7

# 3. Experimentos (pre-registro + medición antes/después)
bash experimentos/EXP-002-crecimiento-10x/scripts/ejecutar.sh 500 1 20s
bash experimentos/EXP-003-tacticas-resiliencia/scripts/ejecutar.sh
node experimentos/EXP-005-controles-seguridad-observabilidad/scripts/verificar-seguridad.js despues

# 4. Smoke test de la aplicación completa (16 flujos de la API, exit 0 solo si todos pasan)
node experimentos/smoke-aplicacion/smoke.js
```

## 1. Matriz de evidencia: qué afirmamos y con qué respaldo

| # | Afirmación de la defensa | Respaldo | Resultado medido | Veredicto | Reproducir |
|---|---|---|---|---|---|
| E1 | «Al crecer 10×, **falla primero la autenticación**, no la base» | **Medido** (EXP-002) | A 500 VUs: 73 % de logins fallan; CPU API 100 % de 1 núcleo, PostgreSQL ≈ 2 % | H-B confirmada; H-A y H-C refutadas | `EXP-002/scripts/ejecutar.sh` |
| E2 | «El bulkhead del login **protege** al resto del sistema» | **Medido** (EXP-003) | P95 del resto 6,8 s → 0,55 s (−92 %); rechazos en 1,4 s en vez de 60 s | T1 VALIDADA | `EXP-003/scripts/ejecutar.sh` |
| E3 | «La caché del catálogo ayuda, pero **no** porque la base sea el cuello» | **Medido** (EXP-003) | P95 6,8 s → 4,3 s (−37 %), por liberar CPU del hilo, no por la base | T2 VALIDADA | idem |
| E4 | «Distribuir en **más núcleos** (no en servicios) multiplica la capacidad» | **Medido** (EXP-004) | 4 procesos → 4,4× logins/s (3,0 → 13,4); PostgreSQL al 8 % | VALIDADA | `EXP-004/scripts/ejecutar.sh` |
| E5 | «Microservicios cuestan ~100× más para el **mismo** efecto» | **Argumento** cuantificado (órdenes de magnitud) | 10³ vs 10¹ USD/mes; supuestos declarados | — | `docs/m6/costo-distribucion.md` |
| E6 | «Las escrituras síncronas **no pierden** datos; las async sí bajo crash» | **Medido** (Spike 1) | SIGKILL: 66/1000 altas perdidas en async, 0 en síncrono | AJUSTADA → ADR-003 | `spike-01-integracion/` |
| E7 | «El `JWT_SECRET` versionado permitía **forjar tokens**» | **Medido** (EXP-005) | Token forjado: 200 antes → 401 después de rotar | H-S1 confirmada | `verificar-seguridad.js` |
| E8 | «Hay **límite de fuerza bruta** sin bloquear a usuarios legítimos» | **Medido** (EXP-005) | 0×429 antes → bloqueo tras 5 fallos; otra cuenta misma IP sigue 401 | H-S2 confirmada | idem |
| E9 | «La observabilidad **detecta** el fallo real (hilo bloqueado)» | **Medido** (EXP-005) | Retraso del bucle de eventos: 21 ms reposo → 1621 ms bajo carga | H-O1 confirmada | `verificar-observabilidad.js` |
| E10 | «Las reglas de capas (ADR-002) se **cumplen** y se vigilan» | **Medido** (FF-1 en CI) | 0 violaciones; autoprueba detecta una inyectada | En CI | `fitness/reglas-capas.js` |
| E11 | «El costo de los logs es **despreciable**» | **Medido, no concluyente** (EXP-005 H-O3) | Diferencia on/off por debajo del ruido de la máquina | Sobrecosto < ruido | §H-O3 del veredicto |
| E12 | «La app completa (front + API + BD) **arranca y responde**» | **Medido** (CI + smoke) | `/health` ok; 16 flujos de la API responden 2xx (ver §3) | En CI (5 workflows) | `node experimentos/smoke-aplicacion/smoke.js` |

**Lectura para el comité:** de las 12 afirmaciones centrales, **10 están medidas** con experimento reproducible, **1 es un argumento cuantificado y declarado como tal** (E5, costo de microservicios), y **1 quedó medida pero no concluyente por ruido** (E11), y así se reporta. Ninguna afirmación crítica de capacidad, resiliencia o seguridad descansa solo en argumento.

## 2. Qué descansa **solo** en argumento (y por qué es aceptable)

Honestidad explícita — esto es lo que el comité debe saber que **no** medimos:

| Punto | Por qué no se midió | Riesgo de equivocarnos |
|---|---|---|
| Costo monetario real de las alternativas (E5) | No hay despliegue en nube facturado; se usan órdenes de magnitud con supuestos | Bajo: la diferencia es de 2 órdenes; aunque los supuestos fallen por 2–3×, la conclusión no cambia |
| Comportamiento en red real (latencia/pérdida) | k6 corre en `localhost` (F9 de la matriz de fallos) | Medio: TLS y saltos de red añaden latencia no medida |
| Caída de PostgreSQL bajo carga (F6) | No ocurrió en los experimentos (CPU de BD ≈ 2–8 %) | Bajo hoy; sube si cambia el perfil de carga |
| Combinación D1+T1+T2 activada a la vez | Se midieron por separado; el estado por proceso cambia con N workers | Medio: condición de entrada del ADR-004 antes de activar por defecto |
| Sobrecosto de logs como % exacto (E11) | El ruido de la máquina supera el efecto | Bajo: el efecto es menor que la variabilidad normal |

## 3. Smoke test de la aplicación completa (M8, reproducible)

> **Reproducible:** `node experimentos/smoke-aplicacion/smoke.js` ejecuta los flujos de extremo a extremo (registra un usuario nuevo, encadena todas las operaciones y **sale con código ≠ 0 si alguno falla**). Salida cruda de la última corrida en `experimentos/smoke-aplicacion/resultado.txt` (16/16 OK, 2026-11-06). El script usa el mismo contrato que el frontend (`auth-sync.js`, `recetas-loader.js`): mismas rutas y métodos.

Los flujos que el frontend usa contra la API, verificados end-to-end (todos 2xx):

| Flujo | Endpoint | Estado |
|---|---|---|
| Registro | `POST /auth/registro` | 201 |
| Login | `POST /auth/login` | 200 |
| Perfil | `GET /auth/me` | 200 |
| Catálogo de recetas | `GET /recetas` | 200 (20) |
| Detalle con ingredientes | `GET /recetas/:id` | 200 |
| Favorito alta/consulta/baja | `POST/GET/DELETE /usuarios/:id/favoritos` | 201/200/204 |
| Inventario alta/consulta/baja | `POST/GET/DELETE /usuarios/:id/inventario` | 201/200/204 |
| Historial alta/consulta | `POST/GET /usuarios/:id/historial` | 201/200 |
| Perfil nombre/preferencias/contraseña | `PATCH /auth/me[...]` | 200/200/204 |

**Cómo se corrió:** con el stack arriba, un script en el contexto del navegador (origen del front) ejecutó los 15 llamados en secuencia. No hubo errores de consola en ninguna página (index, recetas, detalle, login, registro, mi-nevera, favoritos, perfil).

## 4. Cadena de evidencia por módulo (trazabilidad)

| Módulo | Entregó | Evidencia ejecutable |
|---|---|---|
| M2 | Línea base de medición | EXP-001 (histórico Firebase), método k6 |
| M5 | Dominio, integración, contrato | Spike 1 (E6) → ADR-003; OpenAPI; FF futura |
| M6 | Resiliencia, distribución, costo | EXP-002/003/004 (E1–E4); matriz de fallos F1–F12; FF-1/2/3; ADR-004 |
| M7 | Seguridad y observabilidad | EXP-005 (E7–E9, E11); controles C1–C6; FF-5/6; ADR-005 |
| M8 | Consolidación y defensa | **este documento** + trade-offs + riesgos + plan de evolución |

Ver también: `docs/m8/16-matriz-trade-offs.md`, `docs/m8/17-riesgos-priorizados.md`, `docs/m8/evaluacion-arquitectonica.md`, `docs/m8/plan-evolucion.md`, `docs/m8/declaracion-ia-final.md`.
