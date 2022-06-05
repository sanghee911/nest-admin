import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}
  @Get()
  async all(@Query('page') page: string) {
    return await this.permissionService.paginate(parseInt(page));
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.permissionService.findOne(parseInt(id), ['roles']);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body('name') name: string) {
    await this.permissionService.update(id, { name });
    return this.permissionService.findOne(id, null);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.permissionService.delete(id);
    // return this.userService.findOne(id);
  }
}
