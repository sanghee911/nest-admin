import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async all(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async paginate(page = 1): Promise<any> {
    const take = 5;
    const [users, total] = await this.userRepo.findAndCount({
      take,
      skip: (page - 1) * take,
    });

    return {
      data: users,
      meta: {
        total,
        perPage: take,
        currentPage: page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async create(body: any): Promise<User[]> {
    const user = this.userRepo.create(body);
    return await this.userRepo.save(user);
  }

  async findOne(condition): Promise<User> {
    return this.userRepo.findOne(condition, { relations: ['role'] });
  }

  async update(id: string, data): Promise<any> {
    return this.userRepo.update(id, data);
  }

  async delete(id: string): Promise<User> {
    const user = await this.userRepo.findOne(id);
    return this.userRepo.remove(user);
  }
}
