# C4 — Nivel Componentes: CookSmart Web

## 1. Propósito

Esta vista representa los principales componentes lógicos identificados dentro del contenedor **CookSmart Web**.

Los componentes se identifican a partir de las funciones y módulos actualmente implementados en el código fuente del proyecto.

El objetivo es mostrar cómo se organiza internamente la aplicación web y cómo sus componentes interactúan con el catálogo de recetas, el almacenamiento local y Firebase.

---

## 2. Contenedor seleccionado

### CookSmart Web

**Tecnología:** HTML, CSS y JavaScript.

**Responsabilidad:** proporcionar la interfaz web y ejecutar la lógica necesaria para consultar, filtrar, mostrar y gestionar recetas, favoritos y sesión del usuario.

Para esta vista se selecciona el flujo principal de recetas y favoritos, debido a que contiene funciones claramente identificables en el código y permite establecer trazabilidad directa entre arquitectura y código fuente.

---

## 3. Diagrama C4 de Componentes

```text
                         ┌──────────────────────┐
                         │       Usuario        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │       CookSmart Web          │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │ Gestor de recetas      │  │
                    │  │                        │  │
                    │  │ renderRecetas()        │  │
                    │  │ cargarRecetasPopulares()│ │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │              ▼               │
                    │  ┌────────────────────────┐  │
                    │  │ Gestor de filtros      │  │
                    │  │                        │  │
                    │  │ filtrarPorRestricciones│ │
                    │  │ aplicarFiltros()       │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │              ▼               │
                    │  ┌────────────────────────┐  │
                    │  │ Gestor de favoritos    │  │
                    │  │                        │  │
                    │  │ toggleFav()            │  │
                    │  │ updateNavBadge()       │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │              ▼               │
                    │  ┌────────────────────────┐  │
                    │  │ Persistencia local     │  │
                    │  │                        │  │
                    │  │ localStorage           │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │              ▼               │
                    │  ┌────────────────────────┐  │
                    │  │ Sincronizador Firebase │  │
                    │  │                        │  │
                    │  │ syncFavoritosToFirebase│  │
                    │  │ loadFavoritosFromFirebase││
                    │  └───────────┬────────────┘  │
                    └──────────────┼───────────────┘
                                   │
                                   ▼
                         ┌──────────────────────┐
                         │ Firebase             │
                         │ Authentication +     │
                         │ Realtime Database    │
                         └──────────────────────┘

                         ┌──────────────────────┐
                         │ RECETAS_DB           │
                         │ recetas-db.js        │
                         └──────────────────────┘
```

---

# 4. Componentes identificados

## 4.1 Gestor de recetas

### Responsabilidad

Se encarga de preparar y representar las recetas en la interfaz de CookSmart.

Entre sus responsabilidades se encuentran:

* generar las tarjetas de recetas;
* calcular el porcentaje de coincidencia con los ingredientes del usuario;
* mostrar información como nombre, imagen, tiempo y dificultad;
* determinar si una receta está marcada como favorita;
* cargar recetas populares o relacionadas con los favoritos.

### Código

Archivo:

```text
index.html
```

Funciones principales:

```javascript
renderRecetas(recetas, gridId)
cargarRecetasPopulares()
```

### Trazabilidad

`renderRecetas()` utiliza los datos proporcionados por `RECETAS_DB` y genera dinámicamente las tarjetas mediante elementos HTML.

`cargarRecetasPopulares()` obtiene los favoritos almacenados localmente, busca recetas similares dentro de `RECETAS_DB` y posteriormente utiliza `renderRecetas()` para mostrarlas.

---

## 4.2 Gestor de filtros

### Responsabilidad

Aplica las preferencias y restricciones del usuario sobre el conjunto de recetas disponibles.

Permite excluir recetas que no cumplen las restricciones seleccionadas y aplicar filtros relacionados con ingredientes, tiempo, dificultad y categoría.

### Código

Archivo:

```text
index.html
```

Función:

```javascript
filtrarPorRestricciones(recetas)
```

Además, en:

```text
recetas.html
```

se encuentra:

```javascript
aplicarFiltros()
```

### Trazabilidad

En `index.html`, `filtrarPorRestricciones()` obtiene las restricciones y gustos almacenados en `localStorage` y devuelve únicamente las recetas que cumplen las condiciones.

En `recetas.html`, `aplicarFiltros()` trabaja sobre `RECETAS_DB` y aplica filtros relacionados con:

* ingredientes disponibles;
* tiempo;
* dificultad;
* tipo o categoría.

