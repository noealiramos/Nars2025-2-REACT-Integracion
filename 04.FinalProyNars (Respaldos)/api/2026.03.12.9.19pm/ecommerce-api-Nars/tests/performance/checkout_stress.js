import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 },  // Ramp-up rápido para checkout
    { duration: '3m', target: 20 },  // Carga constante de transacciones
    { duration: '1m', target: 0 },   // Ramp-down
  ],
  thresholds: {
    // El checkout es crítico, p95 debe ser < 1s
    'http_req_duration{name:checkout}': ['p(95)<1000'],
    'http_req_failed': ['rate<0.01'], 
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/api';

// Datos de prueba (deben ser válidos en tu DB o Mockeados)
const AUTH_TOKEN = __ENV.AUTH_TOKEN || 'YOUR_JWT_TOKEN_HERE';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`,
    },
  };

  // 1. Simular flujo de Checkout
  const checkoutPayload = JSON.stringify({
    shippingAddress: {
      address: 'Calle Falsa 123',
      city: 'CDMX',
      postalCode: '01000'
    },
    paymentMethodId: '65df1234567890abcdef1234'
  });

  const checkoutRes = http.post(`${BASE_URL}/orders/checkout`, checkoutPayload, {
    ...params,
    tags: { name: 'checkout' },
  });

  check(checkoutRes, {
    'Checkout status is 201 o 400': (r) => [201, 400].includes(r.status),
    'Checkout latency < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(2); // Simular tiempo de espera entre transacciones
}
