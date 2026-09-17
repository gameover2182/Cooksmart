import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';

const BASE_URL = 'http://localhost:3000';

export const options = {
    stages: [
    { duration: '20s', target: 100 },
    { duration: '20s', target: 300 },
    { duration: '20s', target: 500 },
    { duration: '20s', target: 700 },
    { duration: '20s', target: 1000 },
    { duration: '20s', target: 700 },
    { duration: '20s', target: 0 },
],

    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<500'],
    },
};

export default function () {

    const probabilidad = Math.random();
    let response;
    let endpoint;

    // 50% - Consultar lista de recetas
    if (probabilidad < 0.50) {
        endpoint = 'GET /api/recetas';
        response = http.get(`${BASE_URL}/api/recetas`);

    // 20% - Consultar detalle de una receta
    } else if (probabilidad < 0.70) {
        endpoint = 'GET /api/recetas/1';
        response = http.get(`${BASE_URL}/api/recetas/1`);

    // 10% - Consultar categorías de recetas
    } else if (probabilidad < 0.80) {
        endpoint = 'GET /api/categorias-receta';
        response = http.get(`${BASE_URL}/api/categorias-receta`);

    // 10% - Consultar tipos de cocina
    } else if (probabilidad < 0.90) {
        endpoint = 'GET /api/tipos-cocina';
        response = http.get(`${BASE_URL}/api/tipos-cocina`);

    // 10% - Consultar ingredientes
    } else {
        endpoint = 'GET /api/ingredientes';
        response = http.get(`${BASE_URL}/api/ingredientes`);
    }

    check(response, {
        'HTTP 200': (r) => r.status === 200,
        'respuesta JSON': (r) => {
            try {
                r.json();
                return true;
            } catch (error) {
                return false;
            }
        },
    });

    sleep(1);
}