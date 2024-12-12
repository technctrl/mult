import express  ,  { Application } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import { ILogger } from '@main/@types/Logger/domain/ILogger';
import path from 'path';

export const HttpMiddlewareProvider =
  (application: Application, _: ILogger) => (): Application => {
    application.use(
      bodyParser.urlencoded({
        limit: '100mb',
        parameterLimit: 3000,
        extended: false,
      })
    );

    application.use(
      bodyParser.json({
        limit: '100mb',
      })
    );

    application.use(helmet.xssFilter());
    application.use(helmet.noSniff());
    application.use(helmet.hidePoweredBy());
    application.use(helmet.frameguard({ action: 'deny' }));
    application.use(helmet());

    application.use(cors());

      application.use((req, res, next) => {
          res.header('Access-Control-Allow-Origin', '*')
          next()
      })

    application.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

    application.disable('x-powered-by');



    return application;
  };
