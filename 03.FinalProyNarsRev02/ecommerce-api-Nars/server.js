import './src/config/env.js';
import env from './src/config/env.js';
import { pathToFileURL } from 'node:url';

import dbConnection from './src/config/database.js';
import seedTestCatalog from './src/utils/seedTestCatalog.js';
import setupGlobalErrorHandlers from './src/middlewares/globalErrorHandler.js';
import logger from './src/middlewares/logger.js';
import Category from './src/models/category.js';
import Product from './src/models/product.js';
import app from './src/app.js';

let bootstrapPromise = null;
let serverInstance = null;

export async function bootstrapServer({ startListening = (env.NODE_ENV !== 'test' || env.START_SERVER) } = {}) {
  if (bootstrapPromise) {
    await bootstrapPromise;
    return { app, server: serverInstance };
  }

  bootstrapPromise = (async () => {
    setupGlobalErrorHandlers();

    await dbConnection();
    await Promise.all([Category.init(), Product.init()]);

    if (env.NODE_ENV === 'test') {
      const seedResult = await seedTestCatalog();
      logger.info({
        message: 'Test catalog seed status',
        ...seedResult,
      });
    }

    if (startListening) {
      const PORT = env.PORT;
      serverInstance = await new Promise((resolve) => {
        const server = app.listen(PORT, () => {
          logger.info({
            message: 'Server started',
            url: env.PUBLIC_API_URL,
            environment: env.NODE_ENV,
          });
          resolve(server);
        });
      });
    }
  })();

  await bootstrapPromise;
  return { app, server: serverInstance };
}

const isDirectExecution = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  await bootstrapServer();
}

export default app;
