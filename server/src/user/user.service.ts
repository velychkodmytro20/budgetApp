import { Injectable, HttpException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { User, Prisma } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data })
  }

  async findMany(searchQuery: Prisma.UserWhereInput): Promise<User[]> {
    try {
      return this.prisma.user.findMany({
        where: {
          ...searchQuery,
        },
      })
    } catch (error) {
      throw new HttpException(error, error.statusCode)
    }
  }

  async findOne(id: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: id,
    })
  }

  async update(params: {
    data: Prisma.UserCreateInput
    id: string
  }): Promise<User> {
    const { data, id } = params
    return this.prisma.user.update({
      data,
      where: {
        id,
      },
    })
  }

  async updateMany(params: {
    data: Prisma.UserCreateInput
    searchQuery: Prisma.UserWhereInput
  }): Promise<Prisma.BatchPayload> {
    const { data, searchQuery } = params
    try {
      const usersUpdatedCount = await this.prisma.user.updateMany({
        where: {
          ...searchQuery,
        },
        data,
      })

      return usersUpdatedCount
    } catch (error) {
      // throw new HttpException(error.message, error.status)
      throw new Error(error)
    }
  }

  async remove(id: string): Promise<User> {
    try {
      return this.prisma.user.delete({
        where: { id },
      })
    } catch (error) {
      throw new HttpException(error.status, error)
    }
  }
}
