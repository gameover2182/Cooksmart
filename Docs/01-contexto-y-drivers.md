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

### 5.2 Drivers arquitectónicos (atributos de calidad / requerimientos no funcionales)

Estos sí son los drivers arquitectónicos preliminares: fuerzas que moldean decisiones de diseño, no funcionalidades puntuales.

| Código | Driver | Estado real |
|---|---|---|
| RNF02 | Seguridad | Documentado en el proyecto (fase inicial): protección de datos personales, cumplimiento de normativa colombiana, política de privacidad |
| RNF01 | Usabilidad | Funciona, ingreso fácil, aunque falta más organización en la interfaz |
| Disponibilidad (el documento original usa el código "RF03" para esto, pero es un requisito no funcional — pendiente renombrar a RNF03 para no duplicar el código RF03) | Disponibilidad | En teoría funciona sin mayor complicación |
| Rendimiento (el documento original usa el código "RF04" para esto, pero es un requisito no funcional — pendiente renombrar a RNF04) | Rendimiento | Responde rápido al crear usuario y registrar ingredientes, incluso sin backend propio |
| RNF05 | Compatibilidad con navegadores | Funciona en los navegadores probados |

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