---

## 4.3 Gestor de favoritos

### Responsabilidad

Gestiona la interacción del usuario con las recetas favoritas.

Sus responsabilidades principales son:

* agregar una receta a favoritos;
* eliminar una receta de favoritos;
* actualizar el estado visual del botón;
* guardar los favoritos localmente;
* actualizar el contador de favoritos.

### Código

En `index.html`:

```javascript
toggleFav(e, id, btnElement)
updateNavBadge()
```

En `recetas.html` también existe:

```javascript
window.toggleFav = function(e, id, btnElement)
```

### Trazabilidad

`toggleFav()` consulta `RECETAS_DB` para localizar la receta seleccionada.

Posteriormente modifica el arreglo de favoritos y lo guarda mediante:

```javascript
localStorage.setItem(
    'cooksmart_favoritos',
    JSON.stringify(favoritosLocales)
);
```

Después ejecuta:

```javascript
updateNavBadge();
```

para actualizar el contador de favoritos de la navegación.

---

## 4.4 Persistencia local

### Responsabilidad

Mantiene temporalmente en el navegador información necesaria para el funcionamiento de la aplicación.

Entre los datos identificados se encuentran:

```text
cooksmart_favoritos
cookSmartIngredientes
cookSmartGustos
cookSmartRestricciones
```

### Tecnología

```text
Web Storage API — localStorage
```

### Trazabilidad

El código utiliza operaciones como:

```javascript
localStorage.getItem(...)
```

y:

```javascript
localStorage.setItem(...)
```

para recuperar y guardar preferencias y favoritos.

La persistencia local también sirve como punto de integración con el sincronizador de Firebase.

---

## 4.5 Sincronizador Firebase

### Responsabilidad

Integra la aplicación web con Firebase y permite sincronizar los favoritos del usuario autenticado.

### Código

Archivo:

```text
firebase-sync.js
```

Funciones:

```javascript
syncFavoritosToFirebase(favs)
loadFavoritosFromFirebase(uid)
```

Además, el archivo utiliza:

```javascript
firebase.auth()
```

y:

```javascript
firebase.database()
```

### Trazabilidad

Para guardar favoritos utiliza:

```javascript
fbDB.ref(
    'usuarios/' + user.uid + '/favoritos'
).set(...)
```

Para recuperarlos utiliza:

```javascript
fbDB.ref(
    'usuarios/' + uid + '/favoritos'
).get()
```

El sincronizador también escucha los cambios de autenticación mediante:

```javascript
fbAuth.onAuthStateChanged(...)
```

---

## 4.6 Gestor de interfaz

### Responsabilidad

Controla elementos visuales relacionados con la interacción del usuario.

### Código

Archivo:

```text
index.html
```

Funciones:

```javascript
mostrarToast()
abrirModal(receta)
cerrarModal()
scrollRecom(direccion)
```

### Trazabilidad

`mostrarToast()` muestra mensajes temporales al usuario.

`abrirModal()` presenta información de una receta en una ventana modal.

`cerrarModal()` oculta dicha ventana.

`scrollRecom()` controla la navegación entre páginas de recomendaciones.

---

## 4.7 Catálogo de recetas

### Responsabilidad

Proporciona los datos base utilizados por los componentes de recetas y favoritos.

### Código

Archivo:

```text
recetas-db.js
```

Elemento principal:

```javascript
const RECETAS_DB = [...]
```

El catálogo contiene información de las recetas, incluyendo:

* identificador;
* nombre;
* categoría;
* etiquetas;
* restricciones;
* ingredientes;
* tiempo;
* dificultad;
* porciones;
* imagen;
* descripción;
* pasos;
* información nutricional.

### Trazabilidad

Las páginas de CookSmart consultan el catálogo mediante operaciones como:

```javascript
RECETAS_DB.filter(...)
```

y:

```javascript
RECETAS_DB.find(...)
```

---

# 5. Relaciones entre componentes

## Gestor de recetas → Catálogo de recetas

El gestor consulta `RECETAS_DB` para obtener la información necesaria para representar las recetas.

## Gestor de filtros → Catálogo de recetas

El gestor recibe un conjunto de recetas y aplica las restricciones y preferencias del usuario.

## Gestor de recetas → Gestor de favoritos

Durante el renderizado se comprueba si cada receta se encuentra en la lista de favoritos para representar correctamente el estado del botón.

## Gestor de favoritos → Persistencia local

Cuando el usuario agrega o elimina una receta, los favoritos se almacenan en `localStorage`.

