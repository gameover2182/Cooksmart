# Spike 1 — Resultado y veredicto

## 1. Hipótesis pre-registrada

`00-preregistro.md`, commit **`912fd90`** (anterior a la implementación `f5d2506` y a la ejecución `e4135e9`; verificable con `git log --oneline -- experimentos/spike-01-integracion`).

- **H1:** async reduce la mediana de los P95 de `POST /favoritos` en **≥ 30 %**.
- **H2:** con async, `lectura_consistente` **≥ 99 %**.
- **H0:** 0 errores 5xx y `http_req_failed < 1 %` en ambos modos.

## 2. Qué se modificó / qué no

- **Modificado** (`f5d2506`, 4 archivos, +42/−1): `favoritos.service.js` (bifurcación por `FAVORITOS_MODO`), `favoritos.controller.js` (`202` si quedó encolado), `favoritos.cola.js` (nuevo: cola en memoria, concurrencia 5), `docker-compose.yml` (variable con defecto `sync`).
- **No modificado:** repositorios, esquema, pool, autenticación, `GET`/`DELETE` de favoritos, instrumento k6, criterios. Sin broker.

## 3. Condiciones

Ver `01-condiciones.md`: 50 VUs constantes × 30 s, recorrido `POST → GET → DELETE → sleep 0,5 s`, 50 usuarios, misma imagen (commit `f5d2506`) para ambos modos, misma máquina, calentamiento descartado + 3 corridas oficiales por modo, estado inicial restaurado antes de cada corrida.

## 4. Corridas (datos de `02-resultados/*.json`)

| Modo | Corrida | P95 POST (ms) | p50 POST (ms) | P95 GET (ms) | P95 DELETE (ms) | lectura_consistente | delete_antes_de_alta | http_req_failed | Iteraciones |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| sync | calentamiento *(descartada)* | 168,33 | 39,85 | 154,87 | 139,80 | 100,00 % | 0,00 % | 0,00 % | 2270 |
| sync | run-1 | 209,22 | 73,85 | 168,36 | 170,71 | 100,00 % | 0,00 % | 0,00 % | 2046 |
| sync | run-2 | 210,58 | 41,72 | 145,77 | 156,51 | 100,00 % | 0,00 % | 0,00 % | 2242 |
| sync | run-3 | 168,14 | 28,36 | 119,10 | 113,23 | 100,00 % | 0,00 % | 0,00 % | 2383 |
| async | calentamiento *(descartada)* | 157,05 | 47,97 | 220,03 | 252,20 | 51,99 % | 13,31 % | 0,00 % | 1931 |
| async | run-1 | 122,29 | 34,13 | 159,58 | 192,33 | 58,56 % | 11,36 % | 0,00 % | 2121 |
| async | run-2 | 174,16 | 44,92 | 271,49 | 328,51 | 50,27 % | 19,01 % | 0,00 % | 1836 |
| async | run-3 | 115,45 | 32,88 | 149,46 | 161,50 | 54,67 % | 9,85 % | 0,00 % | 2162 |

Errores 5xx: **0** en todas las corridas (la métrica `errores_5xx` nunca se incrementó, por eso no aparece en los JSON).

## 5. Comparación (medianas de las 3 corridas oficiales)

| Métrica | sync | async | Cambio |
|---|---:|---:|---:|
| **P95 POST (primaria, H1)** | **209,22 ms** | **122,29 ms** | **Δ = −41,5 %** |
| p50 POST | 41,72 ms | 34,13 ms | −18,2 % |
| P95 GET (secundaria) | 145,77 ms | 159,58 ms | +9,5 % |
| P95 DELETE (secundaria) | 156,51 ms | 192,33 ms | +22,9 % |
| **lectura_consistente (H2)** | 100,00 % | **54,67 %** | −45,3 pp |
| delete_antes_de_alta | 0,00 % | 11,36 % | +11,4 pp |
| Iteraciones completadas | 2242 | 2121 | −5,4 % |
| http_req_failed / 5xx | 0 % / 0 | 0 % / 0 | = |

