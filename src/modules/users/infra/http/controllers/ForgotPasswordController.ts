import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ForgotPasswordService from '@modules/users/services/ForgotPasswordService';

export default class ForgotPasswordController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const forgotPass = container.resolve(ForgotPasswordService);

    await forgotPass.execute({ email });

    return response.status(204).json();
  }
}
