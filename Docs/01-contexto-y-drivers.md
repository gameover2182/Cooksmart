# Contexto y Drivers Arquitectónicos Preliminares

## 1. Identificación y alcance del sistema

**HECHO VERIFICADO (repo):** CookSmart es una aplicación web estática (HTML/CSS/JS) con las siguientes vistas: registro, login, dashboard, mi-nevera, recetas (con filtros por rápido, vegetariano, desayunos, almuerzos, cenas), favoritos y perfil. La autenticación y persistencia de datos se manejan mediante Firebase Auth y Firebase Realtime Database (`firebase-sync.js`, `recetas-db.js`).

**HECHO VERIFICADO (proyecto, fase inicial):** El objetivo funcional es generar recetas personalizadas usando exclusivamente los ingredientes disponibles en la nevera del usuario, dirigido a familias de ingresos medios en Bogotá.

**DECISIÓN DE EQUIPO (confirmada):** La arquitectura de microservicios del proyecto (fase inicial) se documenta como Roadmap / Trabajo futuro, no como parte del alcance evaluado en este dossier. El alcance de Semana 1-4 es el sistema real: HTML/CSS/JS estático + Firebase.

## 2. Contexto

**HECHO VERIFICADO (proyecto, fase inicial, FAO 2019):** El proyecto responde a que una proporción significativa de los residuos sólidos en Bogotá corresponde a alimentos aún no vencidos, y a tres causas identificadas por el equipo: falta de planificación de comidas, desconocimiento de recetas con ingredientes disponibles, y compras impulsivas.

**HECHO VERIFICADO (encuesta propia, n=18):** Solo 1 de 18 encuestados usa alguna vez una app para planificar comidas; 16 de 18 se muestran dispuestos o muy dispuestos a usar una plataforma como CookSmart.

## 3. Stakeholders y sus preocupaciones

| Stakeholder | Qué espera del sistema | Tensión con otros stakeholders |
|---|---|---|
| Usuario final (familias de ingresos medios, Bogotá) | Recetas usando solo lo que ya tiene, alertas de vencimiento, rapidez (RNF01, RNF04) | Quiere simplicidad sin registro complejo vs. necesidad de guardar datos personales |
| Profesor / evaluador del curso de Arquitectura | Evidencia verificable en Git de decisiones arquitectónicas reales | El proyecto (fase inicial) documenta arquitectura no implementada — riesgo directo aquí |
| Equipo desarrollador | Sistema simple de mantener sin backend propio | Tensión con el plan de pruebas extenso del proyecto (fase inicial), que asume backend real |
| Firebase (proveedor externo) | — | Dependencia total: sin Firebase, el sistema no tiene backend ni autenticación |

> **Pendiente:** confirmar si los competidores (SuperCook, Allrecipes) mencionados en el documento del proyecto aplican como stakeholders o solo como referencia de mercado.

## 4. Restricciones

**HECHO VERIFICADO (repo):** Sin backend propio. Sin base de datos relacional. Proyecto académico con entrega en semana 4.

**HECHO VERIFICADO (confirmado por el equipo):** Firebase está en el plan gratuito (Spark). Presupuesto $0 es una restricción real, no un supuesto.

**SUPUESTO:** El proyecto (fase inicial) asume MySQL/PostgreSQL, Redis y un Motor de IA (Claude) como parte de la arquitectura — esto no está confirmado como restricción real, sino como diseño propuesto no implementado.

## 5. Drivers arquitectónicos preliminares

### 5.1 Requerimientos funcionales verificados (evidencia de que el sistema funciona)

Esto **no son drivers arquitectónicos** — son funcionalidades (features) del sistema, confirmadas por el equipo como operativas hoy:

| Código | Nombre | Estado real |
|---|---|---|
| RF01 | Registro de usuario | Funciona |
| RF02 | Inicio y cierre de sesión | Funciona |
| RF03 | Visualización de perfil | Funciona |
| RF04 | Registro de ingredientes en la nevera | Funciona de manera efectiva |
| RF05 | Recomendación de recetas | Funciona |
| RF06 | Notificación de vencimiento | Funciona |
| RF08 | Eliminación de ingredientes | Funciona |
| RF09 | Filtrado de recetas por categoría | Funciona |

### 5.2 Drivers arquitectónicos preliminares priorizados

Los siguientes drivers representan las fuerzas que pueden condicionar decisiones arquitectónicas del sistema. Se priorizan según el impacto que tendría su incumplimiento sobre los usuarios, el funcionamiento del sistema y el alcance académico del proyecto.

