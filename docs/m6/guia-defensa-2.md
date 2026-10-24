# Guía de la defensa 2 (Corte 2) — Módulo 6

> Defensa **individual de 7 a 10 minutos** con **re-decisión** sobre la decisión de distribución. Rúbrica: Evidencia ejecutable · Trade-offs · Riesgos · Defensa oral y re-decisión. **La medición debe poder re-ejecutarse en vivo**: si no se reproduce, la fila cae a Insuficiente.
> Presentación: el deck "CookSmart — Módulo 6" (18 diapositivas, con notas del orador).

## 1. Guion de 8 minutos

| Min. | Qué decir | Diapositiva | Respaldo |
|---|---|---|---|
| 0:00 | La pregunta y la respuesta adelantada: falla primero la autenticación, y no había monitoreo para verlo | 1–2 | EXP-002 §2 |
| 0:45 | Método: hipótesis con número en Git **antes** de medir; 3 corridas + mediana | 3 | `git log` |
| 1:30 | EXP-002: misma medición de M2 a 1×–10×; gráfica | 4–5 | `degradacion-vs-carga.svg` |
| 2:30 | Dónde: API 100 % de un núcleo, PostgreSQL 2 %; ≈ 3 logins/s por núcleo | 6 | EXP-002 §1.1 |
| 3:15 | Veredicto honesto: 2 de 3 predicciones refutadas | 7 | EXP-002 §3 |
| 3:45 | Matriz de fallos y de resiliencia | 8–9 | `matriz-fallos-resiliencia.md` |
| 4:30 | EXP-003: bulkhead −92 %, caché −37 %; el defecto que bloqueó todos los logins | 10 | EXP-003 §1–4 |
| 5:30 | EXP-004: 4 procesos → 4,4× logins/s; la base sigue en 8 % | 11 | EXP-004 §1 |
| 6:00 | Costo en órdenes de magnitud y ADR-004 | 12–13 | `costo-distribucion.md`, ADR-004 |
| 6:45 | Por qué la propuesta de microservicios de la IA es complejidad innecesaria | 14 | `evaluacion-microservicios-ia-m6.md` |
| 7:15 | Fitness functions + demo en vivo | 15–16 | `fitness.yml` |
| 8:00 | Límites y re-decisión | 17–18 | ADR-004 §7 |

## 2. Demo en vivo (preparar antes de entrar)

```bash
cd Docker/Postgre && docker compose up -d --build && cd ../..      # 1 vez, antes de la defensa
bash experimentos/EXP-003-tacticas-resiliencia/scripts/ejecutar.sh "base t1" 1 20s   # ≈ 2 min: antes/después
node fitness/reglas-capas.js                                       # FF-1 en segundos
```

Qué debe verse: en `base` el P95 de `op_sin_login` en varios segundos; en `t1` por debajo de 1 s y `login_rechazo_controlado` alto. Si la máquina es distinta, los números cambian pero **la dirección** debe repetirse.

## 3. Preguntas probables y respuestas con datos

