# Evaluación arquitectónica y re-decisión — CookSmart (M8)

> Evaluación tipo comité de la arquitectura con los escenarios de calidad y la evidencia acumulada, más el ejercicio de **re-decidir bajo restricciones nuevas** (lo que el Corte 3 evalúa en vivo). Incluye el nivel avanzado: IA como arquitecto adversarial y recorte de alcance si el equipo pierde un integrante.

## 1. Evaluación contra los escenarios de calidad

Se toman los escenarios del dossier (`docs/02-Escenarios-de-calidad.md`) y se dice, para cada atributo, si la arquitectura lo cumple **con evidencia** o **con argumento**.

| Atributo | Escenario | ¿Se cumple? | Respaldo |
|---|---|---|---|
| Rendimiento | PR01: `GET /recetas` p95 < 500 ms a 50 VUs | **Sí, medido** | FF-2 en CI (k6) |
| Escalabilidad | Crecer 10× sin colapso total | **Parcial, medido** | E1: colapsa el login; E4: mitigable 4,4× con núcleos |
| Disponibilidad | Una parte lenta no tumba el resto | **Sí, medido** | E2: bulkhead −92 % P95 del resto |
| Seguridad | PSeg01–04: credenciales, autorización, JWT, inyección | **Sí, medido** | EXP-005 (E7, E8); SQL parametrizado; IDOR cubierto |
| Modificabilidad | Cambiar una capa sin romper otras | **Sí, vigilado** | FF-1 (reglas de capas) |
| Operabilidad | Saber qué pasó en un incidente | **Sí, medido** | E9: observabilidad detecta F1 |
| Consistencia | No perder escrituras aceptadas | **Sí, medido** | E6: síncrono, 0 pérdidas |
| Costo | Crecer sin costo desproporcionado | **Argumento cuantificado** | E5: órdenes de magnitud |

**Veredicto de autoevaluación:** la arquitectura cumple los atributos críticos con evidencia ejecutable. El punto más débil es escalabilidad (techo = núcleos de un host), reconocido y con plan (D2).

## 2. Re-decisión ante tres restricciones nuevas (ensayo del Corte 3)

El ejercicio: llega una restricción nueva y hay que **re-decidir en el momento**, diciendo qué evidencia propia sostiene o cambia la decisión.

### Restricción A — «El presupuesto de nube se recorta a la mitad»
- **Decisión:** sin cambios estructurales. Ya elegimos la opción más barata (D1, 10¹ USD/mes). Se posterga D2 (varios hosts).
- **Evidencia que la sostiene:** E4 (4,4× en el mismo host) y E5 (costo). El recorte no toca el cuello.
- **Qué se sacrifica:** margen de crecimiento horizontal; aceptable hasta acercarse al techo de núcleos.

### Restricción B — «Ahora hay datos personales regulados (PII sensible)»
- **Decisión:** se reabre ADR-005. Entran controles que hoy están como *descartados por costo*: cifrado en reposo y gestión de claves (vault), y se revisa la retención de logs (hoy guardan id de usuario, no PII).
- **Evidencia:** la observabilidad ya registra **patrón de ruta, no datos** (diseño M7), así que los logs no filtran PII — eso ya está medido (H-O2). Lo nuevo (cifrado) sería deuda a saldar, no algo ya hecho.
- **Qué se sacrifica:** simplicidad operativa; el vault es infraestructura nueva que operar (choca con P8).

### Restricción C — «El tráfico se multiplica por 100, no por 10»
- **Decisión:** aquí **sí** cambia la arquitectura. D1 agota el techo de núcleos de un host; se pasa a D2 (varios hosts + balanceador) y, antes, se resuelve el estado por proceso (P9): bulkhead/caché/rate-limit a un almacén compartido (Redis). Microservicios **solo** si se mide que un componente concreto necesita escalar distinto — no por defecto.
- **Evidencia:** E1 (el cuello es CPU de login, replicable por host) y E4 (escala con núcleos). La extrapolación a 100× es **argumento**, no medición: habría que re-medir a esa escala antes de comprometerse.
- **Qué se sacrifica:** simplicidad; se acepta complejidad proporcional a una necesidad **medida**, no anticipada.

