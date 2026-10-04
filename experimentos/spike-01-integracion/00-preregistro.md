# Spike 1 — Pre-registro

> **Este archivo se commitea ANTES de implementar y ANTES de medir.** El orden es verificable con `git log --follow experimentos/spike-01-integracion/`.
> Cualquier cambio posterior a hipótesis, criterios o instrumento se registra como **desviación** en `03-veredicto.md`, no editando este archivo.

## 1. Decisión de integración que se pone a prueba

**Interacción I1 — alta de favorito** (`POST /api/usuarios/{id}/favoritos`, relación E5 del Context Map, `docs/dominio/context-map.md`).

**Decisión candidata (D-async):** procesar la escritura del favorito de forma **asíncrona** dentro de la API — responder `202 Accepted` tras encolar el comando y escribir en PostgreSQL desde un consumidor en segundo plano — en lugar de la integración **síncrona** actual (escribir y responder `201`).

**Por qué esta interacción** (ver `docs/integracion/09-api-eventos-integracion.md` §1 y §3):
- Es la única escritura que el frontend usa hoy y la única que ya se comporta como asíncrona (accidentalmente) en el cliente.
- Es el "CRUD simple" de la pregunta del módulo: si los eventos/asincronía no pagan aquí, el equipo tiene evidencia propia para no introducirlos.
- La comparación depende de un **supuesto no verificado**: que el `INSERT` sea una parte significativa del tiempo de respuesta bajo carga.

**Postura previa del equipo (declarada para no ocultar sesgo):** esperamos que D-async **no** compense. Por eso la hipótesis se formula **a favor de D-async**, de modo que el experimento pueda refutar nuestra propia postura o confirmarla.

## 2. Hipótesis (falsables, con número)

- **H1 (latencia):** Con `FAVORITOS_MODO=async`, la **mediana de los P95** de `POST /api/usuarios/{id}/favoritos` (métrica `favorito_post_duration`) es **al menos 30 % menor** que con `FAVORITOS_MODO=sync`, bajo las condiciones C (§4).
- **H2 (consistencia — condición de adopción):** Con `FAVORITOS_MODO=async`, la **mediana** de la tasa `lectura_consistente` (un `GET` inmediatamente posterior al `POST` contiene la receta) es **≥ 99 %**.
- **H0 (control de errores):** en ambos modos, `errores_5xx = 0` y `http_req_failed < 1 %`.

## 3. Criterio de veredicto (fijado antes de medir)

Sea `Δ = 1 − (mediana P95 async / mediana P95 sync)`.

| Veredicto sobre D-async | Condición |
|---|---|
| **VALIDADA** → adoptar escritura asíncrona | `Δ ≥ 30 %` **y** H2 se cumple **y** H0 se cumple |
| **AJUSTADA** → mantener API síncrona; cualquier asincronía queda en el cliente (UI optimista) | `Δ ≥ 30 %` pero H2 **no** se cumple, **o** `10 % ≤ Δ < 30 %` |
| **REVERTIDA** → se descarta D-async; se mantiene la integración síncrona | `Δ < 10 %`, **o** H0 falla en el modo async |

Métricas secundarias (se reportan, **no** deciden el veredicto): P95 de `GET` y `DELETE`, `delete_antes_de_alta`, iteraciones/s, `http_reqs`/s.

## 4. Condiciones C (detalle en `01-condiciones.md`)

| Parámetro | Valor |
|---|---|
| Carga | 50 VUs constantes (`constant-vus`), 30 s por corrida |
| Recorrido por iteración | `POST` favorito → `GET` favoritos → `DELETE` favorito → `sleep(0.5)` |
| Usuarios | 50 usuarios `spike01_uNN` (uno por VU), creados con `scripts/preparar-usuarios.sql` |
| Recetas | ids 1–20, rotando por iteración |
| Corridas | por modo: **1 de calentamiento (descartada) + 3 oficiales**; se reporta la **mediana** de las 3 |
| Estado inicial | `preparar-usuarios.sql` (borra favoritos de los usuarios del spike) antes de **cada** corrida |
| Commit | **el mismo commit** para ambos modos; solo cambia la variable de entorno `FAVORITOS_MODO` |
| Orden | sync (cal. + 3) → async (cal. + 3); reinicio del contenedor `api` al cambiar de modo |
| Instrumento | `scripts/spike-favoritos.js` (k6), fijado en este commit |
| Máquina | la misma para todas las corridas (ver `01-condiciones.md`) |

## 5. Alcance

**Se puede modificar (y solo esto):**
- `Docker/Postgre/backend/src/services/favoritos.service.js` — bifurcar `agregar` según `FAVORITOS_MODO`.
- `Docker/Postgre/backend/src/controllers/favoritos.controller.js` — responder `202` cuando la escritura quedó encolada.
- Archivo nuevo `Docker/Postgre/backend/src/services/favoritos.cola.js` — cola en memoria + consumidor con **concurrencia 5** que llama a `favoritosRepo.add`.
- `Docker/Postgre/docker-compose.yml` — pasar `FAVORITOS_MODO` a la API con **valor por defecto `sync`**.

**NO se modifica:**
- Repositorios, esquema SQL, *seed*, pool de PostgreSQL (`config/db.js`), autenticación/bcrypt, middlewares, otros módulos.
- `DELETE` y `GET` de favoritos (permanecen síncronos en ambos modos).
- El script k6 y los criterios de este archivo después de este commit.
- No se introduce broker (RabbitMQ/Kafka/Redis): la cola en memoria es el **mejor caso** para D-async (sin salto de red ni serialización). Si el mejor caso no alcanza H1, un broker real tampoco lo haría.

**Comportamiento por defecto:** con `FAVORITOS_MODO` ausente o `sync`, el sistema se comporta exactamente como antes del spike.

## 6. Límite de tiempo

Equivalente a la semana 10 de trabajo independiente (≈ 3 h de ejecución + 1 h de registro). Si no se completa, se reporta lo alcanzado con veredicto "no concluyente".

## 7. Desviación conocida respecto a la guía del curso

La guía pide ejecutar el spike en una **rama separada**. Por instrucción del equipo, todo el trabajo de M5 se hace en la rama `leo`. Para mantener el aislamiento, el cambio experimental queda detrás de un *flag* con valor por defecto `sync` y se identifica por un commit propio (`feat(spike-01): …`), de modo que puede revertirse con un único `git revert`.
