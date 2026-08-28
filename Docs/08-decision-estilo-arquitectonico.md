# Decisión de Estilo Arquitectónico — CookSmart

## 1. Propósito

Este documento compara alternativas de estilo arquitectónico para CookSmart, selecciona una de forma justificada contra los drivers priorizados en `01-contexto-y-drivers.md`, y define el mapa modular objetivo que debe guiar la organización del código a partir de este punto.

**Alcance:** esta decisión aplica sobre el sistema real (frontend estático + Firebase), no sobre la arquitectura de microservicios documentada como Roadmap en el proyecto de fase inicial.

---

## 2. Estilos comparados

Se evaluaron tres alternativas contra los cinco drivers priorizados en el Módulo 1 (Seguridad, Usabilidad, Rendimiento, Disponibilidad, Compatibilidad).

| Estilo | Seguridad | Usabilidad | Rendimiento | Disponibilidad | Compatibilidad | Veredicto |
|---|---|---|---|---|---|---|
| **Monolito modular por capas** (UI / lógica de dominio / acceso a datos) | A favor — un único punto de acceso a Firebase facilita auditar y centralizar reglas | A favor — no agrega complejidad de navegación ni de despliegue | Neutro — no introduce latencia de red adicional entre "servicios" | Neutro — depende igual de Firebase, pero no suma nuevos puntos de falla | A favor — sigue siendo HTML/CSS/JS plano, compatible con cualquier navegador | **Elegido** |
| **Microservicios** (el propuesto en el PDF de fase inicial: Auth, Usuarios, Inventario, Recomendación, Notificaciones detrás de API Gateway) | En contra — más superficie de ataque (N servicios, N configuraciones de seguridad) sin equipo para administrarla | En contra — no aporta nada al usuario final, solo complejidad interna | En contra — introduce latencia de red entre servicios que hoy no existe | En contra — cada servicio es un nuevo punto de falla; hoy dependen de un solo proveedor (Firebase), no de N | En contra — exige backend, contenedores e infraestructura que el sistema real no tiene | **Descartado** |
| **Serverless con Firebase Cloud Functions** | A favor a futuro — permitiría mover lógica sensible fuera del cliente | Neutro | Neutro/Favorable a futuro | Neutro — sigue dependiendo de Firebase | A favor — mismo ecosistema ya usado | **Roadmap, no en este alcance** |

### Criterio de decisión

Se prioriza el estilo que exige el menor número de piezas nuevas de infraestructura para un equipo de 2-3 personas en un proyecto académico de 8 semanas, sin sacrificar el driver de mayor prioridad (Seguridad). El monolito modular por capas es el único de los tres que no requiere infraestructura que el equipo no tiene hoy (servidor propio, orquestador, gateway), y permite atacar directamente el riesgo **R-03** (un solo integrante administra las reglas de seguridad de Firebase) centralizando ese acceso en un módulo único y auditable.

---

## 3. Decisión de estilo arquitectónico

**Se adopta: Monolito modular por capas**, organizado en tres capas con responsabilidad única y dirección de dependencia fija:

```
┌─────────────────────────────┐
│   Capa de Presentación (UI)  │   index.html, recetas.html, mi-nevera.html,
│                               │   favoritos.html, perfil.html, registro.html,
│                               │   login.html, receta-detalle.html, rapido.html,
│                               │   desayunos.html, almuerzos.html, cenas.html,
│                               │   vegetariano.html, style.css
└───────────────┬───────────────┘
                │ solo puede llamar a la capa de dominio
                ▼
┌─────────────────────────────┐
│   Capa de Dominio/Lógica     │   script.js, recetas-db.js
│   (filtrado, recomendación,  │
│   reglas de negocio)         │
└───────────────┬───────────────┘
                │ solo puede llamar a la capa de acceso a datos
                ▼
┌─────────────────────────────┐
│  Capa de Acceso a Datos      │   firebase-sync.js, themealdb.js
│  (único punto de contacto    │
│  con servicios externos)     │
└─────────────────────────────┘
```

### Motivo (verificado contra el repo actual)

**HECHO VERIFICADO (repo):** hoy no existe esta separación estricta — algunas páginas HTML llaman lógica de negocio y acceso a datos de forma mezclada. Esta decisión formaliza hacia dónde debe evolucionar el código, no describe el estado actual como si ya cumpliera la regla.

