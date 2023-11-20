import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@Controller('user')
@UseGuards(AuthGuard)
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @Post()
  create(@Body() user: CreateUserDto) {
    console.log('User data to create new user', user);
    return this.userService.create(user);
  }

  @Put()
  update(@Param('email') email: string, @Body() user: CreateUserDto) {
    return this.userService.update(email, user);
  }
}
