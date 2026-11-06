# 16 · Matriz de trade-offs — CookSmart (M8)

> Cada decisión arquitectónica mayor se evalúa en cuatro ejes: **calidad** (qué atributo mejora), **costo** (dinero + horas de operación), **complejidad** (lo que hay que entender y mantener) y **evolución** (cuánto cierra o abre el futuro). La columna final dice qué se **sacrificó** conscientemente: una decisión sin sacrificio declarado es una decisión no entendida.

## 1. Matriz principal

| Decisión (ADR) | Calidad que gana | Costo | Complejidad | Evolución | Qué se sacrifica (trade-off) |
|---|---|---|---|---|---|
| **Monolito modular por capas** (ADR-001) | Mantenibilidad, simplicidad operativa | 10¹ USD/mes · 1 despliegue | Baja: 1 proceso, 1 repo | Permite extraer un servicio **si** un día se mide necesidad | Escalado independiente por componente (no lo necesitamos: E1 mostró que el cuello es CPU de un hilo, no un módulo) |
| **Límites de capas estrictos** (ADR-002) | Modificabilidad, testabilidad | ~0 (regla en CI) | Baja, pero disciplina constante | Mantiene el monolito "extraíble" | Atajos rápidos (un controller tocando la BD); FF-1 los bloquea |
| **Integración síncrona** (ADR-003) | Consistencia fuerte, simplicidad | ~0 | Baja: sin broker ni outbox | Cierra async por ahora; reabrible | Desacople temporal y picos de escritura; medido innecesario (E6) |
| **Escalar el monolito en núcleos** (ADR-004, D1) | Rendimiento/capacidad de login (4,4×) | 10¹ USD/mes (mismo host) | Baja: 1 variable de entorno | Techo = núcleos del host; luego D2 (varios hosts) | Capacidad "infinita" horizontal; no se necesita a esta escala |
| **Bulkhead + caché** (ADR-004, T1/T2) | Disponibilidad bajo carga | ~0 | Media: estado por proceso | Reabre la pregunta al activar N workers | Simplicidad del request de login; estado compartido pendiente |
| **Secreto fuera del repo + rotación** (ADR-005, C1) | Seguridad (crítica) | ~0 | Baja | Base para gestión de secretos futura | Comodidad de un secreto fijo en el repo |
| **Límite de login, no-root, Adminer local, cabeceras** (ADR-005, C2–C6) | Seguridad | ~0 | Baja | Reversible por variable | Nada relevante; controles baratos |
| **Observabilidad sin dependencias** (ADR-005) | Operabilidad (detecta F1) | ~0 | Baja | Portable a Prometheus/Loki luego | Dashboards "ricos" ya hechos; hoy innecesarios |
| **Despliegue en host propio + proxy** (ADR-005, D-A) | Control de TLS/puertos/healthcheck | 10¹ USD/mes | Media (operar el host) | Migrable a gestionado si crece | Autoescalado del PaaS; su healthcheck agravaría F12 |

## 2. El eje que el curso exige que no se olvide: costo

| Alternativa de crecimiento | Infra (USD/mes) | Operación (h/sem) | ¿Ataca el cuello medido (E1)? |
|---|---|---|---|
| D0 · Monolito, 1 proceso | 10¹ | 10⁰ | No: es lo que colapsa |
| **D1 · Monolito, N procesos (elegida)** | **10¹** | **10⁰** | **Sí: 4,4× medido (E4)** |
| D2 · Varios hosts + balanceador | 10² | 10⁰–10¹ | Sí, pero sobran núcleos en 1 host |
| D3 · Microservicios | 10³ | 10¹–10² | Indirecto: mismo efecto que D1 |

Para un equipo de 3, **el costo que más pesa no es el dinero: son las horas de operación** (F11 de la matriz de fallos). Esto es lo que hace que D3 sea sobreingeniería *para esta escala*, no en abstracto.

## 3. Respuesta directa a las tres acusaciones del comité

| Acusación | Respuesta con evidencia | Dónde |
|---|---|---|
| **«Sobreingenierizada»** | Al revés: elegimos el monolito y rechazamos microservicios **con datos** (E1, E4, E5). La complejidad que añadimos (bulkhead, caché, observabilidad) es barata y está medida que sirve. | ADR-001, ADR-004, `evaluacion-microservicios-ia-m6.md` |
| **«Insegura»** | Encontramos y **cerramos** la amenaza crítica real (secreto en el repo, E7), con medición antes/después y una fitness function que impide reincidir. | ADR-005, EXP-005, FF-5 |
| **«Incapaz de crecer»** | Medimos el crecimiento 10× (E1), identificamos el cuello (CPU de un hilo), y probamos dos caminos de crecimiento (E2, E4). Hay techo conocido y un plan para superarlo (D2). | EXP-002/003/004, `plan-evolucion.md` |

## 4. Deuda arquitectónica reconocida

Lo que **sabemos** que debemos, declarado para que sea decisión y no sorpresa:

| Deuda | Origen | Interés que paga (riesgo si no se salda) |
|---|---|---|
| Estado por proceso en bulkhead/caché/rate-limit | ADR-004/005 | Con N workers, los límites se multiplican por N (R-S3) |
| `GET /recetas` usa subconsultas por receta (N+1 latente) | repos | Hoy invisible (20 recetas); crece con el catálogo (F7) |
| Sin recolector de logs (solo `docker logs`) | ADR-005 | Pérdida de trazas al reiniciar (O-6) |
| Inventario del front no persistía en backend | front M-anteriores | Se salda en M8 (ver `plan-evolucion.md`) |
| Contrato `GET /recetas` no incluye `ingredientes` en el OpenAPI | M5 | Desalineación contrato/implementación (cambio compatible v1.1) |
