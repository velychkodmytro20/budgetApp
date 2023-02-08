import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from '../user/user.service'
import { UserModule } from '../user/user.module'

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, PrismaService, UserService],
    imports: [
        PassportModule,
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('secret'),
                signOptions: {
                    expiresIn: `${configService.get('expiration')}s`,
                },
            }),
        }),
    ],
})
export class AuthModule {}
