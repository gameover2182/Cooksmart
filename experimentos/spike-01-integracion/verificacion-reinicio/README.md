# Verificación posterior: pérdida de altas aceptadas ante un reinicio de la API

> **No forma parte del veredicto del Spike 1.** El veredicto (**AJUSTADA**) se decidió con la regla pre-registrada en `00-preregistro.md` (commit `914a9ab`) y no cambia. Esta verificación responde una pregunta que `03-veredicto.md` §9 y la revisión del tutor dejaron abierta: *"¿Qué pasa si reinicio la API mientras hay mensajes pendientes?"*. Se ejecutó **después** del veredicto, así que es una verificación *post hoc* y se presenta como tal.

## 1. Pregunta

Con la escritura asíncrona (cola en memoria del commit `87728bf`), ¿se pierden favoritos que la API ya confirmó al usuario (`202 Accepted`) si el proceso se reinicia justo después de responder? ¿Y con la escritura síncrona (`201 Created`)?

## 2. Método

| Elemento | Valor |
|---|---|
| Código | Imagen `cooksmart-spike01:87728bf` construida con `git archive 87728bf:Docker/Postgre/backend` (la rama `leo` no se modificó) |
| Contenedor | `cooksmart-spike01`, puerto 3001, misma red y misma base PostgreSQL que el sistema (`postgre_default`, contenedor `cooksmart`) |
| Carga por corrida | 1000 `POST /favoritos` concurrentes = 50 usuarios `spike01_uNN` × 20 recetas (pares únicos, sin conflictos) |
| Momento del reinicio | En cuanto llegan las 1000 respuestas |
| Formas de reinicio | **restart:** `docker restart` (apagado ordenado: SIGTERM y espera). **kill:** `docker kill` + `docker start` (SIGKILL: muerte inmediata, simula un crash o un corte de energía) |
| Medida | `perdidas = aceptadas (201/202) − filas en favorito` después de que la API vuelve |
| Corridas | 3 por combinación (modo × forma) = 12 corridas |
| Script | `prueba-reinicio.js` (`node prueba-reinicio.js <sync\|async> cooksmart-spike01 http://localhost:3001 <restart\|kill>`) |
| Fecha | 2026-10-04, misma máquina que el Spike 1 (`../01-condiciones.md`) |

## 3. Resultados (`resultados/*.json`)

| Modo | Forma | Corrida 1 | Corrida 2 | Corrida 3 | Altas confirmadas y perdidas (total) |
|---|---|---:|---:|---:|---:|
| async | restart | 0 / 1000 | 0 / 1000 | 0 / 1000 | **0 de 3000** |
| sync | restart | 0 / 1000 | 0 / 1000 | 0 / 1000 | **0 de 3000** |
| async | **kill** | **66 / 1000 (6,6 %)** | 0 / 1000 | 0 / 1000 | **66 de 3000** |
| sync | kill | 0 / 1000 | 0 / 1000 | 0 / 1000 | **0 de 3000** |

En todas las corridas, las 1000 peticiones recibieron el código esperado (202 en async, 201 en sync); ningún error.

*Nota: los JSON de la forma `restart` se generaron antes de agregar el campo `forma` al script; la forma se identifica por el nombre del archivo.*

## 4. Lo que esto permite afirmar

| Afirmación | Tipo |
|---|---|
| Con escritura síncrona, ninguna alta confirmada (`201`) se perdió en 6 reinicios, ni siquiera con SIGKILL | **Medido** |
| Con la cola en memoria, un crash (SIGKILL) **puede** perder altas que el usuario ya vio confirmadas: ocurrió en 1 de 3 corridas (66 favoritos) | **Medido** |
| La pérdida es **intermitente**: depende de si la cola tiene pendientes en el instante del crash. Las corridas sin pérdida no prueban que el riesgo no exista | **Inferencia** a partir de la variación entre corridas |
| En el apagado ordenado no hubo pérdidas porque la cola alcanzó a vaciarse antes de que el proceso terminara (Node corre como PID 1 sin manejador de SIGTERM, y Docker espera antes de forzar el cierre) | **Inferencia**: no se instrumentó el tamaño de la cola en el momento de la señal |
| Bajo la carga del Spike 1 (50 VUs sostenidos, donde el 11 % de los `DELETE` llegaban antes que el alta) la cola tiene pendientes con más frecuencia, así que el riesgo sería mayor que en esta prueba | **Inferencia**, no medido |

## 5. Relación con la decisión

Refuerza el ADR-003 con una evidencia que antes era solo teórica: la variante asíncrona no solo produce lecturas inconsistentes (54,67 % de consistencia, Spike 1), sino que **puede perder escrituras ya confirmadas** si el proceso cae. Evitarlo exigiría una cola durable (broker o tabla *outbox* en PostgreSQL), que es exactamente la complejidad que el ADR-003 decidió no introducir.

## 6. Qué no se verificó

- El tamaño de la cola en el instante del reinicio (no se instrumentó).
- El comportamiento con un broker durable (RabbitMQ, Redis Streams) o una tabla *outbox*.
- Pérdidas bajo carga sostenida en lugar de una ráfaga única de 1000 peticiones.
