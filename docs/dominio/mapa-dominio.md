# Mapa de dominio — CookSmart (Módulo 5, Semana 9)

> **Entradas reutilizadas:** `docs/01-contexto-y-drivers.md` (S1–2), `docs/02-Escenarios-de-calidad.md` y `docs/04-Matriz-De-Calidad.md` (S3–4), `docs/05..07-c4-*.md` (S5–6), `docs/09-mapa-modular.md`, `docs/adr/ADR-001`, `docs/adr/ADR-002` (S7–8) y el código de `Docker/Postgre/backend/src` + frontend en la raíz del repo.
>
> **Convención de etiquetas** (misma que en M1):
> - **HECHO DEL REPOSITORIO** — verificable en un archivo/línea concreta.
> - **INFERENCIA** — conclusión razonada a partir de hechos, no verificada directamente.
> - **INFORMACIÓN FALTANTE** — no hay evidencia en el repo.
> - **DECISIÓN DEL EQUIPO** — elección arquitectónica (defendible en la sustentación individual).
>
> **Commit de referencia del análisis:** rama `leo`, a partir del commit que reconecta `leo` con `main` (ver `git log`).

---

## 1. Fotografía del sistema actual (inventario)

Antes de proponer contextos se inventarió **lo que existe**, sin agrupar todavía.

### 1.1 Backend (API Node/Express)

| Elemento real | Archivo/carpeta | Responsabilidad observable | Datos que maneja | Dependencias |
|---|---|---|---|---|
| Registro / login | `routes/auth.routes.js`, `services/auth.service.js` | Crear cuenta, validar credenciales con bcrypt (costo 12), emitir JWT (7 días) | `usuario` (correo, contrasena_hash) | `Usuarios.repository`, `bcryptjs`, `jsonwebtoken` |
| Perfil y preferencias | `auth.service.js` (`obtenerPerfil`, `actualizarNombre`, `actualizarPreferencias`, `cambiarContrasena`) | Leer/editar nombre, gustos, restricciones, contraseña | `usuario.preferencias` (JSONB) | `Usuarios.repository` |
| Protección de rutas | `middlewares/authMiddleware.js` | `requireAuth` valida JWT; `soloElMismoUsuario` impide acceso a datos ajenos (IDOR/BOLA) | `sub` del token | `JWT_SECRET` |
| Recetas | `routes/recetas.routes.js`, `recetas.service.js`, `recetas.repository.js` | Listar (filtros por categoría/tipo de cocina) y detallar recetas | `receta`, `receta_ingrediente`, `receta_etiqueta`, `receta_restriccion` | `categoria_receta`, `tipo_cocina`, `ingrediente`, `etiqueta`, `restriccion` |
| Catálogos | `routes/catalogos.routes.js`, `catalogos.*` | Listas de referencia: categorías de receta, tipos de cocina, categorías de ingrediente, ingredientes | tablas maestras | — |
| Inventario (nevera) | `routes/usuarios.routes.js`, `inventario.*` | Listar/agregar/eliminar ítems de la nevera de un usuario, con fecha de vencimiento | `inventario_usuario` | `ingrediente`, `usuario` |
| Favoritos | `usuarios.routes.js`, `favoritos.*` | Listar/agregar/quitar recetas favoritas (idempotente con `ON CONFLICT DO NOTHING`) | `favorito` | `receta`, `usuario` |
| Historial | `usuarios.routes.js`, `historial.*` | Registrar y listar preparaciones de recetas | `historial_receta` | `receta`, `usuario` |
| Healthcheck | `server.js` (`GET /health`) | Verificar proceso + conexión a PostgreSQL | — | `config/db.js` |

### 1.2 Frontend (HTML/JS estático)

