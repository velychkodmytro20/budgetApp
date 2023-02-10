import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthService } from '../auth/auth.service'
import { JwtStrategy } from '../auth/strategies'
import { PrismaService } from '../prisma/prisma.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

// When you want to provide a set of providers which should be available everywhere out-of-the-box
// (e.g., helpers, database connections, etc.), make the module global with the @Global() decorator.
//@Global()
@Module({
    controllers: [UserController],
    providers: [
        AuthService,
        JwtService,
        JwtStrategy,
        PrismaService,
        UserService,
    ],
    exports: [UserService],
})
export class UserModule {}
