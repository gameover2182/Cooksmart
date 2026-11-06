# Plan de evolución arquitectónica — CookSmart (M8)

> Qué se construye **ahora**, qué se hace **cuando una métrica lo pida** y qué queda como **horizonte**. El principio es el mismo de todo el proyecto: no se añade complejidad por anticipación, sino cuando un número cruza un umbral.

## 1. Disparadores medibles (no fechas)

La evolución se activa por **umbrales**, no por calendario. Cada paso dice qué métrica lo dispara y qué evidencia ya tenemos.

| Paso | Disparador (umbral medible) | Acción | Evidencia que lo respalda |
|---|---|---|---|
| **Ahora (M8)** | — | Conectar el inventario del front a la API; limpiar código muerto de Firebase | Backend de inventario ya existe y responde (smoke test §3 de `15-evidencia-ejecutable.md`) |
| **E1** | Logins/s sostenidos > ~2 (1 núcleo saturado) o p95 de login > 2 s | Activar `API_WORKERS=N` (D1) | E4: 4,4× con 4 procesos |
| **E2** | Al activar N workers | Mover bulkhead/caché/rate-limit a estado compartido (Redis) antes de fiarse de los límites | P9 / R-S3 (condición de ADR-004) |
| **E3** | CPU del host > ~70 % con todos los núcleos usados | D2: segundo host + balanceador | E5: D2 es 10² USD/mes |
| **E4** | Catálogo > ~1.000 recetas o p95 de `GET /recetas` > 500 ms | Paginación + revisar subconsultas N+1 (F7) | F7 inferido; hoy invisible con 20 recetas |
| **E5** | Aparece PII regulada | Reabrir ADR-005: cifrado en reposo + vault | Restricción B de `evaluacion-arquitectonica.md` |
| **E6** | > 1 incidente no visto a tiempo, o se adopta orquestador | Recolector de logs (Loki) + Prometheus; revisar F12 | O-6; observabilidad ya emite formato portable |
| **Horizonte** | Un componente concreto necesita escalar **distinto** (medido) | Extraer **ese** servicio (no todos) | E1/E4: hoy el cuello es transversal (CPU de login), no un módulo |

## 2. Por qué microservicios NO están en el plan por defecto

No es rechazo ideológico: es que **ningún disparador medido** apunta a ellos. El cuello (E1) es la CPU de un hilo, que se resuelve replicando el proceso completo (E4), no partiendo el dominio. Los microservicios entran solo si algún día se **mide** que un componente necesita un ciclo de vida o un escalado propio — y entonces se extrae ese, con su costo (E5) sobre la mesa.

## 3. Lo que se construye en este módulo (M8)

Única evolución que se ejecuta ahora, porque el backend ya está listo y cierra una deuda real:

- **Inventario del front → API.** Hoy "Mi Nevera" vive solo en `localStorage`; el backend tiene `POST/GET/DELETE /usuarios/:id/inventario`. Se conecta siguiendo el patrón ya probado de favoritos (sincronización en `auth-sync`), con el input de ingredientes atado al **catálogo** (el backend exige `id_ingrediente`). Resultado: el inventario persiste en Postgres y entre dispositivos.
- **Limpieza de código muerto de Firebase** (referencias a `syncToFirebase` que ya no existe), para que el código no mienta sobre lo que hace.

Ambos cambios son reversibles y no tocan el dominio ni el esquema.

## 4. Lo que explícitamente NO se hará ahora

- Microservicios, Kubernetes, broker de eventos, Redis, vault, cifrado en reposo: ninguno tiene disparador medido hoy.
- Reescritura del front en un framework (React/Vue): el front estático funciona y no hay métrica que lo exija.

Mantener esta lista de "no" es parte del plan: cada "no" tiene su condición de reapertura en la tabla §1.