**Patrón de las tres:** la decisión cambia solo cuando la restricción toca un **cuello medido**. Una restricción de costo no cambia una arquitectura ya mínima; una de escala 100× sí, porque supera un techo conocido.

## 3. Nivel avanzado — IA como arquitecto adversarial

Se usó la IA como **crítico hostil** (no como generador), pidiéndole que atacara la arquitectura. Qué crítica se pudo **refutar con medición propia** y cuál **se aceptó**:

| Crítica de la IA adversarial | ¿Refutada con datos? | Con qué |
|---|---|---|
| «Un monolito no escala; necesitan microservicios» | **Refutada** | E1 (el cuello es CPU de un hilo) + E4 (escala en núcleos) + E5 (costo 100×) |
| «La caché en memoria es un parche; usen Redis» | **Refutada hoy** | E3: la caché dio −37 % sin infraestructura; Redis es para la escala 100× (Restricción C) |
| «El bulkhead introduce un punto único de fallo» | **Refutada** | Fue cierto en la 1ª versión (defecto D1 de EXP-003); se corrigió y FF-3 lo vigila |
| «No tienen forma de saber si algo falla» | **Aceptada** (era verdad en M6, F4) | Se cerró en M7 con observabilidad (E9) |
| «El secreto en el repo es indefendible» | **Aceptada** | Era cierto; se cerró (E7) y se vigila (FF-5) |
| «Sin pruebas de carga reproducibles, es su palabra» | **Refutada** | Todos los experimentos son pre-registrados y reproducibles (§0 de `15-evidencia-ejecutable.md`) |

**Conclusión del ejercicio:** la IA adversarial acertó en lo que **ya sabíamos que era deuda** (observabilidad y secreto, ambos cerrados) y falló en lo que **habíamos medido** (escala y caché). Confirma el patrón de todo el curso: la IA razona sobre patrones generales; la medición propia es lo que decide en **este** sistema.

## 4. Nivel avanzado — Recorte de alcance si el equipo pierde un integrante

De 3 a 2 personas, qué se **mantiene**, se **congela** y se **corta**:

| Mantener (no negociable) | Congelar (no evolucionar) | Cortar (quitar del alcance) |
|---|---|---|
| El monolito y su despliegue D-A (lo más barato de operar) | D2 / escalado horizontal (no se tocará sin necesidad medida) | Cualquier exploración de microservicios |
| Los controles de seguridad C1–C6 y las fitness functions (son baratos y automáticos) | Nuevos experimentos de carga (los existentes bastan como evidencia) | Dashboards de observabilidad "ricos"; basta `docker logs` + `/metrics` |
| `/health`, alertas mínimas y el `.env` por entorno | El contrato OpenAPI (se corrige solo si cambia un endpoint) | Features de producto no esenciales (p. ej. recomendaciones) |

**Criterio del recorte:** se conserva todo lo que es **automático y barato de mantener** (CI, fitness functions, controles por variable de entorno) y se corta todo lo que exige **atención humana recurrente**. Con 2 personas, la arquitectura simple deja de ser una preferencia y pasa a ser una condición de supervivencia (P8).

## 5. ADR corregidos tras la evaluación

El ejercicio de comité dejó en evidencia dos huecos de proceso, ya corregidos:
- **ADR-004 §9 y ADR-005 §9** tenían el veredicto del mini-comité «por registrar». Se registran en esta ronda (ver los ADR).
- Se añade a ambos la referencia cruzada a este documento y a `17-riesgos-priorizados.md`, para que la trazabilidad decisión → evidencia → riesgo sea explícita.
