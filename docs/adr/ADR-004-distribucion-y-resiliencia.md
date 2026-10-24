# ADR-004 - Distribución y resiliencia ante crecimiento 10×

- **Estado:** Propuesto — pendiente del veredicto del mini-comité 2 (§9)
- **Fecha:** 2026-10-23
- **Decisión:** No distribuir en microservicios. Escalar el **monolito modular** usando **varios procesos en el mismo host** (D1), proteger el login con un **bulkhead con degradación** (T1) y cachear el **catálogo** en memoria (T2).
- **Sistema:** CookSmart
- **Relacionado con:** ADR-001 (monolito modular), ADR-002 (capas, protegido por FF-1), ADR-003 (integración síncrona)
- **Evidencia:** [EXP-002](../../experimentos/EXP-002-crecimiento-10x/03-resultados-y-veredicto.md) · [EXP-003](../../experimentos/EXP-003-tacticas-resiliencia/03-resultados-y-veredicto.md) · [EXP-004](../../experimentos/EXP-004-distribucion-nucleos/03-resultados-y-veredicto.md) · [Costo](../m6/costo-distribucion.md) · [Matrices](../m6/matriz-fallos-resiliencia.md) · [Fitness functions](../m6/fitness-functions.md) · [Evaluación de la propuesta de IA](../ia/evaluacion-microservicios-ia-m6.md)

---

## 1. Contexto (hechos medidos)

| Hecho | Dato | Fuente |
|---|---|---|
| Al crecer de 50 a 500 VUs, lo que falla primero es la **autenticación** | P95 login 22 s a 1×, techo de 60 s desde 2×; 73 % de logins fallidos a 10× | EXP-002 |
| El cuello es **CPU de un solo núcleo** de la API, no la base de datos | API 100 % de 1 núcleo desde 1×; PostgreSQL ≈ 2 % en todos los niveles | EXP-002 |
| El login **arrastra al resto** (mismo hilo) | Resto: 0 % errores, P95 ×2–×3; solo 19 % de recorridos completos a 10× | EXP-002 |
| Un **bulkhead** en el login protege al resto | P95 del resto 6,8 s → 0,55 s a 10×; rechazos en 1,4 s en vez de 60 s | EXP-003 T1 |
| La **caché del catálogo** libera CPU del hilo compartido | P95 del resto 6,8 s → 4,3 s (−37 %) | EXP-003 T2 |
| **4 procesos** en el mismo host multiplican la capacidad de login | 4,4× logins/s; 0 *timeouts*; PostgreSQL 8 % | EXP-004 |
| Una táctica mal implementada puede ser **punto único de fallo** | El primer bulkhead bloqueó todos los logins | EXP-003, desviación D1 |

## 2. Problema

Decidir **si conviene distribuir el sistema** para soportar 10× usuarios, con el costo como dimensión explícita, y qué tácticas de resiliencia aplicar.

## 3. Alternativas consideradas

| Alternativa | Qué es | Costo infra (USD/mes) | Operación (h/semana) | ¿Ataca el cuello medido? | Evidencia |
|---|---|---|---|---|---|
| **D0** Monolito actual (1 proceso) | Sin cambios | 10¹ | 10⁰ | **No**: es el estado que colapsa | EXP-002 |
| **D1** Monolito con N procesos en el mismo host ✅ | `API_WORKERS=N` (módulo `cluster`) | 10¹ (0 adicional si el host ya tiene núcleos libres) | 10⁰ | **Sí**: capacidad de login ≈ proporcional a N | EXP-004: 4,4× con N = 4 |
| **D2** Monolito replicado en varios hosts | Balanceador + PostgreSQL gestionado | 10² | 10⁰–10¹ | Sí, pero el host actual aún tiene núcleos libres | Inferido |
| **D3** Microservicios (propuesta de la IA) | 5 servicios + gateway + broker + 5 bases + Kubernetes | 10³ | 10¹–10² | Solo indirectamente (Identidad con núcleos propios = lo mismo que D1) | `docs/ia/evaluacion-microservicios-ia-m6.md` |
| Bajar el costo de bcrypt (12 → 10) | ≈ 4× menos CPU por login | 0 | 10⁰ | Sí | **No evaluado**: afecta a Seguridad (RNF02, prioridad 1) |

## 4. Decisión

1. **No se distribuye en microservicios (D3) ni en varios hosts (D2).** El cuello es CPU en un núcleo, y se resuelve con núcleos del mismo host a un costo 10²× menor que D3.
2. **Se adopta D1**: la API se despliega con varios procesos en el mismo host.
3. **Se adopta T1** (bulkhead + degradación del login): cuando la demanda supera la capacidad de login, se rechaza rápido con `503 Retry-After` en vez de congelar todo el sistema.
4. **Se adopta T2** (caché en memoria del catálogo, TTL 60 s): el catálogo no cambia en runtime.
5. **Se mantiene el costo de bcrypt en 12** hasta tener una decisión explícita de seguridad.
6. **Se mantienen las fitness functions** FF-1 (capas), FF-2 (rendimiento de recetas) y FF-3 (el bulkhead no fuga cupos) en la CI.

