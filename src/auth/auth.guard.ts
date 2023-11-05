import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    const user = await this.authService.getUser(token);

    if (!user) {
      console.log('User not found');
      return false;
    }

    if (
      'email' in request.params &&
      user.email &&
      request.params.email !== user.email
    ) {
      console.error(
        'Signed in user and email trying to perform actions on does not match',
        request.params,
        user.mail,
      );
      return false;
    }

    console.log(user);
    return true;
  }
}
