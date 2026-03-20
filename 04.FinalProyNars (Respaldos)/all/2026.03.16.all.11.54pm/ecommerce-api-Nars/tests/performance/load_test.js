import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Escenarios de carga (Stress Test)
  stages: [
    { duration: '2m', target: 50 },  // Ramp-up a 50 usuarios
    { duration: '5m', target: 50 },  // Mantener 50 usuarios (Load)
    { duration: '2m', target: 200 }, // Ramp-up a 200 usuarios (Stress)
    { duration: '5m', target: 200 }, // Mantener 200 usuarios
    { duration: '2m', target: 0 },   // Ramp-down
  ],
  thresholds: {
    // REGLA DE ORO: Ningún endpoint debe tardar más de 1s (p95)
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'], // Menos del 1% de errores
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/api';

export default function () {
  // 1. Catálogo de Productos (Read Heavy)
  const productsRes = http.get(`${BASE_URL}/products`);
  check(productsRes, {
    'GET /products status is 200': (r) => r.status === 200,
    'GET /products latency < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1);

  // 2. Detalle de Producto
  // (Asumiendo que existen IDs conocidos o el primero de la lista)
  const productId = '65df1234567890abcdef1234'; // ID de ejemplo
  const detailRes = http.get(`${BASE_URL}/products/${productId}`);
  check(detailRes, {
    'GET /products/:id status is 200 o 404': (r) => [200, 404].includes(r.status),
    'GET /products/:id latency < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1);

  // 3. Health Check & Public Info
  const categoriesRes = http.get(`${BASE_URL}/categories`);
  check(categoriesRes, {
    'GET /categories status is 200': (r) => r.status === 200,
    'GET /categories latency < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(2);
}
