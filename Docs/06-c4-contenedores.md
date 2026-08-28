# C4 — Nivel Contenedores: CookSmart

## 1. Propósito

Esta vista representa la arquitectura de CookSmart a nivel de contenedores, mostrando las principales partes del sistema, sus responsabilidades, tecnologías y relaciones.

La vista se construye a partir de la implementación actualmente disponible en el repositorio.

## 2. Arquitectura actual

CookSmart es actualmente una aplicación web desarrollada con HTML, CSS y JavaScript.

La aplicación utiliza Firebase para:

* autenticación de usuarios;
* gestión del estado de sesión;
* persistencia y sincronización de favoritos.

El catálogo principal de recetas está definido en `recetas-db.js` mediante la estructura `RECETAS_DB`.

## 3. Diagrama C4 de Contenedores

```text
                         ┌──────────────────┐
                         │      Usuario     │
                         └────────┬─────────┘
                                  │
                                  │ Navegador web
                                  ▼
                    ┌──────────────────────────┐
                    │      CookSmart Web       │
                    │                          │
                    │ HTML + CSS + JavaScript  │
                    │                          │
                    │ Interfaz y lógica de la  │
                    │ aplicación               │
                    └───────┬──────────┬───────┘
                            │          │
                            │          │
                            ▼          ▼
                  ┌──────────────┐  ┌──────────────────┐
                  │ RECETAS_DB   │  │ Firebase         │
                  │              │  │                  │
                  │ Catálogo de  │  │ Authentication + │
                  │ recetas      │  │ Realtime Database│
                  └──────────────┘  └──────────────────┘
```

## 4. Contenedores

### 4.1 CookSmart Web

**Tecnología:** HTML, CSS y JavaScript.

**Responsabilidad:**

Es la aplicación web con la que interactúa directamente el usuario. Contiene las páginas y la lógica necesaria para consultar recetas, aplicar filtros, gestionar Mi Nevera, visualizar favoritos, consultar el perfil y realizar autenticación.

**Archivos principales:**

* `index.html`
* `recetas.html`
* `desayunos.html`
* `almuerzos.html`
* `cenas.html`
* `vegetariano.html`
* `rapido.html`
* `mi-nevera.html`
* `favoritos.html`
* `perfil.html`
* `receta-detalle.html`
* `login.html`
* `registro.html`

---

### 4.2 Catálogo de recetas — RECETAS_DB

**Tecnología:** JavaScript.

**Archivo:** `recetas-db.js`

**Responsabilidad:**

Contiene el catálogo principal de recetas utilizado por CookSmart.

Las recetas almacenan información como:

* identificador;
* nombre;
* categoría;
* ingredientes;
* restricciones;
* tiempo;
* dificultad;
* porciones;
* imagen;
* descripción;
* pasos;
* información nutricional.

El catálogo se define mediante:

```javascript
const RECETAS_DB = [
    ...
];
```

Las páginas de CookSmart consultan directamente este catálogo mediante operaciones como:

```javascript
RECETAS_DB.filter(...)
```

y:

```javascript
RECETAS_DB.find(...)
```

Por esta razón, se considera un catálogo de datos integrado en la aplicación web y no una base de datos independiente.

---

### 4.3 Firebase Authentication

**Tecnología:** Firebase Authentication.

**Responsabilidad:**

Gestiona la autenticación de los usuarios de CookSmart.

Las funcionalidades identificadas son:

* registro mediante correo y contraseña;
* inicio de sesión mediante correo y contraseña;
* inicio de sesión mediante Google;
* recuperación de contraseña;
* consulta del estado de autenticación;
* cierre de sesión.

**Evidencia en el código:**

`firebase-sync.js` utiliza:

```javascript
const fbAuth = firebase.auth();
```

y:

```javascript
fbAuth.onAuthStateChanged(...)
```

Además, `login.html` y `registro.html` contienen operaciones de autenticación.

---

### 4.4 Firebase Realtime Database

**Tecnología:** Firebase Realtime Database.

**Responsabilidad:**

Proporciona persistencia remota para información asociada a los usuarios.

Actualmente se utiliza principalmente para almacenar y recuperar los favoritos de los usuarios.

**Evidencia en el código:**

En `firebase-sync.js` se utiliza:

```javascript
const fbDB = firebase.database();
```

Los favoritos se almacenan mediante:

