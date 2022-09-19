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
    return this.prisma.user.findMany({
      where: {
        ...searchQuery,
      },
    })
  }

  async findOne(id: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findFirstOrThrow({
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

    return this.prisma.user.updateMany({
      where: {
        ...searchQuery,
      },
      data,
    })
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    })
  }
}
