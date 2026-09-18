# ADR-002 - Límites de módulos y dependencias

- **Estado:** Aceptado
- **Fecha:** 2026-09-17
- **Decisión:** Centralizar el acceso a PostgreSQL en repositories y mantener dependencias dirigidas por capas
- **Sistema:** CookSmart

---

# 1. Contexto

La API Node.js/Express es el punto de comunicación entre el frontend y PostgreSQL.

El equipo definió como prioridad arquitectónica que la comunicación con la base de datos tenga un límite explícito:

```text
CookSmart API
      │
      ▼
PostgreSQL
```

La API se organiza en:

```text
Routes
Controllers
Services
Repositories
DB Config
Middleware
```

El frontend queda fuera de la frontera de persistencia:

```text
Frontend → API → PostgreSQL

Frontend -X-> PostgreSQL
```

---

# 2. Problema

Sin límites explícitos podrían aparecer dependencias como:

```text
Controller → SQL
Service → PostgreSQL
Frontend → PostgreSQL
Repository → Controller
```

Esto aumentaría el acoplamiento y dificultaría:

- cambiar consultas;
- controlar la persistencia;
- probar cada capa;
- analizar rendimiento;
- mantener la API.

Por esta razón, la comunicación **API → PostgreSQL** se define como un límite arquitectónico central.

---

# 3. Decisión

Las dependencias permitidas siguen esta dirección:

```text
┌──────────────┐
│    Routes    │
└──────┬───────┘
       ▼
┌──────────────┐
│ Controllers  │
└──────┬───────┘
       ▼
┌──────────────┐
│   Services   │
└──────┬───────┘
       ▼
┌──────────────┐
│ Repositories │
└──────┬───────┘
       │ SQL / pg
       ▼
┌──────────────┐
│  PostgreSQL  │
└──────────────┘
```

La regla fundamental es:

> **Solo la capa de repositories accede directamente a la persistencia.**

---

# 4. Límites de los módulos

## 4.1 Routes

**Responsabilidad**

Definir los endpoints HTTP.

**Puede depender de:**

- Controllers.
- Middleware.

**No debe acceder directamente a:**

- PostgreSQL.
- Consultas SQL.

---

## 4.2 Controllers

**Responsabilidad**

Adaptar solicitudes HTTP a operaciones de negocio y construir respuestas HTTP.

**Puede depender de:**

- Services.

**No debe acceder directamente a:**

- PostgreSQL.
- SQL.

---

## 4.3 Services

**Responsabilidad**

Implementar y coordinar la lógica de negocio.

**Puede depender de:**

- Repositories.

**No debe acceder directamente a:**

- SQL de persistencia.

---

## 4.4 Repositories

**Responsabilidad**

Encapsular las operaciones de persistencia.

**Puede depender de:**

- Configuración de base de datos.
- Pool PostgreSQL.
- Driver `pg`.

**No debe depender de:**

- Routes.
- Controllers.
- Presentación.

---

## 4.5 DB Config

**Responsabilidad**

Crear y administrar el pool de conexiones PostgreSQL.

**Puede depender de:**

```text
pg
Configuración del entorno
```

**No debe depender de:**

- HTTP.
- Controllers.
- lógica de presentación.

---

## 4.6 Middleware JWT

**Responsabilidad**

Validar la identidad y proteger las operaciones que requieren autenticación.

El middleware se ejecuta antes de las operaciones protegidas.

---

# 5. Módulos funcionales

La API expone operaciones agrupadas alrededor de:

| Módulo | Operaciones representativas |
|---|---|
| **Auth** | Registro, login y consulta de sesión |
| **Perfil** | Consulta de información del usuario |
| **Recetas** | Listado y detalle de recetas |
| **Categorías** | Consulta de categorías de recetas |
| **Tipos de cocina** | Consulta de tipos de cocina |
| **Ingredientes** | Consulta de ingredientes |
| **Favoritos** | Consulta, creación y eliminación |
| **Inventario** | Consulta, creación y eliminación |
| **Historial** | Consulta y registro de historial |

---

# 6. Dependencias permitidas

| Módulo origen | Dependencia permitida | Motivo |
|---|---|---|
| Routes | Controllers | Entregar solicitudes HTTP a la capa de aplicación |
| Routes | Middleware | Proteger endpoints |
| Controllers | Services | Ejecutar operaciones de negocio |
| Services | Repositories | Solicitar operaciones de persistencia |
| Repositories | DB Config | Obtener conexiones del pool |
| DB Config | PostgreSQL | Mantener la comunicación con la base de datos |
| Middleware | Servicios de autenticación o configuración correspondiente | Validar acceso protegido |

