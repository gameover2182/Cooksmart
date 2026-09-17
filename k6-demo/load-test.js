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
const meDuration = new Trend('perfil_duration');

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
    vus: 50,
    duration: '20s',

    thresholds: {
        // No más del 1% de peticiones con error
        http_req_failed: ['rate<0.01'],

        // Umbral general
        http_req_duration: ['p(95)<500'],

        // Métricas individuales
        login_duration: ['p(95)<2000'],
        perfil_duration: ['p(95)<500'],

        recetas_duration: ['p(95)<500'],
        detalle_receta_duration: ['p(95)<500'],

        categorias_duration: ['p(95)<500'],
        tipos_cocina_duration: ['p(95)<500'],
        ingredientes_duration: ['p(95)<500'],

        favoritos_duration: ['p(95)<500'],
        historial_duration: ['p(95)<500'],
        inventario_duration: ['p(95)<500'],
    },
};


// ==========================================
// RECORRIDO COMPLETO DEL USUARIO
// ==========================================

export default function () {

    // ==========================================
    // 1. INICIAR SESIÓN
    // ==========================================

    const inicioLogin = Date.now();

    const loginResponse = http.post(
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

    loginDuration.add(Date.now() - inicioLogin);

    const loginCorrecto = check(loginResponse, {
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
        fail('El login fallo');
    }

    // Obtener JWT
    const token = loginResponse.json('token');

    // Obtener usuario
    const usuario = loginResponse.json('usuario');

    // ID real del usuario
    const idUsuario = usuario.id_usuario;

    // ==========================================
    // JWT PARA PETICIONES PROTEGIDAS
    // ==========================================

    const authHeaders = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    sleep(1);


    // ==========================================
    // 2. CONSULTAR MI PERFIL
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

    meDuration.add(Date.now() - inicioPerfil);

    check(perfil, {
        'PERFIL - HTTP 200': (r) => r.status === 200,
    });

    sleep(1);


    // ==========================================
    // 3. CONSULTAR TODAS LAS RECETAS
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
    // 4. CONSULTAR DETALLE DE UNA RECETA
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
    // 5. CONSULTAR CATEGORÍAS DE RECETAS
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
    // 6. CONSULTAR TIPOS DE COCINA
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
    // 7. CONSULTAR INGREDIENTES
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
    // 8. CONSULTAR FAVORITOS DEL USUARIO
    // GET /api/usuarios/:idUsuario/favoritos
    // ==========================================

    const inicioFavoritos = Date.now();

    const favoritos = http.get(
        `${BASE_URL}/api/usuarios/${idUsuario}/favoritos`,
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
    // 9. CONSULTAR HISTORIAL
    // GET /api/usuarios/:idUsuario/historial
    // ==========================================

    const inicioHistorial = Date.now();

    const historial = http.get(
        `${BASE_URL}/api/usuarios/${idUsuario}/historial`,
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
    // 10. CONSULTAR INVENTARIO / MI NEVERA
    // GET /api/usuarios/:idUsuario/inventario
    // ==========================================

    const inicioInventario = Date.now();

    const inventario = http.get(
        `${BASE_URL}/api/usuarios/${idUsuario}/inventario`,
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

    sleep(2);
}