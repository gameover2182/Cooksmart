// Táctica de resiliencia T2 (EXP-003): caché en memoria del catálogo.
// El catálogo (recetas, categorías, tipos de cocina, ingredientes) no cambia en
// runtime (solo con el seed). Con CACHE_CATALOGO=on, las respuestas 200 de los
// GET públicos se guardan por CACHE_TTL_MS y se sirven sin consultar PostgreSQL
// ni volver a serializar el JSON.
const ACTIVO = process.env.CACHE_CATALOGO === 'on';
const TTL_MS = Number(process.env.CACHE_TTL_MS) || 60000;

const entradas = new Map();

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
            entradas.set(clave, { cuerpo: JSON.stringify(datos), expira: Date.now() + TTL_MS });
        }
        res.set('X-Cache', 'MISS');
        return jsonOriginal(datos);
    };
    next();
}

module.exports = { cacheCatalogo };