Cálculo de H1: `Δ = 1 − 122,29 / 209,22 = 0,4155` → **41,5 % ≥ 30 %**.

## 6. Observaciones

1. **H1 se cumple:** la variante asíncrona reduce el P95 del `POST` en 41,5 %. Esto **refuta la postura previa del equipo** ("el `INSERT` no pesa"): bajo 50 VUs, quitar la escritura del camino de respuesta sí se nota en el `POST`.
2. **H2 falla de forma contundente:** casi **la mitad** (45 %) de las lecturas inmediatas no ven el favorito recién "aceptado", y en ≈ 11 % de las iteraciones el `DELETE` llega antes de que el alta se aplique (el usuario quita un favorito que la API todavía no registró → `404`).
3. **La latencia no desaparece, se traslada:** el P95 de `GET` (+9,5 %) y de `DELETE` (+22,9 %) empeora y el sistema completa **menos** iteraciones (−5,4 %). El consumidor de la cola compite por el mismo pool de PostgreSQL y el mismo proceso; el trabajo total no disminuye, solo deja de contarse en el `POST`.
4. **Variabilidad alta entre corridas:** los rangos se solapan (P95 POST sync 168–211 ms; async 115–174 ms). Con 3 corridas por modo no hay base para un test estadístico; la conclusión de H1 se apoya en las medianas, como fija el protocolo.
5. **No se perdieron escrituras observables** (0 filas huérfanas, 0 errores del consumidor), pero la cola en memoria **no es durable**: un reinicio de la API con elementos pendientes los perdería. Eso no se midió (fuera de alcance).

## 7. Veredicto (aplicando la regla pre-registrada sin modificarla)

| Condición | Resultado |
|---|---|
| Δ ≥ 30 % | **Sí** (41,5 %) |
| H2 (≥ 99 %) | **No** (54,67 %) |
| H0 | Sí |

> ### Veredicto sobre D-async: **AJUSTADA**
> Regla aplicada: "`Δ ≥ 30 %` pero H2 no se cumple → mantener la API síncrona; cualquier asincronía queda en el cliente (UI optimista)".

En palabras del equipo: la asincronía **sí mejora** la métrica que el usuario no ve directamente (el tiempo del `POST`), pero **rompe** lo que sí ve (al abrir "Mis favoritos" justo después, el favorito no está la mitad de las veces) y empeora las demás operaciones. En CookSmart, la percepción de rapidez al marcar un favorito **ya** la da el cliente (escribe en `localStorage` antes de llamar a la API, relación E5), así que la API no gana nada que el usuario perciba y pierde consistencia.

## 8. Qué cambia después del resultado

| Antes del spike | Después del spike |
|---|---|
| I1 pendiente de decisión (`docs/integracion/09-…` §6) | **Síncrono en la API** (contrato `201` se mantiene; no hay cambio incompatible) → ADR-003 |
| Postura: "el `INSERT` no pesa" | Corregida: pesa ≈ 87 ms de P95 bajo 50 VUs, pero moverlo no reduce trabajo total |
| Eventos/broker como opción abierta | Descartados para I1 con evidencia propia; reabrir solo con un consumidor real (H1 del Context Map) |
| Código del spike en la rama | **Revertido** en un commit propio (`git revert f5d2506`); reproducible con `git checkout e4135e9` |
| Sincronización de favoritos del cliente "fire-and-forget" | Registrada como deuda: el cliente debería serializar alta/baja por receta y reintentar (no se implementa en M5) |

## 9. Qué NO se alcanzó a verificar

- Comportamiento con broker real (RabbitMQ/Redis): no se implementó a propósito; la variante en memoria era el mejor caso.
- Pérdida de mensajes ante reinicio de la API con la cola llena.
- Repetibilidad en otra máquina o con k6 en un equipo distinto al de la API (k6 y la API compartieron CPU).
- Significancia estadística (n = 3 por modo, rangos solapados).
- Efecto con más recetas o más usuarios que los de la base de pruebas (20 recetas, 50 usuarios).
