# Seguridad — modelado de amenazas, controles y riesgos residuales (M7)

> **Pregunta del módulo:** *si el sistema falla en producción, ¿cómo sabríamos qué ocurrió, dónde, a quién afectó y qué decisión arquitectónica lo permitió?* La mitad de "qué/dónde/a quién" la responde la observabilidad (`12-despliegue-observabilidad.md`). Este documento responde **"qué decisión lo permitió"**: qué amenazas tiene la arquitectura actual, qué control las cierra y qué riesgo queda aceptado y por qué.
>
> **Base:** OWASP Top Ten 2021 como *referencia* (no como lista de tareas), el checklist de seguridad de Ingeniería (escenarios PSeg01–PSeg04 de `docs/02-Escenarios-de-calidad.md`) elevado al sistema completo, y los fallos F1–F12 del M6 (`docs/m6/matriz-fallos-resiliencia.md`).
>
> **Toda amenaza marcada "Medido" fue verificada contra el stack real** con `experimentos/EXP-005-controles-seguridad-observabilidad/` (pre-registro, script y resultados `antes`/`despues`). No es una lista teórica.

## 1. Alcance y límites de confianza

Sistema: front estático (HTML/JS servido desde el navegador) + API Express + PostgreSQL + Adminer, todo en `docker compose`. Autenticación con JWT (HS256) y bcrypt costo 12.

```
                 Internet (no confiable)
                         │
   ┌─────────────────────┼─────────────────────────────┐
   │  Navegador del usuario (no confiable: el token       │
   │  vive en localStorage, el JS es inspeccionable)      │
   └─────────────────────┼─────────────────────────────┘
                         │  HTTPS (en producción; hoy HTTP en local)
════════════════════════╪══════════════  ← LÍMITE DE CONFIANZA 1 (perímetro)
                         │
   ┌─────────────────────▼─────────────────────────────┐
   │  API Express (confianza media)                      │
   │  · valida JWT y autorización por usuario            │
   │  · único punto que debería hablar con la base       │
   └─────────────────────┬─────────────────────────────┘
                         │  red interna de Docker
════════════════════════╪══════════════  ← LÍMITE DE CONFIANZA 2 (datos)
                         │
   ┌──────────▼──────────┐     ┌───────────────────────┐
   │  PostgreSQL          │     │  Adminer (consola web  │
   │  (confiable)         │◄────┤  con acceso TOTAL a la │
   │                      │     │  base) — PELIGROSO si  │
   └──────────────────────┘     │  cruza el perímetro    │
                                └───────────────────────┘
```

Los dos puntos donde un dato cruza de "no confiable" a "confiable" son donde se concentran los controles: **entrada a la API** (límite 1) y **acceso a la base** (límite 2). Adminer es especial: es una herramienta interna que, si se expone, le da a cualquiera el control total de la base saltándose toda la API.

## 2. Matriz de riesgos de seguridad (amenazas priorizadas)

Severidad = impacto × facilidad de explotación en **nuestro** sistema (no en abstracto). Orden: de mayor a menor.

