# ADR 2: Límites de módulos y reglas de dependencia

**Estado:** Propuesto — pendiente de veredicto del mini-comité (Semana 8)

## Contexto

Una vez adoptado el monolito modular por capas (`ADR-001-estilo-arquitectonico.md`), es necesario definir reglas concretas y verificables de qué módulo puede depender de cuál, para que la separación de capas no quede solo como intención documental. Sin estas reglas explícitas, cualquier integrante puede volver a mezclar responsabilidades — por ejemplo, llamando a Firebase directamente desde una página HTML — sin que eso se detecte como una desviación de la arquitectura.

## Decisión

Se establecen las siguientes reglas de dependencia, obligatorias para todo código nuevo y objetivo de refactor para el código existente:

| # | Regla |
|---|---|
| 1 | Ningún archivo `.html` ni script embebido en una página puede importar o llamar directamente a `firebase-sync.js`. Debe pasar por una función expuesta en la capa de dominio (`recetas-db.js` o `script.js`). |
| 2 | `firebase-sync.js` es el **único** módulo autorizado para leer o escribir en Firebase Realtime Database y para invocar Firebase Authentication. |
| 3 | `themealdb.js` es el único módulo autorizado para llamar a la API externa de TheMealDB. No puede ser invocado desde la capa de presentación. |
| 4 | La capa de dominio (`script.js`, `recetas-db.js`) no manipula el DOM directamente; esa responsabilidad es exclusiva de la capa de presentación. |
| 5 | Ningún módulo de acceso a datos (`firebase-sync.js`, `themealdb.js`) puede depender de la capa de dominio ni de la de presentación — la dependencia es de arriba hacia abajo únicamente. |

## Implicaciones de seguridad

Concentrar el acceso a Firebase en un único módulo (`firebase-sync.js`) tiene un impacto directo sobre el driver de Seguridad (prioridad 1) y sobre los riesgos ya documentados:

- **Mitiga R-03 parcialmente:** aunque la administración de las reglas de seguridad de Firebase sigue dependiendo de una sola cuenta, tener un único punto de código que las consume facilita que cualquier integrante audite o modifique ese acceso sin tener que rastrear llamadas a Firebase dispersas por todo el proyecto.
- **Reduce la superficie de error:** si las credenciales o la configuración de Firebase cambian, solo un archivo necesita actualizarse, en lugar de buscar referencias repetidas en múltiples páginas HTML.
- **Facilita la trazabilidad de auditoría:** ante un incidente de seguridad, revisar `firebase-sync.js` permite reconstruir qué operaciones de lectura/escritura pudo haber ejecutado el cliente, sin depender de revisar todo el código fuente.
- **No resuelve por sí sola R-04** (dependencia total de Firebase como proveedor externo): esa es una decisión de disponibilidad, no de organización del código, y queda fuera del alcance de este ADR.

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Permitir llamadas directas a Firebase desde cualquier capa (estado actual) | Es la causa raíz del problema que este ADR resuelve: sin un punto único, no hay forma de auditar ni controlar el acceso a datos. |
| Definir las reglas de dependencia mediante una herramienta automática de *fitness functions* (lint de arquitectura) | Valioso, pero corresponde al Módulo 6 según el roadmap del curso (mencionado como nivel avanzado del M4); en esta etapa las reglas se documentan y se verifican manualmente en revisión de PR. |

## Consecuencias

**Se gana:** un contrato claro y verificable de qué módulo puede llamar a cuál, y una mitigación parcial y documentada de R-03.

**Se sacrifica:** verificación manual por ahora (no automatizada), lo que depende de la disciplina del equipo en revisión de PR hasta que exista una fitness function.

**Queda pendiente:** automatizar la verificación de estas reglas como fitness function en el Módulo 6, tal como se sugiere en el nivel avanzado de este módulo.

## Relacionado con

- `ADR-001-estilo-arquitectonico.md`
- Driver: Seguridad (prioridad 1) — `01-contexto-y-drivers.md`
- Riesgos: R-03, R-04 — `01-contexto-y-drivers.md`

## Veredicto del mini-comité (completar en Semana 8)

- **Rol que evaluó:** _pendiente_
- **Veredicto:** _pendiente — Confirmada / Ajustada / Reconsiderada_
- **Observaciones del comité:** _pendiente_