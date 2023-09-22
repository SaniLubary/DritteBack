import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

const modules = [AuthService, AuthGuard];

@Module({
  providers: modules,
  exports: modules,
})
export class AuthModule {}
