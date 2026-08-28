# Validación de Código — CookSmart

## 1. Propósito

Este documento valida que los elementos descritos en la arquitectura C4 de CookSmart corresponden con funcionalidades y estructuras presentes en el código fuente actual del proyecto.

La validación se realiza mediante la revisión de archivos HTML y JavaScript del repositorio, identificando funciones, variables, módulos y llamadas que evidencian las responsabilidades descritas en los modelos arquitectónicos.

---

## 2. Archivos revisados

Durante la validación se revisaron principalmente los siguientes archivos:

```text
index.html
recetas.html
recetas-db.js
firebase-sync.js
themealdb.js
```

También se verificó el uso de `RECETAS_DB` dentro de las diferentes páginas de la aplicación.

---

## 3. Validación del catálogo de recetas

### Evidencia

Archivo:

```text
recetas-db.js
```

Elemento identificado:

```javascript
const RECETAS_DB = [
```

El archivo contiene el catálogo principal de recetas utilizado por la aplicación.

Cada receta contiene información como:

```text
id
nombre
categoria
etiquetas
restricciones
ingredientes
tiempo
dificultad
porciones
imagen
descripcion
pasos
```

### Validación

Se confirma que `RECETAS_DB` constituye una fuente de datos utilizada por diferentes funcionalidades de CookSmart.

Además, se identificaron operaciones como:

```javascript
RECETAS_DB.filter(...)
```

y:

```javascript
RECETAS_DB.find(...)
```

Por lo tanto, el componente **Catálogo de recetas** documentado en el C4 tiene correspondencia directa con el código fuente.

---

## 4. Validación del gestor de recetas

### Evidencia

Archivo:

```text
index.html
```

Funciones identificadas:

```javascript
renderRecetas(recetas, gridId)
cargarRecetasPopulares()
```

`renderRecetas()` genera dinámicamente las tarjetas de recetas y muestra información como:

```text
nombre
imagen
tiempo
dificultad
porcentaje de coincidencia
estado de favorito
```

También se identificó el uso de:

```javascript
RECETAS_DB.filter(...)
```

dentro de `cargarRecetasPopulares()` para obtener recetas relacionadas.

### Validación

Se confirma que existe una responsabilidad de presentación y preparación de recetas implementada directamente en `index.html`.

Por lo tanto, el componente **Gestor de recetas** del C4 corresponde con funcionalidades observables en el código.

---

## 5. Validación del gestor de filtros

### Evidencia

En `index.html` se identificó:

```javascript
function filtrarPorRestricciones(recetas)
```

Esta función consulta información almacenada en:

```text
cookSmartRestricciones
cookSmartGustos
```

mediante `localStorage`.

También se identificó en:

```text
recetas.html
```

la función:

```javascript
function aplicarFiltros()
```

Esta función aplica filtros relacionados con:

```text
ingredientes disponibles
tiempo
dificultad
categoría
```

### Validación

Se confirma que la aplicación posee lógica implementada para filtrar las recetas de acuerdo con diferentes criterios.

Por lo tanto, el componente **Gestor de filtros** tiene trazabilidad directa con el código fuente.

---

## 6. Validación del gestor de favoritos

### Evidencia

En `index.html` se identificó:

```javascript
function toggleFav(e, id, btnElement)
```

y:

```javascript
function updateNavBadge()
```

En `recetas.html` también se identificó:

```javascript
window.toggleFav = function(e, id, btnElement)
```

La función `toggleFav()` utiliza:

```javascript
RECETAS_DB.find(r => r.id === id)
```

para localizar la receta seleccionada.

Posteriormente modifica la lista de favoritos y utiliza:

```javascript
localStorage.setItem(
    'cooksmart_favoritos',
    JSON.stringify(favoritosLocales)
);
```

### Validación

Se confirma que la aplicación implementa las operaciones de agregar y eliminar favoritos, así como la actualización del contador visual y la persistencia local.

Por lo tanto, el componente **Gestor de favoritos** está respaldado por código existente.

---

## 7. Validación de la persistencia local

### Evidencia

En diferentes archivos se identificó el uso de:

```javascript
localStorage.getItem(...)
```

y:

```javascript
localStorage.setItem(...)
```

Entre las claves utilizadas se encuentran:

```text
cooksmart_favoritos
cookSmartIngredientes
cookSmartGustos
cookSmartRestricciones
```

### Validación

Se confirma que `localStorage` es utilizado como mecanismo de almacenamiento local para información necesaria para el funcionamiento de la aplicación.

Además, `firebase-sync.js` intercepta modificaciones realizadas sobre:

```text
cooksmart_favoritos
```

para permitir su sincronización con Firebase cuando existe un usuario autenticado.

---

## 8. Validación del sincronizador Firebase

### Evidencia

Archivo:

