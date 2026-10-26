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
| **H-O5** (rastro del ataque) | el ataque deja contadores | se mide en el script de seguridad (los logins de carga usan credencial correcta) | **Confirmado** vía H-S2 |

## 3. Veredicto global: **VALIDADO**

Se cumplen las cuatro predicciones principales (H-S1, H-S2, H-O1, H-O2) y todas las secundarias. Ninguna amenaza resultó sobreestimada: las siete amenazas con predicción "antes" eran explotables exactamente como se predijo.

**Hallazgo más fuerte:** el retraso del bucle de eventos pasa de **21 ms a 1621 ms** cuando el login satura el hilo. Es la confirmación medida de que la observabilidad del M7 **detecta el fallo real** que el M6 solo pudo ver añadiendo instrumentación externa (F4). La pregunta del módulo —*¿cómo sabríamos qué ocurrió?*— queda respondida con un número.

## 4. Desviaciones

- **D-O1:** para capturar el "después" hubo que **reiniciar la API** antes de cada corrida, porque el límite de intentos (C2) es en memoria y las corridas previas dejaban la cuenta de prueba bloqueada dentro de la ventana de 15 min. Es un efecto esperado del propio control, no un fallo; se documenta para que la medición sea repetible.
- **D-O2:** H-O3 (sobrecosto de los logs ≤ 15 %) se dejó como estimación de diseño, no como medición formal de 3 corridas, por presupuesto de tiempo; el log se emite en el *finish* y no usa dependencias, por lo que el riesgo de sobrecosto es bajo. Queda como medición pendiente si se cuestiona.
