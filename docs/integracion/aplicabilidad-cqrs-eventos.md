# Aplicabilidad de eventos, CQRS, Event Sourcing y consistencia eventual — CookSmart (M5)

> **Pregunta del módulo:** *"Un equipo propone usar eventos y CQRS para un CRUD simple. ¿Qué problema real resuelve? ¿Qué complejidad introduce?"*
>
> **Método:** cada patrón se trata como **opción**, no como recomendación. Para cada uno se pregunta: ¿qué problema verificable resolvería?, ¿tenemos ese problema (evidencia)?, ¿qué costo nuevo trae?, ¿qué evidencia falta? Si no hay evidencia, se escribe **NO JUSTIFICADO TODAVÍA POR LA EVIDENCIA DISPONIBLE**.
>
> **Entradas:** escenarios PR01/PR02 (`docs/02`), matriz (`docs/04`), Context Map (`docs/dominio/context-map.md`), catálogo filtrado de eventos (`docs/integracion/09-api-eventos-integracion.md` §5), resultado del Spike 1 (`experimentos/spike-01-integracion/03-veredicto.md`).

---

## 1. Perfil real de lectura/escritura de CookSmart

| Hecho | Evidencia |
|---|---|
| El catálogo (recetas, ingredientes, categorías) **no tiene endpoints de escritura**; solo cambia con `02_seed.sql` | `recetas.routes.js`, `catalogos.routes.js` (solo `GET`) |
| Las únicas escrituras en runtime son por usuario y de una fila: favorito, historial, ítem de nevera, perfil | `usuarios.routes.js`, `auth.routes.js` |
| Ninguna escritura dispara efectos en otro contexto | `grep "require('../services" services/` → vacío; ningún service llama a otro |
| El modelo de lectura y el de escritura **ya son el mismo** y caben en una consulta con 2–3 `JOIN` | `favoritos.repository.js`, `inventario.repository.js` |
| La lectura más costosa (`GET /recetas`) cumple el umbral aislada: P95 ≈ 233 ms con 50 VUs | PR01, `k6-demo/diagnostico.js` |
| La degradación de PR02 se concentró en el **login** (P95 ≈ 17,9 s), es decir, en CPU de bcrypt, no en lecturas/escrituras de dominio | `docs/01` R-02, `docs/02` PR02 |

## 2. Análisis por patrón

| Opción | Problema que resolvería | ¿Existe en CookSmart? (evidencia) | Complejidad introducida | Evidencia faltante para justificarlo | Decisión del equipo |
|---|---|---|---|---|---|
| **Eventos de dominio (in-process)** | Desacoplar contextos cuando un cambio en uno debe provocar reacciones en otros | **No.** 0 de 12 eventos candidatos tienen productor y consumidor reales en contextos distintos (§5 del doc. de integración) | Bajo en código (un `EventEmitter`), pero agrega flujo implícito difícil de seguir y errores silenciosos en suscriptores | Un requisito tipo H1 ("preparar receta descuenta nevera") | **NO JUSTIFICADO TODAVÍA POR LA EVIDENCIA DISPONIBLE.** Se adoptaría primero para H1 si ese requisito aparece. |
| **Mensajería asíncrona con broker (RabbitMQ/Kafka/Redis Streams)** | Absorber picos de escritura, tolerar caída temporal del consumidor, integrar procesos separados | **No.** Un solo proceso; escrituras de una fila. El Spike 1 midió la variante asíncrona **en su mejor caso** (cola en memoria, sin red) — ver §4 | Un contenedor más, durabilidad, reintentos, DLQ, idempotencia, monitoreo; contradice Escalabilidad/Observabilidad = Baja en la matriz | Evidencia de que la escritura sincrónica es el cuello de botella bajo una carga realista | **Rechazado para el alcance actual.** |
| **CQRS (modelos separados de lectura y escritura)** | Lecturas con forma muy distinta a la escritura, o con carga muchísimo mayor, que el modelo normalizado no sirve bien | **Parcial y débil.** El catálogo es de solo lectura y su lista es costosa (subconsultas `array_agg` por receta), pero cumple el umbral (PR01). El único desajuste real de forma (BC4 necesita `ingredientes` en la lista) se resuelve **agregando un campo** al contrato (`09-…` §4.4), no con un segundo modelo | Dos modelos, proceso de sincronización, consistencia eventual entre ellos, el doble de código por consulta | Una medición donde `GET /recetas` incumpla RNF04 con un catálogo de tamaño realista (hoy hay 20 recetas en la base de pruebas) | **NO JUSTIFICADO TODAVÍA POR LA EVIDENCIA DISPONIBLE.** Alternativa más barata si llega a hacer falta: **vista materializada en PostgreSQL** o caché HTTP del catálogo (no requiere separar comandos). |
| **Event Sourcing** | Necesidad de auditar o reconstruir el historial completo de cambios del estado | **No.** Ningún requisito de auditoría, de "deshacer" ni de reconstrucción. El "historial" de CookSmart es un dato de negocio (qué cociné), no un registro de eventos de estado, y ya se guarda como tabla | Almacén de eventos, proyecciones, versionamiento de eventos, *snapshots*, migraciones de eventos; costo alto para un equipo de 3 | Un requisito explícito de auditoría o trazabilidad temporal del inventario | **Rechazado.** Ningún indicio de que se necesite. |
| **Consistencia eventual** | Permitir que dos modelos/contextos se pongan de acuerdo "más tarde" a cambio de disponibilidad o latencia | **Ya existe accidentalmente** en la sincronización de favoritos del navegador (`auth-sync.js`, relación E5) — sin reintentos ni orden | Ventanas de inconsistencia visibles para el usuario, carreras alta/baja, pérdida silenciosa de escrituras | — | **No se introduce en el backend** (Spike 1). Se registra como **deuda** la consistencia eventual accidental del cliente. |

