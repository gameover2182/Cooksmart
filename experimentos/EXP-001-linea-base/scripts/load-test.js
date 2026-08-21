import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 1,
    duration: '10s',
};

export default function () {
    const response = http.get('https://example.com');

    check(response, {
        'status es 200': (r) => r.status === 200,
    });
}