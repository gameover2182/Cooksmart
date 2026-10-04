# ADR-003 - Integración entre contextos: síncrona, sin bus de eventos

- **Estado:** Aceptado
- **Fecha:** 2026-10-04
- **Decisión:** Las interacciones entre contextos de CookSmart se integran de forma **síncrona** (REST hacia el cliente y llamadas en proceso dentro de la API). No se introduce escritura asíncrona en la API ni un bus/broker de eventos.
- **Sistema:** CookSmart
- **Relacionado con:** ADR-001 (monolito modular por capas), ADR-002 (límites y dependencias por capas)
- **Evidencia:** [Spike 1](../../experimentos/spike-01-integracion/03-veredicto.md) · [Context Map](../dominio/context-map.md) · [Contrato API](../integracion/09-api-eventos-integracion.md) · [OpenAPI v1](../integracion/openapi-v1.yaml) · [Aplicabilidad CQRS/eventos](../integracion/aplicabilidad-cqrs-eventos.md)

---

## 1. Contexto

**Hechos del repositorio:**

- CookSmart tiene cinco contextos lógicos dentro de un solo proceso y una sola base (`docs/dominio/mapa-dominio.md` §6): Identidad y Cuenta, Catálogo de Recetas, Nevera, Recomendación y Actividad del Usuario.
- Ningún *service* invoca a otro; los contextos se acoplan por JWT (E1), REST hacia el cliente (E2, E3, E5) y por base de datos compartida (E6, E7) (`docs/dominio/context-map.md` §3).
- De 12 eventos candidatos propuestos por IA, **ninguno** tiene hoy productor y consumidor reales en contextos distintos (`docs/ia/auditoria-eventos-m5.md`).
- La única escritura entre contextos que el frontend usa es el alta/baja de favoritos (I1), y el cliente ya la hace asíncrona por su cuenta (`auth-sync.js`, E5).
- Drivers: Seguridad y Disponibilidad Alta; Rendimiento Media; Escalabilidad y Observabilidad **Baja** por decisión de alcance (`docs/04-Matriz-De-Calidad.md`). Equipo de 3 personas.

**Pregunta que había que responder con evidencia propia:** si la integración asíncrona de una escritura (I1) mejoraba la latencia lo suficiente como para justificar la consistencia eventual.

**Resultado del Spike 1** (pre-registrado en `914a9ab`, medido en `87728bf`, resultados en `3f3455f`; 50 VUs × 30 s, 3 corridas por modo, misma máquina e imagen):

| Métrica (medianas) | Síncrono | Asíncrono (cola en memoria) |
|---|---:|---:|
| P95 `POST /favoritos` | 209,22 ms | 122,29 ms (**−41,5 %**) |
| Lectura inmediata consistente | 100 % | **54,67 %** |
| `DELETE` antes de que se aplique el alta | 0 % | 11,36 % |
| P95 `GET` / `DELETE` | 145,77 / 156,51 ms | 159,58 / 192,33 ms |
| Iteraciones completadas | 2242 | 2121 (−5,4 %) |

**Veredicto pre-registrado:** **AJUSTADA** — mejora de latencia ≥ 30 % pero consistencia < 99 % → mantener la API síncrona; la percepción de rapidez queda en el cliente.

## 2. Alternativas consideradas

| Alternativa | Descripción | Costo | Evidencia |
|---|---|---|---|
| **A. Síncrona (elegida)** | REST `201` tras escribir en PostgreSQL; llamadas en proceso entre módulos | Latencia del `INSERT` dentro del `POST` (≈ 87 ms de P95 bajo 50 VUs según el spike) | Spike 1: 100 % de lecturas consistentes, más iteraciones completadas |
| **B. Asíncrona en proceso** | Encolar en memoria, responder `202`, escribir desde un consumidor | 45 % de lecturas inconsistentes; carreras alta/baja; `GET`/`DELETE` más lentos; pérdida de pendientes si la API reinicia; **cambio incompatible de contrato** (`201` → `202`, `docs/integracion/09-…` §4.3) | Medida directamente en el Spike 1 |
| **C. Eventos con broker** (RabbitMQ/Kafka/Redis Streams) | Publicar eventos de dominio y consumirlos en otros contextos/procesos | Todo lo de B + un contenedor más que operar, durabilidad, reintentos, DLQ, monitoreo; contradice Escalabilidad/Observabilidad = Baja | No medida: B es su **mejor caso** (sin red ni serialización); si B no cumple la consistencia, C tampoco la mejora. Sin consumidores reales (0/12 eventos) |