La dirección general es:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
DB Config
   ↓
PostgreSQL
```

---

# 7. Dependencias que deben evitarse

```text
Frontend -X-> PostgreSQL

Routes -X-> SQL directo

Controllers -X-> PostgreSQL

Services -X-> SQL directo

Repositories -X-> Controllers

Repositories -X-> Routes

DB Config -X-> HTTP / Presentación
```

Estas restricciones mantienen la frontera de persistencia en repositories y evitan dependencias circulares.

---

# 8. Límite API → PostgreSQL

```text
                    COOKSMART API
┌────────────────────────────────────────────┐
│                                            │
│ Routes                                     │
│    ↓                                       │
│ Controllers                                │
│    ↓                                       │
│ Services                                   │
│    ↓                                       │
│ Repositories                               │
│                                            │
└────────────────────┬───────────────────────┘
                     │
                     │ SQL / pool
                     ▼
            ┌──────────────────┐
            │    PostgreSQL    │
            └──────────────────┘
```

Este límite es importante para el análisis de rendimiento porque permite seguir la ruta:

```text
Solicitud HTTP
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Pool / SQL
   ↓
PostgreSQL
```

---

# 9. Relación con k6

Los resultados actuales de k6 hacen útil conservar esta separación para investigar dónde se produce la latencia.

## Diagnóstico

| Métrica | Resultado |
|---|---:|
| VUs | **50** |
| Solicitudes | **6.349** |
| Errores | **0,00%** |
| P95 HTTP | **232,94 ms** |
| P95 recetas | **234 ms** |

## Recorrido completo

| Métrica | Resultado |
|---|---:|
| VUs | **50** |
| Iteraciones | **50** |
| Solicitudes | **500** |
| Errores | **0,00%** |
| Checks | **100%** |
| P95 global | **9,72 s** |
| P95 login | **17,93 s** |
| P95 inventario | **300,75 ms** |

La diferencia entre ambos experimentos demuestra que el comportamiento de la API depende del flujo ejecutado y no únicamente de un endpoint aislado.

> Los resultados no identifican por sí solos a PostgreSQL como causa única. El límite por capas permite investigar cada tramo de la solicitud.

---

# 10. Trazabilidad con C4

Los límites definidos aquí se reflejan en el modelo C4 de componentes:

```text
Frontend
   │
   ▼
API / Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
DB Config
   │
   ▼
PostgreSQL
```

El límite más relevante es:

```text
CookSmart API
      │
      │ persistencia
      ▼
PostgreSQL
```

---

# 11. Consecuencias

## Positivas

- Centraliza la persistencia.
- Evita que el frontend dependa de la base de datos.
- Reduce el acoplamiento entre negocio y SQL.
- Facilita pruebas unitarias por capa.
- Permite analizar el rendimiento por tramo.
- Hace explícita la dependencia API → PostgreSQL.

## Costos

- Añade una capa de abstracción entre servicios y base de datos.
- Requiere mantener los repositories.
- Una operación puede atravesar varias capas antes de llegar a PostgreSQL.

---

# 12. Resumen de la decisión

La arquitectura actual mantiene una dirección de dependencias:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
DB Config
   ↓
PostgreSQL
```

La regla principal es:

> **La persistencia se concentra en repositories y el frontend nunca accede directamente a PostgreSQL.**

Esta decisión mantiene explícito el límite de comunicación **API ↔ DB**, que constituye una prioridad para el equipo y un punto importante para el análisis de rendimiento.

---

# 13. Veredicto del mini-comité 1

**Estado:** Pendiente de sesión de mini-comité.

Esta sección se completa después de la defensa de la semana 8, en la que otro equipo actúa como comité técnico (CTO, seguridad o finanzas) y evalúa los límites de módulos y las reglas de dependencia definidas en este ADR.

| Campo | Valor |
|---|---|
| Equipo evaluador (comité) | Por registrar |
| Fecha de la sesión | Por registrar |
| Rol representado por el comité | Por registrar (CTO / Seguridad / Finanzas) |
| **Veredicto** | Por registrar: **Confirmada** / **Ajustada** / **Reconsiderada** |
| Observaciones del comité | Por registrar |
| Cambios aplicados tras el veredicto (si aplica) | Por registrar |

> Este ADR permanece con estado **Aceptado** a nivel de equipo mientras no se registre el veredicto del comité. El veredicto no debe anticiparse ni completarse antes de que la sesión de mini-comité ocurra realmente, para no invalidar la evidencia de revisión por pares que exige la rúbrica.
