import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    Query,
    Logger,
    HttpException,
    HttpStatus,
    UseGuards,
} from '@nestjs/common'
import { User, Prisma } from '@prisma/client'

import { JwtAuthGuard } from './../auth/jwt-auth.guard'
import { UserService } from './user.service'
import { JwtStrategy } from '../auth/jwt.strategy'
@Controller('user/')
export class UserController {
    private readonly logger: Logger
    constructor(
        private readonly userService: UserService,
        private readonly jwtStrategy: JwtStrategy,
    ) {
        this.logger = new Logger()
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async userCreate(@Body() data: Prisma.UserCreateInput): Promise<User> {
        try {
            const createdUser = await this.userService.create(data)
            this.logger.debug('User was created', createdUser)

            return createdUser
        } catch (error) {
            this.logger.error('Error while creating a user', error.message)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Get(':id')
    async userfindOne(@Param('id') id: string): Promise<User> {
        try {
            const user = await this.userService.findOne({ id })
            this.logger.debug('User was found in db', user)

            return user
        } catch (error) {
            this.logger.error('Error while find a user', error.message)
            throw new HttpException(error.message, HttpStatus.NOT_FOUND)
        }
    }

    @Get()
    async userFindManyByCriterias(
        @Query() searchQuery: Prisma.UserWhereInput,
    ): Promise<User[]> {
        try {
            const users = await this.userService.findMany(searchQuery)

            return users
        } catch (error) {
            this.logger.error('Error while finding users', error.message)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async userUpdate(
        @Body() data: Prisma.UserCreateInput,
        @Param('id') id: string,
    ): Promise<User> {
        try {
            const updatedUser = await this.userService.update({ data, id })

            return updatedUser
        } catch (error) {
            this.logger.error('Error while updating user', error.message)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async userUpdateMany(
        @Body() data: Prisma.UserCreateInput,
        @Query() searchQuery: Prisma.UserWhereUniqueInput,
    ): Promise<Prisma.BatchPayload> {
        try {
            const countOfUpdetedUsers = await this.userService.updateMany({
                data,
                searchQuery,
            })

            return countOfUpdetedUsers
        } catch (error) {
            this.logger.error('Error while updating users', error.message)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async userRemove(@Param('id') id: string): Promise<User> {
        try {
            const deletedUser = await this.userService.remove(id)

            return deletedUser
        } catch (error) {
            this.logger.error('Error while deleting a user', error.message)
            throw new HttpException(error.message, HttpStatus.NOT_FOUND)
        }
    }
}
