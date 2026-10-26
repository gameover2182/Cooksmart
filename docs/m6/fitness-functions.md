# Funciones de aptitud arquitectónica (fitness functions) — CookSmart (M6)

> Una fitness function es una verificación **automática y objetiva** de que el sistema sigue cumpliendo una decisión arquitectónica. Cada una declara: **regla**, **umbral** y **qué rompe en CI**. Requisito del módulo: definida en S12, implementada en CI a más tardar en S14. **Estado: implementadas** (ver tabla).

| ID | Decisión que protege | Regla | Umbral | Qué rompe la CI | Dónde | Estado |
|---|---|---|---|---|---|---|
| **FF-1** | ADR-002: límites entre capas | Cada archivo del backend solo importa capas permitidas: `routes → controllers, middlewares`; `controllers → services`; `services → services, repositories`; `repositories → config`; `middlewares → services, config`; `config → (nada)`; y solo `config/` importa el driver `pg` | **0 violaciones** | Job **"FF-1 Reglas de dependencia entre capas"** del workflow `fitness.yml` termina con exit 1 → el PR hacia `main` queda en rojo | `fitness/reglas-capas.js`, `.github/workflows/fitness.yml` | **Implementada** |
| **FF-1b** | Que FF-1 no "pase siempre" | La CI inyecta una violación (`require('pg')` en un controller) en una copia del código y exige que FF-1 la detecte | La copia **debe fallar** | Mismo job, paso "Autoprueba de la regla" | `.github/workflows/fitness.yml` | **Implementada** |
| **FF-3** | Táctica T1 (EXP-003): el bulkhead del login protege y **no** se convierte en punto único de fallo | (a) un cliente que se desconecta mientras espera en cola no deja su cupo ocupado; (b) sin carga, un login pasa; (c) con cupo y cola llenos, los excedentes reciben 503 | **3/3 pruebas** | Job **"FF-3 El bulkhead de login protege y no fuga cupos"** del workflow `fitness.yml` | `Docker/Postgre/backend/test/bulkheadLogin.test.js`, `.github/workflows/fitness.yml` | **Implementada** |
| **FF-2** | RNF04 / escenario PR01 | `GET /api/recetas` bajo 50 VUs durante 20 s contra la API real con PostgreSQL | `http_req_failed < 1 %` y `p95 < 500 ms` (umbrales de k6) | Job **"Prueba de carga con k6"** del workflow `load-test.yml`: k6 sale con código ≠ 0 si un umbral no se cumple | `k6-demo/diagnostico.js`, `.github/workflows/load-test.yml` | **Ya existía** (se reconoce como fitness function) |
| **FF-5** | ADR-005 / control C1 (M7): el `JWT_SECRET` y otros secretos de alto valor **no** vuelven al repo | Escanear los archivos **rastreados por git** buscando `JWT_SECRET` con valor literal, claves privadas PEM y tokens de nube; ignora referencias (`process.env…`), interpolaciones (`${…}`) y fixtures de CI | **0 hallazgos** | Job **"FF-5 Ningún secreto en archivos versionados"** del workflow `security.yml`, con autoprueba (secreto inyectado **debe** detectarse) | `fitness/sin-secretos.js`, `.github/workflows/security.yml` | **Implementada (M7)** |
| **FF-6** | ADR-005 / controles C2, C3, C6 y observabilidad (M7) | Pruebas de que (a) las cabeceras de seguridad están y no hay `X-Powered-By`; (b) la caché del catálogo respeta el tope; (c) el login se bloquea tras N fallos por cuenta y no por IP; (d) `/metrics` exige token y no existe sin él | **5/5 pruebas** | Job **"FF-6 Controles de seguridad y observabilidad"** del workflow `fitness.yml` | `Docker/Postgre/backend/test/seguridadObservabilidad.test.js`, `.github/workflows/fitness.yml` | **Implementada (M7)** |

## Por qué estas reglas

- **FF-1** protege la decisión de la que dependen las demás: si una capa se salta a otra (p. ej. un controller con SQL), el análisis por capas de EXP-002 y la táctica de EXP-003 dejan de ser válidos. Es determinista: no depende de la máquina del runner, así que no produce falsos rojos.
- **FF-2** es una fitness function **de rendimiento**. Su debilidad conocida: los runners de GitHub tienen CPU variable, así que el umbral (500 ms) se dejó holgado para no producir falsos rojos. **No** protege el login: el escenario que más se degrada (EXP-002) no está en CI porque su duración y variabilidad la harían inestable. Se deja como candidata (§ siguiente).

## Origen de FF-3

FF-3 no estaba planeada: nació de un **defecto real** encontrado al medir T1 en EXP-003 (desviación D1). La primera versión del bulkhead fugaba cupos cuando el cliente se iba mientras esperaba en cola, y tras dos fugas rechazaba **todos** los logins para siempre. La prueba se escribió para reproducir el defecto (falla con el código original, `72d43fb`) y pasa con la corrección (`a4bbe35`). Como fitness function protege una característica arquitectónica: que una táctica de resiliencia no se convierta en un punto único de fallo.

## Cómo comprobarlas en vivo (para la defensa)

FF-1 (reglas de capas):
```bash
node fitness/reglas-capas.js                 # → "OK: 0 violaciones."
echo "const pg = require('pg');" >> Docker/Postgre/backend/src/controllers/recetas.controller.js
node fitness/reglas-capas.js                 # → "FALLA: 1 violación(es)" y exit 1
git checkout Docker/Postgre/backend/src/controllers/recetas.controller.js
```

FF-5 (ningún secreto versionado — la del M7):
```bash
node fitness/sin-secretos.js                 # → "OK: 0 secretos en archivos versionados."
cp Docker/Postgre/docker-compose.yml /tmp/malo.yml
printf '\n      JWT_SECRET: %s\n' "$(openssl rand -hex 16)" >> /tmp/malo.yml  # inyecta un secreto real
node fitness/sin-secretos.js /tmp/malo.yml   # → "FALLA: 1 posible(s) secreto(s)" y exit 1
```
Qué protege y qué pasa en CI si se viola: FF-5 defiende el control C1 (el `JWT_SECRET` fuera del repo). Si alguien vuelve a commitearlo, el job de seguridad falla y el PR hacia `main` queda en rojo **antes** del merge, señalando archivo y línea.

## Nota de alcance de FF-5 (decisión documentada)

FF-5 marca el **JWT** (secreto de alto valor), claves privadas y tokens de nube, pero **no** marca la contraseña de la base de datos de prueba (`Cooksmart2024`) que aparece en los workflows de CI. Esa contraseña es un *fixture* de una base efímera que nunca tiene datos reales y es la misma del `compose` local; marcarla produciría ruido que entrenaría al equipo a ignorar la alerta. La decisión es consciente (riesgo residual R-S5 en `docs/m7/10-seguridad.md`), no un descuido del escáner.

## Candidata no implementada (declarada)

| ID | Regla propuesta | Por qué no está en CI todavía |
|---|---|---|
| FF-4 | Con ráfagas de login concurrentes, el P95 de las operaciones que no son login se mantiene bajo un umbral (protege la táctica de EXP-003) | Necesita una línea base estable del runner de CI; una corrida de 60 s con cientos de VUs en un runner compartido es ruidosa. Se evaluará en S13–S14 |
