# API, eventos e integración — CookSmart (Módulo 5)

> **Entradas:** `docs/dominio/context-map.md` (relaciones E1–E7, H1–H4), escenarios de calidad (`docs/02`), matriz (`docs/04`), ADR-001/002.
> **Salidas que dependen de este documento:** Spike 1 (`experimentos/spike-01-integracion/`) y ADR-003.
>
> **Pregunta del módulo:** *"Un equipo propone usar eventos y CQRS para un CRUD simple. ¿Qué problema real resuelve? ¿Qué complejidad introduce?"* — Este documento la responde para CookSmart interacción por interacción, en lugar de elegir un mecanismo para todo el sistema.

---

## 1. Interacciones que merecen análisis

De las relaciones del Context Map, solo tienen sentido para sync/async las que **transportan una petición o un cambio de estado en runtime**:

| Interacción | Relación | ¿Por qué se analiza? |
|---|---|---|
| I1 · Alta/baja de favorito (UI → BC5) | E5 | Es la **única** escritura entre contextos que el frontend usa hoy, y ya se comporta como asíncrona de forma accidental |
| I2 · Carga del catálogo (BC2 → BC4) | E2 | Es la lectura más pesada (≈ 16 KB por carga, todas las recetas) y tiene una brecha de contrato |
| I3 · Validación de identidad (BC1 → BC3/BC5) | E1 | Está presente en toda petición protegida |
| I4 · Preparar receta → descontar nevera (BC5 → BC3) | H1 | **Hipotética**: es el caso de libro para un evento de dominio; se analiza para no inventarlo sin evidencia |

Se excluyen E4 (memoria compartida del navegador; no hay red) y E6/E7 (acoplamiento por base de datos; no hay mensaje que pueda ser síncrono o asíncrono).

## 2. Criterios de comparación (anclados a los drivers)

| Criterio | Driver / escenario | Pregunta concreta |
|---|---|---|
| Latencia percibida | RNF04, PR01/PR02 | ¿El usuario espera la respuesta para continuar? |
| Consistencia | RNF01 (usabilidad) | ¿Qué ve el usuario si lee justo después de escribir? |
| Disponibilidad / fallo parcial | RNF03, R-06, R-07 | ¿Qué pasa si el otro lado no está? |
| Acoplamiento | RNF06, ADR-002 | ¿Qué cambia en el otro contexto si cambio éste? |
| Complejidad operativa | Matriz: Escalabilidad y Observabilidad = **Baja**; equipo de 3 | ¿Qué infraestructura nueva hay que operar? |
| Observabilidad / depuración | Matriz: Observabilidad Baja | ¿Cómo sé que algo se perdió? |
| Reversibilidad | — | ¿Cuánto cuesta deshacer la decisión? |

## 3. Comparación síncrono vs asíncrono por interacción

### I1 · Alta/baja de favorito

| Criterio | A. Síncrono (REST, la API escribe y responde `201`) | B. Asíncrono (la API acepta `202`, encola y un consumidor escribe después) |
|---|---|---|
| Latencia | Incluye el `INSERT` en PostgreSQL | Excluye el `INSERT`; **ganancia esperada = costo del INSERT** (a medir) |
| Consistencia | Lectura tras escritura garantizada (misma transacción terminó) | Ventana de inconsistencia: un `GET` inmediato puede no ver el favorito; un `DELETE` inmediato puede llegar antes que el `INSERT` |
| Fallo parcial | Si PostgreSQL cae, el usuario recibe error y puede reintentar | Si PostgreSQL cae, la API dice "aceptado" y el favorito **se pierde** (cola en memoria) o requiere broker durable |
| Acoplamiento | Temporal (UI espera a BC5) | Desacople temporal; nuevo acoplamiento al broker/cola |
| Complejidad | Ninguna nueva | Cola, consumidor, reintentos, idempotencia, orden; con broker real: un contenedor más (RabbitMQ/Redis) |
| Observabilidad | El error vuelve en la respuesta | Errores en un proceso de fondo: hace falta log/DLQ para enterarse |
| Reversibilidad | — | Alta mientras sea un *flag*; baja si el frontend empieza a depender de `202` |

**Supuesto no verificado que decide esta interacción:** *¿el `INSERT` de un favorito es una parte significativa del tiempo de respuesta bajo carga?* Si no lo es, B paga toda su complejidad por casi nada. → **Esto es exactamente lo que mide el Spike 1.**

### I2 · Carga del catálogo

| Criterio | A. Síncrono (REST, hoy) | B. Asíncrono (catálogo empujado por eventos / réplica local) |
|---|---|---|
| Latencia | PR01: P95 ≈ 233 ms con 50 VUs (`diagnostico.js`) | Lectura local inmediata tras la primera sincronización |
| Consistencia | Siempre al día | Puede servir recetas desactualizadas |
| Necesidad real | El catálogo **no cambia en runtime** (solo vía `02_seed.sql`) | Un evento `RecetaPublicada` no tendría productor |
| Decisión | **Síncrono.** El problema real de I2 es el **contenido** del contrato (faltan `ingredientes`), no el mecanismo. Se corrige con versión de contrato (§4.4), no con eventos. | Descartado |

