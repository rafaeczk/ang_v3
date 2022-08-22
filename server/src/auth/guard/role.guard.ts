import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(role: Role){
    this.role = role
  }
  private role: Role

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const payload = req.user
    console.log(payload, this.role);
    return payload.role === this.role
  }
}