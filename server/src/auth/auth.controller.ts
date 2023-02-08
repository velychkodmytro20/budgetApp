import * as bcrypt from 'bcrypt'
import { Response } from 'express'
import { User, Prisma } from '@prisma/client'

import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    Res,
    Req,
    UseGuards,
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { Auth, LoginDto,RequestWithUser } from './dto'
import { JwtAuthGuard, JwtAuthLocalGuard } from './guards'
import { PostgresErrorCode } from '../../database/postgresErrorCodes.enum'
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

    @UseGuards(JwtAuthGuard)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user
        user.password = undefined
        return user
    }

    @Post('signUp')
    async signUp(@Body() data: Prisma.UserCreateInput): Promise<User> {
        try {
            data.password = await this.authService.hashPassword(data.password)

            const user = await this.userService.create(data)
            this.logger.debug('user in signUp', user)
            return user
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException(
                    'User with that email already exists',
                    HttpStatus.BAD_REQUEST,
                )
            }
            throw new HttpException(
                'Something went wrong',
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @Post('login')
    async login(@Body() { email, password }: LoginDto): Promise<Auth> {
        try {
            //todo: uncomment in scope of cookies login
             // async login(
            // @Req() request: RequestWithUser,
            // @Res() response: Response,
            // ): Promise<Response> {
            // const { user } = request
            // const cookie = this.authService.getCookieWithJwtToken(user?.id)
            // response.setHeader('Set-Cookie', cookie)
            // user.password = undefined
            //return response.send(user)
            return this.authService.login(email, password)
        } catch (error) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST,
            )
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('log-out')
    async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.authService.getCookieForLogOut())
        return response.sendStatus(200)
    }
}
