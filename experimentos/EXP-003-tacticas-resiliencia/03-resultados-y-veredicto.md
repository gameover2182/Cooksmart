# EXP-003 — Tácticas de resiliencia — Resultados y veredicto

- **Pre-registro:** `00-preregistro.md`, commit `387ac56` (antes de implementar y medir).
- **Implementación:** `72d43fb` (T1 y T2 detrás de *flags* apagados).
- **Ejecución:** 2026-10-23. base y T2 sobre la imagen de `72d43fb`; **T1 re-ejecutado** sobre la imagen de `a4bbe35` (ver desviación D1).
- **Análisis:** `scripts/analizar.js` → `resultados/mediana-por-config.json` (medianas de 3 corridas, 500 VUs = 10×).

## 1. Desviación D1 — defecto en la implementación de T1 (declarada)

En la primera ejecución, T1 funcionó durante el calentamiento y luego **rechazó el 98,8 % de los logins con 503 en ~1 ms y ninguno tuvo éxito** en las 3 corridas oficiales (`resultados/t1-con-defecto/`, `logs/t1-con-defecto/`, conservados como evidencia).

- **Causa (reproducida con una prueba antes de corregirla):** el bulkhead escuchaba el cierre de la conexión solo cuando la petición obtenía cupo. Si el cliente se iba mientras esperaba en cola (pasa al final de cada corrida de k6), al recibir su turno el evento `close` ya había ocurrido y **el cupo nunca se liberaba**. Con los 2 cupos fugados, el login quedaba bloqueado para siempre. El contenedor no se reinicia entre corridas de una misma configuración, por eso el bloqueo persistió.
- **Corrección:** commit `a4bbe35` (`fix(m6)…`), con `Docker/Postgre/backend/test/bulkheadLogin.test.js`: la prueba **falla** con el código original y **pasa** con la corrección; una tercera prueba verifica que bajo saturación sigue rechazando.
- **Re-ejecución:** T1 completo (calentamiento + 3 corridas) con el mismo instrumento, carga y parámetros. Única diferencia con base/T2: la imagen incluye además el modo *cluster* de EXP-004, **inactivo** con `API_WORKERS=1`.
- **Consecuencia para la arquitectura:** una táctica de resiliencia con un defecto se convirtió en un **punto único de fallo** (dejó a todos sin poder iniciar sesión). Se agregó **FF-3** a la CI para que este defecto no vuelva (`docs/m6/fitness-functions.md`).

## 2. Resultados (medianas de 3 corridas, 500 VUs)

| Métrica | base | **T1 bulkhead** | **T2 caché** |
|---|---:|---:|---:|
| **P95 de las 9 operaciones sin login** | 6 765 ms | **550 ms** | **4 259 ms** |
| Error de las operaciones sin login | 0 % | 0 % | 0 % |
| P95 de los rechazos controlados (503) | — | **1 370 ms** | — |
| Logins rechazados con 503 (degradación) | 0 % | 93,7 % de los intentos | 0 % |
| Logins exitosos (cantidad) | 269 | 263 | 268 |
| Logins exitosos por segundo | 2,99 | **3,48** | 3,34 |
| Logins con *timeout* de 60 s (corrida 1) | 307 | **46** | 359 |
| Recorridos completos | 187 | **263** | **268** |
| Duración real de la corrida (60 s + cola de cierre) | 90 s | 76 s | 84 s |

Por corrida (P95 sin login): base 6 765 / 6 728 / 6 969 · T1 547 / 550 / 607 · T2 3 721 / 4 259 / 4 544. Rechazos T1 (P95): 1 454 / 1 370 / 1 364 ms.

### Observación que afecta a todas las configuraciones

Al iniciar cada corrida de 500 VUs, k6 abre 500 conexiones a la vez y **~350 son rechazadas** (*connection refused*): base 349, T1 348, T2 362 en la corrida 1; también ocurre en EXP-002 a 500 VUs (374). Es independiente de la táctica, así que no sesga la comparación, pero **forma parte de la tasa de error del login** reportada en EXP-002 a 10×. No se determinó si el límite es la cola de conexiones del proceso o el reenvío de puertos de Docker Desktop en Windows (ver §5).

