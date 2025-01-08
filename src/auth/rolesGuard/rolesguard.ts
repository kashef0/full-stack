import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      const user = req.user;
  
      if (!user) {
        throw new ForbiddenException('User not authenticated');
      }
  
      if (user.role === 'ADMIN') {
        console.log('Access granted to ADMIN');
        return true;
      } 
      throw new ForbiddenException('Forbidden resource');
    }
  }
  