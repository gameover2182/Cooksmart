# Uso de IA en el Módulo 5 — auditoría de eventos y registro de delegación

> El sílabo exige: (1) pedir a la IA un catálogo de eventos y **filtrar reales, inventados, redundantes o innecesarios** contra el dominio real; (2) declarar qué se delegó, qué se aceptó/rechazó y **qué no se alcanzó a verificar**.

## 1. Herramienta y sesión

| Campo | Valor |
|---|---|
| Herramienta | Claude Code (modelo Claude Opus 5.5), extensión de VS Code |
| Fecha | 2026-10-04 |
| Rama | `leo` |
| Integrante que operó la sesión | Leonardo Juan Pablo Leon Robelto |
| Insumos entregados a la IA | Repositorio completo (código del backend, frontend, `docs/01…10`, ADR-001/002, scripts k6) y las guías del módulo (prompts "I-C-T-O") |

## 2. Actividad: catálogo de eventos propuesto por IA y filtro

### 2.1 Prompt utilizado

```
A partir EXCLUSIVAMENTE del dominio y flujos que te proporcionaré,
genera EVENTOS CANDIDATOS.
Para cada candidato indica: hecho que representa; evidencia del input que
sugiere que ese hecho existe; productor potencial; posibles interesados;
información mínima asociada; nivel de confianza.
No conviertas automáticamente métodos CRUD, clics de UI ni detalles técnicos
en eventos de dominio.
Clasifica cada propuesta como: A) respaldada directamente por evidencia,
B) inferencia plausible, C) especulativa.
No decidas cuáles debo implementar.
```

### 2.2 Salida de la IA (12 candidatos) y filtro del equipo

| # | Evento propuesto por IA | Clasif. IA | Productor / interesados (según IA) | Evidencia real en el repo | Veredicto del equipo | Motivo | Verificación hecha |
|---|---|---|---|---|---|---|---|
| 1 | `FavoritoAgregado` | A | BC5 → (nadie) | `POST /favoritos`, usado por `auth-sync.js` | **Real, sin consumidor** | El hecho ocurre, pero ningún contexto reacciona. No se publica como evento. | `grep` de consumidores de favoritos fuera de BC5: ninguno |
| 2 | `FavoritoQuitado` | A | BC5 → (nadie) | `DELETE /favoritos/:idReceta` | **Real, sin consumidor** | Ídem 1 | Ídem 1 |
| 3 | `RecetaPreparada` | B | BC5 → BC3 (descontar nevera) | `POST /historial` existe; **descuento de nevera no existe**; ninguna página llama a historial | **Condicionado (H1)** | Es el único con un interesado plausible en otro contexto, pero el requisito no existe | Lectura de `historial.service.js`: solo `INSERT` |
| 4 | `IngredienteProximoAVencer` | B | BC3 → notificador | Lógica en `mi-nevera.html` (≤ 3 días) | **Plausible, no demostrado** | Requiere RF06 en backend (H2) | `grep vencimiento` en backend: solo columna y `ORDER BY` |
| 5 | `IngredienteAgregadoANevera` | A | BC3 → BC4 | `POST /inventario` | **Rechazado (CRUD sin consumidor)** | El endpoint no tiene consumidores en el frontend; BC4 lee `localStorage` | `grep "/inventario"` en `*.html`, `*.js`: sin resultados |
| 6 | `IngredienteEliminadoDeNevera` | A | BC3 → BC4 | `DELETE /inventario/:id` | **Rechazado (CRUD sin consumidor)** | Ídem 5 | Ídem 5 |
| 7 | `UsuarioRegistrado` | A | BC1 → BC3 (nevera inicial), correo de bienvenida | `POST /auth/registro` | **Rechazado (innecesario)** | No existe nevera inicial ni envío de correos; los "interesados" los inventó la IA | Lectura de `auth.service.registrar` |
| 8 | `UsuarioInicioSesion` | A | BC1 → auditoría | `POST /auth/login` | **Rechazado (técnico)** | Es un hecho de seguridad, no de dominio | — |
| 9 | `PreferenciasActualizadas` | A | BC1 → BC4 | `PATCH /auth/me/preferencias` | **Rechazado (redundante)** | BC4 ya consulta `/auth/me` cuando lo necesita; un evento duplicaría el canal | `index.html` ≈ 1295 |
| 10 | `RecetaPublicada` | C | BC2 → BC4 | Ninguna: no hay escritura del catálogo | **Rechazado (inventado)** | El catálogo solo cambia por *seed* | `recetas.routes.js`: solo `GET` |
| 11 | `RecetaConsultada` | B | BC2 → analítica | `GET /recetas/:id` | **Rechazado (técnico / CRUD)** | Una lectura no es un hecho de negocio; la "analítica" no existe | — |
| 12 | `RecomendacionGenerada` | C | BC4 → BC5 | Ninguna en backend | **Rechazado (inventado)** | BC4 no existe en el servidor | `grep match` en backend: sin resultados |