| # | Amenaza | OWASP 2021 | Límite | Severidad | Estado antes (medido) | Control | Estado después (medido) |
|---|---|---|---|---|---|---|---|
| **A1** | **`JWT_SECRET` versionado** en `docker-compose.yml` (repo público). Con él, cualquiera **forja un token de cualquier usuario** y lee/modifica sus datos | A02 Fallos criptográficos / A07 | 1 | **Crítica** | Token forjado con el secreto del repo → **HTTP 200** sobre datos ajenos (H-S1) | **C1**: secreto fuera del repo (`.env`), exigido por variable, **rotado**; FF-5 en CI impide re-commitearlo | Mismo token forjado → **HTTP 401** (H-S1) |
| **A2** | **Fuerza bruta de contraseña** en `/login` (PSeg01/PSeg07). No había límite de intentos | A07 Fallos de identificación | 1 | Alta | 15 intentos fallidos → **15×401, 0×429** (H-S2) | **C2**: límite de intentos **fallidos** por (IP, correo); `429 + Retry-After` | Intentos 6–15 → **429**; otra cuenta desde la misma IP → **401** (no bloquea la IP entera) (H-S2) |
| **A5** | **API corre como `root`** dentro del contenedor: un RCE tendría privilegios máximos | A05 Mala configuración | 2 | Alta | `uid=0(root)` | **C4**: `USER node` en el Dockerfile | `uid=1000(node)` |
| **A6** | **Adminer expuesto** en `0.0.0.0:5433`: consola con acceso total a la base, alcanzable desde la red | A05 Mala configuración | 2 | **Crítica** si cruza el perímetro | Publicado en `0.0.0.0:5433` | **C5**: publicar solo en `127.0.0.1` | Publicado en `127.0.0.1:5433` |
| **A7** | **Caché sin tope** (T2 del M6): `GET /api/recetas?x=1…N` crea una entrada por query → agotamiento de memoria (DoS) | A05 / disponibilidad | 1 | Media | Clave = URL completa, sin límite | **C3**: tope de entradas (FIFO), probado | ≤ `CACHE_MAX_ENTRADAS` (prueba unitaria) |
| **A8** | **Cuerpos de petición sin límite** de tamaño | A05 | 1 | Media | `express.json()` sin `limit` | **C-extra**: `express.json({ limit: '100kb' })` | Límite aplicado |
| **A9** | **Fingerprinting**: la API anuncia `X-Powered-By: Express` | A05 | 1 | Baja | Cabecera presente, sin `nosniff`/`DENY` | **C6**: `x-powered-by` off + cabeceras mínimas | `X-Powered-By` ausente; `nosniff` y `X-Frame-Options: DENY` presentes (H-S5) |
| **A-SQL** | **Inyección SQL** (PSeg04) | A03 Inyección | 1/2 | — | **No explotable**: todos los repositorios usan consultas **parametrizadas** (`$1,$2…`), nunca concatenan entrada | Se mantiene como invariante; FF-1 ya impide que una capa fuera de `repositories` hable con `pg` | Sigue no explotable |
| **A-IDOR** | **Acceso a datos de otro usuario** (PSeg02, BOLA) | A01 Control de acceso roto | 1 | — | **No explotable**: `soloElMismoUsuario` compara el `sub` del token con el `:idUsuario` del path; el borrado filtra por `id_usuario` | Se mantiene; cubierto por el token legítimo | Sigue no explotable |

**A-SQL** y **A-IDOR** son las dos amenazas más graves de una API de este tipo, y están **cubiertas desde antes del M7** por decisiones del M5 (parametrización, autorización por usuario). Se listan para dejar explícito que se revisaron y por qué no requieren un control nuevo — no para inflar la matriz.

## 3. Controles arquitectónicos

| Control | Qué hace | Dónde | Reversible |
|---|---|---|---|
| **C1** | Secreto JWT fuera del repo, por variable de entorno, rotado | `docker-compose.yml`, `.env(.example)`, `server.js` (ya abortaba sin él) | — (no se vuelve atrás) |
| **C2** | Límite de intentos **fallidos** de login por (IP, correo) → 429 | `middlewares/limiteLoginFallidos.js`, `auth.routes.js` | `LOGIN_RATELIMIT=off` |
| **C3** | Tope de entradas de la caché del catálogo | `middlewares/cacheCatalogo.js` | `CACHE_MAX_ENTRADAS` |
| **C4** | Proceso no-root en el contenedor | `backend/Dockerfile` (`USER node`) | — |
| **C5** | Adminer solo en `127.0.0.1` | `docker-compose.yml` | — |
| **C6** | Cabeceras de seguridad + sin `X-Powered-By` | `middlewares/cabecerasSeguridad.js`, `server.js` | — |

**Decisión de no usar `helmet`:** las cabeceras que aplican a una API JSON detrás de un proxy son pocas y se ponen a mano, sin añadir una dependencia más que auditar (`npm audit` en CI). Si el front pasara a servirse desde la misma API, se reevaluaría (CSP).

**Relación con el límite de intentos (C2) y el bulkhead del M6 (T1):** son controles **distintos y complementarios**. El bulkhead protege la **capacidad** (CPU de bcrypt) de todos por igual; C2 protege una **cuenta concreta** de que se la intente adivinar. Van en ese orden en la ruta (`C2 → T1 → controlador`) para que un atacante bloqueado no consuma ni un cupo del bulkhead.

