# Matriz formal de atributos de calidad — priorizada y justificada

Esta matriz cruza los **drivers de negocio** y **drivers de calidad** definidos para CookSmart con los atributos de calidad trabajados en `docs/02-Escenarios-de-calidad.md`. La priorización se actualiza para representar el **sistema actualmente implementado**, no la arquitectura inicial ni componentes que ya no forman parte del alcance evaluado.

La arquitectura actual de CookSmart está compuesta por un **frontend web HTML/CSS/JavaScript**, una **API propia en Node.js/Express** y **PostgreSQL** como sistema de persistencia. El backend se organiza mediante capas de rutas, controladores, servicios, repositorios y acceso a base de datos.

La matriz conserva los cinco atributos del anteproyecto —Seguridad, Usabilidad, Rendimiento, Disponibilidad y Compatibilidad— y agrega **Mantenibilidad, Escalabilidad y Observabilidad** porque adquirieron relevancia al construir y evaluar el backend real.

> **Criterio de actualización:** las referencias a Firebase, Redis, API Gateway, microservicios o un motor de IA no se utilizan como evidencia de la arquitectura actual. Si aparecen en documentación histórica, se consideran antecedentes o trabajo futuro y no drivers activos del sistema evaluado.

## Cómo se prioriza

- **Alta:** el atributo tiene un requisito no funcional formal asociado y/o existe evidencia concreta de un riesgo que puede afectar directamente la seguridad, la continuidad del servicio o un objetivo crítico de rendimiento.
- **Media:** tiene un RNF o driver relevante y requiere seguimiento, pero la evidencia disponible no demuestra actualmente una afectación crítica para el alcance académico.
- **Baja:** es deseable para una evolución futura, pero el equipo decidió no incorporar infraestructura o mecanismos adicionales que resultarían desproporcionados para el alcance actual.

## Matriz

