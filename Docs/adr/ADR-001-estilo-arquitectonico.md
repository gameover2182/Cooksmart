# ADR 1: Adopción de monolito modular por capas

**Estado:** Propuesto — pendiente de veredicto del mini-comité (Semana 8)

## Contexto

CookSmart es hoy una aplicación web estática (HTML, CSS, JavaScript) que usa Firebase Authentication y Firebase Realtime Database como único backend. No existe servidor propio ni base de datos relacional. El equipo está compuesto por 2-3 estudiantes con un alcance académico de 8 semanas.

El código actual no tiene una separación formal de responsabilidades: la lógica de presentación, la lógica de negocio y el acceso a Firebase pueden mezclarse dentro de las mismas páginas HTML o scripts, lo que dificulta mantener, auditar y extender el sistema, y agrava el riesgo **R-03** (un solo integrante administra las reglas de seguridad de Firebase) al no existir un punto único y claro de acceso a datos.

Es necesario decidir un estilo arquitectónico que ordene el crecimiento del código sin introducir infraestructura que el equipo no puede sostener.

## Decisión

Se adopta un **monolito modular por capas**, con tres capas de responsabilidad única:

1. **Presentación** — páginas `.html` y `style.css`.
2. **Dominio/lógica** — `script.js`, `recetas-db.js`.
3. **Acceso a datos** — `firebase-sync.js` (Firebase) y `themealdb.js` (API externa de recetas).

La dependencia solo puede fluir en una dirección: Presentación → Dominio → Acceso a datos. Nunca al revés, y nunca saltando una capa.

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Microservicios (arquitectura del PDF de fase inicial) | Requiere backend propio, API Gateway, base de datos relacional y orquestación — infraestructura inexistente y no sostenible para un equipo de 2-3 personas en 8 semanas. Ya descartado como alcance evaluado desde el Módulo 1. |
| Arquitectura hexagonal/limpia | El sistema tiene un único adaptador externo real (Firebase) y lógica de dominio simple; el costo de las abstracciones de puertos/adaptadores no se justifica en este alcance. |
| Mantener el estado actual sin estructura definida | Es exactamente la causa del riesgo que este ADR busca mitigar; sin reglas de dependencia, el código tiende al antipatrón *Big Ball of Mud*. |

## Consecuencias

**Se gana:**
- Un único punto auditable de acceso a Firebase (`firebase-sync.js`), lo que facilita mitigar R-03 y R-04.
- Código más fácil de extender sin depender de infraestructura adicional.
- Compatibilidad total mantenida: sigue siendo HTML/CSS/JS plano, sin build ni servidor.

**Se sacrifica:**
- No hay aislamiento fuerte entre módulos (como daría hexagonal): un cambio en el "contrato" de una capa puede seguir propagándose si no se disciplina el equipo.
- Esta decisión no resuelve el riesgo R-01 (ausencia de pruebas automatizadas); solo ordena el código para que, cuando existan pruebas, sea más fácil aislar qué probar.

**Queda pendiente:**
- Refactorizar el código existente que hoy viola la separación de capas (no se hace en este módulo; se documenta como deuda técnica).
- Veredicto del mini-comité de la Semana 8: confirmar, ajustar o reconsiderar esta decisión.

## Relacionado con

- Drivers: Seguridad (prioridad 1), Compatibilidad (prioridad 5) — ver `01-contexto-y-drivers.md`.
- Riesgos: R-03, R-04 — ver `01-contexto-y-drivers.md`.
- Documento de soporte: `08-decision-estilo-arquitectonico.md`.
- Ver también: `ADR-002-limites-modulos-dependencias.md`.

## Veredicto del mini-comité (completar en Semana 8)

- **Rol que evaluó:** _pendiente_
- **Veredicto:** _pendiente — Confirmada / Ajustada / Reconsiderada_
- **Observaciones del comité:** _pendiente_