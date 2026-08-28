/* =============================================
   THEMEALDB - Cook Smart
   Trae recetas de la base de datos pública TheMealDB
   (https://www.themealdb.com) y las traduce al mismo
   formato que usa RECETAS_DB, para poder mostrarlas
   con el mismo tipo de tarjetas.

   Es gratis y no necesita API key para la capa básica,
   así que se puede llamar directo desde el navegador.
   ============================================= */

const THEMEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

// Busca por nombre/ingrediente. Devuelve un arreglo de recetas
// YA MAPEADAS al formato de Cook Smart (nunca el formato crudo de la API).
async function buscarTheMealDB(query) {
    if (!query || !query.trim()) return [];
    try {
        const res = await fetch(THEMEALDB_BASE + '/search.php?s=' + encodeURIComponent(query.trim()));
        const data = await res.json();
        if (!data.meals) return [];
        return data.meals.map(mapearMealDBaCookSmart);
    } catch (e) {
        console.warn('Error consultando TheMealDB:', e);
        return [];
    }
}

// Convierte un "meal" crudo de TheMealDB al esquema de Cook Smart
function mapearMealDBaCookSmart(meal) {
    // Los ingredientes vienen en 20 pares de campos sueltos: strIngredient1..20 / strMeasure1..20
    const ingredientes = [];
    for (let i = 1; i <= 20; i++) {
        const ing = (meal['strIngredient' + i] || '').trim();
        if (ing) ingredientes.push(ing.toLowerCase());
    }

    const pasos = (meal.strInstructions || '')
        .split(/\r?\n/)
        .map(p => p.trim())
        .filter(Boolean);

    const descripcionCorta = (meal.strInstructions || '').slice(0, 160).trim() + '...';

    return {
        id: 'ext_' + meal.idMeal,          // prefijo para no chocar nunca con tus ids locales (1, 2, 3...)
        nombre: meal.strMeal,
        categoria: 'internacional',         // no mapea 1:1 a desayuno/almuerzo/cena, se marca aparte
        etiquetas: [meal.strArea, meal.strCategory].filter(Boolean),
        restricciones: meal.strCategory === 'Vegetarian' ? ['vegetariano'] : [],
        ingredientes: ingredientes,
        tiempo: 30,                         // TheMealDB no da tiempo real; se deja un estimado fijo
        dificultad: 'N/D',
        porciones: 4,                       // idem: valor por defecto para que el escalador de ingredientes no se rompa
        match: 0,
        imagen: meal.strMealThumb,
        descripcion: descripcionCorta + ' (datos aproximados, TheMealDB no da tiempo ni porciones exactas)',
        pasos: pasos,
        calorias: 0, proteina: 0, carbos: 0, grasa: 0, // TheMealDB no da info nutricional
        fuente: 'themealdb',                // <-- así distinguimos "tuyas" de "externas" en toda la app
        idExterno: meal.idMeal,
        urlOriginal: meal.strSource || meal.strYoutube || null
    };
}
