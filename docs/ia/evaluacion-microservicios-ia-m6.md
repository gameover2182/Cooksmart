# ¿La estrategia de microservicios propuesta por IA añade complejidad innecesaria? (M6)

> Actividad de la semana 12. Diferencia con M4 (`docs/10-critica-arquitectura-ia.md`): en M4 la propuesta se criticó con **argumentos**; aquí se contrasta con **datos medidos** del crecimiento 10× (EXP-002), de la táctica (EXP-003) y con el costo estimado (`docs/m6/costo-distribucion.md`).

## 1. Prompt entregado a la IA

```
CookSmart es una app web académica (equipo de 3 personas): frontend estático,
API Node.js/Express (monolito modular por capas) y una sola base PostgreSQL,
desplegada con Docker Compose en un solo host. La autenticación usa JWT y
bcrypt (costo 12). Contextos: Identidad, Catálogo de Recetas, Nevera,
Recomendación (hoy en el navegador) y Actividad (favoritos e historial).

El número de usuarios va a crecer 10 veces. Propón una estrategia de
distribución con microservicios para soportar ese crecimiento.
```

Herramienta: Claude Code (Claude Opus 5.5), 2026-10-23. Se pidió explícitamente una estrategia **de microservicios** para evaluar esa opción, no para adoptarla.

## 2. Propuesta generada (resumen fiel)

1. Separar cinco servicios, uno por contexto: `identity-service`, `catalog-service`, `fridge-service`, `recommendation-service`, `activity-service`.
2. *Database per service*: cinco bases PostgreSQL independientes; reemplazar las claves foráneas entre contextos por identificadores y sincronización por eventos.
3. API Gateway delante de los servicios (enrutamiento, validación de JWT, *rate limiting*).
4. Broker de eventos (RabbitMQ o Kafka) para `FavoriteAdded`, `RecipePrepared`, `IngredientExpiring`.
5. Redis como caché distribuido del catálogo y de sesiones.
6. Kubernetes con *Horizontal Pod Autoscaler* para escalar cada servicio según CPU.
7. Observabilidad: OpenTelemetry + Prometheus + Grafana + trazas distribuidas.
8. Mover la recomendación al backend como servicio propio.

## 3. Contraste de cada elemento con los datos

| # | Elemento propuesto | ¿Ataca el fallo medido? | Evidencia | Veredicto |
|---|---|---|---|---|
| 1 | 5 servicios, uno por contexto | **Solo de forma indirecta.** El fallo es CPU del login en un núcleo (EXP-002); separar `identity-service` le da núcleos propios, pero lo mismo se logra con N procesos del monolito en el mismo host (EXP-004) | EXP-002: API 100 % de un núcleo, PostgreSQL 2 % | **Complejidad innecesaria** para el fallo medido |
| 2 | *Database per service* (5 bases) | **No.** PostgreSQL está ocioso en todos los niveles (≈ 2 % CPU, ≤ 1 conexión activa) | EXP-002 §1.1 | **Innecesario**; además rompe las FK que ADR-003 decidió conservar |
| 3 | API Gateway | **No.** Hay un solo backend; un salto de red más no reduce la CPU del login | — | Innecesario |
| 4 | Broker de eventos | **No**, y es **dañino** para los datos: la variante asíncrona perdió 66/1000 escrituras confirmadas con un *crash* y dio 54,7 % de lecturas consistentes | Spike 1 + verificación de reinicio (M5) | **Rechazado** (ADR-003) |
| 5 | Redis como caché del catálogo | **Parcialmente sí**, pero la caché **en memoria del proceso** ya dio −37 % (T2) sin agregar infraestructura; Redis solo haría falta con varios procesos que deban compartir la caché | EXP-003 T2 | Innecesario **hoy**; reconsiderar si D1 vuelve inconsistentes las cachés por proceso |
| 6 | Kubernetes + HPA por CPU | **Riesgoso.** El *healthcheck* ya marca `unhealthy` bajo carga (F12): un orquestador con *liveness probe* reiniciaría la API en plena saturación | Matriz de fallos F12 | Rechazado sin antes separar *liveness* de *readiness* |
| 7 | OpenTelemetry + Prometheus + Grafana | **Sí apunta a un fallo real (F4: sin monitoreo)**, pero en su versión mínima: métricas de CPU y latencia por ruta en el monolito, no trazas distribuidas | Matriz F4 | **Aceptado en versión mínima** |
| 8 | Recomendación como servicio | **No relacionado** con el fallo de crecimiento | M5: BC4 vive en el navegador | Fuera de alcance |

## 4. Qué omitió la IA (riesgos que los datos sí mostraron)

- **No preguntó qué fallaba.** Propuso la arquitectura antes del diagnóstico. El dato más importante del módulo (la base de datos está ociosa y el cuello es un núcleo de CPU) invalida la mitad de la propuesta.
- **No mencionó el costo** (`docs/m6/costo-distribucion.md`: D3 ≈ 10³ USD/mes y 10¹–10² h/semana frente a 10¹ USD/mes y 10⁰ h/semana de D1).
- **No mencionó que una táctica de resiliencia puede fallar**: nuestro bulkhead, con un defecto, bloqueó todos los logins (EXP-003, D1). Con más piezas distribuidas hay más lugares para ese tipo de error.
- **No propuso la táctica que más protegió** (bulkhead en el login, −92 % en el P95 del resto): propuso escalar en lugar de aislar.

## 5. Conclusión

**Sí: la estrategia de microservicios añade complejidad innecesaria para CookSmart.** De 8 elementos, uno se acepta en versión mínima (monitoreo), uno es parcialmente útil y ya se resolvió sin infraestructura (caché), y seis no atacan el fallo medido o lo empeoran. La alternativa con datos es: **monolito modular + bulkhead del login + caché del catálogo + más procesos en el mismo host** (ADR-004).
