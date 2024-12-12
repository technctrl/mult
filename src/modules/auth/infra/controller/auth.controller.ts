import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { ResponseProvider } from '@main/@types/Response/infrastructure/Response';

export class AuthController {

  public static async login(req: Request, res: Response) {
    const  responseRepo = ResponseProvider(res)
    try {
      const userData = {
        firstname : "John",
        lastname : "Doe",
        role: "admin",
        email : "john@doe.com"
      }
    return responseRepo(StatusCodes.OK, "Connexion réussie", userData)

    } catch (error : any) {
        return responseRepo(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
  }

}
