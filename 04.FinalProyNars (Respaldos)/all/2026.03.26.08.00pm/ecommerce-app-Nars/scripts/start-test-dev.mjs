import { createServer } from 'vite';

process.env.VITE_API_URL = 'http://localhost:3001/api';

const server = await createServer({
  mode: 'test',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});

await server.listen();
server.printUrls();
