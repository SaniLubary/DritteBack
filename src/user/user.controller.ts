import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { UserPayload } from './dto/user-payload.dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findOne(@Req() req: Request & { user: UserPayload }) {
    return this.userService.findOne(req.user.email);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':email')
  update(@Param('email') email: string, @Body() user: CreateUserDto) {
    return this.userService.update(email, user);
  }
}
