import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from './auth.service'
import { jwtConstants } from './constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private auth: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConstants.secret,
        })
    }

    async validate(payload: { userId: string }) {
        const user = await this.auth.validateUser(payload.userId)

        if (!user) {
            throw new UnauthorizedException()
        }

        return user
    }

    async validateAdmin(payload: { userId: string; role: string }) {
        const admin = await this.auth.validateAdmin(
            payload.userId,
            payload.role,
        )
        if (!admin) {
            throw new UnauthorizedException()
        }
        return admin
    }
}
