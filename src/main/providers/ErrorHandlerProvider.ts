import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { config } from '@main/providers/LocalsProvider';
import { ResponseProvider } from '@main/@types/Response/infrastructure/Response';
import { RouteInfoImp } from '@main/@types/RouteInfoImp';

const notFoundHandler = (info: [RouteInfoImp]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const responseProvider = ResponseProvider(res);

    if (req.originalUrl === '/api-docs/') {
      return next();
    }
    const conf = config();
    const filter = info.filter((r: RouteInfoImp) => {
      return conf.api_prefix + r.path === req.originalUrl;
    });

    if (filter.length > 0) {
      return next();
    }

    return responseProvider(
      StatusCodes.NOT_FOUND,
      `'${req.originalUrl}' resource link not found`,
      null
    );
  };
};

const clientErrorHandler = (): ErrorRequestHandler => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    const responseProvider = ResponseProvider(res);

    if (req.xhr && !(err instanceof SyntaxError)) {
      responseProvider(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Something went wrong',
        null
      );
      return;
    } else {
      next(err);
      return;
    }
  };
};

const errorHandler = (): ErrorRequestHandler => {
  return (err: Error, _: Request, res: Response, __: NextFunction) => {
    const responseProvider = ResponseProvider(res);

    if (err.name === 'UnauthorizedError') {
      const innerMessage = err.message;
      responseProvider(StatusCodes.UNAUTHORIZED, 'Invalid Token!', {
        error: [innerMessage],
      });
      return;
    }

    responseProvider(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong',
      null
    );
    return;
  };
};

const syntaxErrorHandler = (): ErrorRequestHandler => {
  return (err: unknown, _: Request, res: Response, next: NextFunction) => {
    const responseProvider = ResponseProvider(res);
    if (err instanceof SyntaxError) {
      responseProvider(StatusCodes.BAD_REQUEST, 'Invalid JSON', null);
      return;
    } else {
      next(err);
      return;
    }
  };
};

export default {
  notFoundHandler,
  clientErrorHandler,
  errorHandler,
  syntaxErrorHandler,
};
