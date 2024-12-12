export interface IHashProvider {
  hashProvider: (password: string) => Promise<string>;
  compareProvider: (
    toComparePassword: string,
    encryptedPassword: string
  ) => Promise<boolean>;
}