| Atributo de calidad | Prioridad en Docs/01 §5.2 | Driver de negocio | Driver de calidad | Prioridad (esta matriz) | Justificación | Evidencia en el sistema real |
|---|---:|---|---|---|---|---|
| **Seguridad** | 1 (RNF02) | Cumplimiento normativo y protección de datos | Seguridad | **Alta** | RNF02 establece la necesidad de proteger las cuentas y los datos de los usuarios. En la arquitectura actual la API concentra autenticación, autorización y acceso a PostgreSQL, por lo que una configuración incorrecta puede comprometer directamente la información. | Autenticación mediante JWT, contraseñas protegidas con bcrypt y acceso a datos mediante la API. Las validaciones de seguridad deben mantenerse como parte de las pruebas específicas del sistema. |
| **Disponibilidad** | 4 (RNF03) | Confiabilidad del servicio | Disponibilidad y recuperación | **Alta** | RNF03 establece un objetivo de disponibilidad de al menos 95 %. La arquitectura actual depende de la disponibilidad conjunta de la API y PostgreSQL, por lo que una falla de infraestructura puede afectar las operaciones principales. | PostgreSQL está definido en Docker Compose con versión fijada (`postgres:16-alpine`), `healthcheck` y dependencia de la API respecto al estado saludable de la base de datos. Todavía se requieren pruebas formales de disponibilidad y recuperación. |
| **Usabilidad** | 2 (RNF01) | Facilidad de uso y adopción | Experiencia de usuario | **Media-Alta** | RNF01 exige una interacción sencilla. La arquitectura debe permitir que el frontend consuma las funcionalidades de la API sin exponer al usuario la complejidad de las capas internas. | Frontend separado de la lógica de persistencia y consumo de endpoints definidos de la API. La usabilidad continúa siendo relevante, aunque la evidencia disponible se centra principalmente en funcionalidad y arquitectura. |
| **Rendimiento** | 3 (RNF04) | Crecimiento de usuarios | Rendimiento | **Media** | RNF04 establece objetivos cuantitativos de respuesta. Las pruebas k6 muestran que el comportamiento depende del escenario: el endpoint de recetas aislado presenta buen rendimiento, mientras que el recorrido completo bajo concurrencia presenta degradación. | `diagnostico.js`: 50 VUs, 20 s, 0 % de errores y P95 de aproximadamente 232,94 ms para `/api/recetas`. `load-test.js`: 50 VUs, 20 s, 500 solicitudes y P95 global de aproximadamente 9,72 s; login con P95 aproximado de 17,93 s. |
| **Compatibilidad** | 5 (RNF05) | Acceso desde navegadores objetivo | Compatibilidad web | **Baja** | No existe evidencia nueva que justifique cambiar la prioridad establecida originalmente. Dentro del alcance actual, el mayor impacto arquitectónico se concentra en seguridad, disponibilidad, rendimiento y mantenibilidad. | Verificada en los navegadores utilizados durante las pruebas del proyecto. No se cuenta con una campaña de compatibilidad exhaustiva que modifique esta valoración. |
| **Mantenibilidad** | — (nuevo) | Reducción del costo de evolución y corrección | Modularidad y separación de responsabilidades | **Media-Alta** | Al existir ahora un backend propio, mantener límites claros entre responsabilidades se convirtió en una preocupación real. La separación por capas facilita modificar servicios o persistencia sin trasladar toda la lógica al frontend. | Arquitectura monolítica modular por capas: `routes → controllers → services → repositories → db`. PostgreSQL queda encapsulado detrás de la capa de acceso a datos. |
| **Escalabilidad** | — (nuevo) | Crecimiento de usuarios | Capacidad de crecimiento | **Baja** | El sistema actual tiene un alcance académico y no requiere incorporar en esta etapa réplicas, Kubernetes, autoescalado u otra infraestructura distribuida. La decisión es consciente y corresponde al principio de evitar sobreingeniería. | Docker Compose utiliza una instancia de PostgreSQL y una API monolítica. Las pruebas k6 sirven para caracterizar el comportamiento actual, pero no constituyen una estrategia de escalabilidad horizontal. |
| **Observabilidad** | — (nuevo) | Confiabilidad del servicio | Diagnóstico y medición | **Baja** | Es una capacidad útil para operar y diagnosticar el sistema, pero no constituye actualmente un requisito formal del anteproyecto y el alcance académico no justifica incorporar una plataforma completa de métricas y alertas. | El diagnóstico actual se apoya principalmente en métricas de k6 y registros del backend/Docker. No se considera implementada una plataforma formal de observabilidad con métricas, dashboards y alertas. |

## Lectura de la matriz

**Seguridad** y **Disponibilidad** quedan en prioridad Alta porque ambas se relacionan con requisitos no funcionales formales y con consecuencias directas sobre la protección de los datos o la continuidad del servicio.

**Rendimiento** se mantiene en prioridad Media porque existe un requisito formal y evidencia cuantitativa, pero los resultados no muestran un fallo funcional: el escenario aislado de `/api/recetas` cumple el umbral definido, mientras que el flujo completo de 50 VUs presenta degradación. Esto convierte al rendimiento en un riesgo que requiere análisis y optimización, no en una conclusión de que toda la aplicación sea lenta.

**Usabilidad** conserva una prioridad relevante porque es parte del objetivo funcional del sistema, pero la evidencia arquitectónica disponible no muestra actualmente un problema crítico que justifique elevarla por encima de Seguridad o Disponibilidad.

**Mantenibilidad** emerge como un atributo importante después de incorporar el backend propio. La separación `routes → controllers → services → repositories → db` permite mantener una frontera explícita entre la lógica de aplicación y PostgreSQL.

**Escalabilidad** y **Observabilidad** permanecen en prioridad Baja por decisión de alcance. Esto no significa que sean atributos irrelevantes, sino que el sistema académico actual no requiere todavía infraestructura distribuida ni una plataforma completa de monitoreo.

## Relación con los drivers arquitectónicos

