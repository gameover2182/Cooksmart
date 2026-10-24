# EXP-004 — Distribución en núcleos del mismo host (D1) — Resultados y veredicto

- **Pre-registro:** `00-preregistro.md`, commit `23a2297` (antes de implementar y medir).
- **Implementación:** `df4f9b0` (`API_WORKERS`, por defecto 1). Imagen medida: `a4bbe35` (incluye además la corrección de T1; T1 y T2 **apagadas**).
- **Ejecución:** 2026-10-23, 19:21–19:37 (−05:00). Calentamiento + 3 corridas por configuración, 500 VUs × 60 s.
- **Análisis:** `../EXP-003-tacticas-resiliencia/scripts/analizar.js resultados w1 w4` → `resultados/mediana-por-config.json`.

## 1. Resultados (medianas de 3 corridas)

| Métrica | **w1** (1 proceso) | **w4** (4 procesos) | Cambio |
|---|---:|---:|---:|
| Logins exitosos (cantidad) | 273 | **1 066** | **3,9×** |
| Logins exitosos por segundo | 3,03 | **13,37** | **4,4×** |
| Tasa de error del login | 70,7 % | **24,6 %** | ÷ 2,9 |
| Logins con *timeout* de 60 s (corrida 1) | 302 | **0** | — |
| Conexiones rechazadas al arrancar (corrida 1) | 329 | 348 | ≈ igual |
| Recorridos completos | 190 | **1 066** | 5,6× |
| P95 de las operaciones sin login | 6 824 ms | 4 850 ms | −29 % |
| P95 del login | 60 000 ms (techo) | 32 154 ms | — |
| CPU de la API (100 % = 1 núcleo) | 100,0 % | **393,5 %** | 4 núcleos saturados |
| CPU de PostgreSQL | 1,8 % | **8,2 %** | sigue ociosa |

Por corrida: logins/s w1 3,03 / 3,04 / 3,00 · w4 13,33 / 13,60 / 13,37 — variación < 2 %.

## 2. Lectura

1. **La capacidad de login escala casi linealmente con los núcleos**: 4 procesos → 4,4× logins por segundo. La CPU de la API pasa de 1 a casi 4 núcleos completos.
2. **Con 4 procesos desaparecen los *timeouts* del login.** El 24,6 % de error que queda corresponde **íntegramente** a las conexiones rechazadas en la ráfaga inicial (~345 por corrida, igual que con w1), no a esperas por CPU.
3. **El siguiente cuello todavía no es la base de datos**: PostgreSQL sube de 1,8 % a 8,2 % al atender 5,6× más recorridos completos.
4. **El resto de operaciones mejora poco (−29 %)** porque ahora **muchos más usuarios llegan a usarlas** (1 066 recorridos frente a 190): el sistema hace 5,6× más trabajo útil con una latencia algo menor. Con w4 la API sigue saturada (393 %) a 10×.
5. **Estimación** (inferida, no medida): a 10× la demanda es ≈ 500 VUs / ≈ 12 s por iteración ≈ 40 logins/s; a ≈ 3,3 logins/s por núcleo harían falta ≈ 12 núcleos solo para el login con bcrypt costo 12. Por eso D1 se combina con T1 (degradación controlada cuando se supera la capacidad) y se deja abierta la discusión del costo de bcrypt (ADR-004).

## 3. Veredicto (reglas del pre-registro)

| Hipótesis | Criterio | Dato | ¿Cumple? |
|---|---|---|---|
| H-D1a (capacidad) | logins exitosos/s w4 ≥ 3× w1 | **4,4×** (3,9× en cantidad) | Sí |
| H-D1b (errores) | error del login w4 ≤ 50 % del de w1 | 24,6 % / 70,7 % = **35 %** | Sí |
| H-D1c (la base no es el siguiente cuello) | CPU de PostgreSQL w4 ≤ 50 % | **8,2 %** | Sí |

> **Veredicto: VALIDADA.** Usar más núcleos del mismo host resuelve el cuello medido en proporción a los núcleos, sin cambiar el dominio ni la base de datos.

## 4. Qué no se verificó

- Más de 4 procesos, ni dónde aparece el siguiente cuello (CPU total del host, k6 compitiendo por la misma máquina).
- La combinación w4 + T1 + T2: el bulkhead y la caché guardan estado **por proceso** (con 4 procesos, el límite efectivo de logins concurrentes sería 4 × 2 = 8).
- El origen de las conexiones rechazadas al inicio (ver EXP-003 §2).
- Réplicas en hosts distintos (D2) y caída de un proceso durante la carga (el proceso principal relanza *workers* que terminan; no se probó).

## 5. Reproducir

```bash
bash experimentos/EXP-004-distribucion-nucleos/scripts/ejecutar.sh               # completo (≈ 16 min)
bash experimentos/EXP-004-distribucion-nucleos/scripts/ejecutar.sh "1 4" 1 20s     # demo en vivo (≈ 2 min)
node experimentos/EXP-003-tacticas-resiliencia/scripts/analizar.js experimentos/EXP-004-distribucion-nucleos/resultados w1 w4
```
