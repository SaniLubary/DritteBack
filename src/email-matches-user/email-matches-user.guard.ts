// email-matches-user.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service'; // Assuming you have an AuthService

@Injectable()
export class EmailMatchesUserGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.params;
    return this.authService
      .getUser(request.headers.authorization)
      .then((user) => {
        if (user?.email && user.email === email) {
          return true;
        }
        return false;
      });
  }
}