| Elemento real | Archivo | Responsabilidad observable | Datos que maneja | ¿Usa la API? |
|---|---|---|---|---|
| Cliente de autenticación y favoritos | `auth-sync.js` | Login/registro, guarda JWT en `localStorage`; **intercepta `localStorage.setItem('cooksmart_favoritos')` y sincroniza con la API en segundo plano** | token, usuario, favoritos | Sí: `/auth/*`, `/usuarios/:id/favoritos` |
| Carga del catálogo | `recetas-loader.js` | Descarga **todas** las recetas de `GET /api/recetas` al cargar la página y las adapta a `window.RECETAS_DB` | recetas | Sí: `/recetas` |
| Mi nevera | `mi-nevera.html` | Gestiona ingredientes con fecha de vencimiento, calcula "próximos a vencer" (≤ 3 días) | `localStorage.cookSmartNevera` | **No.** No llama a `/inventario` |
| Recomendación por ingredientes | `recetas.html` (≈ líneas 1070–1095), `receta-detalle.html` | Calcula `% match` entre ingredientes del usuario y los de cada receta | `localStorage.cookSmartIngredientes`, `RECETAS_DB` | Indirectamente (usa el catálogo descargado) |
| Perfil | `perfil.html`, `index.html` | Muestra y edita preferencias | `/auth/me`, `/auth/me/preferencias` | Sí |
| Búsqueda TheMealDB | `themealdb.js` | Adaptador a una API externa | — | **No se incluye en ninguna página** (código muerto) |
| Sincronización Firebase | `recetas.html` ≈ línea 1394 | Lee preferencias desde Firebase | — | Código muerto (Firebase no se carga) |

### 1.3 Hallazgos del inventario que condicionan el análisis

1. **HECHO DEL REPOSITORIO:** el frontend **no usa** los endpoints `/usuarios/:id/inventario` ni `/usuarios/:id/historial`. La nevera vive en `localStorage` (`mi-nevera.html`) y el historial no se registra desde ninguna página.
2. **HECHO DEL REPOSITORIO:** la **recomendación** (cálculo de coincidencia ingredientes ↔ receta) y la **alerta de vencimiento** (RF06) se ejecutan en el navegador, no en la API.
3. **HECHO DEL REPOSITORIO (verificado con `curl` el 2026-10-04):** `GET /api/recetas` **no devuelve `ingredientes`** (solo `GET /api/recetas/:id` los incluye). `recetas-loader.js` mapea `receta.ingredientes || []`, por lo que en `recetas.html` el cálculo de `% match` opera sobre un arreglo vacío. → **El contrato del proveedor (catálogo) no cubre lo que necesita su consumidor (recomendación).**
4. **HECHO DEL REPOSITORIO:** la sincronización de favoritos ya es, en la práctica, **asíncrona y de consistencia eventual desde el cliente**: el navegador escribe primero en `localStorage` y luego dispara `POST`/`DELETE` sin esperar ni reintentar (errores solo en `console.warn`).
5. **HECHO DEL REPOSITORIO:** todos los módulos comparten **un proceso** Node y **una base** PostgreSQL con claves foráneas entre tablas de distintos módulos (`favorito → receta`, `inventario_usuario → ingrediente`, etc.).

---

## 2. Responsabilidades identificadas

| # | Responsabilidad | Evidencia | Conceptos | Depende de |
|---|---|---|---|---|
| R1 | Gestionar identidad y sesión | `auth.service.js`, `authMiddleware.js` | Usuario, Credencial, Token | — |
| R2 | Gestionar perfil y preferencias alimentarias | `auth.service.js` (`actualizarPreferencias`), `perfil.html` | Gustos, Restricción (del usuario) | R1 |
| R3 | Publicar el catálogo de recetas | `recetas.*`, `02_seed.sql` | Receta, Paso, Nutrición, Etiqueta, Restricción (de la receta) | R4 |
| R4 | Mantener datos maestros (ingredientes, categorías, tipos de cocina) | `catalogos.*` | Ingrediente (maestro), Categoría, Tipo de cocina | — |
| R5 | Registrar lo que el usuario tiene en su nevera y cuándo vence | `inventario.*` (API) **y** `mi-nevera.html` (cliente) | Ítem de inventario, Cantidad, Unidad, Fecha de vencimiento | R1, R4 |
| R6 | Recomendar recetas con lo disponible / lo que vence pronto | `recetas.html`, `mi-nevera.html` | Coincidencia (%), "Vence pronto", Modo urgente | R3, R5, R2 |
| R7 | Recordar recetas preferidas | `favoritos.*`, `auth-sync.js` | Favorito | R1, R3 |
| R8 | Registrar recetas preparadas | `historial.*` | Preparación | R1, R3 |

