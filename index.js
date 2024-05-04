require('dotenv').config();
const express = require('express');
const DatabaseConnector = require ('./config/database-connector');
const router = require('./router');
const NotFoundRoutesHandler = require('./error-handlers/not-found-routes-error.handler')
const GlobalErrorHandler = require('./error-handlers/global-error.handler');
const UnhandledRejectionHandler = require('./error-handlers/unhandled-rejection.handler');

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const app = express();
  app.use(express.json());
  router(app);
  app.all('*', NotFoundRoutesHandler.catch);
  app.use(GlobalErrorHandler.catch);
  UnhandledRejectionHandler.catch()
  await DatabaseConnector.connect();
  await app.listen(port);
  console.log(`App is running at: http://localhost:${port} 🚀`);
}

bootstrap();