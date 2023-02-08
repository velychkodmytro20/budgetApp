import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'

import {
    Injectable,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common'

import { AuthService } from '../auth.service'
// import { jwtConstants } from './constants'

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private auth: AuthService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Authentication
                },
            ]),
            secretOrKey: configService.get('expiration'),
        })
    }

    async validate(payload: { userId: string }) {
        const user = await this.auth.validateUser(payload.userId)

        if (!user) {
            throw new UnauthorizedException()
        }

        return user
    }
}
