# Crítica a la arquitectura recomendada por IA — decisión de estilo (Módulo 4)

Actividad de la semana 7: describir el sistema actual a una IA, pedirle una recomendación de arquitectura y criticar esa propuesta contra los drivers priorizados del equipo, señalando supuestos falsos y riesgos omitidos.

Este ejercicio es distinto del registro de riesgos de IA del Módulo 1 (`docs/03-Riesgos-Sugeridos-IA.md`), que evaluaba riesgos sobre el sistema actual. Aquí se evalúa una **propuesta de arquitectura completa** generada por IA para la evolución de CookSmart.

## 1. Descripción del sistema entregada a la IA

> CookSmart es una aplicación web académica desarrollada por un equipo pequeño de tres estudiantes, en fase de validación de arquitectura y calidad. El frontend es HTML/CSS/JavaScript estático. El backend es una API propia en Node.js/Express organizada como monolito modular por capas (routes → controllers → services → repositories), con PostgreSQL como única base de datos relacional, desplegado con Docker Compose. La autenticación usa JWT y bcrypt. El sistema no tiene usuarios reales en producción todavía; su alcance es un curso de Arquitectura de Software. Las pruebas de carga con k6 muestran que un endpoint aislado responde bien (P95 ≈ 233 ms con 50 VUs), pero un recorrido completo autenticado degrada severamente (P95 global ≈ 9,72 s, con el login en ≈ 17,93 s).

## 2. Propuesta de arquitectura generada por la IA

Al pedir una recomendación de arquitectura "para escalar CookSmart y resolver los problemas de rendimiento observados", una IA generativa típica propone lo siguiente (respuesta reconstruida a partir de patrones comunes de este tipo de recomendaciones):

> "Recomiendo migrar CookSmart de monolito a una arquitectura de microservicios, separando Auth, Recetas, Inventario, Favoritos e Historial como servicios independientes, cada uno con su propia base de datos. Se debe introducir un API Gateway para enrutar las solicitudes, un bus de eventos (Kafka o RabbitMQ) para la comunicación asíncrona entre servicios, Redis como caché distribuido para reducir la latencia detectada en el login, y desplegar todo en Kubernetes con autoescalado horizontal para soportar el crecimiento de usuarios. Esto resolverá los problemas de rendimiento del recorrido completo y preparará el sistema para escalar a miles de usuarios concurrentes."

## 3. Crítica de la propuesta