## 3. Decisión

1. **I1 (favoritos)** y cualquier otra escritura de la API: **síncronas**; el contrato v1 mantiene `201 Created`.
2. **I2 (catálogo → recomendación)**: REST síncrono. Su problema real es de **contenido** del contrato (falta `ingredientes` en `GET /recetas`), que se corrige con un cambio compatible (v1.1), no con eventos.
3. **I3 (identidad)**: se mantiene el token autocontenido (sin llamada en runtime a Identidad).
4. **No** se introduce bus de eventos, broker, CQRS ni Event Sourcing (`docs/integracion/aplicabilidad-cqrs-eventos.md`).
5. El código del spike se **revierte**; queda reproducible en el commit `3f3455f`.

## 4. Consecuencias

**Positivas**
- Lectura tras escritura garantizada para el usuario (100 % en el spike).
- Sin infraestructura nueva; coherente con ADR-001 y con la prioridad Baja de Escalabilidad/Observabilidad.
- Errores visibles en la respuesta HTTP (no se pierden en un consumidor en segundo plano).
- Contrato v1 estable: el frontend no necesita cambios.

**Negativas**
- El `POST` de favoritos conserva ≈ 87 ms más de P95 bajo 50 VUs que la variante asíncrona.
- Acoplamiento temporal: si PostgreSQL no responde, el alta falla en ese momento (aceptado: el usuario puede reintentar).
- La consistencia eventual **accidental** del cliente (`auth-sync.js`, sin reintentos ni orden) **sigue existiendo**; esta decisión no la resuelve y queda como deuda.

## 5. Reversibilidad

**Alta.** La variante asíncrona ya existe en la historia (`87728bf`) detrás de un flag y puede reaplicarse con `git revert` del commit de reversión. El costo real de revertir esta decisión no es el código sino el **contrato**: pasar a `202` exige `/api/v2` y adaptar `auth-sync.js` (ver política de versiones, `docs/integracion/09-…` §4.3).

## 6. Supuestos y condiciones de revisión

| Supuesto | Revisar esta decisión si… |
|---|---|
| Ninguna escritura necesita reacciones en otro contexto | Se implementa "preparar receta descuenta la nevera" (H1 del Context Map) → evaluar **un** evento de dominio in-process (`RecetaPreparada`) |
| RF06 solo se calcula al abrir la nevera | RF06 debe notificar con la app cerrada (H2) → proceso programado en backend |
| La carga es la de un sistema académico (≤ 50 VUs medidos) | Una medición muestra que una escritura síncrona incumple RNF04 bajo carga realista |
| La percepción de rapidez la da el cliente (`localStorage` primero) | El frontend deja de escribir de forma optimista |
| Resultados en una sola máquina, n = 3 por modo | Una réplica del spike en otra máquina o en CI contradice el veredicto |

## 7. Trazabilidad

| Elemento | Ubicación |
|---|---|
| Interacciones analizadas (I1–I4) | `docs/integracion/09-api-eventos-integracion.md` §1–3 |
| Pre-registro (antes de medir) | `experimentos/spike-01-integracion/00-preregistro.md` — commit `914a9ab` |
| Código medido | commit `87728bf` |
| Datos crudos | `experimentos/spike-01-integracion/02-resultados/` — commit `3f3455f` |
| Veredicto | `experimentos/spike-01-integracion/03-veredicto.md` |
| Filtro de eventos de IA | `docs/ia/auditoria-eventos-m5.md` |
