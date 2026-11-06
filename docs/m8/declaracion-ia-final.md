# Declaración final de uso de IA — CookSmart (M8)

> El curso exige declarar el uso de IA. Esta es la declaración **consolidada** de todo el proyecto: qué se le pidió a la IA, y qué se **aceptó**, **modificó** o **rechazó**, siempre bajo revisión del equipo y contrastado con medición propia cuando se pudo. No se retira esta declaración del dossier: es parte de la evidencia de criterio.

## 1. Cómo se usó la IA

- **Como asistente de redacción y de código:** borradores de documentos, ADRs, scripts de experimento, middlewares y fitness functions. Todo revisado por el equipo antes de adoptarse.
- **Como crítico (M4, M6, M7, M8):** se le pidió proponer o atacar, y se contrastó con datos. Ver `evaluacion-arquitectonica.md` §3 (IA adversarial).
- **Lo que la IA NO decidió:** ninguna decisión arquitectónica se tomó por recomendación de la IA sin evidencia. Donde hubo medición, la medición mandó.

## 2. Registro de lo aceptado / modificado / rechazado

| Propuesta de la IA | Módulo | Decisión | Por qué |
|---|---|---|---|
| Lista de eventos de dominio | M5 | **Modificado** | Se auditaron: reales / redundantes / inventados (`auditoria-eventos-m5.md`); se quedaron solo los reales |
| Integración asíncrona con broker | M5/M6 | **Rechazado** | Spike 1 (E6): async perdía 66/1000 escrituras en crash; se eligió síncrono (ADR-003) |
| Estrategia de microservicios (5 bases, broker, k8s, Redis) | M6 | **Rechazado** (6 de 8 elementos) | Datos: BD al 2 %, cuello en CPU de 1 hilo; 100× más costo (`evaluacion-microservicios-ia-m6.md`) |
| Observabilidad (en la propuesta de microservicios) | M6 | **Aceptado en versión mínima** | Era un fallo real (F4); se implementó sin dependencias (M7) |
| Principios de seguridad (no versionar secretos, no-root, límite de fuerza bruta) | M7 | **Aceptado** (4 de 11) | Coincidían con amenazas medidas (E7, E8); los otros 7 descartados por costo-beneficio |
| Controles genéricos (WAF, vault, MFA, DAST, cifrado en reposo) | M7 | **Rechazado hoy** | Desproporcionados para 3 personas y este sistema; con disparador medido se reabren (`plan-evolucion.md`) |
| Caché del catálogo con Redis | M7/M8 | **Modificado** | Se hizo en memoria (−37 %, E3); Redis solo a escala 100× |
| Cabeceras con `helmet` | M7 | **Modificado** | Se pusieron a mano para no ampliar la superficie de `npm audit` |
| Críticas adversariales a la arquitectura | M8 | **Mixto** | Refutadas con datos las de escala/caché; aceptadas las de observabilidad y secreto (ya cerradas) |

## 3. Qué habría salido mal si hubiéramos seguido a la IA sin medir

- Habríamos construido **microservicios** (10³ USD/mes + decenas de horas de operación) para un cuello que se resuelve con **una variable de entorno** (E4).
- Habríamos añadido **Redis** cuando una caché en memoria de 20 líneas bastaba (E3).
- Habríamos confiado en un **bulkhead con un defecto** que lo volvía punto único de fallo, de no haberlo medido (D1 de EXP-003).

## 4. Qué aportó realmente la IA

- Velocidad en redactar y en escribir instrumentos (scripts, pruebas), que el equipo revisó.
- Un **adversario barato**: pedirle que atacara la arquitectura obligó a tener evidencia lista para cada crítica (M8 §3).
- Detección de huecos reales que el equipo ya sospechaba (observabilidad, secreto), acelerando su cierre.

**Síntesis:** la IA fue útil como acelerador y como adversario, nunca como árbitro. El criterio del proyecto —**medir antes de decidir, y declarar qué descansa en argumento**— es lo que mantuvo la arquitectura honesta. Esta declaración queda en el dossier como parte de esa honestidad.