**Resumen del filtro:** 2 reales sin consumidor · 1 condicionado · 1 plausible no demostrado · 8 rechazados (2 CRUD sin consumidor, 1 innecesario, 1 técnico, 1 redundante, 2 inventados, 1 técnico/CRUD).

**Patrón de error de la IA observado:** la IA tiende a (a) convertir cada endpoint de escritura en un evento (#5, #6, #8) y (b) inventar **interesados** plausibles que no existen en el sistema (#7: "correo de bienvenida", #11: "analítica"). La clasificación "A" de la IA medía que el *hecho* existe, no que exista un *consumidor*, que es lo que justifica un evento.

## 3. Registro de delegación del Módulo 5 (qué hizo la IA y qué se decidió)

| Entregable | Qué hizo la IA | Qué debe validar/decidir el equipo | Estado |
|---|---|---|---|
| Inventario del sistema (`docs/dominio/mapa-dominio.md` §1) | Extrajo responsabilidades del código y detectó 5 hallazgos (nevera en `localStorage`, recomendación en cliente, contrato sin `ingredientes`, favoritos asíncronos accidentales, base compartida) | Confirmar hallazgos abriendo los archivos citados | Hallazgo 3 **verificado con `curl`**; los demás verificados por lectura de código |
| Fronteras de contexto (§6) | **Redactó una propuesta** de 5 contextos | **Decisión del equipo**: aceptar, ajustar o rechazar; cada integrante debe poder defenderla | Pendiente de revisión del equipo |
| Context Map | Construyó la matriz de relaciones con evidencia y separó hipotéticas | Revisar patrones asignados (OHS, Customer/Supplier, Shared Kernel) | Pendiente de revisión del equipo |
| Comparación sync/async y contrato | Redactó la comparación y el OpenAPI (validado con `redocly lint`: válido, 8 advertencias menores) | Revisar política de versionamiento | OpenAPI verificado sintácticamente |
| Hipótesis del Spike 1 | **Redactó la hipótesis y criterios** a pedido del integrante | La guía del curso indica que la hipótesis la debe escribir el equipo: **el equipo debe revisarla y asumirla como propia o reemplazarla antes de la sustentación** | Commiteada antes de ejecutar (verificable por orden de commits) |
| Implementación del spike | Implementó el *flag* `FAVORITOS_MODO` y el script k6 dentro del alcance pre-registrado | Revisar el diff del commit de implementación | `f5d2506`: 4 archivos, todos dentro del alcance; revertido tras el veredicto |
| Ejecución y resultados | Ejecutó las corridas, calculó medianas y aplicó la regla de veredicto pre-registrada | Revisar los JSON crudos y recalcular las medianas | `e4135e9`; veredicto **AJUSTADA** (Δ = 41,5 %, consistencia 54,67 %). La IA **no** eligió la regla después de ver los datos: la regla está en `912fd90` |
| ADR-003 | Redactó el ADR a partir del veredicto | Auditar contra la checklist del curso (una decisión, ≥ 2 alternativas, costos, consecuencias +/−, reversibilidad, supuestos con condición de revisión, referencia al spike) | Pendiente de revisión del equipo |
| Análisis CQRS/ES | Redactó la tabla de aplicabilidad y la conectó con el spike | Llenar/confirmar la columna "Decisión del equipo" | Pendiente de revisión del equipo |

## 4. Qué NO se alcanzó a verificar

- Que la nevera en `localStorage` sea la **única** fuente usada en todas las páginas (se revisaron `mi-nevera.html`, `recetas.html` y `receta-detalle.html`; no `desayunos.html`, `almuerzos.html`, `cenas.html`, `rapido.html`, `vegetariano.html` en detalle).
- El comportamiento del spike con un broker real (RabbitMQ/Redis): **no se implementó** a propósito (fuera del alcance pre-registrado); la variante en memoria es el mejor caso para la hipótesis asíncrona.
- Resultados en otra máquina o en CI: todas las corridas se hicieron en un solo equipo local (ver `01-condiciones.md`).
- Significancia estadística del Δ de latencia: n = 3 por modo y los rangos de P95 se solapan.
- Pérdida de mensajes de la cola en memoria ante un reinicio de la API.
- Que los patrones DDD asignados en el Context Map coincidan con la interpretación del docente.
