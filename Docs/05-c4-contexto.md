# C4 - Diagrama de Contexto de CookSmart

## 1. Propósito de la vista

Esta vista representa el contexto actual de CookSmart, identificando el sistema,
sus usuarios y los sistemas externos con los que interactúa.

La vista corresponde a la arquitectura real implementada y no incluye componentes
de la arquitectura propuesta como trabajo futuro.

## 2. Audiencia

- Profesor y evaluadores del curso de Arquitectura de Software.
- Integrantes del equipo de desarrollo.
- Personas que necesiten comprender los límites del sistema sin revisar el código.

## 3. Sistema

### CookSmart

Aplicación web que permite a los usuarios gestionar los ingredientes disponibles
en su nevera y consultar recetas personalizadas de acuerdo con dichos ingredientes.

La implementación actual utiliza HTML, CSS y JavaScript en el lado del cliente.

## 4. Personas

### Usuario final

Persona que utiliza CookSmart para:

- Registrarse e iniciar sesión.
- Gestionar los ingredientes disponibles en su nevera.
- Consultar recetas.
- Filtrar recetas por categorías.
- Consultar su perfil.
- Gestionar sus recetas favoritas.

## 5. Sistemas externos

### Firebase Authentication

Servicio externo utilizado por CookSmart para gestionar la autenticación
de los usuarios.

### Firebase Realtime Database

Servicio externo utilizado por CookSmart para la persistencia y consulta
de los datos utilizados por la aplicación.

## 6. Relaciones

| Origen | Destino | Relación |
|---|---|---|
| Usuario final | CookSmart | Utiliza la aplicación web |
| CookSmart | Firebase Authentication | Gestiona registro, inicio y cierre de sesión |
| CookSmart | Firebase Realtime Database | Consulta y persiste información del sistema |

## 7. Límites del sistema

El sistema evaluado corresponde a la implementación actualmente disponible
en el repositorio.

Incluye:

- HTML
- CSS
- JavaScript
- Firebase Authentication
- Firebase Realtime Database

No se consideran parte del sistema actual:

- API Gateway
- Microservicios
- MySQL/PostgreSQL
- Redis
- Motor de IA/Claude

Estos elementos corresponden a una arquitectura propuesta o de trabajo futuro
y no forman parte de la arquitectura actualmente implementada.

## 8. Validación contra el código

El contexto fue construido a partir de la implementación real del repositorio.

La existencia de Firebase Authentication y Firebase Realtime Database se
evidencia mediante los archivos `firebase-sync.js` y `recetas-db.js`.

Las interfaces principales del sistema están implementadas mediante archivos
HTML, CSS y JavaScript ubicados en la raíz del repositorio.

## 9. Decisiones y correcciones

El diagrama representa únicamente la arquitectura actual (as-is). Se excluyeron
los elementos de la arquitectura propuesta inicialmente que no tienen una
implementación correspondiente en el repositorio actual.

Esta corrección evita representar como arquitectura existente componentes que
pertenecen al roadmap o trabajo futuro.

## 10. Trazabilidad del contexto al código

| Elemento del contexto | Evidencia en el repositorio | Responsabilidad |
|---|---|---|
| Usuario final | `login.html`, `registro.html`, `index.html`, `mi-nevera.html`, `recetas.html`, `favoritos.html`, `perfil.html` | Permitir al usuario interactuar con las funcionalidades de CookSmart |
| CookSmart | Archivos HTML, JavaScript y CSS de la raíz del repositorio | Implementar la interfaz y la lógica de interacción de la aplicación web |
| Firebase Authentication | `firebase-sync.js` y páginas de autenticación | Gestionar registro, inicio y cierre de sesión |
| Firebase Realtime Database | `firebase-sync.js` y `recetas-db.js` | Persistir y consultar información utilizada por la aplicación |
| Recetas locales | `recetas-db.js` | Contener y proporcionar los datos de recetas utilizados por la aplicación |

### Evidencia de corrección arquitectónica

Durante la revisión de la arquitectura se comparó el modelo documentado inicialmente con la implementación disponible en el repositorio.

Se identificó que elementos como API Gateway, microservicios, MySQL/PostgreSQL, Redis y un motor de IA no cuentan actualmente con una implementación correspondiente en el código.

Por esta razón, estos elementos fueron excluidos del C4 de contexto de la arquitectura actual y se mantienen únicamente como arquitectura propuesta o trabajo futuro.

La vista C4 actual representa únicamente elementos que pueden ser relacionados con la implementación disponible en el repositorio.