## 3. Veredicto (reglas del pre-registro)

`Δ = 1 − (P95 táctica / P95 base)` sobre las operaciones sin login.

### T1 — Bulkhead + degradación del login → **VALIDADA** (con la desviación D1 declarada)

| Hipótesis | Criterio | Dato | ¿Cumple? |
|---|---|---|---|
| H-T1a (protección) | Δ ≥ 50 % y error sin login ≤ 1 % | **Δ = 91,9 %** · error 0 % | Sí |
| H-T1b (falla rápida) | P95 del rechazo ≤ 1 500 ms | **1 370 ms** (las 3 corridas ≤ 1 454 ms) | Sí, con poco margen |
| H-T1c (no pierde capacidad útil) | logins exitosos/s ≥ 80 % de base | **116 %** (3,48 vs 2,99) | Sí |

Nota sobre H-T1c: la fórmula pre-registrada divide entre la duración real, y T1 termina antes (76 s vs 90 s) porque no deja peticiones colgadas. En **cantidad absoluta**, T1 logra 263 logins contra 269 de base (98 %): T1 **no aumenta** la capacidad de login (sigue siendo ≈ 2–3/s por núcleo); lo que hace es **dejar de desperdiciar** la espera de los demás.

### T2 — Caché del catálogo → **VALIDADA** (refuta la postura previa del equipo)

| Hipótesis | Criterio | Dato | ¿Cumple? |
|---|---|---|---|
| H-T2 | Δ ≥ 30 % | **Δ = 37,0 %** | Sí |

El equipo esperaba que T2 **no** llegara al 30 % porque PostgreSQL estaba ocioso. Se equivocó en el mecanismo: la caché no le ahorra trabajo a la base, le ahorra **CPU al único hilo de la API** (procesar el resultado de SQL y serializar el JSON del catálogo en cada petición). Esa CPU es justo la que disputa bcrypt.

## 4. Comparación de las dos tácticas (nivel avanzado del módulo)

| | T1 bulkhead | T2 caché |
|---|---|---|
| Qué protege | Al **resto** del sistema, de la sobrecarga del login | Al catálogo, liberando CPU compartida |
| Efecto sobre el resto (P95) | 6,8 s → **0,55 s** (12× mejor) | 6,8 s → 4,3 s (1,6× mejor) |
| Efecto sobre el login | Rechaza rápido lo que no puede atender (503 + `Retry-After`) | Ninguno: el login sigue esperando hasta 60 s |
| Lo que cuesta | El usuario ve "intenta de nuevo en un momento" en ráfagas; estado por proceso; un defecto lo convirtió en punto único de fallo | Datos hasta 60 s viejos (el catálogo no cambia en runtime); memoria |
| ¿Aumenta la capacidad de login? | **No** | **No** |

**Conclusión:** T1 es la táctica que responde al fallo medido en EXP-002 (contagio desde el login); T2 es complementaria y barata. **Ninguna** de las dos aumenta la capacidad de login, que sigue limitada a un núcleo → eso lo evalúa EXP-004 (decisión de distribución).

## 5. Qué no se verificó

- El origen de los ~350 rechazos de conexión al inicio de cada corrida de 500 VUs (proceso vs. Docker Desktop).
- T1 + T2 combinadas.
- Otros parámetros de T1 (concurrencia 2, espera 1 s, cola 20 se fijaron sin barrido).
- Comportamiento de la experiencia de usuario ante el 503 (el frontend actual no lo maneja de forma específica).

## 6. Reproducir

```bash
bash experimentos/EXP-003-tacticas-resiliencia/scripts/ejecutar.sh                  # completo (≈ 25 min)
bash experimentos/EXP-003-tacticas-resiliencia/scripts/ejecutar.sh "base t1" 1 20s  # demo en vivo (≈ 2 min)
node experimentos/EXP-003-tacticas-resiliencia/scripts/analizar.js experimentos/EXP-003-tacticas-resiliencia/resultados base t1 t2
cd Docker/Postgre/backend && node --test test/bulkheadLogin.test.js                 # prueba del defecto D1
```
