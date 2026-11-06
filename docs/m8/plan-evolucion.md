# Plan de evolución arquitectónica — CookSmart (M8)

> Qué se construye **ahora**, qué se hace **cuando una métrica lo pida** y qué queda como **horizonte**. El principio es el mismo de todo el proyecto: no se añade complejidad por anticipación, sino cuando un número cruza un umbral.

## 1. Disparadores medibles (no fechas)

La evolución se activa por **umbrales**, no por calendario. Cada paso dice qué métrica lo dispara y qué evidencia ya tenemos.

| Paso | Disparador (umbral medible) | Acción | Evidencia que lo respalda |
|---|---|---|---|
| **Hecho (M8)** | — | Inventario del front **conectado** a la API; código muerto de Firebase retirado | Implementado (commit `c23267a`); verificado en vivo y por el smoke test §3 de `15-evidencia-ejecutable.md` |
| **E1** | Logins/s sostenidos > ~2 (1 núcleo saturado) o p95 de login > 2 s | Activar `API_WORKERS=N` (D1) | E4: 4,4× con 4 procesos |
| **E2** | Al activar N workers | Mover bulkhead/caché/rate-limit a estado compartido (Redis) antes de fiarse de los límites | P9 / R-S3 (condición de ADR-004) |
| **E3** | CPU del host > ~70 % con todos los núcleos usados | D2: segundo host + balanceador | E5: D2 es 10² USD/mes |
| **E4** | Catálogo > ~1.000 recetas o p95 de `GET /recetas` > 500 ms | Paginación + revisar subconsultas N+1 (F7) | F7 inferido; hoy invisible con 20 recetas |
| **E5** | Aparece PII regulada | Reabrir ADR-005: cifrado en reposo + vault | Restricción B de `evaluacion-arquitectonica.md` |
| **E6** | > 1 incidente no visto a tiempo, o se adopta orquestador | Recolector de logs (Loki) + Prometheus; revisar F12 | O-6; observabilidad ya emite formato portable |
| **Horizonte** | Un componente concreto necesita escalar **distinto** (medido) | Extraer **ese** servicio (no todos) | E1/E4: hoy el cuello es transversal (CPU de login), no un módulo |

## 2. Por qué microservicios NO están en el plan por defecto

No es rechazo ideológico: es que **ningún disparador medido** apunta a ellos. El cuello (E1) es la CPU de un hilo, que se resuelve replicando el proceso completo (E4), no partiendo el dominio. Los microservicios entran solo si algún día se **mide** que un componente necesita un ciclo de vida o un escalado propio — y entonces se extrae ese, con su costo (E5) sobre la mesa.

## 3. Lo que se construyó en este módulo (M8) — hecho

Única evolución ejecutada en M8, porque el backend ya estaba listo y cerraba una deuda real:

- **Inventario del front → API (implementado, commit `c23267a`).** Antes "Mi Nevera" vivía solo en `localStorage`; ahora, con sesión, sincroniza con `POST/GET/DELETE /usuarios/:id/inventario` a través de `window.CookSmartInventario` en `auth-sync.js`, con el input de ingredientes atado al **catálogo** (`/ingredientes`; el backend exige `id_ingrediente` y `unidad`). Resultado: el inventario persiste en Postgres y entre dispositivos. Sin sesión, sigue el modo local (fallback). Verificado en vivo (alta por formulario → fila en Postgres → visible al recargar; baja → borrado en servidor) y sin errores de consola.
- **Limpieza de código muerto de Firebase** (`syncToFirebase` retirado; preferencias de recetas ahora desde `/auth/me`), para que el código no mienta sobre lo que hace.

Ambos cambios son reversibles y no tocan el dominio ni el esquema. **Deuda que queda abierta:** un ingrediente de texto libre fuera del catálogo de 51 no persiste (solo local); es un límite consciente, no un fallo.

## 4. Lo que explícitamente NO se hará ahora

- Microservicios, Kubernetes, broker de eventos, Redis, vault, cifrado en reposo: ninguno tiene disparador medido hoy.
- Reescritura del front en un framework (React/Vue): el front estático funciona y no hay métrica que lo exija.

Mantener esta lista de "no" es parte del plan: cada "no" tiene su condición de reapertura en la tabla §1.
