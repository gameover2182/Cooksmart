# Contexto y Drivers Arquitectónicos

## 1. Identificación y alcance del sistema

**HECHO VERIFICADO (sistema actual):** CookSmart es una aplicación web construida con HTML/CSS/JavaScript en el frontend y una API propia en Node.js/Express. La persistencia actual se realiza en PostgreSQL. El backend utiliza una arquitectura por capas con rutas, controladores, servicios, repositorios y configuración de base de datos.

**HECHO VERIFICADO (sistema actual):** El sistema cuenta con funcionalidades de autenticación, perfil, recetas, favoritos, inventario, historial y filtros/categorías. La comunicación entre frontend y backend se realiza mediante endpoints HTTP de la API.

**DECISIÓN DE EQUIPO:** La arquitectura actualmente evaluada es la implementación real: frontend web + API Node.js/Express + PostgreSQL. Las referencias a Firebase, Redis, microservicios, API Gateway o un motor de IA corresponden a etapas o propuestas anteriores y no forman parte del alcance actual evaluado.

## 2. Contexto

**HECHO VERIFICADO (proyecto):** El objetivo funcional de CookSmart es apoyar la planificación de comidas y el aprovechamiento de ingredientes disponibles, permitiendo consultar recetas y gestionar información relacionada con las recetas y los ingredientes del usuario.

**HECHO VERIFICADO (sistema actual):** La solución dejó de depender de Firebase como backend de persistencia y actualmente utiliza una API propia que centraliza el acceso a PostgreSQL. Esto permite que las operaciones del frontend pasen por una capa de aplicación definida.

## 3. Stakeholders y sus preocupaciones

| Stakeholder | Qué espera del sistema | Tensión con otros stakeholders |
|---|---|---|
| Usuario final | Consultar recetas, gestionar sus datos y utilizar las funciones de favoritos, inventario e historial de forma sencilla y con tiempos de respuesta adecuados | Simplicidad de uso vs. necesidad de autenticación y protección de datos |
| Profesor / evaluador del curso de Arquitectura | Evidencia verificable de las decisiones arquitectónicas y de su correspondencia con la implementación real | La documentación debe mantenerse alineada con el sistema implementado y con las pruebas realizadas |
| Equipo desarrollador | Arquitectura mantenible, separación clara de responsabilidades y comunicación estable entre frontend, API y PostgreSQL | Mayor separación por capas implica más componentes que mantener, pero facilita evolución y diagnóstico |
| Administrador / responsable técnico | Poder operar y revisar la aplicación y su base de datos durante el desarrollo | Las herramientas administrativas deben mantenerse separadas de la exposición normal de la aplicación |

## 4. Restricciones

**HECHO VERIFICADO (sistema actual):** La aplicación utiliza Node.js/Express como backend y PostgreSQL como sistema de persistencia.

**HECHO VERIFICADO (sistema actual):** La solución se ejecuta mediante una configuración Docker que contempla la API, PostgreSQL y Adminer para administración de la base de datos.

**RESTRICCIÓN DE ALCANCE:** El sistema evaluado no debe documentarse como una arquitectura de microservicios. La implementación actual corresponde a una aplicación monolítica modular con separación por capas.

**RESTRICCIÓN DE EVIDENCIA:** Las conclusiones de rendimiento deben basarse en las pruebas k6 disponibles y en sus condiciones concretas. Una prueba aislada de un endpoint no permite concluir por sí sola el comportamiento de todo el flujo de usuario.

## 5. Drivers arquitectónicos

### 5.1 Requerimientos funcionales considerados

Estas funcionalidades representan capacidades que condicionan la arquitectura actual:

| Código | Nombre | Relación con la arquitectura actual |
|---|---|---|
| RF01 | Registro de usuario | Requiere comunicación frontend-API y persistencia de usuarios |
| RF02 | Inicio y cierre de sesión | Requiere autenticación mediante la API y manejo de JWT |
| RF03 | Visualización de perfil | Requiere consulta de información del usuario mediante la API |
| RF04 | Registro de ingredientes en la nevera | Requiere operaciones de lectura/escritura sobre PostgreSQL |
| RF05 | Recomendación de recetas | Requiere acceso a las recetas y procesamiento de la información disponible |
| RF06 | Notificación de vencimiento | Debe considerarse según las capacidades realmente implementadas; no se documenta como un servicio externo activo |
| RF07 | Historial de recetas | Se contempla mediante el módulo de historial de la API |
| RF08 | Eliminación de ingredientes | Requiere operaciones de modificación en PostgreSQL |
| RF09 | Filtrado de recetas por categoría | Requiere consulta de recetas y categorías mediante la API |