| Prioridad | Código | Driver         | Justificación                                                                                                                                                                                            | Estado actual                                                                                                            |
| --------- | ------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1         | RNF02  | Seguridad      | CookSmart maneja cuentas de usuario e información almacenada en Firebase. Una configuración incorrecta de las reglas de seguridad podría permitir acceso no autorizado a los datos.                      | Configurado y verificado parcialmente; las reglas dependen de Firebase                                                   |
| 2         | RNF01  | Usabilidad     | El sistema está dirigido a usuarios que necesitan encontrar recetas e ingresar ingredientes de manera sencilla y rápida. Una interfaz compleja afectaría directamente el objetivo funcional del sistema. | Funciona; se identificaron oportunidades de mejora en la organización de la interfaz                                     |
| 3         | RNF04  | Rendimiento    | Las operaciones principales, como autenticación y registro de ingredientes, deben responder en tiempos adecuados para que el usuario pueda utilizar el sistema de manera fluida.                         | Se observa respuesta rápida en las pruebas funcionales; la medición cuantitativa se realizará mediante k6 en el Módulo 2 |
| 4         | RNF03  | Disponibilidad | La autenticación y persistencia dependen de Firebase. Una indisponibilidad del servicio externo puede impedir el acceso o la gestión de información del usuario.                                         | No se ha realizado una prueba específica de disponibilidad                                                               |
| 5         | RNF05  | Compatibilidad | CookSmart se ejecuta como aplicación web y debe mantener su funcionamiento en los navegadores utilizados por los usuarios.                                                                               | Verificado en los navegadores probados                                                                                   |

#### Criterio de priorización

La prioridad se estableció considerando primero los atributos cuyo incumplimiento tendría mayor impacto sobre los datos y la operación básica del sistema. Por esta razón, Seguridad ocupa el primer lugar. Usabilidad ocupa el segundo debido a que la interacción sencilla es fundamental para el propósito de CookSmart. Rendimiento y Disponibilidad se priorizan posteriormente porque afectan directamente la experiencia y continuidad del servicio, mientras que Compatibilidad tiene un impacto menor dentro del alcance actual.

#### Trazabilidad hacia decisiones futuras

| Driver         | Decisión arquitectónica que deberá responder                                       |
| -------------- | ---------------------------------------------------------------------------------- |
| Seguridad      | Configuración de autenticación, reglas de Firebase y límites de acceso a los datos |
| Usabilidad     | Organización de funcionalidades y flujo de navegación                              |
| Rendimiento    | Medición de tiempos de respuesta y evaluación de posibles optimizaciones           |
| Disponibilidad | Evaluación de la dependencia de Firebase y posibles estrategias de recuperación    |
| Compatibilidad | Validación del comportamiento en navegadores objetivo                              |


## 6. Riesgos iniciales

**RIESGO VERIFICADO:** El sistema real no tiene tests automatizados, a pesar de que el proyecto (fase inicial) documenta un plan de QA extenso (pruebas unitarias, integración, rendimiento, seguridad) que no se ha ejecutado. Esto es evidencia faltante crítica para el checkpoint de Semana 2.

**RIESGO VERIFICADO:** RF07 (Historial de recetas) está documentado en el proyecto (fase inicial) pero **no está implementado** en el sistema real — es evidencia faltante, no una funcionalidad verificada.

**RIESGO VERIFICADO (confirmado por el equipo):** Las reglas de seguridad de Firebase (Firebase Security Rules) están configuradas y son administradas exclusivamente desde la cuenta de correo de un solo integrante (Leonardo). Esto es un punto único de fallo: si esa persona no está disponible, el resto del equipo no puede modificar la seguridad de la base de datos ni verificar su configuración de forma independiente. Este riesgo se relaciona directamente con el driver de Seguridad (RNF02).

## 7. Supuestos

- Se asume que Firebase Realtime Database es la única persistencia de datos (sin backend intermedio).
- Se asume que las recetas mostradas son estáticas/curadas por el equipo, no generadas por IA en tiempo real (el proyecto, fase inicial, menciona un "Motor IA / Claude" en el diagrama de secuencias que no está confirmado como implementado en el sistema real).

## 8. Referencia a la hipótesis inicial

**Hipótesis de riesgo arquitectónico principal:** El principal riesgo arquitectónico del sistema actual es la dependencia de Firebase para la autenticación y persistencia de datos. Una indisponibilidad, configuración incorrecta o cambio en este servicio podría afectar directamente el acceso de los usuarios y la gestión de la información, debido a que el sistema actual no cuenta con un backend propio que desacople estas responsabilidades.

## 9. Qué todavía no ha sido verificado

- Commit/versión exacta que se va a evaluar en la entrega final.
- Evidencia de pruebas automatizadas del sistema, ya que actualmente no se cuenta con tests automatizados.

**VERIFICADO:** El sistema se ejecuta correctamente y sus funcionalidades principales fueron probadas, funcionando de manera adecuada durante la revisión del proyecto.

**VERIFICADO:** El repositorio cuenta con un workflow de GitHub Actions que ejecuta validaciones automáticas sobre la estructura y los archivos principales de CookSmart en los `push` a `main` y Pull Requests dirigidos a `main`. La ejecución del workflow fue verificada correctamente.

## 10. Trazabilidad
- Repositorio: https://github.com/gameover2182/Cooksmart.git
- Este documento fue commiteado como parte del primer commit del proyecto (contexto y drivers).
- La CI se encuentra implementada mediante GitHub Actions en `.github/workflows/`.