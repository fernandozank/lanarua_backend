import { inject, injectable } from 'tsyringe';

import { sign } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import { classToClass } from 'class-transformer';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
  admin: boolean;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email / password combination', 401);
    }

    const passMatch = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passMatch) {
      throw new AppError('Incorrect email / password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({ admin: user.user_type === 'A' }, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      admin: user.user_type === 'A',
      user: classToClass(user),
      token,
    };
  }
}

export default AuthenticateUserService;