### 5.2 Drivers arquitectónicos priorizados

Los siguientes drivers representan las fuerzas que condicionan las decisiones de la arquitectura actual. Se priorizan por su relación con el funcionamiento, seguridad, mantenibilidad y evidencia del sistema.

| Prioridad | Código | Driver | Justificación | Estado actual |
|---|---|---|---|---|
| 1 | RNF02 | Seguridad | La API gestiona autenticación, JWT, credenciales y datos asociados a usuarios. La separación correcta de acceso entre usuarios y la protección de las operaciones sobre PostgreSQL son esenciales. | Implementado mediante autenticación y autorización en la API; requiere validación continua |
| 2 | RNF04 | Rendimiento | Las operaciones principales dependen de la comunicación frontend → API → PostgreSQL. Las pruebas k6 muestran que el rendimiento cambia según el tipo de carga y el flujo ejecutado. | Medido con k6; la prueba aislada de recetas cumple el umbral, mientras el flujo completo bajo concurrencia presenta degradación |
| 3 | RNF06 | Mantenibilidad | La implementación utiliza separación por rutas, controladores, servicios, repositorios y acceso a base de datos. Mantener estos límites reduce el acoplamiento entre responsabilidades. | Arquitectura por capas implementada |
| 4 | RNF01 | Usabilidad | El usuario debe poder consultar recetas y gestionar sus datos sin que la complejidad interna de la API afecte el flujo de uso. | Implementado en el frontend; sujeto a mejoras funcionales |
| 5 | RNF03 | Disponibilidad | La aplicación depende de la disponibilidad de la API y de PostgreSQL. Una falla de cualquiera de estos componentes puede afectar las operaciones principales. | No se ha realizado una prueba específica de disponibilidad de larga duración |

#### Criterio de priorización

La prioridad se estableció considerando primero los atributos que pueden comprometer directamente la protección de los datos y el funcionamiento del sistema. Seguridad y rendimiento se consideran críticos porque afectan las operaciones de autenticación y consulta/gestión de información. Mantenibilidad es relevante debido a la arquitectura por capas y a la necesidad de conservar límites claros entre API y base de datos. Usabilidad y disponibilidad también condicionan la experiencia, pero no se cuenta con una medición específica de disponibilidad que permita caracterizarla cuantitativamente.

#### Trazabilidad hacia decisiones arquitectónicas

| Driver | Decisión arquitectónica que responde al driver |
|---|---|
| Seguridad | Autenticación mediante JWT, validación de credenciales y control de acceso a operaciones asociadas al usuario |
| Rendimiento | Separación de responsabilidades entre API y PostgreSQL, medición mediante k6 y análisis diferenciado por endpoint y flujo |
| Mantenibilidad | Organización por rutas → controladores → servicios → repositorios → configuración de base de datos |
| Usabilidad | Frontend separado de la lógica de persistencia, consumiendo la API mediante endpoints definidos |
| Disponibilidad | Dependencia explícita de la API y PostgreSQL; requiere pruebas específicas de disponibilidad y recuperación |

## 6. Inventario inicial de riesgos

Los riesgos se identifican a partir del sistema actual y de la evidencia disponible en las pruebas y documentación. Se evita mantener riesgos que dependían específicamente de Firebase como arquitectura activa.

