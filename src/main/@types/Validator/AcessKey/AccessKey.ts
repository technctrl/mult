import { Request, Response, NextFunction } from 'express';
import { config } from '@main/providers/LocalsProvider';

export const accessKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.originalUrl.startsWith('/api/')) {
    return next();
  }


  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(400).json({ error: 'Access key missing from request.' });
  }

  if (apiKey === config().appSecret) {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied, key unknown.' });
  }
};
