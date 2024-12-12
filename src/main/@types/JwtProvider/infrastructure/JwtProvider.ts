import {
  decode,
  DecodeOptions,
  JwtPayload,
  sign,
  SignOptions,
} from 'jsonwebtoken';
import { config } from '@/main/providers/LocalsProvider';
import { IJwtProvider } from '@main/@types/JwtProvider/domain/IJwtProvider';

class JwtProvider implements IJwtProvider {
  private appSecret: string;

  constructor() {
    this.appSecret = config().appSecret;
  }

  CreateJwtProvider = <T = null>(
    object: Record<keyof T, unknown>,
    options?: SignOptions
  ): string => {
    return sign(object, this.appSecret, options);
  };

  DecodeInterface = (
    token: string,
    options?: DecodeOptions
  ): null | JwtPayload | string => {
    return decode(token, options);
  };
}

export default JwtProvider;