---

## 4. Alternativas descartadas y motivo

| Alternativa | Motivo de descarte |
|---|---|
| Microservicios (PDF de fase inicial) | Sobreingeniería: exige backend, API Gateway, base de datos relacional y orquestación que el sistema real no tiene ni necesita para su alcance actual. Ya fue descartado como alcance evaluado desde el M1. |
| Arquitectura hexagonal/limpia completa | Aporta valor cuando hay lógica de dominio compleja y múltiples adaptadores de entrada/salida. CookSmart tiene un solo adaptador externo (Firebase) y lógica de dominio simple (filtrado de recetas), por lo que el costo de abstracción no se justifica todavía. |
| Sin estructura definida (estado actual) | Es la razón de que este módulo exista: sin reglas de dependencia explícitas, el código tiende al antipatrón *Big Ball of Mud* a medida que crecen las páginas HTML. |

---

## 5. Reglas de dependencia entre módulos

1. Ningún archivo `.html` ni su script embebido puede llamar directamente a `firebase-sync.js`; debe pasar por funciones de la capa de dominio (`recetas-db.js` / `script.js`).
2. `firebase-sync.js` es el **único** archivo autorizado para leer/escribir en Firebase Realtime Database o llamar a Firebase Authentication.
3. `themealdb.js` es el único punto de integración con la API externa de recetas (TheMealDB); no debe ser llamado desde la capa de presentación.
4. La capa de dominio no debe manipular el DOM directamente — esa responsabilidad es exclusiva de la capa de presentación.

Estas reglas quedan formalizadas en `ADR-002-limites-modulos-dependencias.md`.

---

## 6. Propuesta generada por IA y crítica del equipo

Se usó el siguiente prompt (mismo formato que en el Módulo 2):

```
Actúa como un arquitecto de software senior especializado en decisiones de
estilo arquitectónico (ADR) y trade-offs de arquitectura.

CONTEXTO DEL SISTEMA:
CookSmart es hoy una aplicación web estática (HTML/CSS/JS) con Firebase
Authentication y Firebase Realtime Database como único backend, sin
servidor propio, mantenida por un equipo de 2-3 estudiantes en un proyecto
académico de 8 semanas. Los drivers priorizados son: Seguridad, Usabilidad,
Rendimiento, Disponibilidad, Compatibilidad.

TAREA:
Recomienda un estilo arquitectónico para este sistema, justifícalo contra
los drivers, y describe el mapa modular que resultaría de aplicarlo.
```

**Respuesta generada por la IA (resumen):** recomendó un monolito modular por capas con separación presentación/dominio/acceso a datos, coincidiendo con el análisis del equipo. Adicionalmente propuso introducir una capa de "Servicio de Caché local" con `localStorage` para reducir lecturas a Firebase, y sugirió preparar el código para una eventual migración a Firebase Cloud Functions.

### Clasificación de la propuesta

| Elemento propuesto por la IA | Clasificación | Justificación |
|---|---|---|
| Monolito modular por capas (presentación/dominio/datos) | **Válido** | Coincide con el análisis independiente del equipo hecho en la sección 2-3 de este documento, antes de consultar la IA. |
| Capa de caché local con `localStorage` | **Modificado** | Es una idea razonable para el driver de Rendimiento, pero el equipo no la había definido como parte del alcance de este módulo. Se registra como mejora candidata para un módulo futuro, no como parte de esta decisión. |
| Preparar migración a Cloud Functions | **Modificado** | Coincide con lo que el equipo ya había identificado como Roadmap (tabla de la sección 2), pero la IA lo presenta como parte de la decisión actual en lugar de como trabajo futuro. Se mantiene fuera del alcance de este ADR. |

---

## 7. Trazabilidad

- Este documento sustenta las decisiones formalizadas en `ADR-001-estilo-arquitectonico.md` y `ADR-002-limites-modulos-dependencias.md`.
- Responde a los drivers definidos en `01-contexto-y-drivers.md` y a los riesgos R-01 a R-04 del mismo documento.
- Repositorio: https://github.com/gameover2182/Cooksmart.git