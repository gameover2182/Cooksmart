# EXP-005 — Controles de seguridad y observabilidad: antes/después — Pre-registro

> **Se commitea ANTES de implementar los controles y de medir.** Módulo 7. Motivado por el modelado de amenazas (`docs/m7/10-seguridad.md`) y por el fallo F4 del M6 (*"no nos habríamos enterado sin el muestreo del experimento"*, `docs/m6/matriz-fallos-resiliencia.md`).
>
> La pregunta del módulo — *«si el sistema falla en producción, ¿cómo sabríamos qué ocurrió, dónde, a quién afectó y qué decisión lo permitió?»* — se convierte aquí en hipótesis que pueden fallar.

## 1. Qué se compara

| Fase | Commit | Qué se mide |
|---|---|---|
| **Antes** | el de este pre-registro (código igual a `main` tras el PR #37) | Si las amenazas priorizadas **se pueden explotar hoy** |
| **Después** | el commit de implementación posterior a este | Si los controles las cierran **sin romper** el uso normal, y si la observabilidad **detecta** los fallos del M6 |

## 2. Hipótesis de seguridad (antes → después)

Instrumento: `scripts/verificar-seguridad.js` (fijado en este commit), contra el stack de `docker compose` en la misma máquina de EXP-002…004.

| ID | Amenaza (ver `10-seguridad.md`) | Predicción **antes** | Control | Predicción **después** |
|---|---|---|---|---|
| **H-S1** | A1 — El `JWT_SECRET` está escrito en `docker-compose.yml`, que es público en GitHub | Un atacante **sin cuenta** forja un token con el secreto publicado en `main` (commit `c40793b`) y lee el inventario de otro usuario: **HTTP 200** | C1: el secreto sale del repo (se exige por variable de entorno) y se **rota** | El mismo token forjado: **HTTP 401** |
| **H-S2** | A2 — Fuerza bruta de contraseña en `/login` (PSeg01/PSeg07) | 15 intentos fallidos seguidos sobre una cuenta: **15 × 401, 0 × 429** | C2: límite de intentos **fallidos** por (IP, correo) | Intentos 1–5: 401; intentos 6–15: **429 con `Retry-After`**; un login **correcto** de otra cuenta desde la misma IP: **200** |
| **H-S3** | A5 — El proceso de la API corre como `root` dentro del contenedor | `uid=0` | C4: `USER node` en el Dockerfile | `uid=1000` |
| **H-S4** | A6 — Adminer (consola web con acceso total a la base) escucha en todas las interfaces | Publicado en `0.0.0.0:5433` | C5: publicar solo en `127.0.0.1` | Publicado solo en `127.0.0.1:5433` |
| **H-S5** | A9 — La API anuncia su tecnología (`X-Powered-By: Express`) | Cabecera presente | C6: cabeceras mínimas de seguridad | Cabecera ausente; `X-Content-Type-Options: nosniff` presente |
| **H-S6** | A3 — Enumeración de cuentas en `/registro` (responde 409 si el correo existe) | 409 | **Ninguno: riesgo aceptado** (ver `10-seguridad.md` §5) | **409 (sin cambio)** — se mide para que el riesgo residual quede demostrado, no supuesto |
| **H-S7** | A4 — Un token sigue valiendo después de cambiar la contraseña | 200 con el token viejo | **Ninguno: riesgo aceptado** con expiración de 7 días | **200 (sin cambio)** |

Además, como prueba unitaria (estilo FF-3, debe **fallar sobre el código de antes** y pasar después):

| ID | Amenaza | Predicción antes | Control | Predicción después |
|---|---|---|---|---|
| **H-S8** | A7 — Con `CACHE_CATALOGO=on`, la caché usa la URL completa como clave y no tiene tope: `GET /api/recetas?x=1…N` crece sin límite (memoria) | 2 000 URLs distintas → 2 000 entradas | C3: tope de entradas | ≤ `CACHE_MAX_ENTRADAS` (500) |

## 3. Hipótesis de observabilidad (solo después: antes **no existe** ninguna señal — F4)

| ID | Pregunta del módulo | Predicción |
|---|---|---|
| **H-O1** | ¿Sabríamos **qué** ocurrió? (detección de F1/F2) | Con el recorrido de EXP-002 a **100 VUs durante 60 s**, la alerta `BucleDeEventosBloqueado` (p99 del retraso del bucle de eventos > **200 ms** sostenido **≥ 15 s**) **se dispara en ≤ 60 s**. Con la API **en reposo** 60 s, **no se dispara** (p99 < 50 ms). |
| **H-O2** | ¿Sabríamos **dónde** y **a quién**? (correlación) | En 100 peticiones, el **100 %** de las respuestas trae `X-Request-Id` y ese mismo id aparece en **exactamente una** línea de log JSON con `ruta` (patrón, no la URL con datos), `estado`, `duracion_ms` y, si hay sesión, `usuario`. |
| **H-O3** | ¿Cuánto cuesta observar? | P95 de `k6-demo/diagnostico.js` (50 VUs, 20 s) con logs por petición **activados** vs **desactivados**: aumento **≤ 15 %** (mediana de 3 corridas por configuración, 1 calentamiento descartado). |
| **H-O4** | ¿Las métricas son un nuevo punto de fuga? | `GET /metrics` sin token → **401**; con token → **200** `text/plain`. Si no se configura token → **404**. |
| **H-O5** | ¿Se ve el ataque de H-S2? | Tras H-S2, `/metrics` muestra exactamente **5** logins `fallido` y **10** `bloqueado` más que antes, y la alerta `PicoDeLoginsFallidos` se dispara. |

**Postura previa declarada:** el equipo espera que H-O1 se cumpla con holgura (bcrypt bloquea el hilo ~0,5 s por login), pero **no está seguro** de que `/metrics` pueda responder a tiempo cuando el hilo está saturado: es el mismo problema que el *healthcheck* (F12). Si no responde, la propia ausencia de métricas tiene que convertirse en alerta, y eso se documentará.

## 4. Regla de veredicto

| Veredicto | Condición |
|---|---|
| **VALIDADO** | Todas las predicciones *antes* y *después* de H-S1…H-S8 y H-O1…H-O5 se cumplen |
| **AJUSTADO** | Se cumplen H-S1, H-S2, H-O1 y H-O2, pero falla alguna de las demás (se documenta qué y por qué) |
| **RECHAZADO** | Falla H-S1, H-S2, H-O1 o H-O2: el control principal o la detección principal no funcionan |

Una predicción *antes* que **no** se cumpla (la amenaza no era explotable) se reporta como **amenaza sobreestimada**, y se baja su prioridad en `10-seguridad.md`.

## 5. Protocolo

| Parámetro | Valor |
|---|---|
| Seguridad | `node experimentos/EXP-005-controles-seguridad-observabilidad/scripts/verificar-seguridad.js` → `resultados/seguridad-<fase>.json` |
| Observabilidad | `bash experimentos/EXP-005-controles-seguridad-observabilidad/scripts/ejecutar-observabilidad.sh` (reposo 60 s, luego 100 VUs 60 s, muestreo de `/metrics` cada 1 s; después H-O3 con 1 + 3 corridas por configuración) |
| Orden | antes (este commit) → implementación → después |
| Máquina | la misma de EXP-002…004 |

## 6. Alcance

**Se puede modificar:** `server.js` (cabeceras, montaje de la observabilidad), middlewares nuevos (`observabilidad.js`, `limiteLoginFallidos.js`), `cacheCatalogo.js` (solo el tope), `routes/auth.routes.js` (solo `POST /login`), `Dockerfile` (`USER node`, `npm ci`), `docker-compose.yml` (secreto, puerto de Adminer, variables nuevas), `.env.example`, workflows de CI, `auth-sync.js` (escape del nombre en la barra de navegación), pruebas y fitness functions nuevas.

**No se modifica:** servicios, repositorios, esquema, costo de bcrypt, contrato de la API (`openapi-v1.yaml`) salvo documentar los códigos 429 y la cabecera `X-Request-Id`, y los instrumentos de este experimento después de este commit.
