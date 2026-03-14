import http from 'http';

const BASE_URL = 'http://localhost:3000/api';
const CONCURRENCY = 10;
const TOTAL_REQUESTS = 100;

async function measureRequest(path) {
  const start = Date.now();
  return new Promise((resolve) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        resolve({
          status: res.statusCode,
          duration,
          path
        });
      });
    }).on('error', (err) => {
      resolve({
        status: 500,
        duration: Date.now() - start,
        path,
        error: err.message
      });
    });
  });
}

async function runTest() {
  console.log(`🚀 Iniciando Pruebas de Rendimiento (Node.js Collector)`);
  console.log(`📍 Endpoint: ${BASE_URL}/products`);
  console.log(`👥 Concurrencia: ${CONCURRENCY} | Total: ${TOTAL_REQUESTS} requests\n`);

  const results = [];
  const batches = Math.ceil(TOTAL_REQUESTS / CONCURRENCY);

  for (let i = 0; i < batches; i++) {
    const batchPromises = Array.from({ length: CONCURRENCY }).map(() => measureRequest('/products'));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    process.stdout.write('.');
  }

  console.log('\n\n✅ Pruebas completadas.');

  const durations = results.map(r => r.duration).sort((a, b) => a - b);
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const errors = results.filter(r => r.status >= 400).length;

  console.log(`--- Resumen de Resultados ---`);
  console.log(`Latencia Promedio: ${avg.toFixed(2)} ms`);
  console.log(`Latencia P95: ${p95} ms`);
  console.log(`Tasa de Error: ${(errors / TOTAL_REQUESTS * 100).toFixed(2)}%`);
  console.log(`Total Requests: ${results.length}`);
  
  if (p95 < 1000) {
    console.log(`\n🎉 CONCLUSIÓN: CUMPLE con el estándar (< 1s)`);
  } else {
    console.log(`\n❌ CONCLUSIÓN: NO CUMPLE con el estándar (> 1s)`);
  }
}

runTest();