## 3. Vocabulario que cambia de significado (señal de frontera)

| Término | Significado en un área | Significado en otra | Implicación |
|---|---|---|---|
| **Ingrediente** | Catálogo (R4): entrada maestra con `unidad_base` y categoría | Nevera (R5): algo que **yo** tengo, con cantidad, unidad y fecha de vencimiento | Es la señal más fuerte de frontera: el mismo nombre representa un *tipo* y una *existencia* |
| **Ingrediente** (en recomendación, cliente) | — | Recomendación (R6): un **string** comparado con `includes()` | El cliente no usa IDs: la integración catálogo ↔ nevera ↔ recomendación es por texto (frágil) |
| **Restricción** | Usuario (R2): lo que **no** puede comer | Receta (R3): lo que la receta **cumple** (p.ej. "sin gluten") | Misma palabra, dirección semántica distinta |
| **Usuario** | Identidad (R1): credencial + token | Resto: solo un `id_usuario` dueño de datos | Los demás contextos solo necesitan el identificador |

## 4. Subdominios

| Subdominio | Tipo | Justificación |
|---|---|---|
| Aprovechamiento de la nevera (inventario + vencimiento + recomendación) | **Núcleo (core)** | Es la propuesta de valor declarada: "recetas con los ingredientes disponibles para reducir el desperdicio" (README). **INFERENCIA:** paradójicamente es la parte **menos** implementada en el backend (vive en el navegador). |
| Catálogo de recetas | **Soporte** | Necesario para el núcleo, pero no diferencia al producto; es mayormente de lectura y los datos vienen del *seed*. |
| Actividad del usuario (favoritos, historial) | **Soporte** | Funciones de conveniencia. |
| Identidad y cuenta | **Genérico** | Problema resuelto (JWT + bcrypt); podría delegarse a un proveedor externo sin cambiar el producto. |

## 5. Agrupaciones candidatas (antes de decidir)

| Candidato | Responsabilidades | Evidencia a favor | Dudas |
|---|---|---|---|
| C-A: Identidad y Cuenta | R1, R2 | `auth.service.js` ya agrupa ambas | ¿Las preferencias pertenecen a Identidad o a Recomendación? Hoy están en `usuario.preferencias` |
| C-B: Catálogo de Recetas | R3, R4 | Solo lectura; todos sus endpoints son públicos; tablas maestras compartidas | ¿Ingredientes maestros son un contexto propio? Su único consumidor es el propio catálogo y la nevera |
| C-C: Nevera | R5 | Tabla `inventario_usuario`, vocabulario propio (vencimiento, cantidad) | Existe **dos veces** (API sin uso + `localStorage` en uso) |
| C-D: Recomendación | R6 | Lógica en `recetas.html` / `mi-nevera.html` | No tiene código en el backend; no tiene datos propios |
| C-E: Actividad (Favoritos + Historial) | R7, R8 | Ambos son relaciones usuario→receta de solo inserción/borrado | ¿Separarlos? No comparten reglas entre sí |
| C-E': Favoritos / C-E'': Historial separados | R7 / R8 | Archivos separados en cada capa | Ningún comportamiento propio que justifique dos contextos |

## 6. Límites propuestos — DECISIÓN DEL EQUIPO

> Borrador redactado con asistencia de IA a partir de las tablas anteriores (ver `docs/ia/auditoria-eventos-m5.md`, sección "Uso de IA en M5"). **Cada integrante debe poder defender estas fronteras**; si el equipo cambia alguna, se edita aquí y en `context-map.md`.

Se adoptan **cinco contextos acotados lógicos** dentro del **mismo monolito modular** (ADR-001 no cambia: no se propone separar despliegues ni bases de datos):

