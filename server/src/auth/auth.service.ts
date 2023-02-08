import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Auth, TokenPayload } from './dto'
import { PrismaService } from './../prisma/prisma.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) {}

    public getCookieWithJwtToken(userId: string) {
        const payload: TokenPayload = { userId }
        const token = this.jwtService.sign(payload)
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
            'expiration',
        )}`
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`
    }

    async login(email: string, password: string): Promise<Auth> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`)
        }

        await this.verifyPassword(password, user.password)

        return {
            accessToken: this.jwtService.sign({ userId: user.id }),
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
        return this.prisma.user.findUnique({ where: { id: userId } })
    }
}
