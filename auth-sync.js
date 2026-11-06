/* =============================================
   AUTH SYNC - Cook Smart (100% Postgres, sin Firebase)
   Reemplaza a firebase-sync.js. Toda la autenticación y sincronización
   de datos (favoritos, inventario, historial) vive en el backend propio
   (Node.js + Express) sobre PostgreSQL. No hay ninguna dependencia
   externa: todo corre con `docker compose up` sin necesitar credenciales
   de terceros.
   ============================================= */

const _AUTH_API_BASE = window.COOKSMART_API_BASE || 'http://localhost:3000/api';
const TOKEN_KEY = 'cooksmart_token';
const USUARIO_KEY = 'cooksmart_usuario';

let _favoritosConocidos = [];

function _tokenActual() {
    return localStorage.getItem(TOKEN_KEY);
}

function _usuarioActual() {
    const raw = localStorage.getItem(USUARIO_KEY);
    return raw ? JSON.parse(raw) : null;
}

async function _apiFetch(path, opciones = {}) {
    const token = _tokenActual();
    const headers = { 'Content-Type': 'application/json', ...(opciones.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    const resp = await fetch(`${_AUTH_API_BASE}${path}`, { ...opciones, headers });
    if (!resp.ok) {
        const cuerpo = await resp.json().catch(() => ({}));
        throw Object.assign(new Error(cuerpo.error || `Error ${resp.status}`), { status: resp.status });
    }
    return resp.status === 204 ? null : resp.json();
}

// ---- REGISTRO / LOGIN / LOGOUT ----

async function cookSmartRegistrar(nombre, correo, contrasena) {
    const data = await _apiFetch('/auth/registro', {
        method: 'POST',
        body: JSON.stringify({ nombre, correo, contrasena }),
    });
    _guardarSesion(data);
    return data.usuario;
}

async function cookSmartLogin(correo, contrasena) {
    const data = await _apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ correo, contrasena }),
    });
    _guardarSesion(data);
    return data.usuario;
}

function cookSmartLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    localStorage.removeItem('cooksmart_favoritos');
    updateNavAuthUI(null);
    window.dispatchEvent(new Event('authUpdated'));
}

function _guardarSesion({ usuario, token }) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

window.CookSmartAuth = {
    registrar: cookSmartRegistrar,
    login: cookSmartLogin,
    logout: cookSmartLogout,
    usuarioActual: _usuarioActual,
    apiFetch: _apiFetch,
};

// ---- FAVORITOS ----

