import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @Post()
  create(@Body() user: CreateUserDto) {
    console.log('User data to create new user', user);
    return this.userService.create(user);
  }

  @Put(':email')
  update(@Param('email') email: string, @Body() user: CreateUserDto) {
    return this.userService.update(email, user);
  }
}