```javascript
fbDB.ref('usuarios/' + user.uid + '/favoritos').set(...)
```

y se recuperan mediante:

```javascript
fbDB.ref('usuarios/' + uid + '/favoritos').get()
```

La información se organiza mediante el identificador del usuario (`uid`).

---

## 5. Relaciones

### Usuario → CookSmart Web

El usuario accede a CookSmart mediante un navegador web e interactúa con las diferentes páginas de la aplicación.

### CookSmart Web → RECETAS_DB

La aplicación consulta `RECETAS_DB` para buscar, filtrar y mostrar recetas.

### CookSmart Web → Firebase Authentication

Las páginas de autenticación utilizan Firebase Authentication para registrar usuarios, iniciar sesión, utilizar Google Authentication, recuperar contraseñas y gestionar el estado de sesión.

### CookSmart Web → Firebase Realtime Database

La aplicación utiliza Firebase Realtime Database para almacenar y recuperar los favoritos asociados a los usuarios autenticados.

### CookSmart Web → Firebase

El archivo `firebase-sync.js` funciona como módulo compartido para integrar las páginas de CookSmart con los servicios de Firebase.

---

## 6. Trazabilidad C4 ↔ código

| Elemento                   | Código real                                                                                                       | Evidencia                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| CookSmart Web              | Archivos `.html`, JavaScript y CSS                                                                                | Implementación de la interfaz y lógica                     |
| Catálogo de recetas        | `recetas-db.js`                                                                                                   | Define `RECETAS_DB`                                        |
| Consulta de recetas        | `index.html`, `recetas.html`, `desayunos.html`, `almuerzos.html`, `cenas.html`, `rapido.html`, `vegetariano.html` | Uso de `RECETAS_DB.filter()` y `RECETAS_DB.find()`         |
| Firebase Authentication    | `firebase-sync.js`, `login.html`, `registro.html`, `perfil.html`                                                  | Autenticación y gestión de sesión                          |
| Firebase Realtime Database | `firebase-sync.js`                                                                                                | Guardado y recuperación de favoritos                       |
| Sincronización             | `firebase-sync.js`                                                                                                | Sincronización de favoritos entre la aplicación y Firebase |

## 7. Validación contra el código

Para validar que la arquitectura corresponde a la implementación real, se revisaron las referencias a Firebase y `RECETAS_DB` dentro de los archivos HTML y JavaScript del repositorio.

La revisión permitió comprobar que:

1. CookSmart funciona como una aplicación web basada en HTML, CSS y JavaScript.
2. `RECETAS_DB` está definido en `recetas-db.js`.
3. Las páginas de recetas utilizan directamente `RECETAS_DB`.
4. Firebase Authentication está implementado en las páginas de autenticación y en `firebase-sync.js`.
5. Firebase Realtime Database se utiliza para almacenar y recuperar favoritos.
6. `firebase-sync.js` contiene la integración compartida con Firebase.

## 8. Integraciones no activas

El repositorio contiene el archivo `themealdb.js`, que implementa funciones para consultar la API externa TheMealDB.

Sin embargo, durante la validación se comprobó que actualmente ninguna página HTML carga `themealdb.js` ni se encontró una llamada a `buscarTheMealDB()`.

Por esta razón, TheMealDB no se representa como una dependencia activa en el C4 actual.

Se considera una integración preparada para una posible utilización futura.

## 9. Elementos que no pertenecen a la arquitectura actual

La vista representa únicamente elementos que pueden comprobarse en el código actual.

Por lo tanto, no se representan como contenedores activos:

* API Gateway;
* microservicios;
* MySQL;
* PostgreSQL;
* Redis;
* motor de IA.

Estos elementos pueden corresponder a propuestas o evoluciones futuras del proyecto, pero no forman parte de la implementación actual comprobada.

## 10. Audiencia y propósito

| Audiencia                | Propósito                                                |
| ------------------------ | -------------------------------------------------------- |
| Equipo de desarrollo     | Comprender la organización actual de CookSmart           |
| Docente / evaluador      | Verificar la correspondencia entre arquitectura y código |
| Integrantes del proyecto | Identificar responsabilidades y dependencias             |
| Futuros desarrolladores  | Comprender la estructura actual del sistema              |

La vista de contenedores permite pasar del contexto general del sistema al detalle de sus principales partes y sirve como base para construir posteriormente la vista C4 de componentes.
