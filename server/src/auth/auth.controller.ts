import * as bcrypt from 'bcrypt'
import { User, Prisma } from '@prisma/client'
import { Body, Controller, Post, Logger } from '@nestjs/common'

import { LoginDto } from './dto/auth-login.dto'
import { AuthService } from './auth.service'
import { Auth } from './entity/auth.entity'
import { UserService } from '../user/user.service'

@Controller('auth')
export class AuthController {
    private readonly logger: Logger
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
        this.logger = new Logger()
    }

    @Post('signUp')
    async signUp(@Body() data: Prisma.UserCreateInput): Promise<User> {
        data.password = await bcrypt.hash(data.password, 10)

        const user = await this.userService.create(data);
        this.logger.debug('user in signUp', user)
        return user
    }

    @Post('login')
    async login(@Body() { email, password }: LoginDto): Promise<Auth> {
        return this.authService.login(email, password)
    }
}
