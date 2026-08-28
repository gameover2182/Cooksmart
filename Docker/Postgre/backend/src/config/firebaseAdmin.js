const admin = require('firebase-admin');

// El backend necesita las credenciales de "cuenta de servicio" del
// proyecto de Firebase (Consola de Firebase -> Configuración del proyecto
// -> Cuentas de servicio -> Generar nueva clave privada). NO es la misma
// firebaseConfig pública que usa el frontend (esa es intencionalmente
// pública). El JSON de la cuenta de servicio es secreto: nunca subirlo
// al repositorio.
//
// Se soportan dos formas de configurarlo (para no atarnos a un solo
// flujo en Docker vs. local):
//   - FIREBASE_SERVICE_ACCOUNT_JSON: el contenido completo del JSON,
//     como variable de entorno (útil para pasarlo en docker-compose/.env)
//   - FIREBASE_SERVICE_ACCOUNT_PATH: ruta a un archivo .json montado
//     como volumen en el contenedor
//
// Si ninguna está configurada, el servidor sigue arrancando (para no
// tumbar el resto de la API), pero las rutas /api/me/* devuelven 501
// hasta que se configure. Esto es deliberado: no se puede probar contra
// el proyecto de Firebase real de este equipo sin esas credenciales.

let firebaseApp = null;

function inicializarFirebaseAdmin() {
    if (firebaseApp) return firebaseApp;

    let credenciales;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        credenciales = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        credenciales = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    } else {
        console.warn(
            '[firebaseAdmin] No hay credenciales de Firebase configuradas ' +
            '(FIREBASE_SERVICE_ACCOUNT_JSON o FIREBASE_SERVICE_ACCOUNT_PATH). ' +
            'Las rutas /api/me/* devolverán 501 hasta que se configuren.'
        );
        return null;
    }

    firebaseApp = admin.initializeApp({ credential: admin.credential.cert(credenciales) });
    return firebaseApp;
}

function estaConfigurado() {
    return Boolean(
        process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    );
}

module.exports = { inicializarFirebaseAdmin, estaConfigurado, admin };
