# Auditoría de evidencia del Módulo 5

> Responde, punto por punto, la revisión del tutor: qué evidencia de M5 existe, dónde está, qué es **medición** y qué es **spike**, y cómo se demuestra el orden temporal en Git.

---

## 1. Las cinco evidencias de M5

| # | Evidencia que pide el curso | Archivo(s) | Estado |
|---|---|---|---|
| 1 | Dominio: subdominios y contextos acotados | `docs/dominio/mapa-dominio.md` (inventario §1, subdominios §4, límites §6) | 🟢 |
| 1b | Context Map con relaciones justificadas | `docs/dominio/context-map.md` (relaciones E1–E7 con evidencia, H1–H4 hipotéticas) | 🟢 |
| 2 | Contrato API o catálogo de eventos + decisión síncrono/asíncrono | `docs/integracion/09-api-eventos-integracion.md`, `docs/integracion/openapi-v1.yaml` | 🟢 |
| 2b | Filtro de eventos propuestos por IA | `docs/ia/auditoria-eventos-m5.md` (12 eventos: 0 con productor y consumidor reales) | 🟢 |
| 3 | Spike 1: hipótesis, ejecución, observación, veredicto | `experimentos/spike-01-integracion/` (`00-preregistro`, `01-condiciones`, `02-resultados`, `03-veredicto`) | 🟢 Veredicto **AJUSTADA** |
| 4 | ADR 3 con referencia explícita al spike | `docs/adr/ADR-003-integracion-entre-contextos.md` (§1 y §7 citan los commits del spike) | 🟢 |
| 5 | Aplicabilidad de CQRS / Event Sourcing / eventos / consistencia eventual | `docs/integracion/aplicabilidad-cqrs-eventos.md` | 🟢 |

**Pendiente de la parte del equipo (no técnica):** cada integrante debe revisar y poder defender los límites de contexto, la hipótesis y el ADR-003 (ver `docs/ia/auditoria-eventos-m5.md` §3: la IA redactó borradores de esas decisiones).

## 2. Medición ≠ Spike: qué es cada evidencia de k6

| Evidencia | Pregunta que responde | ¿Tiene hipótesis previa? | ¿Tiene cambio experimental? | ¿≥ 3 corridas? | Tipo |
|---|---|---|---|---|---|
| `experimentos/EXP-001-linea-base/` | ¿Cómo respondía la consulta de favoritos en **Firebase**? | No | No | Sí (3 + calentamiento) | Línea base **histórica** (sistema anterior) |
| `k6-demo/diagnostico.js` (50 VUs × 20 s) | ¿Cómo responde `GET /api/recetas` aislado? | No | No | No (1 corrida) | **Medición** |
| `k6-demo/load-test.js` @ `3da63ea` (50 VUs × 20 s) | ¿Cómo responde el recorrido completo con login por iteración? | No | No | No (1 corrida) | **Medición** |
| `k6-demo/load-test.js` @ `a57e7d9` (progresivo hasta 500 VUs) | ¿Hasta qué carga aguanta el recorrido? | No | No | — | **Medición** sin resultados registrados |
| `experimentos/spike-01-integracion/` | ¿La escritura asíncrona de favoritos justifica su consistencia eventual? | **Sí** (`914a9ab`) | **Sí** (`87728bf`) | **Sí** (3 + calentamiento por modo) | **Spike** |

**Comparabilidad:** las cuatro primeras filas **no** son comparables entre sí ni con el spike (sistemas, scripts, cargas y duraciones distintas). El spike **no** usa los números del README como línea base: mide su propia línea base síncrona en el **mismo commit**, la **misma máquina** y el **mismo script** que la variante asíncrona. Esa es la única comparación que se usa para el veredicto.

## 3. Cómo leer el "P95 global = 9,72 s"

- Es el P95 de **todas las solicitudes HTTP mezcladas** del recorrido (login + perfil + recetas + detalle + categorías + tipos de cocina + ingredientes + favoritos + historial + inventario), con el script de `3da63ea`.
- **No** es la latencia de un endpoint ni "la latencia de la API".
- En esa versión, cada iteración hacía su propio login → los logins eran 50 de 500 solicitudes (10 %). Como el P95 mira el 5 % más lento, el valor global cae dentro de la distribución del login (P95 login ≈ 17,93 s). *(Inferencia a partir de la composición del recorrido; las demás operaciones tuvieron P95 entre 0,30 s y 1,59 s.)*
- 50 VUs **no** son 50 solicitudes/s: cada iteración tenía 11 s de pausas (`sleep`).

## 4. Por qué el Spike 1 investiga favoritos y no el login

Secuencia aplicada: **driver → escenario → interacción → hipótesis → spike**, y no "número grande → tecnología nueva".