| ID | Riesgo | Causa | Impacto | Probabilidad | Nivel | Mitigación inicial | Estado |
|---|---|---|---|---|---|---|---|
| R-01 | Degradación del rendimiento del flujo completo bajo concurrencia | El escenario k6 de 50 VUs ejecuta autenticación y múltiples operaciones consecutivas y presenta latencias elevadas en varios endpoints | Puede afectar la experiencia del usuario y el cumplimiento de los objetivos de rendimiento | Alta | Alto | Analizar tiempos por capa, consultas PostgreSQL, pool de conexiones y costo de autenticación; repetir pruebas después de optimizaciones | Abierto |
| R-02 | Latencia elevada en autenticación bajo concurrencia | El login con bcrypt forma parte del flujo completo y presenta un P95 cercano a 18 s en la prueba actual | El inicio de sesión puede convertirse en un punto de degradación del flujo completo | Alta | Alto | Medir por separado el costo de bcrypt y de la consulta de usuario, revisar concurrencia y configuración del proceso de autenticación | Abierto |
| R-03 | Diferencia entre rendimiento de endpoint aislado y flujo real | `/api/recetas` presenta buen comportamiento en la prueba aislada, pero el flujo completo muestra latencias mayores | Una medición aislada puede ocultar problemas que aparecen al combinar autenticación y múltiples operaciones | Alta | Alto | Mantener pruebas independientes y pruebas de recorrido completo como escenarios complementarios | Abierto |
| R-04 | Ausencia de una suite completa de pruebas automatizadas | Las pruebas k6 validan rendimiento, pero no sustituyen pruebas unitarias e integración para toda la lógica | Puede dificultar la detección temprana de regresiones | Media | Medio | Incorporar pruebas automatizadas para servicios, repositorios, autenticación y endpoints críticos | Abierto |
| R-05 | Acoplamiento incorrecto entre capas | Cambios que mezclen responsabilidades de rutas, controladores, servicios o repositorios pueden aumentar el acoplamiento | Reduce mantenibilidad y dificulta localizar problemas de rendimiento o funcionalidad | Media | Medio | Mantener y documentar los límites de cada capa y revisar dependencias en cambios futuros | Abierto |
| R-06 | Dependencia de una instancia de PostgreSQL | La persistencia actual está centralizada en PostgreSQL | Una falla de la instancia puede afectar las funciones que requieren datos persistentes | Media | Alto | Definir respaldos, recuperación y procedimientos de restauración como parte de la operación del sistema | Abierto |
| R-07 | Falta de pruebas de disponibilidad y recuperación | Las pruebas actuales se concentran principalmente en funcionalidad y rendimiento | No permite caracterizar cuantitativamente el comportamiento ante fallos o interrupciones | Media | Medio | Diseñar pruebas de disponibilidad, recuperación y comportamiento ante caída de PostgreSQL/API | Abierto |
| R-08 | Ausencia de medición prolongada de carga | Las pruebas actuales tienen una duración corta y no constituyen una prueba de soak prolongada | No permite detectar degradaciones asociadas a ejecuciones de larga duración | Media | Medio | Incorporar escenarios de carga sostenida cuando el alcance de la evaluación lo requiera | Abierto |
| R-09 | Riesgo de exposición de contenido no sanitizado en el frontend | El uso de contenido dinámico en la interfaz requiere controlar cualquier dato que pueda provenir del usuario o de fuentes no confiables | Una representación insegura podría introducir vulnerabilidades de XSS | Media | Alto | Validar y sanitizar contenido dinámico y evitar insertar datos no confiables directamente como HTML | Abierto |
| R-10 | Ausencia de mecanismos específicos contra abuso del login | El endpoint de autenticación puede recibir múltiples solicitudes concurrentes | Puede aumentar el costo computacional del proceso de autenticación y facilitar intentos repetidos de acceso | Media | Medio | Evaluar rate limiting, controles de intentos y monitoreo del endpoint de autenticación | Abierto |

### 6.1 Criterio de valoración

La probabilidad y el impacto se clasifican cualitativamente como Baja, Media o Alta. El nivel del riesgo combina ambos factores y se utiliza para identificar aspectos que requieren seguimiento.

Los riesgos R-01, R-02 y R-03 se relacionan directamente con la evidencia obtenida mediante k6. Los riesgos R-05, R-06 y R-07 corresponden a propiedades operativas y arquitectónicas de la solución actual que requieren seguimiento. Los riesgos de seguridad deben validarse mediante pruebas específicas y no deben darse por cubiertos únicamente por utilizar JWT.

