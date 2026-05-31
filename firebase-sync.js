/* =============================================
   FIREBASE SYNC - Cook Smart
   Archivo compartido para TODAS las páginas.
   Maneja: auth navbar, favoritos sync, perfil.
   ============================================= */

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyA60XhpKmHY5KV2mozo2_mzMWRTbq7Qwj4",
    authDomain: "cook-smart-626ff.firebaseapp.com",
    databaseURL: "https://cook-smart-626ff-default-rtdb.firebaseio.com",
    projectId: "cook-smart-626ff",
    storageBucket: "cook-smart-626ff.firebasestorage.app",
    messagingSenderId: "339922416882",
    appId: "1:339922416882:web:68891748b48ee00a2d8c6b"
};

if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
const fbAuth = firebase.auth();
const fbDB = firebase.database();

// ---- FAVORITOS SYNC ----

// Guardar favoritos en Firebase
function syncFavoritosToFirebase(favs) {
    const user = fbAuth.currentUser;
    if (!user) return;
    fbDB.ref('usuarios/' + user.uid + '/favoritos').set(
        favs.map(f => f.id)
    );
}

// Cargar favoritos desde Firebase al localStorage
async function loadFavoritosFromFirebase(uid) {
    try {
        const snap = await fbDB.ref('usuarios/' + uid + '/favoritos').get();
        if (snap.exists()) {
            const ids = snap.val();
            // Reconstruir objetos completos desde RECETAS_DB si existe
            if (typeof RECETAS_DB !== 'undefined') {
                const favs = ids.map(id => RECETAS_DB.find(r => r.id === id)).filter(Boolean);
                localStorage.setItem('cooksmart_favoritos', JSON.stringify(favs));
            } else {
                localStorage.setItem('cooksmart_favoritos', JSON.stringify(ids));
            }
        } else {
            localStorage.setItem('cooksmart_favoritos', JSON.stringify([]));
        }
    } catch (e) {
        console.warn('Error cargando favoritos:', e);
    }
}

// Interceptar cambios en localStorage para sincronizar
const _origSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(key, value) {
    _origSetItem(key, value);
    if (key === 'cooksmart_favoritos' && fbAuth.currentUser) {
        try {
            const favs = JSON.parse(value);
            syncFavoritosToFirebase(favs);
        } catch(e) {}
    }
};

// ---- AUTH STATE & NAVBAR ----

fbAuth.onAuthStateChanged(async (user) => {
    const btn = document.getElementById('btn-login');
    if (!btn) return;

    if (user) {
        // Cargar favoritos del usuario desde Firebase
        await loadFavoritosFromFirebase(user.uid);

        // Actualizar badge si existe la función
        if (typeof updateNavBadge === 'function') updateNavBadge();

        // Actualizar botón navbar → perfil
        const nombre = user.displayName ? user.displayName.split(' ')[0] : 'Usuario';
        btn.innerHTML = `👤 ${nombre} ▾`;
        btn.href = 'perfil.html';
        btn.onclick = null;

    } else {
        // Limpiar favoritos locales al cerrar sesión
        localStorage.removeItem('cooksmart_favoritos');
        localStorage.removeItem('cookSmartIngredientes');

        if (typeof updateNavBadge === 'function') updateNavBadge();

        btn.textContent = 'Iniciar Sesión';
        btn.href = 'login.html';
        btn.onclick = null;
    }

    // Disparar evento para que las páginas reaccionen
    window.dispatchEvent(new Event('authUpdated'));
});
