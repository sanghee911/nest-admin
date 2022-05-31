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

  async create(body: any): Promise<User[]> {
    const user = this.userRepo.create(body);
    return await this.userRepo.save(user);
  }

  async findOne(condition): Promise<User> {
    return this.userRepo.findOne(condition);
  }
}
