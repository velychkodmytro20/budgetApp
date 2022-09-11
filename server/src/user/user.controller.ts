import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import { UserService } from './user.service'
import { Prisma } from '@prisma/client'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  create(@Body() userCreateInput: Prisma.UserCreateInput) {
    return this.userService.create(userCreateInput)
  }

  @Get('/users')
  findAll(@Query() data: Prisma.UserWhereInput) {
    return this.userService.findAll(data)
  }

  @Get(':id')
  findOne(@Param('id') where: Prisma.UserWhereUniqueInput) {
    return this.userService.findOne(where)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto)
  // }

  // @Delete(':id')
  // async remove(@Param('id') data: string): Promise<boolean> {
  //   return this.userService.remove(data)
  // }
}
