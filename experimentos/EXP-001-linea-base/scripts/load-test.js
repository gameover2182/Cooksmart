import http from 'k6/http';
import { check } from 'k6';
import { Trend, Counter } from 'k6/metrics';

const FIREBASE_DB_URL =
    'https://cook-smart-626ff-default-rtdb.firebaseio.com';

// Métricas exclusivas del endpoint que queremos medir
const favoritosDuration = new Trend('favoritos_duration', true);
const favoritosRequests = new Counter('favoritos_requests');

export const options = {
    vus: 1,
    duration: '10s',
};

export function setup() {
    const apiKey = __ENV.FIREBASE_API_KEY;
    const email = __ENV.FIREBASE_TEST_EMAIL;
    const password = __ENV.FIREBASE_TEST_PASSWORD;

    const authUrl =
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    const payload = JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = http.post(authUrl, payload, params);

    if (response.status !== 200) {
        throw new Error(
            `Error de autenticación: HTTP ${response.status} - ${response.body}`
        );
    }

    const data = response.json();

    return {
        idToken: data.idToken,
        uid: data.localId,
    };
}

export default function (data) {
    const url =
        `${FIREBASE_DB_URL}/usuarios/${data.uid}/favoritos.json?auth=${data.idToken}`;

    const start = Date.now();

    const response = http.get(url);

    const duration = Date.now() - start;

    // Guardamos solamente el tiempo del endpoint de favoritos
    favoritosDuration.add(duration);

    // Contamos solamente las peticiones al endpoint de favoritos
    favoritosRequests.add(1);

    check(response, {
        'respuesta HTTP 200': (r) => r.status === 200,
    });
}