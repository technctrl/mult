import { SignOptions, DecodeOptions, JwtPayload } from 'jsonwebtoken';

export interface IJwtProvider {
  CreateJwtProvider: <T = null>(
    object: Record<keyof T, unknown>,
    options?: SignOptions
  ) => string;
  DecodeInterface: (
    token: string,
    options?: DecodeOptions
  ) => null | JwtPayload | string;
}