## 4. Amenazas genéricas descartadas (lo que la IA propondría sin mirar el sistema)

Una lista de seguridad generada "a ciegas" (ver `docs/ia/evaluacion-amenazas-ia-m7.md`) incluye controles que **no aplican** o cuyo costo no se justifica **hoy**, con 3 personas y este sistema. Se descartan con motivo, no por pereza:

| Propuesta genérica | Por qué no aplica hoy |
|---|---|
| WAF gestionado | No hay superficie que un WAF cubra mejor que la parametrización + autorización ya existentes; añade costo e infra (ver D-alternativas en `12-...`) |
| Rotación automática de secretos con un *vault* | Con un secreto y 3 personas, la rotación manual documentada (C1) es suficiente; un vault es infra que operar (F11) |
| Cifrado de la base en reposo + gestión de claves | PostgreSQL local sin datos sensibles regulados; se revisaría con PII real o cumplimiento |
| MFA / OAuth externo | No hay requisito de negocio; añade un proveedor de identidad al perímetro |
| Escaneo DAST/pentest continuo | Desproporcionado para el tamaño; `npm audit` + FF-5 + las verificaciones de EXP-005 cubren lo alcanzable |

El criterio es el mismo del M4 y el M6: **el control se justifica contra una amenaza medible en nuestro sistema**, no contra un catálogo abstracto.

## 5. Riesgos residuales aceptados

Lo que **sabemos** que queda abierto y por qué es aceptable **hoy** (documentado para que sea una decisión, no un olvido):

| # | Riesgo residual | Por qué se acepta | Cuándo reabrirlo | Evidencia |
|---|---|---|---|---|
| **R-S1** | **Enumeración de cuentas**: `/registro` responde 409 si el correo ya existe (A3) | El flujo de registro necesita decir "ese correo ya tiene cuenta"; ocultarlo degrada la usabilidad. El login sí da error genérico | Si aparece abuso dirigido | 409 medido antes y después (H-S6) |
| **R-S2** | **Un token sigue valiendo tras cambiar la contraseña** (A4): no hay lista de revocación; el JWT es válido hasta su `exp` (7 días) | Revocar exige estado de servidor (lista negra) que contradice el JWT sin sesión; la ventana es acotada | Si se reduce `exp` o se requiere cierre de sesión inmediato | Token de sesión sigue 200 antes y después (H-S7) |
| **R-S3** | **C2 es por proceso**: con varios workers (D1 del M6) el límite efectivo de intentos se multiplica por el nº de workers | Hoy se corre con 1 worker por defecto; con N workers el límite sigue acotando el orden de magnitud | Si se activan workers en producción → mover el contador a un almacén compartido | `limiteLoginFallidos.js` (comentado) |
| **R-S4** | **HTTP en local**: el token viaja en claro | En producción va detrás de TLS (responsabilidad del despliegue, `12-...`) | — | — |
| **R-S5** | **DB password compartida dev/CI** (`Cooksmart2024`) en workflows de CI | Base efímera de prueba que nunca tiene datos reales; FF-5 vigila el **JWT**, que es el secreto de alto valor | Con un entorno gestionado real | FF-5 (decisión de alcance documentada en `docs/m6/fitness-functions.md`) |

## 6. Checklist de Ingeniería elevado al sistema

Los escenarios PSeg01–PSeg04 estaban como "pruebas específicas pendientes" en `docs/02-Escenarios-de-calidad.md`. Estado ahora:

| Escenario | Antes | Ahora |
|---|---|---|
| PSeg01 (rechazar credenciales malas) | pendiente | **verificado** (H-S2: 401) + reforzado con C2 (429) |
| PSeg02 (no acceder a datos de otro) | pendiente | **verificado** no explotable (A-IDOR) |
| PSeg03/04 (JWT inválido / inyección) | pendiente | **verificado**: JWT forjado rechazado tras C1 (H-S1); SQL parametrizado (A-SQL) |

El seguimiento de estos escenarios pasa de "pendiente" a "cubierto por EXP-005 + fitness functions FF-5/FF-6".
