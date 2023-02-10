import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Prisma } from '@prisma/client'
import { Request } from 'express'

import { UserService } from '../../user/user.service'
@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Authentication
                },
            ]),
            secretOrKey: configService.get('JWT_SECRET'),
        })
    }

    async validate(payload: Prisma.UserWhereUniqueInput) {
        const user = await this.userService.findOne({ id: payload.id })

        if (!user) {
            throw new HttpException(
                'User with this id does not exist',
                HttpStatus.NOT_FOUND,
            )
        }
    }
}