### 6.2 Riesgos prioritarios

Los riesgos que requieren mayor atención inicialmente son:

1. **R-01 — Degradación del rendimiento del flujo completo bajo concurrencia.**
2. **R-02 — Latencia elevada en autenticación bajo concurrencia.**
3. **R-03 — Diferencia entre rendimiento de endpoint aislado y flujo real.**
4. **R-06 — Dependencia de una instancia de PostgreSQL.**

Estos riesgos se relacionan directamente con la arquitectura actual y con la evidencia de las pruebas realizadas. La priorización no implica que los demás riesgos sean inexistentes, sino que requieren seguimiento adicional según el alcance de las siguientes iteraciones.

## 7. Supuestos

- Se considera PostgreSQL como el sistema de persistencia actual de CookSmart.
- Se considera Node.js/Express como el backend activo.
- Se considera que el frontend consume la API propia mediante HTTP.
- Se considera que JWT y bcrypt forman parte del mecanismo actual de autenticación.
- Se considera que la arquitectura evaluada es monolítica modular por capas y no una arquitectura de microservicios.
- Firebase, Redis, API Gateway y un motor de IA no se consideran componentes activos de la arquitectura actual, salvo que exista evidencia posterior de su incorporación.
- Los resultados de k6 dependen del entorno de ejecución y de las condiciones concretas del escenario; no deben extrapolarse directamente a producción.

## 8. Hipótesis de riesgo arquitectónico principal

**Hipótesis de riesgo arquitectónico principal:** La principal preocupación arquitectónica observable en el sistema actual es el comportamiento de la cadena frontend → API → PostgreSQL bajo concurrencia, especialmente cuando el flujo incluye autenticación y múltiples operaciones consecutivas. La evidencia de k6 muestra que una consulta aislada de recetas puede mantener tiempos inferiores al umbral definido, mientras que el recorrido completo presenta degradación significativa. Por ello, el análisis debe continuar descomponiendo el tiempo de respuesta por operación y por capa antes de atribuir la causa exclusivamente a PostgreSQL.

## 9. Qué todavía no ha sido verificado

- Comportamiento de disponibilidad durante periodos prolongados.
- Recuperación automática ante caída de la API o PostgreSQL.
- Rendimiento de la base de datos mediante métricas internas de PostgreSQL durante las pruebas.
- Comportamiento con una duración de carga prolongada.
- Cobertura completa mediante pruebas unitarias e integración.
- Comportamiento en un entorno de producción con infraestructura equivalente a la de la evaluación.
- Impacto aislado de bcrypt frente al resto de operaciones del endpoint de login.

**VERIFICADO:** La prueba k6 `diagnostico.js`, con 50 VUs durante 20 segundos sobre `/api/recetas`, registró 0 % de errores y un P95 aproximado de 232,94 ms.

**VERIFICADO:** La prueba k6 `load-test.js`, con 50 VUs durante 20 segundos y un recorrido completo, registró 0 % de errores funcionales, pero un P95 global aproximado de 9,72 s. El login presentó un P95 aproximado de 17,93 s.

**VERIFICADO:** El flujo completo realizó 50 iteraciones y 500 solicitudes HTTP, con 100 % de checks exitosos. Esto demuestra que el problema observado en ese escenario es principalmente de rendimiento y no de errores HTTP o fallos funcionales de las comprobaciones realizadas.

## 10. Trazabilidad

- Repositorio: https://github.com/gameover2182/Cooksmart.git
- Arquitectura actual: frontend web + Node.js/Express + PostgreSQL.
- Documentación relacionada:
  - `docs/05-c4-contexto.md`
  - `docs/06-c4-contenedores.md`
  - `docs/07-c4-componentes.md`
  - `docs/ADR-001-estilo-arquitectonico.md`
  - `docs/ADR-002-limites-modulos-dependencias.md`
  - `docs/02-Escenarios-de-calidad.md`
- Evidencia de rendimiento:
  - `k6-demo/diagnostico.js`
  - `k6-demo/load-test.js`
- Los resultados de k6 deben interpretarse junto con las condiciones específicas de cada experimento y no como una medición universal del sistema.