### I3 · Validación de identidad

Ya es la mejor variante posible para el alcance: **ni síncrona ni asíncrona en runtime**, porque el token autocontenido elimina la llamada a BC1. No hay alternativa que mejore un driver. **Se mantiene.**

### I4 · Preparar receta → descontar nevera (hipotética)

Si algún día existe, es el **único** candidato legítimo a evento de dominio (`RecetaPreparada`): el usuario no necesita esperar a que se descuente la nevera para ver confirmada su preparación, y BC3 no debería conocer a BC5. **Hoy no existe el requisito** (ver `docs/dominio/context-map.md` H1), así que no se diseña infraestructura para él; se deja como condición de revisión en ADR-003.

## 4. Contrato API (REST, v1) — se elige **API**, no catálogo de eventos

Decisión: CookSmart documenta un **contrato de API** porque todas las interacciones reales (I1–I3) son petición/respuesta. El catálogo de eventos se analiza en §5 solo para filtrarlo.

Contrato formal: [`docs/integracion/openapi-v1.yaml`](openapi-v1.yaml) (OpenAPI 3.0.3, nivel avanzado opcional del módulo). Resumen:

### 4.1 Convenciones comunes

| Aspecto | Contrato |
|---|---|
| Base | `http://localhost:3000/api` (configurable en el cliente con `window.COOKSMART_API_BASE`) |
| Formato | JSON UTF-8. Nombres de campos de respuesta en `snake_case` (vienen de columnas SQL); cuerpos de petición en `camelCase` (`idReceta`, `idIngrediente`). **Inconsistencia conocida**, se mantiene en v1 por compatibilidad. |
| Autenticación | `Authorization: Bearer <JWT>`; JWT HS256, `sub` = `id_usuario`, expira en 7 días |
| Autorización | En `/usuarios/{idUsuario}/…` el `sub` del token **debe** coincidir con `idUsuario` → si no, `403` |
| Errores | Siempre `{"error": "<mensaje>"}`. `400` validación · `401` sin token / token inválido / credenciales · `403` recurso de otro usuario · `404` no existe · `409` correo duplicado · `500` "Error interno del servidor" (sin detalles) |
| Lo que **no** cruza la frontera | `contrasena_hash` (excluido explícitamente en `auth.service.login` y en los `SELECT` de `Usuarios.repository`), `firebase_uid`, datos de otros usuarios |

### 4.2 Operaciones por contexto (proveedor → consumidor)

| Contexto proveedor | Operación | Consumidor real | Respuesta |
|---|---|---|---|
| BC1 | `POST /auth/registro` | `registro.html` | `201 {usuario, token}` · `400` · `409` |
| BC1 | `POST /auth/login` | `login.html`, k6 | `200 {usuario, token}` · `401` |
| BC1 | `GET /auth/me` | `perfil.html`, `index.html` | `200 {usuario}` (incluye `preferencias`) |
| BC1 | `PATCH /auth/me` · `/auth/me/preferencias` · `/auth/me/password` | `perfil.html` | `200` · `200` · `204` |
| BC2 | `GET /recetas?categoria={id}&tipoCocina={id}` | `recetas-loader.js` | `200 [RecetaResumen]` (**sin `ingredientes`**) |
| BC2 | `GET /recetas/{id}` | `receta-detalle.html` | `200 RecetaDetalle` (con `ingredientes`) · `404` |
| BC2 | `GET /categorias-receta`, `/tipos-cocina`, `/categorias-ingrediente`, `/ingredientes` | k6 (ninguna página) | `200 [...]` |
| BC3 | `GET/POST /usuarios/{id}/inventario`, `DELETE …/inventario/{idInventario}` | **ninguno** (solo k6) | `200` · `201` · `204` · `404` |
| BC5 | `GET/POST /usuarios/{id}/favoritos`, `DELETE …/favoritos/{idReceta}` | `auth-sync.js` | `200` · `201` (idempotente: si ya existía devuelve `yaExistia: true`) · `204` · `404` |
| BC5 | `GET/POST /usuarios/{id}/historial` | **ninguno** (solo k6) | `200` · `201` |

> **Hallazgo de contrato:** los filtros de recetas van por *query string* con nombres `categoria` y `tipoCocina` (IDs numéricos), distintos de los nombres internos `idCategoriaRec`/`idTipoCocina`; `docs/09-mapa-modular.md` no los documenta. Ver `recetas.controller.js` línea 5.

### 4.3 Política de versionamiento