| Pregunta | Respuesta | Dónde |
|---|---|---|
| ¿Cómo sabes que no es la base de datos? | Medimos su CPU durante cada corrida: ≈ 2 % en todos los niveles y ≤ 1 conexión activa, mientras la API estaba al 100 % | EXP-002 §1.1 |
| ¿Por qué el login es tan caro? | bcrypt con costo 12 (2¹² rondas) a propósito: es lo que hace costoso un ataque de fuerza bruta. ≈ 3 logins/s por núcleo | `auth.service.js` (`COSTO_HASH = 12`) |
| ¿Por qué no bajan el costo de bcrypt? | Mejoraría ≈ 4× con costo 10, pero cambia una decisión de **seguridad** (RNF02, prioridad 1). Lo dejamos explícito como alternativa no evaluada, no lo decidimos por rendimiento | ADR-004 §3 |
| Sus hipótesis fallaron, ¿el experimento sirve? | Sí: el curso evalúa igual o mejor un experimento que refuta la predicción si el registro es sólido. La regla quedó en Git antes de medir | EXP-002 §3, `02a5143` |
| ¿Qué pasó con el primer T1? | Fugaba cupos cuando un cliente se iba en cola; tras 2 fugas bloqueaba todos los logins. Lo reprodujimos con una prueba, lo corregimos, re-medimos y la prueba quedó como FF-3 | EXP-003 §1 |
| ¿T1 no es simplemente rechazar usuarios? | Sí, es **degradación elegida**: sin T1 los mismos usuarios esperaban hasta 60 s y fallaban igual, y además arrastraban al resto. Con T1 los logins exitosos no bajan (263 vs 269) y el resto pasa de 6,8 s a 0,55 s | EXP-003 §2–3 |
| ¿Por qué no microservicios? | El cuello es CPU en un núcleo; darle núcleos al login con 4 procesos dio 4,4× a costo 10¹ USD/mes. Microservicios: 10³ USD/mes y 10¹–10² h/semana para el mismo efecto | EXP-004, `costo-distribucion.md` |
| ¿Los números de costo son reales? | Son órdenes de magnitud con supuestos explícitos, no una cotización | `costo-distribucion.md` §2 |
| ¿Qué falla después de D1? | No medido más allá de 4 procesos. Estimación: a 10× harían falta ≈ 12 núcleos solo para el login con costo 12 | EXP-004 §2.5 |
| ¿Qué es esa ráfaga de conexiones rechazadas? | Al arrancar 500 VUs a la vez, ~350 conexiones se rechazan en todas las configuraciones (incluso con 4 procesos). No se determinó si es la cola del proceso o Docker Desktop. Es igual en todas, así que no sesga las comparaciones | EXP-003 §2 |
| ¿Qué hace la fitness function? | FF-1 recorre los `require` de cada archivo y rompe el PR si una capa importa otra no permitida; la CI le inyecta una violación para comprobar que no pasa siempre | `fitness/reglas-capas.js` |
| ¿Qué hizo la IA y qué decidieron ustedes? | Ver §5 | `docs/ia/evaluacion-microservicios-ia-m6.md` |

## 4. Re-decisión: preparar las tres respuestas

El comité puede cambiar una condición y pedir que se re-decida. Respuestas preparadas desde ADR-004 §7:

| Si el comité dice… | Re-decisión | Por qué |
|---|---|---|
| "El rol es **Finanzas**: el presupuesto es el mínimo" | **Mantener D1 + T1 + T2** en el host actual | Costo adicional ≈ 0; ya hay 11 núcleos libres |
| "El rol es **Seguridad**: no se puede rechazar a usuarios legítimos" | **Ajustar**: mantener D1 y subir N; T1 con más cupos y cola; agregar *rate limiting* por cliente para separar abuso de demanda legítima | T1 rechaza en ráfagas; con más núcleos rechaza menos (EXP-004) |
| "Se exige 99 % de disponibilidad aunque caiga una máquina" | **Reconsiderar hacia D2** (2+ hosts + balanceador + base gestionada) | D1 no sobrevive a la caída del host; el costo pasa a 10² USD/mes |
| "Los usuarios crecen 100×" | **Reconsiderar**: repetir EXP-002 al nuevo nivel; probable D2 y revisar costo de bcrypt con Seguridad | 100× ≈ 400 logins/s → ≈ 120 núcleos con costo 12 (inferido) |

## 5. Uso de IA en el Módulo 6 (declaración)

| Parte | Qué hizo la IA (Claude Code) | Qué debe revisar y defender el equipo |
|---|---|---|
| Diseño de EXP-002/003/004 e hipótesis | Redactó las hipótesis y las reglas de veredicto a partir de los datos de M2 | Que las hipótesis y umbrales sean los que el equipo considera razonables |
| Implementación (T1, T2, *cluster*, FF-1, FF-3) | Escribió el código y las pruebas | Entender cada archivo (son cortos) para explicarlo |
| Ejecución y análisis | Ejecutó las corridas y calculó medianas con scripts del repo | Re-ejecutar al menos la demo en vivo antes de la defensa |
| Defecto D1 de T1 | Lo introdujo la IA en la primera versión y lo encontró al medir | Saber explicarlo: es una de las mejores lecciones del módulo |
| Propuesta de microservicios | Generó la propuesta a pedido, para evaluarla | La evaluación contra datos: `docs/ia/evaluacion-microservicios-ia-m6.md` |
| ADR-004 | Redactó el borrador | **La decisión es del equipo**: revisar, ajustar o rechazar antes del comité |