| Contexto | Responsabilidades | Por qué este límite |
|---|---|---|
| **BC1 · Identidad y Cuenta** | R1, R2 | Es el único que conoce credenciales; los demás solo reciben `id_usuario` vía JWT. Las preferencias quedan aquí porque hoy se editan desde el perfil y se guardan junto al usuario; **se revisará** si Recomendación pasa al backend (ver supuestos). |
| **BC2 · Catálogo de Recetas** | R3, R4 | Datos de referencia de solo lectura para el usuario final; modelo propio (Receta con pasos, nutrición, etiquetas). Ingredientes maestros quedan aquí: separarlos no aporta reglas propias. |
| **BC3 · Nevera (Inventario personal)** | R5 | Vocabulario propio (ítem, cantidad, vencimiento) distinto del "ingrediente" del catálogo. Es parte del **núcleo**. |
| **BC4 · Recomendación** | R6 | Núcleo del producto. Se reconoce como contexto aunque **hoy solo existe en el cliente**; dejarlo implícito ocultaría el hallazgo 1.3-3. |
| **BC5 · Actividad del Usuario** | R7, R8 | Favoritos e historial comparten forma (relación usuario→receta), reglas triviales y el mismo consumidor. Separarlos sería fragmentación sin beneficio. |

**Lo que se descartó explícitamente:**
- *Un contexto por tabla* (≈ 14 tablas): las tablas `etiqueta`, `restriccion`, `categoria_*` no tienen comportamiento propio.
- *Un contexto por carpeta/controller* (6 controllers): reproduciría la estructura técnica, no el dominio (Favoritos e Historial quedarían separados sin razón; Recomendación desaparecería por no tener controller).
- *Un microservicio por contexto*: ya descartado en ADR-001 y en la crítica de M4 (`docs/10-critica-arquitectura-ia.md`); ninguna evidencia nueva lo justifica.

## 7. Trazabilidad decisión → código

| Decisión | Código que la respalda |
|---|---|
| BC1 solo expone `id_usuario` al resto | `authMiddleware.js`: `req.usuario = { id: payload.sub, nombre }`; `soloElMismoUsuario` |
| BC2 es de solo lectura y público | `recetas.routes.js` y `catalogos.routes.js` sin `requireAuth`; solo `GET` |
| BC3 tiene vocabulario propio | `inventario.repository.js` (`cantidad`, `unidad`, `fecha_vencimiento`, `activo`) |
| BC4 vive en el cliente | `recetas.html` (cálculo `matchReal`), `mi-nevera.html` (`vencenPronto`, `cookSmartModoUrgente`) |
| BC5 agrupa favoritos + historial | `usuarios.routes.js` monta ambos bajo `/:idUsuario` con los mismos middlewares |

## 8. Supuestos y condición de revisión

| Supuesto | Revisar si… |
|---|---|
| S1. Los contextos son **lógicos** (módulos), no unidades de despliegue | aparece un requisito de escalar o desplegar un contexto por separado |
| S2. Las preferencias pertenecen a BC1 | la recomendación se mueve al backend y necesita las preferencias como insumo propio |
| S3. La nevera "real" es la del cliente (`localStorage`) | el frontend migra a `/inventario`; entonces BC3 pasa a tener una sola fuente de verdad |
| S4. Favoritos e historial no necesitan contextos separados | historial adquiere reglas propias (p. ej. descontar inventario al preparar una receta) |

## 9. Preguntas abiertas (INFORMACIÓN FALTANTE)

- ¿El equipo planea migrar la nevera de `localStorage` a la API? Hoy hay **dos fuentes de verdad** y la de la API está vacía.
- ¿"Preparar una receta" debería descontar ingredientes de la nevera? No existe ningún código que lo haga. Si se implementa, sería la **primera interacción real entre contextos con efecto de escritura** (BC5 → BC3) y el mejor candidato a un evento de dominio (ver `docs/integracion/09-api-eventos-integracion.md`).
- ¿RF06 (notificación de vencimiento) debe funcionar con la app cerrada? Si sí, requiere un proceso en el backend (hoy no existe).
