import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validator = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const bodyData = req.file ? { avatar: req.file } : req.body;

    const result = schema.safeParse(bodyData);

    if (!result.success) {
      return res.status(400).json({
        succeed: false,
        message: 'Invalid input(s)',
        errors: result.error.errors,
      });
    }

    next();
  };
};
