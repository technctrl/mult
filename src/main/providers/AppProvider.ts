import express, { Express } from 'express';
import http from 'http';
import { ILogger } from '@main/@types/Logger/domain/ILogger';
import { printStartupLog } from '@main/helpers/launch';
import { init as initLocals } from './LocalsProvider';
import dotenv from 'dotenv';
import { RoutesHandler } from '@/main';
import ErrorHandlerProvider from '@main/providers/ErrorHandlerProvider';
import { HttpMiddlewareProvider } from '@main/providers/MiddlewaresProvider';
import NodeMailerService from '@main/services/Notifications/mail/NodeMailerService';
import { accessKeyMiddleware } from '@main/@types/Validator/AcessKey/AccessKey';
import createDatabaseProvider from '@main/providers/database/DatabaseProviderFactory';

dotenv.config();

export const server = {
  httpServer: null as http.Server | null,
};

export const AppProvider = (logger: ILogger, inTest = false) => {
  return async (): Promise<Express> => {
    const app = express();

    // Init elements
    initLocals(app);

    try {
      await NodeMailerService.verifyTransport();
      logger.info('NodeMailer transport verified successfully');
    } catch (error) {
      logger.warn(`Mail transport not configured: ${(error as Error).message}`);
    }

    try {
      await createDatabaseProvider().connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.warn(`Database not configured: ${(error as Error).message}`);
    }

    // Les middlewares
    HttpMiddlewareProvider(app, logger)();
    app.use(accessKeyMiddleware)
    app.use(ErrorHandlerProvider.syntaxErrorHandler());
    app.use(ErrorHandlerProvider.clientErrorHandler());
    app.use(ErrorHandlerProvider.errorHandler());

    RoutesHandler.setupRoutes(app);


    const port = process.env.PORT;
    if (!inTest) {
      server.httpServer = app.listen(port, () => printStartupLog());
    }
    return app;
  };
};
