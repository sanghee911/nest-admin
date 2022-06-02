import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import { UserCreateDto } from './models/user-create.dto';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async all(@Query('page') page: string): Promise<User[]> {
    return await this.userService.paginate(parseInt(page));
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() body: UserCreateDto) {
    const password = await bcrypt.hash('1234', 12);

    if (await this.userService.findOne({ email: body.email })) {
      throw new BadRequestException('user exists');
    }

    const { roleId, ...data } = body;

    return this.userService.create({
      ...data,
      password,
      role: { id: roleId },
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Param('id') id: string, @Body() body: UserUpdateDto) {
    const { roleId, ...data } = body;
    await this.userService.update(id, {
      ...data,
      role: { id: roleId },
    });

    return this.userService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
    // return this.userService.findOne(id);
  }
}
