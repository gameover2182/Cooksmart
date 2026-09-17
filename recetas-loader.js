/* =============================================
   RECETAS LOADER - Cook Smart
   Reemplaza a recetas-db.js. Antes, RECETAS_DB era un array
   hardcodeado de +200 recetas embebido en el archivo. Ahora se
   carga desde la API (Postgres) al cargar.

   Para no reescribir toda la lógica de cada página (que asume
   `RECETAS_DB` ya poblado de forma síncrona), este script:
     1. Hace fetch a la API en cuanto se carga.
     2. Llena `window.RECETAS_DB` con el mismo formato de objeto
        que usaba el array viejo.
     3. Dispara el evento 'recetasDBReady' cuando ya está listo.

   Las páginas que antes asumían RECETAS_DB disponible de inmediato
   ahora deben esperar ese evento antes de renderizar. Es el único
   cambio manual que hay que hacer en cada página (ver guía abajo).
   ============================================= */

const _RECETAS_API_BASE = window.COOKSMART_API_BASE || 'http://localhost:3000/api';

window.RECETAS_DB = [];
window.recetasDBListo = false;

function _adaptarReceta(receta) {
    // Traduce la forma que devuelve la API (tablas normalizadas) a la
    // forma plana que las páginas ya saben leer (mismo "shape" que el
    // viejo RECETAS_DB, para minimizar cambios en el resto del código).
    return {
        id: receta.id_receta,
        nombre: receta.nombre_receta,
        categoria: (receta.categoria_receta || '').toLowerCase(),
        tipoCocina: receta.tipo_cocina,
        tiempo: receta.tiempo_prep_min,
        descripcion: receta.descripcion,
        instrucciones: receta.instrucciones,
        pasos: receta.pasos || [],
        imagen: receta.imagen_url,
        dificultad: receta.dificultad,
        porciones: receta.porciones,
        calorias: receta.calorias,
        proteina: receta.proteina_g,
        carbos: receta.carbos_g,
        grasa: receta.grasa_g,
        etiquetas: receta.etiquetas || [],
        restricciones: receta.restricciones || [],
        ingredientes: (receta.ingredientes || []).map(i => i.nombre_ingrediente),
        ingredientesDetalle: receta.ingredientes || [],
    };
}

async function _cargarRecetasDesdeAPI() {
    try {
        const resp = await fetch(`${_RECETAS_API_BASE}/recetas`);
        if (!resp.ok) throw new Error(`API respondió ${resp.status}`);
        const recetas = await resp.json();

        window.RECETAS_DB = recetas.map(_adaptarReceta);
        window.recetasDBListo = true;
        window.dispatchEvent(new Event('recetasDBReady'));
    } catch (err) {
        console.error('No se pudieron cargar las recetas desde la API:', err);
        window.RECETAS_DB = [];
        window.recetasDBListo = true; // listo, aunque vacío, para no colgar la página
        window.dispatchEvent(new Event('recetasDBReady'));
    }
}

_cargarRecetasDesdeAPI();

