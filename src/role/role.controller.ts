import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  async all() {
    return this.roleService.all();
  }

  @Post()
  async create(
    @Body('name') name: string,
    @Body('permissions') permissionIds: number[],
  ) {
    return this.roleService.create({
      name,
      permissions: permissionIds.map((id) => ({ id })),
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async get(@Param('id') id: number) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('permissions') permissionIds: number[],
  ) {
    await this.roleService.update(id, { name });
    const role = await this.roleService.findOne(id);
    return this.roleService.create({
      ...role,
      permissions: permissionIds.map((id) => ({ id })),
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.roleService.delete(id);
    // return this.userService.findOne(id);
  }
}
