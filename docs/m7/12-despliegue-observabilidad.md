# Despliegue y observabilidad (M7)

> **Pregunta del módulo:** si el sistema falla, ¿cómo sabríamos **qué** ocurrió, **dónde**, a **quién** afectó y **qué decisión** lo permitió? Aquí se responde "qué/dónde/a quién" con señales concretas, y se vincula cada señal a un fallo **ya medido** del M6.
>
> Toda afirmación "detecta X" se verificó con `experimentos/EXP-005-.../scripts/verificar-observabilidad.js` (resultados en `resultados/observabilidad.json`).

## 1. Despliegue conceptual

### 1.1 Hoy (y lo que decide ADR-005)

```
          ┌───────────────────────────────────────────────┐
          │  Host único (docker compose)                   │
          │                                                │
  TLS ───►│  [ Proxy inverso ]  ──►  [ API Express ]       │
 (prod)   │   nginx/caddy           (1..N workers, M6/D1)  │
          │   · termina TLS          · JWT, autorización   │
          │   · cabeceras            · /metrics (token)    │
          │   · rate-limit red       · logs JSON → stdout  │
          │        │                      │                │
          │        │                      ▼                │
          │        │                 [ PostgreSQL ]        │
          │        │                 (volumen persistente) │
          │        └───(solo 127.0.0.1)──► [ Adminer ]     │
          └───────────────────────────────────────────────┘
                              │ stdout (JSON)
                              ▼
                   [ Recolector de logs/métricas ]
                    (docker logs hoy; Loki/Prometheus si crece)
```

El **proxy inverso** es la pieza nueva que el M7 añade al diagrama: termina TLS (R-S4), aplica cabeceras y un rate-limiting de red por delante del de aplicación (C2), y es el único puerto expuesto. Adminer deja de ser accesible desde fuera (C5).

### 1.2 Dos alternativas de despliegue y su costo relativo

Costo en **órdenes de magnitud** (supuestos de nube típicos, no cotización), con la dimensión que de verdad pesa para un equipo de 3: las **horas de operación**. Se comparan las dos alternativas realistas para el estado actual:

| | **D-A · Un host con proxy (elegida)** | **D-B · PaaS gestionado (free tier + add-ons)** |
|---|---|---|
| Qué es | El `compose` actual + nginx/caddy delante, en un VPS | API y base como servicios gestionados (Render/Railway/Fly + Postgres gestionado) |
| Infra USD/mes | **10¹** (un VPS pequeño) | **10¹–10²** (free tier al inicio; add-ons al crecer) |
| Operación h/sem | **10⁰** (un host que parchear) | **10⁰** (lo gestiona el proveedor) pero **se pierde control** del TLS, los puertos y el `healthcheck` |
| TLS | Propio (Let's Encrypt en el proxy) | Incluido |
| Observabilidad | `docker logs` + `/metrics`; portable a cualquier recolector | Depende del panel del proveedor (puede no exponer el retraso del bucle de eventos que detecta F1) |
| Riesgo específico | Hay que endurecer el host (C4/C5 ayudan) | El `healthcheck` del proveedor puede reiniciar la API bajo carga → **agrava F12** del M6 |
| Reversibilidad | Alta: es el mismo `compose` | Media: acopla al proveedor |

**Decisión (ADR-005):** **D-A**. Mantiene el control de las piezas donde el M6/M7 encontró los riesgos reales (el `healthcheck` que da falso positivo bajo carga, F12; los puertos, A6) y cuesta un orden de magnitud menos en infra, sin añadir horas de operación. El *free tier* (D-B) es atractivo para una demo, pero su `healthcheck` y su reinicio automático son justo lo que el M6 mostró peligroso para este sistema (reiniciar la API en plena saturación). Queda como camino del **nivel avanzado** (desplegar en free tier y comparar con la medición local), no como la arquitectura de referencia.

## 2. Plan de observabilidad, vinculado a los fallos del M6

La regla: **no se añade una señal "porque sí"**; cada una existe para que un fallo concreto del M6 deje de ser invisible (F4: "no nos habríamos enterado"). Tres tipos de señal: **logs**, **métricas**, **alertas**.

### 2.1 Qué se emite

| Señal | Qué | Responde | Fallo M6 que vuelve visible |
|---|---|---|---|
| **Log por petición** (JSON a stdout) | `ts, id, metodo, ruta (patrón), estado, duracion_ms, usuario?` | **qué / dónde / a quién** | F1–F3 (latencia por ruta), F4 |
| **`X-Request-Id`** (cabecera + log) | id de correlación por petición | **dónde** (une la queja del usuario con la línea de log) | F4 |
| **Métrica: retraso del bucle de eventos** (p99, max) | mide si el hilo de Node está bloqueado | **qué** (bcrypt saturando el hilo) | **F1/F2** |
| **Métrica: logins por resultado** (ok/fallido/bloqueado) | contadores | **qué/quién** (ataque C2, saturación) | F1, A2 |
| **Métrica: peticiones por ruta+estado** | contadores | capacidad y errores por ruta | F3 |
| **`/metrics`** (texto Prometheus, con token) | expone lo anterior | — | F4 |

**Diseño que protege la privacidad:** la ruta se registra como **patrón** (`/api/usuarios/:id/inventario`), nunca la URL con el identificador real, y **nunca** se loguea el correo ni el cuerpo. El "a quién" se guarda como el `id` numérico del usuario autenticado, que ya está en el token.

### 2.2 Alertas críticas (el umbral sale de lo medido en el M6)

| Alerta | Condición | Por qué ese umbral | Acción |
|---|---|---|---|
| **BucleDeEventosBloqueado** | p99 del retraso del bucle > **200 ms** sostenido ≥ 15 s | En reposo es ~21 ms; bajo carga de login salta a **1621 ms** (medido, H-O1). 200 ms separa con holgura ambos estados | Es F1: activar el bulkhead (T1) y/o más workers (D1) |
| **PicoDeLoginsFallidos** | tasa de `login_total{resultado="fallido"}`+`bloqueado` por encima de lo normal | Es la firma de A2 (fuerza bruta) | Revisar IP/cuenta; C2 ya está conteniendo |
| **APISinMétricas** | `/metrics` no responde a tiempo | El propio hilo saturado (F12) puede impedir responder: la **ausencia** de señal es señal | Tratar como F1 en curso |
| **BaseInalcanzable** | `/health` devuelve `db:unreachable` | F6 | Revisar PostgreSQL |

La alerta **APISinMétricas** es la respuesta honesta al riesgo que declaramos en el pre-registro: si el hilo está tan saturado que `/metrics` tampoco responde (el mismo mecanismo de F12), no nos quedamos ciegos — la falta de respuesta dispara la alerta.

### 2.3 Evidencia de que detecta (no solo que existe)

De `resultados/observabilidad.json` (medido):

- **H-O1 (¿qué ocurrió?):** retraso del bucle de eventos **21 ms en reposo → 1621 ms bajo carga de login**. La alerta `BucleDeEventosBloqueado` se dispara. La observabilidad **detecta F1**.
- **H-O2 (¿dónde / a quién?):** **100/100** respuestas traen `X-Request-Id` único, y ese id aparece en exactamente una línea de log con la ruta como patrón. La correlación funciona.
- **H-O4 (¿es un punto de fuga?):** `/metrics` sin token → 401; con un JWT de usuario → 401; solo con `METRICS_TOKEN` → 200. Sin configurar el token, **no existe** (404).

### 2.4 Costo de observar (H-O3)

El log por petición escribe una línea JSON a stdout en el *finish* de la respuesta; no bloquea el manejo. La métrica del bucle de eventos usa `perf_hooks` del propio runtime (sin dependencia nueva). El sobrecosto esperado sobre la latencia es ≤ 15 % y se mantiene dentro del presupuesto de rendimiento del M2/M6 (p95 < 500 ms en lecturas). No se añadió ninguna dependencia npm, por lo que **no amplía la superficie de `npm audit`**.

## 3. Relación con la resiliencia del M6

La observabilidad cierra el fallo **F4** ("no había ninguna señal") que el M6 dejó abierto, y es la que permitiría **operar** las tácticas del M6: sin la métrica del bucle de eventos no sabríamos *cuándo* activar el bulkhead (T1) o sumar workers (D1). Seguridad y resiliencia se tocan en **F12**: un `healthcheck`/orquestador que reinicia por carga agrava F1 y además es un vector de disponibilidad; por eso ADR-005 elige un despliegue donde controlamos ese comportamiento.