| Regla | Detalle |
|---|---|
| Versión actual | **v1 implícita** (rutas sin prefijo `/v1`). Se documenta como `info.version: 1.0.0` en OpenAPI. |
| Cambios compatibles (minor) | Agregar campos opcionales en respuestas, agregar endpoints, agregar parámetros opcionales. Los consumidores deben **ignorar campos desconocidos** (hoy `_adaptarReceta` ya lo hace). |
| Cambios incompatibles (major) | Quitar/renombrar campos, cambiar tipos, cambiar códigos de estado de éxito (p. ej. `201` → `202`). Requieren `/api/v2/...` y convivencia de ambas versiones hasta migrar el frontend. |
| Versionar el archivo | `openapi-v1.yaml` vive en Git; cualquier PR que toque `routes/` o un `SELECT` de repositorio debe actualizarlo (pendiente de automatizar como *fitness function*). |

### 4.4 Cambio de contrato pendiente detectado (no se implementa en M5)

`GET /recetas` debería incluir `ingredientes: [{id_ingrediente, nombre_ingrediente}]` para que BC4 calcule coincidencias por **ID** en vez de por texto. Es un cambio **compatible** (campo adicional) → `1.1.0`. Se registra aquí y no se implementa porque está fuera del alcance de la decisión de integración que prueba el spike.

> **Nota sobre el Spike 1:** si se adoptara la variante asíncrona de I1, `POST /favoritos` pasaría de `201` a `202 Accepted` → **cambio incompatible** según §4.3. Ese costo de contrato forma parte de la evaluación (ver ADR-003).

## 5. Catálogo de eventos (filtrado)

Se pidió a la IA un catálogo de eventos candidatos y se filtró contra el dominio real. Detalle completo, prompt y clasificación: [`docs/ia/auditoria-eventos-m5.md`](../ia/auditoria-eventos-m5.md).

| Evento | Veredicto del equipo | Motivo corto |
|---|---|---|
| `FavoritoAgregado` / `FavoritoQuitado` | **Real pero sin consumidor** | El hecho ocurre (E5), pero ningún otro contexto reacciona a él. Un evento sin suscriptor es un log. |
| `RecetaPreparada` | **Real, condicionado a H1** | Solo tiene sentido si se implementa "descontar de la nevera". |
| `IngredienteProximoAVencer` | **Plausible, no demostrado** | Depende de RF06 en backend (H2); hoy se calcula en el navegador en cada visita. |
| `UsuarioRegistrado` | **Rechazado (innecesario)** | Ningún contexto necesita reaccionar (no hay correo de bienvenida ni inventario inicial). |
| `UsuarioInicioSesion` | **Rechazado (técnico)** | Es un hecho de seguridad/auditoría, no de dominio. |
| `PreferenciasActualizadas` | **Rechazado (redundante)** | El único consumidor (BC4) lee `/auth/me` cuando lo necesita. |
| `RecetaPublicada` / `CatalogoActualizado` | **Rechazado (inventado)** | No existe ningún flujo que publique recetas en runtime. |
| `RecetaConsultada` / `RecetaVista` | **Rechazado (técnico/CRUD)** | Un `GET` no es un hecho de negocio. |
| `InventarioItemAgregado` / `…Eliminado` | **Rechazado (CRUD sin consumidor)** | Además, la API de inventario no tiene consumidores reales. |
| `RecomendacionGenerada` | **Rechazado (inventado)** | La recomendación ni siquiera existe en el backend. |

**Conclusión de §5:** de 12 eventos propuestos, **0** tienen hoy un productor y un consumidor reales en contextos distintos. Esto respalda, con evidencia del código, lo que la crítica de M4 afirmó sin medir (`docs/10-critica-arquitectura-ia.md`, fila 4).

## 6. Decisión síncrono/asíncrono (antes del spike)

| Interacción | Decisión previa | ¿Requiere evidencia experimental? |
|---|---|---|
| I1 · Favoritos | **Pendiente**: hipótesis del equipo = la variante asíncrona no compensa | **Sí → Spike 1** |
| I2 · Catálogo | Síncrono (REST) + corregir contenido del contrato | No: el catálogo no cambia en runtime |
| I3 · Identidad | Token autocontenido (sin llamada) | No |
| I4 · Preparar → nevera | No se diseña (requisito inexistente) | No; condición de revisión en ADR-003 |

La decisión final de I1 y la decisión general de integración se registran en [`docs/adr/ADR-003-integracion-entre-contextos.md`](../adr/ADR-003-integracion-entre-contextos.md) **después** del veredicto del spike.

---

## 7. Actualización posterior al Spike 1

> Agregada **después** de ejecutar el spike; las secciones 1–6 quedaron como estaban en el commit de pre-registro (`914a9ab`).

Spike 1 → veredicto **AJUSTADA**: con escritura asíncrona el P95 del `POST` bajó 41,5 % (209,22 → 122,29 ms), pero solo el 54,67 % de las lecturas inmediatas vio el favorito. **I1 queda síncrona** y el contrato v1 conserva `201`. Decisión formal: [ADR-003](../adr/ADR-003-integracion-entre-contextos.md). Detalle: [`03-veredicto.md`](../../experimentos/spike-01-integracion/03-veredicto.md).
