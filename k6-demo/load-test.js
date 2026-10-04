import http from 'k6/http';
import { check, fail } from 'k6';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics';

// ==========================================
// CONFIGURACIÓN
// ==========================================

const BASE_URL = 'http://localhost:3000';

const EMAIL = 'k6test@cooksmart.local';
const PASSWORD = 'K6_Prueba_2026!';

// ==========================================
// MÉTRICAS POR OPERACIÓN
// ==========================================

const loginDuration = new Trend('login_duration');
const perfilDuration = new Trend('perfil_duration');

const recetasDuration = new Trend('recetas_duration');
const detalleRecetaDuration = new Trend('detalle_receta_duration');

const categoriasDuration = new Trend('categorias_duration');
const tiposCocinaDuration = new Trend('tipos_cocina_duration');
const ingredientesDuration = new Trend('ingredientes_duration');

const favoritosDuration = new Trend('favoritos_duration');
const historialDuration = new Trend('historial_duration');
const inventarioDuration = new Trend('inventario_duration');

// ==========================================
// CONFIGURACIÓN DE K6
// ==========================================

export const options = {
    stages: [
    // Calentamiento
    { duration: '20s', target: 10 },

    // 25 usuarios
    { duration: '20s', target: 25 },

    // 50 usuarios
    { duration: '20s', target: 50 },

    // 100 usuarios
    { duration: '20s', target: 100 },

    // 200 usuarios
    { duration: '20s', target: 200 },

    // 300 usuarios
    { duration: '20s', target: 300 },

    // 400 usuarios
    { duration: '20s', target: 400 },

    // 500 usuarios
    { duration: '20s', target: 500 },

    // Descenso
    { duration: '30s', target: 0 },
],
    thresholds: {
        // Menos del 1% de peticiones con error
        http_req_failed: ['rate<0.01'],

        // Umbral general
        http_req_duration: ['p(95)<2000'],

        // Métricas individuales
        login_duration: ['p(95)<2000'],
        perfil_duration: ['p(95)<2000'],

        recetas_duration: ['p(95)<2000'],
        detalle_receta_duration: ['p(95)<2000'],

        categorias_duration: ['p(95)<2000'],
        tipos_cocina_duration: ['p(95)<2000'],
        ingredientes_duration: ['p(95)<2000'],

        favoritos_duration: ['p(95)<2000'],
        historial_duration: ['p(95)<2000'],
        inventario_duration: ['p(95)<2000'],
    },
};

// ==========================================
// SETUP
// Se ejecuta una vez antes de la prueba.
// Aquí obtenemos el JWT.
// ==========================================

export function setup() {
    console.log('==========================================');
    console.log('INICIANDO SETUP DE K6');
    console.log('==========================================');

    const inicioLogin = Date.now();

    const response = http.post(
        `${BASE_URL}/api/auth/login`,
        JSON.stringify({
            correo: EMAIL,
            contrasena: PASSWORD,
        }),
        {
            headers: {
                'Content-Type': 'application/json',
            },
            tags: {
                endpoint: 'login',
            },
        }
    );

    const tiempoLogin = Date.now() - inicioLogin;

    loginDuration.add(tiempoLogin);

    const loginCorrecto = check(response, {
        'LOGIN - HTTP 200': (r) => r.status === 200,

        'LOGIN - devuelve token': (r) => {
            try {
                return !!r.json('token');
            } catch (error) {
                return false;
            }
        },

        'LOGIN - devuelve usuario': (r) => {
            try {
                return !!r.json('usuario');
            } catch (error) {
                return false;
            }
        },
    });

    if (!loginCorrecto) {
        console.error('ERROR: El login inicial falló');
        console.error(`HTTP status: ${response.status}`);
        console.error(`Respuesta: ${response.body}`);

        fail('No se pudo iniciar sesión para la prueba');
    }

    const token = response.json('token');
    const usuario = response.json('usuario');

    console.log('Login inicial correcto');
    console.log(`Usuario de prueba: ${usuario.correo}`);
    console.log(`ID usuario: ${usuario.id_usuario}`);
    console.log(`Tiempo login: ${tiempoLogin} ms`);
    console.log('==========================================');

    return {
        token: token,
        idUsuario: usuario.id_usuario,
    };
}

// ==========================================
// RECORRIDO MIXTO
// ==========================================

