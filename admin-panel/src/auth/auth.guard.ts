import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const token = request.cookies?.admin_token;

    if (!token) {
      response.redirect('/login');
      return false;
    }
    return true;
  }
}
