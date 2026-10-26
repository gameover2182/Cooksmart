// Control C6 (M7) — Cabeceras de seguridad mínimas y ocultamiento de tecnología.
//
// No añade dependencias (no usamos helmet) para no ampliar la superficie de
// npm audit; son las cabeceras que aplican a una API JSON servida tras un
// proxy. Cierra A9 (fingerprinting) del modelado de amenazas y endurece el
// navegador contra sniffing y clickjacking del front estático.
function cabecerasSeguridad(req, res, next) {
    // A9: no anunciar el framework. app.disable('x-powered-by') ya lo quita;
    // esto es defensa en profundidad por si se monta sub-app.
    res.removeHeader('X-Powered-By');

    // El navegador no debe adivinar el tipo de contenido (evita XSS por MIME).
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // La API no se embebe en iframes.
    res.setHeader('X-Frame-Options', 'DENY');
    // No filtrar el token en el Referer hacia terceros (themealdb, imágenes).
    res.setHeader('Referrer-Policy', 'no-referrer');
    // Esta API no usa Flash/PDF ni necesita políticas cross-domain.
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

    next();
}

module.exports = { cabecerasSeguridad };
