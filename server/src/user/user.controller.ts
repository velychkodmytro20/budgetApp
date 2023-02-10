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
import { User, Role, Prisma } from '@prisma/client'

import { AuthService } from '../auth/auth.service'
import { JwtAuthGuard, RoleGuard } from '../auth/guards'
import { UserService } from './user.service'

@Controller('user/')
export class UserController {
    private readonly logger: Logger
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
        this.logger = new Logger()
    }

    @Post('create')
    @UseGuards(RoleGuard(Role.admin))
    async userCreate(@Body() data: Prisma.UserCreateInput): Promise<User> {
        try {
            data.password = await this.authService.hashPassword(data.password)

            const createdUser = await this.userService.create(data)
            this.logger.debug('User was created', createdUser)

            return createdUser
        } catch (error) {
            this.logger.error('Error while creating a user', error.message)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(RoleGuard(Role.admin))
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
    @UseGuards(RoleGuard(Role.admin))
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
