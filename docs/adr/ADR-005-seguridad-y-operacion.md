# ADR-005 — Seguridad, despliegue y observabilidad

- **Estado:** Propuesto — veredicto del mini-comité por registrar (§9)
- **Fecha:** 2026-10-26
- **Contexto de módulo:** M7 (Fase IV — Operación y defensa)
- **Decisiones relacionadas:** ADR-002 (capas, base de FF-1), ADR-003 (escrituras síncronas, F10), ADR-004 (distribución y resiliencia, F1–F12)

## 1. Contexto

El M6 dejó dos huecos explícitos: **F4** (el sistema no tiene ninguna señal propia: los fallos solo se vieron porque el experimento añadió muestreo) y **F12** (el `healthcheck` da falso positivo bajo carga y un orquestador que reinicie por ello agravaría el fallo). Además, una revisión de seguridad del sistema completo (`docs/m7/10-seguridad.md`) encontró amenazas **explotables y medidas**, la más grave un secreto JWT versionado en un repo público (A1).

El M7 exige decidir, con el costo explícito: qué controles de seguridad se aplican, cómo se despliega, y qué se observa.

## 2. Decisión

Se adopta un conjunto de decisiones acopladas:

1. **Seguridad (C1–C6):** sacar y rotar el `JWT_SECRET` (C1), limitar intentos fallidos de login (C2), acotar la caché (C3), correr la API como no-root (C4), cerrar Adminer al exterior (C5) y endurecer cabeceras (C6). Detalle y evidencia en `10-seguridad.md`.
2. **Despliegue:** **un host con proxy inverso** (D-A), no PaaS gestionado (D-B). Mantiene el control de TLS, puertos y `healthcheck` —las piezas donde el M6/M7 encontró los riesgos reales— y cuesta un orden de magnitud menos en infra sin sumar horas de operación. Detalle en `12-despliegue-observabilidad.md` §1.2.
3. **Observabilidad:** logs JSON por petición con `X-Request-Id`, métrica del retraso del bucle de eventos, contadores de login y `/metrics` protegido, **sin dependencias nuevas**. Cada señal está atada a un fallo del M6; las alertas usan umbrales medidos (§2.2 de `12-...`).
4. **Verificación en CI:** FF-5 (ningún secreto versionado, protege C1) y FF-6 (cabeceras, caché acotada, límite de login y protección de `/metrics`), ambas rompen el PR ante una violación.

## 3. Alternativas consideradas

- **Despliegue D-B (PaaS/free tier):** rechazado como arquitectura de referencia porque su `healthcheck` y reinicio automático son justo el comportamiento que el M6 mostró peligroso (F12); se conserva como experimento del nivel avanzado.
- **`helmet` para cabeceras / vault para secretos / WAF / MFA:** descartados hoy por costo-beneficio para 3 personas y este sistema; motivos en `10-seguridad.md` §4 y `docs/ia/evaluacion-amenazas-ia-m7.md`.
- **Revocación de tokens (lista negra):** rechazada por ahora (contradice el JWT sin estado); se acepta el riesgo residual R-S2 con `exp` de 7 días.

## 4. Consecuencias

**Positivas:** la amenaza crítica (A1) queda cerrada y verificada; los fallos F1/F2 del M6 pasan a ser **detectables** (medido: retraso del bucle 21 → 1621 ms); el despliegue conserva el control de los puntos sensibles; CI impide reintroducir el secreto.

**Negativas / costos:** hay que operar un proxy y renovar TLS (horas de operación 10⁰); el límite de login es por proceso (R-S3) y habrá que compartir estado si se activan workers; quedan riesgos residuales aceptados (R-S1, R-S2, R-S4) documentados.

## 5. Matriz de riesgos operativos

Riesgos de **operar** el sistema (distintos de los de seguridad de `10-seguridad.md` y de los de carga del M6). Prob. e impacto en bajo/medio/alto.

| # | Riesgo operativo | Prob. | Impacto | Detección | Mitigación | Dueño |
|---|---|---|---|---|---|---|
| **O-1** | El `JWT_SECRET` se pierde o no se rota entre entornos | Media | Alto (nadie entra / todos los tokens caen) | Arranque falla sin la variable | `.env.example` documentado; secreto por entorno; respaldo fuera del repo | Equipo |
| **O-2** | `healthcheck` reinicia la API bajo carga (F12) | Media | Alto | `docker inspect`, alerta `BucleDeEventosBloqueado` | D-A evita orquestador que reinicie por liveness; `start-period` holgado | Equipo |
| **O-3** | `/metrics` queda expuesto sin token por despiste | Baja | Alto (fuga de métricas) | FF-6 y H-O4 en CI; 404 sin token | Token obligatorio; sin token el endpoint no existe | Equipo |
| **O-4** | TLS caduca | Media | Alto (servicio inaccesible) | Monitoreo de certificado | Renovación automática (Let's Encrypt) | Operación |
| **O-5** | Caída de PostgreSQL (F6) | Baja | Alto | `/health` → `db:unreachable`, alerta `BaseInalcanzable` | Volumen persistente; respaldo; reinicio con `restart: always` | Equipo |
| **O-6** | Pérdida de logs (solo `docker logs`, sin recolector) | Media | Medio | — | stdout portable a un recolector (Loki) cuando crezca; hoy aceptado | Equipo |
| **O-7** | Límite de login por proceso ineficaz con N workers (R-S3) | Baja hoy | Medio | Revisión al activar workers | Mover contador a almacén compartido antes de escalar | Equipo |
| **O-8** | Equipo de 3 sin guardias (F11) | Alta | Medio | — | Alertas accionables y pocas; D-A simple de operar; no distribuir (ADR-004) | Equipo |

## 6. Verificación

- Seguridad: `experimentos/EXP-005-.../resultados/seguridad-antes.json` vs `seguridad-despues.json` (H-S1…H-S8).
- Observabilidad: `resultados/observabilidad.json` (H-O1, H-O2, H-O5) y H-O4 en el script de seguridad.
- CI: FF-5 (`.github/workflows/security.yml`) y FF-6 (`.github/workflows/fitness.yml`), cada una con autoprueba.

## 7. Declaración de uso de IA

El borrador de los controles, los scripts de verificación, las fitness functions y este ADR se elaboraron con asistencia de IA (Claude) bajo revisión del equipo. La propuesta de amenazas generada por IA se **contrastó y podó** con los datos del sistema (`docs/ia/evaluacion-amenazas-ia-m7.md`): se descartaron los controles genéricos que no atacan una amenaza medible aquí. El equipo valida cada control contra la evidencia de EXP-005 antes de darlo por adoptado.

## 8. Plan de activación

Antes de poner nada "por defecto" en producción: (a) montar el proxy con TLS; (b) definir `JWT_SECRET` y `METRICS_TOKEN` por entorno; (c) conectar un recolector de logs/métricas y cablear las 4 alertas; (d) si se activan workers (D1), resolver R-S3/O-7 primero.

## 9. Veredicto del mini-comité

> _Por registrar tras la sesión de defensa (igual que ADR-004 §9)._ El equipo revisa la matriz de amenazas, la elección D-A vs D-B y la matriz de riesgos operativos, y deja aquí el acuerdo (adoptado / adoptado con cambios / rechazado) con fecha.
