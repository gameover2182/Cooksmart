import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL = 'http://localhost:3000';

const recetasDuration = new Trend('recetas_duration');

export const options = {
    vus: 50,
    duration: '20s',

    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<500'],
        recetas_duration: ['p(95)<500'],
    },
};

export default function () {
    const inicio = Date.now();

    const response = http.get(
        `${BASE_URL}/api/recetas`,
        {
            tags: {
                endpoint: 'recetas',
            },
        }
    );

    recetasDuration.add(Date.now() - inicio);

    check(response, {
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
}