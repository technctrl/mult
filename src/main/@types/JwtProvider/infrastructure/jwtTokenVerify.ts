import { Request, Response, NextFunction } from 'express';
import JwtProvider from '@main/@types/JwtProvider/infrastructure/JwtProvider';
import { consoleLogger } from '@main/@types/Logger/infrastructure/ConsoleLogger';

const jwtProvider = new JwtProvider();

interface CustomRequest extends Request {
  user?: any;
}

const jwtTokenVerify = (req: CustomRequest, res: Response, next: NextFunction) => {

  const authHeader : string = req.header('Authorization') as string;

  if (!authHeader) return res.status(401).json({
    succeed: false,
    message: 'Access Denied: No authorization header.',
  })

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      succeed: false,
      message: 'Access Denied: No token provided.',
    });
  }


  try {
    const decoded = jwtProvider.DecodeInterface(token);

    if (decoded && typeof decoded !== 'string') {
      req.user = decoded;
      next();
    } else {
      res.status(400).json({
        succeed: false,
        message: 'Invalid Token: Please check the token format.',
      });
    }
  } catch (error) {
    consoleLogger.error('Token verification error:', error);
    res.status(400).json({
      succeed: false,
      message: 'Invalid Token Key: An error occurred during verification.',
    });
  }
}



export default jwtTokenVerify;