export default function (data) {

    const authHeaders = {
        headers: {
            Authorization: `Bearer ${data.token}`,
        },
    };

    // ==========================================
    // 1. CONSULTAR PERFIL
    // GET /api/auth/me
    // ==========================================

    const inicioPerfil = Date.now();

    const perfil = http.get(
        `${BASE_URL}/api/auth/me`,
        {
            ...authHeaders,
            tags: {
                endpoint: 'perfil',
            },
        }
    );

    perfilDuration.add(Date.now() - inicioPerfil);

    check(perfil, {
        'PERFIL - HTTP 200': (r) => r.status === 200,
    });

    sleep(1);

    // ==========================================
    // 2. CONSULTAR TODAS LAS RECETAS
    // GET /api/recetas
    // ==========================================

    const inicioRecetas = Date.now();

    const recetas = http.get(
        `${BASE_URL}/api/recetas`,
        {
            tags: {
                endpoint: 'recetas',
            },
        }
    );

    recetasDuration.add(Date.now() - inicioRecetas);

    check(recetas, {
        'RECETAS - HTTP 200': (r) => r.status === 200,

        'RECETAS - devuelve JSON': (r) => {
            try {
                const datos = r.json();
                return Array.isArray(datos);
            } catch (error) {
                return false;
            }
        },
    });

    sleep(1);

    // ==========================================
    // 3. DETALLE DE UNA RECETA
    // GET /api/recetas/1
    // ==========================================

    const inicioDetalle = Date.now();

    const detalleReceta = http.get(
        `${BASE_URL}/api/recetas/1`,
        {
            tags: {
                endpoint: 'detalle_receta',
            },
        }
    );

    detalleRecetaDuration.add(Date.now() - inicioDetalle);

    check(detalleReceta, {
        'DETALLE RECETA - HTTP 200': (r) => r.status === 200,

        'DETALLE RECETA - devuelve JSON': (r) => {
            try {
                r.json();
                return true;
            } catch (error) {
                return false;
            }
        },
    });

    sleep(1);

    // ==========================================
    // 4. CATEGORÍAS DE RECETAS
    // GET /api/categorias-receta
    // ==========================================

    const inicioCategorias = Date.now();

    const categorias = http.get(
        `${BASE_URL}/api/categorias-receta`,
        {
            tags: {
                endpoint: 'categorias',
            },
        }
    );

    categoriasDuration.add(Date.now() - inicioCategorias);

    check(categorias, {
        'CATEGORIAS - HTTP 200': (r) => r.status === 200,
    });

    sleep(1);

    // ==========================================
    // 5. TIPOS DE COCINA
    // GET /api/tipos-cocina
    // ==========================================

    const inicioTiposCocina = Date.now();

    const tiposCocina = http.get(
        `${BASE_URL}/api/tipos-cocina`,
        {
            tags: {
                endpoint: 'tipos_cocina',
            },
        }
    );

    tiposCocinaDuration.add(Date.now() - inicioTiposCocina);

    check(tiposCocina, {
        'TIPOS COCINA - HTTP 200': (r) => r.status === 200,
    });

    sleep(1);

    // ==========================================
    // 6. INGREDIENTES
    // GET /api/ingredientes
    // ==========================================

    const inicioIngredientes = Date.now();

    const ingredientes = http.get(
        `${BASE_URL}/api/ingredientes`,
        {
            tags: {
                endpoint: 'ingredientes',
            },
        }
    );

    ingredientesDuration.add(Date.now() - inicioIngredientes);

    check(ingredientes, {
        'INGREDIENTES - HTTP 200': (r) => r.status === 200,
    });

    sleep(1);

    // ==========================================
    // 7. FAVORITOS
    // GET /api/usuarios/:idUsuario/favoritos
    // ==========================================

    const inicioFavoritos = Date.now();

    const favoritos = http.get(
        `${BASE_URL}/api/usuarios/${data.idUsuario}/favoritos`,
        {
            ...authHeaders,
            tags: {
                endpoint: 'favoritos',
            },
        }
    );

    favoritosDuration.add(Date.now() - inicioFavoritos);

    check(favoritos, {
        'FAVORITOS - HTTP 200': (r) => r.status === 200,

        'FAVORITOS - devuelve JSON': (r) => {
            try {
                const datos = r.json();
                return Array.isArray(datos);
            } catch (error) {
                return false;
            }
        },
    });

    sleep(1);

    // ==========================================
    // 8. HISTORIAL
    // GET /api/usuarios/:idUsuario/historial
    // ==========================================

    const inicioHistorial = Date.now();

    const historial = http.get(
        `${BASE_URL}/api/usuarios/${data.idUsuario}/historial`,
        {
            ...authHeaders,
            tags: {
                endpoint: 'historial',
            },
        }
    );

    historialDuration.add(Date.now() - inicioHistorial);

    check(historial, {
        'HISTORIAL - HTTP 200': (r) => r.status === 200,

        'HISTORIAL - devuelve JSON': (r) => {
            try {
                const datos = r.json();
                return Array.isArray(datos);
            } catch (error) {
                return false;
            }
        },
    });

    sleep(1);

    // ==========================================
    // 9. INVENTARIO / MI NEVERA
    // GET /api/usuarios/:idUsuario/inventario
    // ==========================================

    const inicioInventario = Date.now();

    const inventario = http.get(
        `${BASE_URL}/api/usuarios/${data.idUsuario}/inventario`,
        {
            ...authHeaders,
            tags: {
                endpoint: 'inventario',
            },
        }
    );

    inventarioDuration.add(Date.now() - inicioInventario);

    check(inventario, {
        'INVENTARIO - HTTP 200': (r) => r.status === 200,

        'INVENTARIO - devuelve JSON': (r) => {
            try {
                const datos = r.json();
                return Array.isArray(datos);
            } catch (error) {
                return false;
            }
        },
    });

    // ==========================================
    // FIN DEL RECORRIDO
    // ==========================================

    sleep(2);
}