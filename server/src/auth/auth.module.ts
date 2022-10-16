import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { PrismaService } from '../prisma/prisma.service'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'
import { jwtConstants } from './constants'
import { UserService } from '../user/user.service'
import { UserModule } from '../user/user.module'

@Module({
    controllers: [AuthController],
    providers: [JwtStrategy, AuthService, PrismaService, UserService],
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '7d' },
        }),
    ],
})
export class AuthModule {}
