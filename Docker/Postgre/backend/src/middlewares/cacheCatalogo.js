// Táctica de resiliencia T2 (EXP-003): caché en memoria del catálogo.
// El catálogo (recetas, categorías, tipos de cocina, ingredientes) no cambia en
// runtime (solo con el seed). Con CACHE_CATALOGO=on, las respuestas 200 de los
// GET públicos se guardan por CACHE_TTL_MS y se sirven sin consultar PostgreSQL
// ni volver a serializar el JSON.
const ACTIVO = process.env.CACHE_CATALOGO === 'on';
const TTL_MS = Number(process.env.CACHE_TTL_MS) || 60000;
// Control C3 (M7, amenaza A7): tope de entradas. La clave es req.originalUrl,
// así que GET /api/recetas?x=1..N generaría una entrada por query distinta y
// agotaría memoria. Con el tope, al llenarse se descarta la entrada más vieja
// (FIFO sobre el orden de inserción del Map).
const MAX_ENTRADAS = Number(process.env.CACHE_MAX_ENTRADAS) || 500;

const entradas = new Map();

function guardar(clave, valor) {
    if (entradas.size >= MAX_ENTRADAS && !entradas.has(clave)) {
        entradas.delete(entradas.keys().next().value); // descarta la más antigua
    }
    entradas.set(clave, valor);
}

function cacheCatalogo(req, res, next) {
    if (!ACTIVO || req.method !== 'GET') return next();

    const clave = req.originalUrl;
    const guardada = entradas.get(clave);
    if (guardada && guardada.expira > Date.now()) {
        res.set('X-Cache', 'HIT');
        return res.type('application/json').send(guardada.cuerpo);
    }

    const jsonOriginal = res.json.bind(res);
    res.json = (datos) => {
        if (res.statusCode === 200) {
            guardar(clave, { cuerpo: JSON.stringify(datos), expira: Date.now() + TTL_MS });
        }
        res.set('X-Cache', 'MISS');
        return jsonOriginal(datos);
    };
    next();
}

module.exports = { cacheCatalogo, _entradas: entradas, MAX_ENTRADAS };
