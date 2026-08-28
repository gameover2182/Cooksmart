/* =============================================
   FIREBASE SYNC - Cook Smart (arquitectura híbrida)
   Firebase se usa ÚNICAMENTE para autenticación (login/registro).
   Los favoritos, inventario e historial YA NO se guardan en Firebase
   Realtime Database -- viven en Postgres, a través de /api/me/* del
   backend propio. El backend verifica el ID token de Firebase en cada
   request (no confía en nada que venga del navegador sin verificar).
   ============================================= */

const COOKSMART_API_BASE = window.COOKSMART_API_BASE || 'http://localhost:3000/api';

const firebaseConfig = {
    apiKey: "AIzaSyA60XhpKmHY5KV2mozo2_mzMWRTbq7Qwj4",
    authDomain: "cook-smart-626ff.firebaseapp.com",
    projectId: "cook-smart-626ff",
    storageBucket: "cook-smart-626ff.firebasestorage.app",
    messagingSenderId: "339922416882",
    appId: "1:339922416882:web:68891748b48ee00a2d8c6b"
    // Nota: ya no se necesita "databaseURL" -- Firebase Realtime Database
    // no se usa más para datos de la app, solo Firebase Auth.
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let _favoritosConocidos = [];

async function _idTokenActual() {
    const usuario = auth.currentUser;
    if (!usuario) return null;
    return usuario.getIdToken(); // el SDK de Firebase refresca solo si venció
}

async function _apiFetch(path, opciones = {}) {
    const token = await _idTokenActual();
    const headers = { 'Content-Type': 'application/json', ...(opciones.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    const resp = await fetch(`${COOKSMART_API_BASE}${path}`, { ...opciones, headers });
    if (!resp.ok) {
        const cuerpo = await resp.json().catch(() => ({}));
        throw Object.assign(new Error(cuerpo.error || `Error ${resp.status}`), { status: resp.status });
    }
    return resp.status === 204 ? null : resp.json();
}

// ---- FAVORITOS (equivalente a lo que antes hacía Realtime Database) ----

async function cargarFavoritosDesdeAPI() {
    try {
        const favoritos = await _apiFetch('/me/favoritos');
        const idsFavoritos = favoritos.map(f => f.id_receta);

        if (typeof window.RECETAS_DB !== 'undefined' && window.RECETAS_DB.length) {
            const favs = idsFavoritos.map(id => window.RECETAS_DB.find(r => r.id === id)).filter(Boolean);
            _favoritosConocidos = favs;
            localStorage.setItem('cooksmart_favoritos', JSON.stringify(favs));
        } else {
            _favoritosConocidos = idsFavoritos;
            localStorage.setItem('cooksmart_favoritos', JSON.stringify(idsFavoritos));
        }
    } catch (e) {
        console.warn('Error cargando favoritos desde la API:', e);
    }
}

async function _sincronizarFavoritosConAPI(nuevaLista) {
    const idsNuevos = nuevaLista.map(r => (typeof r === 'object' ? r.id : r));
    const idsViejos = _favoritosConocidos.map(r => (typeof r === 'object' ? r.id : r));

    const agregados = idsNuevos.filter(id => !idsViejos.includes(id));
    const quitados = idsViejos.filter(id => !idsNuevos.includes(id));

    for (const idReceta of agregados) {
        await _apiFetch('/me/favoritos', { method: 'POST', body: JSON.stringify({ idReceta }) })
            .catch(e => console.warn('No se pudo agregar favorito:', e));
    }
    for (const idReceta of quitados) {
        await _apiFetch(`/me/favoritos/${idReceta}`, { method: 'DELETE' })
            .catch(e => console.warn('No se pudo quitar favorito:', e));
    }

    _favoritosConocidos = nuevaLista;
}

const _origSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function (key, value) {
    _origSetItem(key, value);
    if (key === 'cooksmart_favoritos' && auth.currentUser) {
        try {
            _sincronizarFavoritosConAPI(JSON.parse(value));
        } catch (e) {
            /* valor no parseable, se ignora */
        }
    }
};

// ---- NAVBAR + ESTADO DE SESIÓN ----

function updateNavAuthUI(usuario) {
    const btn = document.getElementById('btn-login');
    if (!btn) return;

    if (usuario) {
        const nombre = usuario.displayName ? usuario.displayName.split(' ')[0] : 'Usuario';
        btn.innerHTML = `👤 ${nombre} ▾`;
        btn.href = 'perfil.html';
    } else {
        btn.textContent = 'Iniciar Sesión';
        btn.href = 'login.html';
    }
}

// onAuthStateChanged sigue siendo 100% de Firebase -- es la parte que
// SÍ seguimos usando tal cual. Lo único nuevo es que, en vez de leer
// favoritos de Realtime Database, los pide a la API/Postgres.
auth.onAuthStateChanged(async (usuario) => {
    if (usuario) {
        await cargarFavoritosDesdeAPI();
        if (typeof window.updateNavBadge === 'function') window.updateNavBadge();
        updateNavAuthUI(usuario);
    } else {
        localStorage.removeItem('cooksmart_favoritos');
        updateNavAuthUI(null);
    }
    window.dispatchEvent(new Event('authUpdated'));
});