import * as bcrypt from 'bcrypt'
import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { PrismaService } from './../prisma/prisma.service'
import { Auth } from './entity/auth.entity'

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async login(email: string, password: string): Promise<Auth> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`)
        }

        const passwordValid = await bcrypt.compare(password, user.password)
        if (!passwordValid) {
            throw new UnauthorizedException(`Invalid password: ${password}`)
        }

        return {
            accessToken: this.jwtService.sign({ userId: user.id }),
        }
    }

    async validateUser(userId: string) {
        return this.prisma.user.findUnique({ where: { id: userId } })
    }

    async validateAdmin(userId: string, role: string) {
        return this.prisma.user.findFirst({
            where: {
                id: userId,
                role: 'admin',
            },
        })
    }
}
