import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { User } from '../user/models/user.entity';
import { AuthGuard } from './auth.guard';

@Controller()
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() body: RegisterDto): Promise<User[]> {
    if (await this.userService.findOne({ email: body.email })) {
      throw new BadRequestException('user exists');
    }
    if (body.password !== body.passwordConfirm) {
      throw new BadRequestException('passwords do not match');
    }

    body.password = await bcrypt.hash(body.password, 12);
    const { roleId, ...data } = body;
    return this.userService.create({ ...data, role: { id: roleId } });
  }

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });

    return user;
  }

  @Get('user')
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    return this.userService.findOne({ id: data.id }, null);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'logout success' };
  }
}