| Paso | Login (R-02) | Favoritos (I1) |
|---|---|---|
| Driver | Rendimiento (RNF04) y Seguridad (RNF02) | Rendimiento (RNF04) y Usabilidad (RNF01: que el usuario vea lo que acaba de guardar) |
| Escenario | PR02, P95 login ≈ 17,93 s | PR02 (favoritos P95 ≈ 1,04 s) + pregunta del módulo ("¿eventos para un CRUD simple?") |
| ¿Es una **decisión de integración entre contextos**? | **No.** Es costo de CPU de bcrypt (costo 12) dentro del mismo proceso. Su diagnóstico es por capa (bcrypt vs. consulta vs. pool), no síncrono vs. asíncrono | **Sí.** Es la única escritura entre contextos que usa el frontend y la única que ya se comporta como asíncrona (E5 del Context Map) |
| Tema de M5 | Fuera del foco de integración | Exactamente el foco: sync vs async, consistencia eventual |

El login sigue siendo el **problema de rendimiento más grande medido**, y por eso queda como candidato al **Spike 2** (opcional, bonificable, "decisión de resiliencia/distribución"), con hipótesis propia y su propio pre-registro. No se mezcla con el Spike 1.

## 5. Trazabilidad Git: preguntas que puede hacer el profesor

| Pregunta | Respuesta | Cómo mostrarlo |
|---|---|---|
| "Muéstreme el commit donde registraron la hipótesis" | `914a9ab` — 2026-10-04 12:43:10 | `git show --stat 914a9ab` |
| "Muéstreme el cambio experimental" | `87728bf` — 12:43:53 (4 archivos, todos dentro del alcance pre-registrado) | `git show 87728bf` |
| "¿La hipótesis existía antes de medir?" | Sí: primera corrida 12:44:23 (`01-condiciones.md` §5), posterior a `914a9ab` | `git log --date=iso --format="%h %ad %s" 914a9ab^..95de6b7` |
| "Muéstreme el commit donde ejecutaron el experimento" | `3f3455f` — 12:53:04 (JSON + logs de 8 corridas) | `git show --stat 3f3455f` |
| "¿Cambiaron la regla del veredicto después de ver los datos?" | No: `00-preregistro.md` no se modificó después de `914a9ab` | `git log --format=%h -- experimentos/spike-01-integracion/00-preregistro.md` → solo `914a9ab` |
| "¿Qué hizo la IA y qué decidieron ustedes?" | `docs/ia/auditoria-eventos-m5.md` §3 | — |

## 6. Inconsistencias documentales corregidas

| Inconsistencia | Corrección |
|---|---|
| README decía "Semana 8 — Módulo 4" | Ahora dice "Semana 10 — Módulo 5" |
| README presentaba como "trabajo futuro" cosas ya hechas | Se separó **Ya ejecutado** de **Pendiente / Roadmap** |
| README mostraba resultados de `load-test.js` que el script actual ya no reproduce | Nota de trazabilidad: resultados de `3da63ea`; el script actual (`a57e7d9`) es otro experimento |
| "P95 global 9,72 s" podía leerse como latencia de la API | Nota de interpretación en el README y §3 de este documento |
| Rutas de ADR en el README (`docs/ADR-00x…`) | Corregidas a `docs/adr/ADR-00x…` |

## 7. Puntos de defensa señalados por el tutor

| Punto | Qué se hizo | Dónde |
|---|---|---|
| "¿Qué pasa si reinicio la API con mensajes pendientes?" | **Medido** (post hoc, no altera el veredicto): con SIGKILL la cola en memoria perdió 66/1000 altas confirmadas en 1 de 3 corridas; síncrono 0/6000. Apagado ordenado: 0 pérdidas en ambos modos | `experimentos/spike-01-integracion/verificacion-reinicio/` |
| "¿E4 es realmente un Shared Kernel si vive en `localStorage`?" | Evidencia de escritores/lectores por clave, defecto de divergencia `cookSmartIngredientes` vs `cookSmartNevera`, y 3 clasificaciones posibles con pros y contras | `docs/dominio/context-map.md` §6 — **decisión del equipo pendiente** |
| "La IA redactó decisiones importantes" | El equipo revisa cada decisión y registra si la mantiene, la modifica o la rechaza | `docs/ia/auditoria-eventos-m5.md` §3 — **pendiente** |

## 8. Lo que sigue pendiente (declarado, no oculto)

- Resultados de la carga progresiva a 500 VUs (`a57e7d9`): el script existe, pero no hay corridas registradas con protocolo.
- `docs/01`, `docs/02`, `docs/04` y los ADR-001/002 siguen citando "P95 global 9,72 s" sin la aclaración del §3; la aclaración está centralizada en el README y en este documento.
- Spike 2 (login) no ejecutado.
- Clasificación final de E4 en el Context Map (§6.3) y revisión de las decisiones redactadas con IA.
- Los veredictos del mini-comité en ADR-001/002 siguen "por registrar".