async function cargarFavoritosDesdeAPI(idUsuario) {
    try {
        const favoritos = await _apiFetch(`/usuarios/${idUsuario}/favoritos`);
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

async function _sincronizarFavoritosConAPI(idUsuario, nuevaLista) {
    const idsNuevos = nuevaLista.map(r => (typeof r === 'object' ? r.id : r));
    const idsViejos = _favoritosConocidos.map(r => (typeof r === 'object' ? r.id : r));

    const agregados = idsNuevos.filter(id => !idsViejos.includes(id));
    const quitados = idsViejos.filter(id => !idsNuevos.includes(id));

    for (const idReceta of agregados) {
        await _apiFetch(`/usuarios/${idUsuario}/favoritos`, { method: 'POST', body: JSON.stringify({ idReceta }) })
            .catch(e => console.warn('No se pudo agregar favorito:', e));
    }
    for (const idReceta of quitados) {
        await _apiFetch(`/usuarios/${idUsuario}/favoritos/${idReceta}`, { method: 'DELETE' })
            .catch(e => console.warn('No se pudo quitar favorito:', e));
    }

    _favoritosConocidos = nuevaLista;
}

const _origSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function (key, value) {
    _origSetItem(key, value);
    const usuario = _usuarioActual();
    if (key === 'cooksmart_favoritos' && usuario) {
        try {
            _sincronizarFavoritosConAPI(usuario.id_usuario, JSON.parse(value));
        } catch (e) {
            /* valor no parseable, se ignora */
        }
    }
};

// ---- INVENTARIO (MI NEVERA) ----
// El backend (PostgreSQL) es la fuente de verdad del inventario cuando hay sesión.
// La página "Mi Nevera" sigue renderizando desde localStorage ('cookSmartNevera'),
// pero aquí se hidrata desde la API y se escribe a través de ella. El backend exige
// un id_ingrediente del catálogo (51 ingredientes), así que las altas van por el
// catálogo; los ingredientes de texto libre solo existen sin sesión (modo local).

let _catalogoIngredientes = null;
let _mapaNombreAId = null;

async function _cargarCatalogoIngredientes() {
    if (_catalogoIngredientes) return _catalogoIngredientes;
    const resp = await fetch(`${_AUTH_API_BASE}/ingredientes`);
    if (!resp.ok) throw new Error(`Catálogo de ingredientes: ${resp.status}`);
    _catalogoIngredientes = await resp.json();
    _mapaNombreAId = new Map(
        _catalogoIngredientes.map(i => [i.nombre_ingrediente.trim().toLowerCase(), i])
    );
    return _catalogoIngredientes;
}

function _escribirNeveraLocal(lista) {
    // Escritura directa que NO dispara sincronización (no hay override para esta clave).
    _origSetItem('cookSmartNevera', JSON.stringify(lista));
}

// Traduce una fila de la API a la forma plana que usa Mi Nevera.
function _adaptarItemInventario(fila, catalogoPorId) {
    const cat = catalogoPorId.get(fila.id_ingrediente);
    // El POST de alta no devuelve nombre_ingrediente (el repo inserta sin el JOIN);
    // se completa desde el catálogo para que la página y el matching de recetas lo tengan.
    const nombre = (fila.nombre_ingrediente || (cat ? cat.nombre_ingrediente : '') || '').toLowerCase();
    return {
        id: fila.id_inventario,          // la página usa .id como identificador
        idInventario: fila.id_inventario,
        idIngrediente: fila.id_ingrediente,
        nombre,
        cantidad: fila.cantidad != null ? String(fila.cantidad) : '',
        unidad: fila.unidad || (cat ? cat.unidad_base : ''),
        fechaCompra: fila.fecha_compra ? String(fila.fecha_compra).split('T')[0] : null,
        fechaVencimiento: fila.fecha_vencimiento ? String(fila.fecha_vencimiento).split('T')[0] : null,
        categoria: cat ? cat.categoria : 'otros',
        persistido: true,
    };
}

async function _cargarInventarioDesdeAPI(idUsuario) {
    await _cargarCatalogoIngredientes();
    const catalogoPorId = new Map(_catalogoIngredientes.map(i => [i.id_ingrediente, i]));
    const filas = await _apiFetch(`/usuarios/${idUsuario}/inventario`);
    const lista = filas.map(f => _adaptarItemInventario(f, catalogoPorId));
    _escribirNeveraLocal(lista);
    window.dispatchEvent(new Event('inventarioReady'));
    return lista;
}

window.CookSmartInventario = {
    // Catálogo (para construir el selector de ingredientes de la página).
    async catalogo() { return _cargarCatalogoIngredientes(); },
    idDeNombre(nombre) {
        const i = _mapaNombreAId && _mapaNombreAId.get((nombre || '').trim().toLowerCase());
        return i ? i.id_ingrediente : null;
    },
    // Alta en la API. Devuelve el item ya adaptado (con idInventario), o lanza.
    async agregar(idUsuario, { idIngrediente, cantidad, unidad, fechaCompra, fechaVencimiento }) {
        await _cargarCatalogoIngredientes();
        const catalogoPorId = new Map(_catalogoIngredientes.map(i => [i.id_ingrediente, i]));
        const cat = catalogoPorId.get(idIngrediente);
        // El backend exige unidad; si no se indica, usamos la unidad base del catálogo.
        const unidadFinal = unidad || (cat ? cat.unidad_base : 'unidad');
        const cantidadFinal = (cantidad === undefined || cantidad === null || cantidad === '') ? 1 : cantidad;
        const fila = await _apiFetch(`/usuarios/${idUsuario}/inventario`, {
            method: 'POST',
            body: JSON.stringify({ idIngrediente, cantidad: cantidadFinal, unidad: unidadFinal, fechaCompra, fechaVencimiento }),
        });
        return _adaptarItemInventario(fila, catalogoPorId);
    },
    async eliminar(idUsuario, idInventario) {
        await _apiFetch(`/usuarios/${idUsuario}/inventario/${idInventario}`, { method: 'DELETE' });
    },
};

// ---- NAVBAR + ESTADO DE SESIÓN ----

function updateNavAuthUI(usuario) {
    const btn = document.getElementById('btn-login');
    if (!btn) return;

    if (usuario) {
        const nombre = usuario.nombre ? usuario.nombre.split(' ')[0] : 'Usuario';
        btn.innerHTML = `👤 ${nombre} ▾`;
        btn.href = 'perfil.html';
    } else {
        btn.textContent = 'Iniciar Sesión';
        btn.href = 'login.html';
    }
}

async function _inicializarSesion() {
    const usuario = _usuarioActual();
    const token = _tokenActual();

    if (!usuario || !token) {
        updateNavAuthUI(null);
        window.dispatchEvent(new Event('authUpdated'));
        return;
    }

    try {
        await cargarFavoritosDesdeAPI(usuario.id_usuario);
        // Inventario: hidratar "Mi Nevera" desde la API (no bloquea si falla).
        _cargarInventarioDesdeAPI(usuario.id_usuario).catch(e => console.warn('Inventario API:', e));
        if (typeof window.updateNavBadge === 'function') window.updateNavBadge();
        updateNavAuthUI(usuario);
    } catch (e) {
        // Token vencido/inválido (ej. expiró a los 7 días): cerrar sesión local
        cookSmartLogout();
        return;
    }

    window.dispatchEvent(new Event('authUpdated'));
}

_inicializarSesion();