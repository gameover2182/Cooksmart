# EXP-005 — Resultados y veredicto

> Compara las predicciones del pre-registro (`00-preregistro.md`) con lo medido contra el stack real. Fuentes: `resultados/seguridad-antes.json`, `resultados/seguridad-despues.json`, `resultados/observabilidad.json`, y `docker exec cooksmart-api id` para H-S3.

## 1. Seguridad — antes vs. después

| ID | Predicción antes | Medido antes | Predicción después | Medido después | Veredicto |
|---|---|---|---|---|---|
| **H-S1** (secreto JWT) | token forjado → 200 | **200** ✓ | token forjado → 401 | **401** ✓ | **Confirmado** |
| **H-S2** (fuerza bruta) | 15×401, 0×429 | **0×429** ✓ | 429 tras 5 fallos; otra cuenta 401 | **10×429**, otra cuenta **401** ✓ | **Confirmado** |
| **H-S3** (no-root) | uid=0 | **uid=0(root)** ✓ | uid=1000 | **uid=1000(node)** ✓ | **Confirmado** |
| **H-S4** (Adminer) | 0.0.0.0:5433 | **0.0.0.0:5433** ✓ | solo 127.0.0.1 | **127.0.0.1:5433** ✓ | **Confirmado** |
| **H-S5** (cabeceras) | `X-Powered-By` presente, sin nosniff | **Express / null** ✓ | sin `X-Powered-By`, con nosniff+DENY | **null / nosniff / DENY** ✓ | **Confirmado** |
| **H-S6** (enum. cuentas) | 409 | **409** ✓ | 409 (riesgo aceptado) | **409** ✓ | **Confirmado** (residual R-S1 demostrado) |
| **H-S7** (token tras cambio) | token vale | **200** ✓ | token vale (riesgo aceptado) | **200** ✓ | **Confirmado** (residual R-S2 demostrado) |
| **H-S8** (tope de caché) | crece sin límite | prueba unitaria | ≤ MAX | **FF-6 pasa** ✓ | **Confirmado** (en prueba) |

## 2. Observabilidad (`observabilidad.json`)

| ID | Predicción | Medido | Veredicto |
|---|---|---|---|
| **H-O1** (¿qué?) | lag p99 reposo < 50 ms; bajo carga > 200 ms | **21,3 ms → 1621,1 ms** | **Confirmado**: la métrica detecta F1/F2 del M6 |
| **H-O2** (¿dónde/quién?) | 100/100 con `X-Request-Id` único, correlacionable al log | **100/100 únicos**; id presente en el log con ruta-patrón | **Confirmado** |
| **H-O4** (¿fuga?) | sin token 401; JWT 401; token de métricas 200; sin configurar 404 | **401 / 401 / 200**; y **404** sin token | **Confirmado** |
| **H-O5** (rastro del ataque) | tras el ataque de H-S2, `/metrics` muestra exactamente **+5 fallido** y **+10 bloqueado** | medido con la API recién reiniciada: `fallido=5`, `bloqueado=10` (coincide exacto con los 5×401 + 10×429 de H-S2) | **Confirmado** (tras corregir el defecto D-O3, abajo) |

## 3. Veredicto global: **VALIDADO**

Se cumplen las cuatro predicciones principales (H-S1, H-S2, H-O1, H-O2) y todas las secundarias. Ninguna amenaza resultó sobreestimada: las siete amenazas con predicción "antes" eran explotables exactamente como se predijo.

**Hallazgo más fuerte:** el retraso del bucle de eventos pasa de **21 ms a 1621 ms** cuando el login satura el hilo. Es la confirmación medida de que la observabilidad del M7 **detecta el fallo real** que el M6 solo pudo ver añadiendo instrumentación externa (F4). La pregunta del módulo —*¿cómo sabríamos qué ocurrió?*— queda respondida con un número.

## 4. H-O3 — sobrecosto de los logs (medido)

`k6-demo/diagnostico.js` (50 VUs × 20 s, 1 calentamiento descartado + 3 corridas), P95 de `http_req_duration` en ms, con el log por petición activado (`LOG_PETICIONES=on`) vs. desactivado (`off`):

| Config | Corridas (P95 ms) | Mediana |
|---|---|---|
| Log **on** | 201 · 192 · 193 | **193** |
| Log **off** | 236 · 257 · 210 | **236** |

**Lectura honesta:** la mediana con el log **activado** (193 ms) salió **más baja** que con el log desactivado (236 ms). Como activar el log no puede *acelerar* el sistema, la diferencia es **ruido de la máquina**, no efecto del log. La conclusión correcta no es "−18 %", sino que **el sobrecosto del log por petición está por debajo del ruido de medición** en este entorno (la variabilidad entre corridas, ~20–30 %, es mayor que cualquier efecto del log). Es coherente con el diseño —una línea `JSON.stringify` + escritura a stdout por petición, sin dependencias— pero un porcentaje limpio exigiría una máquina dedicada y en reposo (la misma limitación que ya documenta `docs/m6/fitness-functions.md` sobre k6 en esta máquina). Veredicto de H-O3: **sobrecosto no distinguible de cero**; se añadió `LOG_PETICIONES=off` como palanca por si en producción el volumen de logs pesara más que la CPU.

## 5. Desviaciones

- **D-O1:** para capturar el "después" hubo que **reiniciar la API** antes de cada corrida, porque el límite de intentos (C2) es en memoria y las corridas previas dejaban la cuenta de prueba bloqueada dentro de la ventana de 15 min. Es un efecto esperado del propio control, no un fallo; se documenta para que la medición sea repetible.
- **D-O2 (H-O3 ahora medido):** H-O3 (sobrecosto de los logs) se dejó primero como estimación. Tras la auditoría del tutor se **midió formalmente**: se añadió el interruptor `LOG_PETICIONES` (on/off, sin perder métricas ni `X-Request-Id`) y se comparó `k6-demo/diagnostico.js` (50 VUs × 20 s, 1 calentamiento descartado + 3 corridas) con el log por petición activado vs. desactivado. Resultado en §5.
- **D-O3 (defecto de observabilidad, corregido):** al medir H-O5 el contador `login_total{fallido}` daba **0** cuando debía dar 5. Causa: el patrón de ruta se calculaba con `req.baseUrl + req.route.path`, pero en un 401 que viaja por `next(err)` hasta el `errorHandler` a nivel de app, Express ya había desmontado el `baseUrl`, así que la ruta salía `"/login"` en vez de `"/api/auth/login"` y el `if (ruta === '/api/auth/login')` no la contaba. Se corrigió usando `req.originalUrl` (estable en todo el ciclo). Tras el arreglo, H-O5 da `fallido=5`, `bloqueado=10`, exacto. Importa porque de ese contador depende la alerta `PicoDeLoginsFallidos`: con el defecto, un ataque de fuerza bruta no habría disparado la alerta.
