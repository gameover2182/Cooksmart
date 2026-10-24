# Matriz de fallos y matriz de resiliencia — CookSmart (M6)

> **Entradas:** EXP-002 (crecimiento 10×), EXP-003 (tácticas), verificación de reinicio del Spike 1 (`experimentos/spike-01-integracion/verificacion-reinicio/`), riesgos R-01…R-10 de `docs/01-contexto-y-drivers.md`, ADR-001/002/003.
> **Convención:** **Medido** = hay un experimento del repo que lo muestra. **Inferido** = razonamiento sobre el código o la configuración, sin experimento.

## 1. Matriz de fallos

Responde la pregunta del módulo componente por componente: *¿qué falla, cuándo, cómo se nota y qué tan grave es?* Ordenada por el nivel de carga en que aparece.

| # | Componente (pregunta del módulo) | Modo de fallo | Disparador | Cuándo aparece | Efecto observable para el usuario | Detección hoy | Evidencia | Severidad |
|---|---|---|---|---|---|---|---|---|
| F1 | **Autenticación** (login) | CPU del único hilo de Node saturada por bcrypt costo 12 (≈ 0,5 s/login → ≈ 2 logins/s como máximo) | Logins concurrentes | **Desde 1× (50 VUs)**: P95 22 s; desde 2× toca el *timeout* | No puede iniciar sesión; a 10× falla el **73 %** de los logins (≈ la mitad por *timeout* de 60 s y ≈ la mitad por conexiones rechazadas en la ráfaga inicial; ver EXP-002 §5b) | Ninguna en producción (solo k6) | **Medido** EXP-002 | **Crítica** |
| F2 | **API** (resto de operaciones) | Contagio: esperan turno en el mismo hilo ocupado por bcrypt | F1 | Desde 1×: P95 2,2–3,1 s; 2×–10×: ≈ 5 s (detalle ≈ 9,9 s) | Navegación lenta aunque no falle (0 % errores) | Ninguna | **Medido** EXP-002 | Alta |
| F3 | **API** (capacidad) | Saturación: el throughput deja de crecer (28 → 32 solicitudes/s de 5× a 10×) | F1 + F2 | 5×–10× | Solo el **19 %** de los recorridos se completa a 10× | Ninguna | **Medido** EXP-002 | Crítica |
| F4 | **Monitoreo** | No hay métricas, alertas ni *dashboards*: F1–F3 solo se vieron porque el experimento agregó `docker stats` | Cualquier incidente | Siempre | El equipo se entera por los usuarios | — | **Medido** (hubo que construir el muestreo para EXP-002) | Alta |
| F5 | **Despliegue** | Un solo contenedor de API sin réplicas: reiniciarlo deja el servicio caído | Despliegue, crash, OOM | Cada despliegue | Interrupción total durante el reinicio (≈ 0,5 s con `docker kill` + `start`; ≈ 3,4 s con `docker restart`) | `healthcheck` de Docker | **Medido** (tiempos de la verificación de reinicio del Spike 1) | Media |
| F6 | **Base de datos** | Caída de la única instancia de PostgreSQL | Fallo del contenedor o del volumen | No observado bajo carga (CPU ≈ 2 %) | Todas las operaciones con datos fallan; `/health` responde 503 | `/health` y `healthcheck` | **Inferido** (R-06); bajo carga, **medido** que **no** es el cuello | Alta (probabilidad baja) |
| F7 | **Consultas** | Consultas lentas o N+1 (`GET /recetas` usa subconsultas `array_agg` por receta) | Catálogo grande | No observado con 20 recetas | Listado lento | Ninguna | **Inferido**; con 20 recetas no se nota (PostgreSQL ocioso) | Baja hoy |
| F8 | **Pool de conexiones** | Agotamiento del pool (10 conexiones por defecto de `pg`) | Consultas lentas + mucha concurrencia | No observado: ≤ 1 conexión activa en todos los niveles | Peticiones esperando conexión | Ninguna | **Medido** que no ocurre: el hilo de la API se satura antes de que lleguen consultas suficientes | Baja |
| F9 | **Red** | Latencia o pérdida entre cliente y API | Red real | No evaluado (k6 en `localhost`) | Respuestas más lentas | Ninguna | **No verificado** | Desconocida |
| F10 | **Escrituras confirmadas** | Pérdida de altas aceptadas si la API cae con trabajo pendiente | Crash con cola en memoria | Solo con la variante asíncrona (descartada en ADR-003) | Favoritos "guardados" que desaparecen | Ninguna | **Medido**: 66/1000 con SIGKILL en async; 0 en síncrono | Evitada por ADR-003 |
| F11 | **Equipo** | 3 personas sin guardias; una arquitectura distribuida multiplicaría lo que hay que operar | Crecimiento de la plataforma | Al distribuir | Incidentes sin atender, despliegues lentos | — | **Inferido** (`docs/m6/costo-distribucion.md`) | Media hoy, alta con D3 |
| F12 | **Despliegue / healthcheck** | Falso positivo: bajo carga el `healthcheck` de Docker (`wget /health`, *timeout* 3 s) espera turno en el hilo saturado y marca la API `unhealthy` aunque sigue atendiendo | Carga alta | Observado durante EXP-003 a 500 VUs (4 fallos seguidos, *"Health check exceeded timeout (3s)"*) | Hoy ninguno (Compose no reinicia por `unhealthy`). En un orquestador que reinicie por *liveness* (Kubernetes), **reiniciaría la API en plena carga** y agravaría F1–F3 | `docker inspect` | **Medido** (registro de salud del contenedor) | Media hoy, alta si se adopta un orquestador |

