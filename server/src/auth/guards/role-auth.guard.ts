import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common'
import { Role } from '@prisma/client'

import { JwtAuthGuard } from '../guards'
import { RequestWithUser } from '../dto/index'

export const RoleGuard = (role: Role): Type<CanActivate> => {
    class RoleGuardMixin extends JwtAuthGuard {
        async canActivate(context: ExecutionContext) {
            await super.canActivate(context)

            const request = context.switchToHttp().getRequest<RequestWithUser>()
            const user = request.user

            return user?.role === role
        }
    }
    return mixin(RoleGuardMixin)
}
