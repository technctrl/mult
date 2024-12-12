import bcrypt from 'bcrypt';
import { IHashProvider } from '@main/@types/HashProvider/domain/IHashProvider';

export class HashProvider implements IHashProvider {
  async hashProvider(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    return await bcrypt.hash(password, saltRounds);
  }

  async compareProvider(
    toComparePassword: string,
    encryptedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(toComparePassword, encryptedPassword);
  }
}
