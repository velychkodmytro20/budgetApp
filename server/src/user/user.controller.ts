import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common'
import { UserService } from './user.service'
import { User, Prisma } from '@prisma/client'
@Controller('user/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async userCreate(@Body() data: Prisma.UserCreateInput): Promise<User> {
    return this.userService.create(data)
  }
  @Get(':id')
  async userfindOne(@Param('id') id: string): Promise<User> {
    try {
      return this.userService.findOne({ id })
    } catch (error) {
      throw new NotFoundException({ error })
    }
  }

  @Get('all')
  async userFindManyByCriterias(
    @Query() searchQuery: Prisma.UserWhereInput,
  ): Promise<User[]> {
    return this.userService.findMany(searchQuery)
  }

  @Patch('update/:id')
  async userUpdate(
    @Body() data: Prisma.UserCreateInput,
    @Param('id') id: string,
  ): Promise<User> {
    try {
      return this.userService.update({ data, id })
    } catch (error) {
      console.log(error)
    }
  }

  @Patch(':id')
  async userUpdateMany(
    @Body() data: Prisma.UserCreateInput,
    @Query() searchQuery: Prisma.UserWhereUniqueInput,
  ): Promise<Prisma.BatchPayload> {
    try {
      return this.userService.updateMany({ data, searchQuery })
    } catch (error) {
      throw new Error(error)
    }
  }

  @Delete(':id')
  async userRemove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id)
  }
}
