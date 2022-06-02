import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './models/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async all(): Promise<Role[]> {
    return this.roleRepo.find({ relations: ['permissions'] });
  }

  async create(body: any): Promise<Role[]> {
    const role = this.roleRepo.create(body);
    return await this.roleRepo.save(role);
  }

  async findOne(condition): Promise<Role> {
    return this.roleRepo.findOne(condition, { relations: ['permissions'] });
  }

  async update(id: string, data): Promise<any> {
    return this.roleRepo.update(id, data);
  }

  async delete(id: string): Promise<Role> {
    const role = await this.roleRepo.findOne(id);
    return this.roleRepo.remove(role);
  }
}