| Atributo | Driver arquitectónico relacionado | Respuesta en la arquitectura actual |
|---|---|---|
| Seguridad | Seguridad (RNF02) | JWT, bcrypt, autorización en endpoints protegidos y acceso a PostgreSQL a través de la API |
| Disponibilidad | Disponibilidad (RNF03) | PostgreSQL y API gestionados mediante Docker Compose, healthcheck de PostgreSQL y dependencia del servicio saludable |
| Usabilidad | Usabilidad (RNF01) | Frontend web separado de la lógica de backend y consumo mediante API |
| Rendimiento | Rendimiento (RNF04) | Medición con k6 y análisis diferenciado de endpoints y recorrido completo |
| Compatibilidad | Compatibilidad (RNF05) | Validación en navegadores objetivo |
| Mantenibilidad | Mantenibilidad (RNF06) | Arquitectura monolítica modular y separación por capas |
| Escalabilidad | Crecimiento de usuarios | Se mantiene una solución simple sin réplicas ni infraestructura distribuida para el alcance actual |
| Observabilidad | Confiabilidad del servicio | Métricas de k6 y logs disponibles; observabilidad avanzada queda como evolución futura |

## Evidencia de rendimiento considerada

La priorización de Rendimiento se basa en dos escenarios complementarios:

| Escenario | Condiciones principales | Resultado relevante | Interpretación |
|---|---|---|---|
| `k6-demo/diagnostico.js` | 50 VUs durante 20 s, GET `/api/recetas` | 0 % de errores; P95 ≈ 232,94 ms; ≈ 315,57 req/s | El endpoint aislado presenta un comportamiento compatible con el umbral definido de 500 ms |
| `k6-demo/load-test.js` | 50 VUs durante 20 s, recorrido completo de autenticación y operaciones | 0 % de errores; 500 solicitudes; P95 global ≈ 9,72 s; login P95 ≈ 17,93 s | El recorrido completo presenta degradación bajo concurrencia y requiere análisis por operación y por capa |

> **Importante:** estos resultados no permiten atribuir automáticamente la latencia a PostgreSQL. El tiempo observado puede incluir autenticación con bcrypt, consultas, pool de conexiones, lógica de servicios, comunicación HTTP y otros costos del flujo. La atribución causal requiere mediciones adicionales.

## Trazabilidad con los demás documentos

| Documento | Relación con esta matriz |
|---|---|
| `docs/01-Contexto-y-Drivers-Arquitectonicos.md` | Define el contexto, restricciones y drivers arquitectónicos utilizados como base |
| `docs/02-Escenarios-de-calidad.md` | Define los RNF y escenarios utilizados para evaluar los atributos de calidad |
| `docs/05-c4-contexto.md` | Representa el contexto actual del sistema |
| `docs/06-c4-contenedores.md` | Representa frontend, API y PostgreSQL como contenedores principales |
| `docs/07-c4-componentes.md` | Detalla los componentes y capas internas de la API |
| `docs/ADR-001-estilo-arquitectonico.md` | Documenta la decisión de utilizar una arquitectura monolítica modular por capas |
| `docs/ADR-002-limites-modulos-dependencias.md` | Define los límites y dependencias entre módulos |
| `k6-demo/diagnostico.js` | Evidencia el comportamiento del endpoint de recetas bajo carga concurrente |
| `k6-demo/load-test.js` | Evidencia el comportamiento del recorrido completo bajo concurrencia |

## Conclusión

La matriz actual refleja las prioridades del sistema realmente construido. **Seguridad y Disponibilidad** concentran los riesgos de mayor impacto; **Rendimiento** requiere seguimiento debido a la diferencia entre el endpoint aislado y el flujo completo; **Usabilidad y Mantenibilidad** condicionan la evolución y experiencia del sistema; y **Compatibilidad, Escalabilidad y Observabilidad** permanecen en un nivel inferior de prioridad de acuerdo con el alcance académico y las decisiones arquitectónicas actuales.

La matriz debe actualizarse si aparecen nuevas mediciones, incidentes o cambios de arquitectura. En particular, una futura prueba de disponibilidad, una optimización del login o nuevas pruebas de carga podrían modificar la valoración de Rendimiento o Disponibilidad.