## 3. Respuesta directa a la pregunta del módulo para CookSmart

**¿Qué problema real resolverían eventos + CQRS aquí?** Ninguno que esté evidenciado hoy. Los dos problemas medidos de CookSmart son: (1) latencia del login bajo concurrencia (CPU de bcrypt en el mismo proceso, R-02) y (2) un contrato de catálogo incompleto para la recomendación. Ninguno de los dos es un problema de acoplamiento temporal entre contextos ni de forma de lectura.

**¿Qué complejidad introducirían?** Para un sistema con 1 proceso, 1 base, 5 contextos lógicos y 3 desarrolladores: infraestructura nueva (broker), dos modelos por consulta, consistencia eventual visible por el usuario (medida en el Spike 1), cambio incompatible de contrato (`201` → `202`), y depuración de flujos implícitos sin la plataforma de observabilidad que la matriz decidió no tener.

## 4. Lo que aportó el Spike 1 a este análisis

Ver `experimentos/spike-01-integracion/03-veredicto.md`. La variante asíncrona en su forma **más favorable** (cola en memoria, sin broker ni red) se comparó con la síncrona bajo el mismo escenario (50 VUs × 30 s, 3 corridas por modo):

| Medianas | Síncrono | Asíncrono |
|---|---:|---:|
| P95 `POST /favoritos` | 209,22 ms | 122,29 ms (−41,5 %) |
| Lectura inmediata consistente | 100 % | 54,67 % |
| P95 `GET` / `DELETE` | 145,77 / 156,51 ms | 159,58 / 192,33 ms |
| Iteraciones completadas | 2242 | 2121 |

**Veredicto pre-registrado: AJUSTADA.** Lo que esto aporta al análisis de §2:

- **Consistencia eventual tiene un costo medido, no teórico:** en el CRUD más simple del sistema, casi la mitad de las lecturas inmediatas no ven la escritura. Eso es lo que un usuario vería al abrir "Mis favoritos" justo después de marcar uno.
- **La asincronía no quitó trabajo, lo movió:** el `POST` mejora, pero `GET` y `DELETE` empeoran y el sistema completa menos iteraciones. Para un monolito con un solo pool de conexiones, encolar no agrega capacidad.
- **La postura previa del equipo era parcialmente incorrecta:** esperábamos que el `INSERT` no pesara; pesa ≈ 87 ms de P95 bajo carga. La decisión no cambia por la consistencia, no por la latencia. (Regla del spike honesto: se registra tal cual.)

Esta tabla **no** se modificó para adaptarse al resultado: las decisiones de §2 se escribieron con el mismo criterio antes y después del spike.

## 5. Condiciones que reabrirían esta decisión

| Si ocurre… | Reevaluar |
|---|---|
| Se implementa "preparar receta descuenta nevera" (H1) | Eventos de dominio in-process (`RecetaPreparada`) |
| RF06 debe notificar con la app cerrada (H2) | Proceso programado en backend; eventos solo si hay más de un consumidor |
| `GET /recetas` incumple RNF04 con un catálogo realista | Vista materializada → si no basta, modelo de lectura separado (CQRS ligero) |
| Aparece un requisito de auditoría del inventario | Event Sourcing **solo** para BC3 |
