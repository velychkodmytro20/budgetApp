import { Injectable, HttpException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { User, Prisma } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }

  async findAll(where: Prisma.UserWhereInput): Promise<User[]> {
    try {
      return this.prisma.user.findMany({
        where,
      })
    } catch (error) {
      throw new HttpException(error, error.statusCode)
    }
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    })
  }

  async update(params: {
    data: Prisma.UserCreateInput
    where: Prisma.UserWhereUniqueInput
  }): Promise<User> {
    const { data, where } = params
    return this.prisma.user.update({
      data,
      where,
    })
  }

  // async updateMany(params: {
  //   data: Prisma.UserUpdateManyArgs
  //   where: Prisma.UserWhereInput
  // }): Promise<User[]> {
  //   const { data, where } = params
  //   return this.prisma.user.updateMany({})
  // }

  // async remove(where: Prisma.UserWhereUniqueInput): Promise<boolean> {
  //   try {
  //     await this.prisma.user.delete({
  //       where,
  //     })
  //     return true
  //   } catch (error) {
  //     throw new Error(error)
  //     return false
  //     // throw new HttpException(error.status, error)
  //   }
  // }
}
