# Funciones de aptitud arquitectónica (fitness functions) — CookSmart (M6)

> Una fitness function es una verificación **automática y objetiva** de que el sistema sigue cumpliendo una decisión arquitectónica. Cada una declara: **regla**, **umbral** y **qué rompe en CI**. Requisito del módulo: definida en S12, implementada en CI a más tardar en S14. **Estado: implementadas** (ver tabla).

| ID | Decisión que protege | Regla | Umbral | Qué rompe la CI | Dónde | Estado |
|---|---|---|---|---|---|---|
| **FF-1** | ADR-002: límites entre capas | Cada archivo del backend solo importa capas permitidas: `routes → controllers, middlewares`; `controllers → services`; `services → services, repositories`; `repositories → config`; `middlewares → services, config`; `config → (nada)`; y solo `config/` importa el driver `pg` | **0 violaciones** | Job **"FF-1 Reglas de dependencia entre capas"** del workflow `fitness.yml` termina con exit 1 → el PR hacia `main` queda en rojo | `fitness/reglas-capas.js`, `.github/workflows/fitness.yml` | **Implementada** |
| **FF-1b** | Que FF-1 no "pase siempre" | La CI inyecta una violación (`require('pg')` en un controller) en una copia del código y exige que FF-1 la detecte | La copia **debe fallar** | Mismo job, paso "Autoprueba de la regla" | `.github/workflows/fitness.yml` | **Implementada** |
| **FF-2** | RNF04 / escenario PR01 | `GET /api/recetas` bajo 50 VUs durante 20 s contra la API real con PostgreSQL | `http_req_failed < 1 %` y `p95 < 500 ms` (umbrales de k6) | Job **"Prueba de carga con k6"** del workflow `load-test.yml`: k6 sale con código ≠ 0 si un umbral no se cumple | `k6-demo/diagnostico.js`, `.github/workflows/load-test.yml` | **Ya existía** (se reconoce como fitness function) |

## Por qué estas reglas

- **FF-1** protege la decisión de la que dependen las demás: si una capa se salta a otra (p. ej. un controller con SQL), el análisis por capas de EXP-002 y la táctica de EXP-003 dejan de ser válidos. Es determinista: no depende de la máquina del runner, así que no produce falsos rojos.
- **FF-2** es una fitness function **de rendimiento**. Su debilidad conocida: los runners de GitHub tienen CPU variable, así que el umbral (500 ms) se dejó holgado para no producir falsos rojos. **No** protege el login: el escenario que más se degrada (EXP-002) no está en CI porque su duración y variabilidad la harían inestable. Se deja como candidata (§ siguiente).

## Cómo comprobarla en vivo (para la defensa)

```bash
node fitness/reglas-capas.js                 # → "OK: 0 violaciones."
echo "const pg = require('pg');" >> Docker/Postgre/backend/src/controllers/recetas.controller.js
node fitness/reglas-capas.js                 # → "FALLA: 1 violación(es)" y exit 1
git checkout Docker/Postgre/backend/src/controllers/recetas.controller.js
```

## Candidata no implementada (declarada)

| ID | Regla propuesta | Por qué no está en CI todavía |
|---|---|---|
| FF-3 | Con ráfagas de login concurrentes, el P95 de las operaciones que no son login se mantiene bajo un umbral (protege la táctica de EXP-003) | Necesita una línea base estable del runner de CI; una corrida de 60 s con cientos de VUs en un runner compartido es ruidosa. Se evaluará en S13–S14 |