## Persistencia local → Sincronizador Firebase

`firebase-sync.js` intercepta cambios realizados sobre `cooksmart_favoritos` y sincroniza la información con Firebase cuando existe un usuario autenticado.

## Sincronizador Firebase → Firebase Realtime Database

El sincronizador guarda y recupera los identificadores de las recetas favoritas dentro de:

```text
usuarios/{uid}/favoritos
```

## Sincronizador Firebase → Firebase Authentication

El sincronizador utiliza el usuario autenticado para determinar a qué cuenta pertenecen los favoritos.

---

# 6. Tabla de trazabilidad C4 ↔ código

| Componente             | Archivo                       | Funciones / elemento          | Evidencia                         |
| ---------------------- | ----------------------------- | ----------------------------- | --------------------------------- |
| Gestor de recetas      | `index.html`                  | `renderRecetas()`             | Genera tarjetas de recetas        |
| Gestor de recetas      | `index.html`                  | `cargarRecetasPopulares()`    | Obtiene y prepara recomendaciones |
| Gestor de filtros      | `index.html`                  | `filtrarPorRestricciones()`   | Aplica restricciones y gustos     |
| Gestor de filtros      | `recetas.html`                | `aplicarFiltros()`            | Aplica filtros de búsqueda        |
| Gestor de favoritos    | `index.html`                  | `toggleFav()`                 | Agrega y elimina favoritos        |
| Gestor de favoritos    | `index.html` / `recetas.html` | `updateNavBadge()`            | Actualiza contador                |
| Persistencia local     | HTML / JavaScript             | `localStorage`                | Guarda preferencias y favoritos   |
| Sincronizador Firebase | `firebase-sync.js`            | `syncFavoritosToFirebase()`   | Guarda favoritos en Firebase      |
| Sincronizador Firebase | `firebase-sync.js`            | `loadFavoritosFromFirebase()` | Recupera favoritos                |
| Sincronizador Firebase | `firebase-sync.js`            | `onAuthStateChanged()`        | Reacciona al estado de sesión     |
| Gestor de interfaz     | `index.html`                  | `mostrarToast()`              | Mensajes temporales               |
| Gestor de interfaz     | `index.html`                  | `abrirModal()`                | Muestra detalle                   |
| Gestor de interfaz     | `index.html`                  | `cerrarModal()`               | Cierra detalle                    |
| Gestor de interfaz     | `index.html`                  | `scrollRecom()`               | Navega recomendaciones            |
| Catálogo de recetas    | `recetas-db.js`               | `RECETAS_DB`                  | Fuente principal de recetas       |

---

# 7. Validación de la arquitectura

La identificación de los componentes se realizó revisando el código existente del repositorio.

Se verificó que:

1. `RECETAS_DB` está definido en `recetas-db.js`.
2. Las páginas de recetas consultan `RECETAS_DB`.
3. `index.html` implementa funciones para renderizar y recomendar recetas.
4. `recetas.html` implementa funciones de renderizado y filtrado.
5. Los favoritos se gestionan mediante `toggleFav()`.
6. Los favoritos se almacenan en `localStorage`.
7. `firebase-sync.js` sincroniza los favoritos con Firebase.
8. Firebase Authentication proporciona el usuario autenticado utilizado para identificar los datos.
9. Firebase Realtime Database almacena los identificadores de favoritos asociados al usuario.

Por lo tanto, los componentes documentados corresponden a responsabilidades observables en el código fuente actual.

---

# 8. Limitaciones

Esta vista no representa como componentes activos funcionalidades que no se pudieron comprobar en el código revisado.

En particular, `themealdb.js` contiene una integración con TheMealDB, pero no se encontró ninguna página HTML que cargue el archivo ni llamadas a `buscarTheMealDB()`.

Por esta razón, TheMealDB no se incluye como componente activo del C4 actual.

Asimismo, no se representan como componentes implementados tecnologías o servicios que no aparecen en el código revisado.

---

# 9. Audiencia y propósito

| Audiencia                | Propósito                                               |
| ------------------------ | ------------------------------------------------------- |
| Equipo de desarrollo     | Comprender la organización interna de CookSmart Web     |
| Docente                  | Verificar la correspondencia entre componentes y código |
| Integrantes del proyecto | Identificar responsabilidades y dependencias            |
| Futuros desarrolladores  | Facilitar la comprensión y evolución del sistema        |

Esta vista permite relacionar directamente cada componente arquitectónico con las funciones y archivos que implementan su responsabilidad.
