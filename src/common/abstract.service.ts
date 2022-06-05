import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated.result';

@Injectable()
export abstract class AbstractService {
  protected constructor(protected readonly repo: Repository<any>) {}

  async all(relations = []): Promise<any[]> {
    return await this.repo.find({ relations });
  }

  async paginate(page = 1, relations = []): Promise<PaginatedResult> {
    const take = 5;
    const [data, total] = await this.repo.findAndCount({
      take,
      skip: (page - 1) * take,
      relations,
    });

    return {
      data,
      meta: {
        total,
        perPage: take,
        currentPage: page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async create(body: any): Promise<any[]> {
    const data = this.repo.create(body);
    return await this.repo.save(data);
  }

  async findOne(condition: any, relations = []): Promise<any> {
    return this.repo.findOne(condition, { relations });
  }

  async update(id: string, data): Promise<any> {
    return this.repo.update(id, data);
  }

  async delete(id: string): Promise<any> {
    const data = await this.repo.findOne(id);
    return this.repo.remove(data);
  }
}
