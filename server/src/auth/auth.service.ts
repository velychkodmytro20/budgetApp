import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'

import { ITokenPayload } from './dto'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    public getCookieWithJwtToken(id: string) {
        const payload: ITokenPayload = { id }
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
        })
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
            'JWT_EXPIRATION_TIME',
        )}s`
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`
    }

    async login(email: string, password: string): Promise<User> {
        try {
            const user = await this.userService.findOne({ email })

            if (!user) {
                throw new NotFoundException(`No user found for email: ${email}`)
            }

            await this.verifyPassword(password, user.password)

            return user
        } catch (error) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST,
            )
        }
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10)
    }

    private async verifyPassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<void> {
        const isPasswordMatching = await bcrypt.compare(
            plainPassword,
            hashedPassword,
        )
        if (!isPasswordMatching) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST,
            )
        }
    }

    async validateUser(userId: string) {
        return this.userService.findOne({ id: userId })
    }
}
