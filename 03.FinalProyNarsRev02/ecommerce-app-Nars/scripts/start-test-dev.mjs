import { createServer } from 'vite';
import { resolveApiUrl } from '../src/config/runtimeUrls.mjs';

process.env.VITE_API_URL = resolveApiUrl(process.env.VITE_API_URL);

const server = await createServer({
  mode: 'test',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});

await server.listen();
server.printUrls();
