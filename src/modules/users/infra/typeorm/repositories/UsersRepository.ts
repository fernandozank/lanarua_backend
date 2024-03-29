import { getRepository, Repository } from 'typeorm';
import { classToClass } from 'class-transformer';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async returnAll(): Promise<User[]> {
    const users = await this.ormRepository
      .createQueryBuilder()
      .select('users')
      .from(User, 'users')
      .orderBy('users.name', 'ASC')
      .getMany();

    return users;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({ where: { email } });

    return findUser;
  }

  public async findByID(id: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne(id);

    return findUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return classToClass(user);
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async deleteUser(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default UsersRepository;
