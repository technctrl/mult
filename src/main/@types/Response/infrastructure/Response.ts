import { IResponse } from '../domain/IResponse';
export const ResponseProvider: IResponse =
  (res) =>
  <T = null>(statusCode: number, message: string, data?: T) => {
    const response = {
      succeed: [200, 201].includes(statusCode),
      message,
      ...(data ? { data } : {}),
    };

    return res.status(statusCode).json(response);
  };
