process.env.NODE_ENV = 'test';
process.env.START_SERVER = 'true';
process.env.PORT = process.env.PORT || '3001';

const { bootstrapServer } = await import('../server.js');

await bootstrapServer();