**Respuesta en una línea:** al crecer 10×, **primero falla la autenticación** (F1), por CPU en el único hilo de la API; arrastra al resto (F2–F3); y **no nos habríamos enterado** sin el muestreo agregado para el experimento (F4). La base de datos, el pool y las consultas **no** son el cuello hoy (F6–F8, medido).

## 2. Matriz de resiliencia

Tácticas del módulo (timeouts, retries, circuit breakers, caché, degradación) más las del catálogo general (bulkhead, *rate limiting*, réplicas), cruzadas con los fallos.

| Táctica | Fallo que mitiga | ¿Aplica a CookSmart hoy? | Estado | Evidencia / motivo |
|---|---|---|---|---|
| **Bulkhead + degradación del login (T1)** | F1, F2, F3 | **Sí**: aísla el recurso que se satura (CPU del login) para que no arrastre al resto | **VALIDADA** (EXP-003): P95 del resto 6,8 s → 0,55 s a 10×; rechazos en 1,4 s en vez de 60 s. Requirió corregir un defecto que la volvía punto único de fallo (D1, protegido por FF-3) | `experimentos/EXP-003-tacticas-resiliencia/03-resultados-y-veredicto.md` |
| **Caché del catálogo (T2)** | F2, F7 | Parcial: el catálogo no cambia en runtime, pero la base de datos no es el cuello | **VALIDADA** (EXP-003): P95 del resto 6,8 s → 4,3 s (−37 %), porque libera CPU del hilo compartido, no por la base de datos | `experimentos/EXP-003-tacticas-resiliencia/03-resultados-y-veredicto.md` |
| **Timeout** | F1 (esperas de 60 s), F6 | Sí. Hoy el único *timeout* efectivo es el del cliente (60 s de k6); la API no corta nada. T1 incluye un timeout de cola (1 s) | Parcial (dentro de T1) | Diseño de T1 |
| **Retry con backoff** | F5, F9 | Solo en el cliente y solo para lecturas e idempotentes (el alta de favorito ya es idempotente: `ON CONFLICT DO NOTHING`). **Nunca** reintentar el login bajo F1: reintentar multiplica la carga sobre el recurso saturado | No implementado | `Retry-After: 1` de T1 le indica al cliente cuándo reintentar |
| **Circuit breaker** | F6 (PostgreSQL caído) | Bajo valor hoy: hay una sola dependencia y `/health` ya la reporta; un breaker hacia la base solo cambiaría "error lento" por "error rápido" | No implementado (decisión) | F6 no ocurrió bajo carga |
| **Rate limiting por IP/cuenta en login** | F1, R-10 (abuso) | Sí, complementa a T1 (T1 protege la capacidad; *rate limiting* protege de un solo cliente abusivo) | No implementado | Pendiente |
| **Réplicas de la API / usar todos los núcleos (D1)** | F1, F3, F5 | **Sí**: el cuello es un núcleo de 12; N réplicas multiplican la capacidad de login por N y permiten despliegues sin caída | No implementado (decisión en ADR-004) | EXP-002 (100 % de un núcleo) |
| **Hashing fuera del hilo principal** (bcrypt nativo / *worker threads*) | F1, F2 | Sí: quita el bloqueo del hilo de E/S, aunque no aumenta la CPU total | No implementado | Alternativa en ADR-004 |
| **Monitoreo mínimo** (métricas de latencia por ruta, CPU, alertas) | F4 | Sí, barato: lo que se construyó para el experimento | Parcial (solo en el experimento) | `scripts/ejecutar.sh` de EXP-002 |
| **Cola durable / outbox** | F10 | No: ADR-003 mantuvo escrituras síncronas | Descartado | ADR-003 |