```text
firebase-sync.js
```

Funciones identificadas:

```javascript
syncFavoritosToFirebase(favs)
loadFavoritosFromFirebase(uid)
```

También se identificó:

```javascript
firebase.auth()
```

y:

```javascript
firebase.database()
```

Para almacenar favoritos se utiliza:

```javascript
fbDB.ref(
    'usuarios/' + user.uid + '/favoritos'
).set(...)
```

Para recuperarlos:

```javascript
fbDB.ref(
    'usuarios/' + uid + '/favoritos'
).get()
```

También se utiliza:

```javascript
fbAuth.onAuthStateChanged(...)
```

para reaccionar a cambios en el estado de autenticación.

### Validación

Se confirma que existe integración con Firebase Authentication y Firebase Realtime Database.

La aplicación utiliza el identificador del usuario autenticado para asociar sus favoritos dentro de:

```text
usuarios/{uid}/favoritos
```

Por lo tanto, el componente **Sincronizador Firebase** descrito en el C4 corresponde con el código implementado.

---

## 9. Validación del gestor de interfaz

### Evidencia

En `index.html` se identificaron las siguientes funciones:

```javascript
mostrarToast()
abrirModal(receta)
cerrarModal()
scrollRecom(direccion)
```

Estas funciones controlan diferentes elementos de interacción de la interfaz.

### Validación

Se confirma que existe código encargado de:

* mostrar mensajes temporales;
* abrir información de una receta;
* cerrar la ventana de detalle;
* controlar la navegación de recomendaciones.

Por lo tanto, el componente **Gestor de interfaz** tiene correspondencia con funcionalidades existentes en el código.

---

## 10. Validación de integración externa TheMealDB

### Evidencia

Archivo:

```text
themealdb.js
```

Se identificaron:

```javascript
const THEMEALDB_BASE =
    'https://www.themealdb.com/api/json/v1/1';
```

y:

```javascript
async function buscarTheMealDB(query)
```

El archivo contiene lógica para consultar la API pública de TheMealDB y transformar sus resultados al formato utilizado por CookSmart.

### Resultado de la validación

La existencia del archivo y de la función fue confirmada.

Sin embargo, en la revisión realizada no se encontró una página HTML que cargue explícitamente `themealdb.js` ni una llamada activa a:

```javascript
buscarTheMealDB()
```

Por esta razón, TheMealDB se considera actualmente una **integración preparada o no activa**, y no un componente activo del flujo principal documentado en el C4.

---

## 11. Tabla de trazabilidad

| Elemento arquitectónico | Archivo                       | Evidencia de código                                        | Estado    |
| ----------------------- | ----------------------------- | ---------------------------------------------------------- | --------- |
| Catálogo de recetas     | `recetas-db.js`               | `RECETAS_DB`                                               | Validado  |
| Gestor de recetas       | `index.html`                  | `renderRecetas()`, `cargarRecetasPopulares()`              | Validado  |
| Gestor de filtros       | `index.html` / `recetas.html` | `filtrarPorRestricciones()`, `aplicarFiltros()`            | Validado  |
| Gestor de favoritos     | `index.html` / `recetas.html` | `toggleFav()`, `updateNavBadge()`                          | Validado  |
| Persistencia local      | HTML / JavaScript             | `localStorage`                                             | Validado  |
| Sincronizador Firebase  | `firebase-sync.js`            | `syncFavoritosToFirebase()`, `loadFavoritosFromFirebase()` | Validado  |
| Autenticación           | `firebase-sync.js`            | `firebase.auth()`, `onAuthStateChanged()`                  | Validado  |
| Base de datos Firebase  | `firebase-sync.js`            | `firebase.database()`, `fbDB.ref()`                        | Validado  |
| Gestor de interfaz      | `index.html`                  | `mostrarToast()`, `abrirModal()`, `cerrarModal()`          | Validado  |
| Integración TheMealDB   | `themealdb.js`                | `buscarTheMealDB()`                                        | No activa |

---

## 12. Resultado

La revisión del código confirma que los principales componentes documentados en la arquitectura C4 de CookSmart tienen correspondencia con elementos concretos del repositorio.

Se encontró trazabilidad entre:

```text
Arquitectura C4
       ↓
Componentes
       ↓
Archivos
       ↓
Funciones y estructuras
       ↓
Código implementado
```

Los componentes de recetas, filtros, favoritos, persistencia local, sincronización con Firebase e interfaz presentan evidencia directa en el código revisado.

La integración con TheMealDB también fue identificada en el repositorio, pero actualmente no se considera parte del flujo activo debido a que no se encontró evidencia de su utilización desde las páginas HTML revisadas.

Por lo tanto, la arquitectura documentada representa de manera consistente las responsabilidades observables en la implementación actual de CookSmart.