### Plan de activación (no se activa nada por defecto todavía)

Las tres medidas se midieron **por separado**. Antes de cambiar los valores por defecto de `docker-compose.yml` (`API_WORKERS`, `LOGIN_BULKHEAD`, `CACHE_CATALOGO`) se debe medir la **combinación** w4 + T1 + T2 a 10×, porque el bulkhead y la caché guardan estado **por proceso** (con 4 procesos el límite efectivo de logins concurrentes pasa de 2 a 8). Esa medición es la condición de entrada a producción de esta decisión (§7).

## 5. Consecuencias

**Positivas**
- La capacidad de login escala con los núcleos (medido: 4,4× con 4 procesos) sin tocar el dominio, la base ni las integraciones de ADR-003.
- El resto del sistema deja de sufrir el contagio del login (medido: −92 % en su P95 con T1).
- Costo de infraestructura en el mismo orden de magnitud (10¹ USD/mes) y operación sin habilidades nuevas para el equipo.

**Negativas**
- Con T1, en ráfagas los usuarios reciben "intenta de nuevo en un momento" (93,7 % de los intentos a 10× sin más núcleos). Es una **degradación elegida**, no un fallo silencioso, pero el frontend aún no la maneja de forma específica.
- El estado de T1 y T2 es por proceso: cachés y límites no son compartidos entre procesos.
- D1 tiene techo: a 10× la demanda estimada es ≈ 40 logins/s, que con bcrypt costo 12 pediría ≈ 12 núcleos (inferido, §2.5 de EXP-004).
- Más procesos → más conexiones a PostgreSQL (10 por proceso; 40 con 4, por debajo de `max_connections = 100`).

## 6. Reversibilidad

**Alta.** Las tres medidas son variables de entorno: `API_WORKERS=1`, `LOGIN_BULKHEAD=off`, `CACHE_CATALOGO=off` restauran el comportamiento anterior sin cambiar código. Pasar más adelante a D2 tampoco exige reescribir: la sesión ya es *stateless* (JWT). Lo único que se descarta con esta decisión es el **costo de oportunidad** de D3, que puede retomarse con datos.

## 7. Supuestos y condiciones de revisión (re-decisión)

| Supuesto | Revisar esta decisión si… |
|---|---|
| La combinación D1 + T1 + T2 se comporta como cada una por separado | La medición combinada a 10× (condición de entrada) muestra que no |
| El host tiene núcleos libres para crecer | La CPU total del host pasa de ≈ 80 % con N procesos → evaluar D2 |
| La base de datos no es el cuello | PostgreSQL pasa de 50 % de CPU o el pool se agota → réplicas de lectura o vista materializada del catálogo |
| La disponibilidad aceptable es la de un solo host | Se exige sobrevivir a la caída de una máquina (RNF03 medido) → D2 |
| bcrypt costo 12 es innegociable | El equipo de seguridad acepta costo 10 o un *hash* distinto → reevaluar núcleos necesarios |
| El crecimiento es de usuarios similares a los del recorrido de M2 | El perfil de uso cambia (p. ej. muchos más logins por sesión) → repetir EXP-002 |
| Un solo equipo de 3 personas | El equipo crece y necesita desplegar contextos por separado → reconsiderar D3 por razones organizacionales, no de rendimiento |

## 8. Trazabilidad

| Elemento | Commit |
|---|---|
| Pre-registro EXP-002 / datos / veredicto | `02a5143` / `0434d99` / `f5e2246` |
| Pre-registro EXP-003 / código T1-T2 / corrección D1 / resultados | `387ac56` / `72d43fb` / `a4bbe35` / `ec19398` |
| Pre-registro EXP-004 / código *cluster* / resultados | `23a2297` / `df4f9b0` / `a9193d3` |
| Fitness function FF-1 en CI | `91cb60e` |

Comando: `git log --date=iso --format="%h %ad %s" 02a5143^..HEAD`

## 9. Veredicto del mini-comité 2

**Estado:** Pendiente de la sesión del mini-comité 2 (semana 12).

| Campo | Valor |
|---|---|
| Equipo evaluador (comité) | Por registrar |
| Fecha de la sesión | Por registrar |
| Rol representado por el comité | Por registrar (CTO / Seguridad / Finanzas) |
| **Veredicto** | Por registrar: **Confirmada** / **Ajustada** / **Reconsiderada** |
| Observaciones del comité | Por registrar |
| Re-decisión tras el veredicto | Por registrar |

> El veredicto no se anticipa: se completa después de la sesión real. Preguntas probables y respuestas con datos: `docs/m6/guia-defensa-2.md`.