| # | Elemento de la propuesta de IA | Tipo de problema | Crítica basada en el sistema real |
|---|---|---|---|
| 1 | Migrar a microservicios (Auth, Recetas, Inventario, Favoritos, Historial como servicios separados) | **Supuesto falso / sobreingeniería** | El equipo tiene 3 integrantes y el sistema es un proyecto académico sin usuarios reales. Microservicios multiplican el número de despliegues, redes internas y puntos de falla que un equipo de este tamaño no puede operar ni monitorear. El ADR-001 ya descarta explícitamente esta alternativa por el mismo motivo. No existe evidencia de que el dominio necesite escalar o desplegarse de forma independiente por módulo. |
| 2 | Cada microservicio con su propia base de datos | **Riesgo omitido** | La propuesta ignora que dividir la base de datos introduce el problema de consistencia distribuida (por ejemplo, un favorito referencia una receta que vive en otra "base de datos"). El sistema actual no tiene ese problema porque PostgreSQL mantiene las relaciones (`receta_ingrediente`, `receta_etiqueta`, etc.) con integridad referencial real. La IA no considera el costo de reemplazar esas foreign keys por lógica de consistencia eventual. |
| 3 | Introducir un API Gateway | **Supuesto falso sobre la causa raíz** | El Gateway resolvería un problema de enrutamiento entre muchos servicios, pero el sistema actual tiene **un solo backend**. Añadir un Gateway aquí no resuelve el P95 de 17,93 s del login; solo agrega un salto de red adicional antes de llegar a la misma API. |
| 4 | Bus de eventos (Kafka/RabbitMQ) para comunicación entre servicios | **Sobreingeniería** | No existe ningún flujo asíncrono identificado en los drivers ni en los escenarios de calidad de CookSmart (`docs/02-Escenarios-de-calidad.md`). Ninguna operación actual (login, consulta de recetas, favoritos) requiere procesamiento diferido o notificación entre servicios. Se estaría añadiendo infraestructura de mensajería sin un caso de uso real que la justifique. |
| 5 | Redis como caché distribuido para "reducir la latencia del login" | **Riesgo omitido / causa no diagnosticada** | El P95 de login de 17,93 s corresponde muy probablemente al costo de `bcrypt` bajo concurrencia (verificación de contraseña) y/o al pool de conexiones de PostgreSQL, no a datos que se puedan cachear: el login siempre necesita leer y comparar la contraseña del usuario que inicia sesión, un dato que cambia por solicitud y no es cacheable de forma útil. La IA prescribe una solución de infraestructura antes de que el equipo haya instrumentado por capa (bcrypt vs. consulta SQL vs. red), que es exactamente lo que el ADR-001 y `docs/01-contexto-y-drivers.md` (sección "Qué todavía no ha sido verificado") señalan como pendiente. |
| 6 | Desplegar en Kubernetes con autoescalado horizontal | **Sobreingeniería / costo no justificado** | Kubernetes agrega una capa completa de operación (manifiestos, ingress, autoescalado, observabilidad de clúster) que ningún integrante del equipo tiene la capacidad ni el tiempo de mantener dentro del alcance de un curso. El sistema ya usa Docker Compose, que es suficiente para el volumen de tráfico real (una prueba académica con 50 VUs), y la matriz de atributos (`docs/04-Matriz-De-Calidad.md`) clasifica Escalabilidad como prioridad **Baja** por decisión consciente de alcance. |
| 7 | "Esto resolverá los problemas de rendimiento del recorrido completo" | **Afirmación no verificable / falsa causalidad** | La propuesta presenta la migración como una solución garantizada sin haber diagnosticado la causa real de la degradación. La evidencia de k6 (`k6-demo/load-test.js`) muestra 0 % de errores y 100 % de checks exitosos: el problema es de latencia bajo un flujo concurrente, no de arquitectura distribuida. Cambiar de estilo arquitectónico sin antes medir por capa (igual que ya se advirtió en `docs/03-Riesgos-Sugeridos-IA.md` para el caso de la migración de Firebase a PostgreSQL) no garantiza una mejora y sí introduce nueva complejidad y nuevos puntos de falla. |

## 4. Conclusión de la crítica

La propuesta de la IA es internamente coherente como "receta genérica" para escalar un sistema web, pero no está anclada al contexto real de CookSmart: un equipo de 3 personas, un sistema académico sin tráfico de producción, y un problema de rendimiento que todavía no ha sido diagnosticado por capa. La recomendación:

- **Ignora el driver de costo/mantenibilidad** que el equipo priorizó explícitamente (ver `docs/08-decision-estilo-arquitectonico.md`, sección 14 "Alternativas descartadas").
- **Confunde síntoma con causa**: prescribe infraestructura distribuida para un problema de latencia que aún no se ha aislado (bcrypt, pool de conexiones, o consultas).
- **Omite el costo de consistencia** de partir la base de datos entre servicios, cuando el sistema depende hoy de integridad referencial real en PostgreSQL.

Por estas razones, el equipo mantiene la decisión documentada en `docs/adr/ADR-001-estilo-arquitectonico.md`: **monolito modular por capas**, con la comunicación API → PostgreSQL como límite central a optimizar, en vez de adoptar la arquitectura distribuida recomendada por la IA.

## 5. Relación con los demás documentos

| Documento | Relación |
|---|---|
| `docs/adr/ADR-001-estilo-arquitectonico.md` | Decisión de estilo que esta crítica sustenta y confirma |
| `docs/08-decision-estilo-arquitectonico.md` | Comparación formal de alternativas de estilo, incluida la razón de descarte de microservicios |
| `docs/03-Riesgos-Sugeridos-IA.md` | Ejercicio análogo de crítica a IA, aplicado a riesgos en lugar de arquitectura |
| `docs/01-contexto-y-drivers.md` | Lista lo que todavía no ha sido verificado sobre la causa de la latencia (sección 9) |
| `k6-demo/load-test.js`, `k6-demo/diagnostico.js` | Evidencia de rendimiento usada para refutar la causalidad asumida por la IA |
