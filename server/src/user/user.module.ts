import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from '../prisma/prisma.service'

// When you want to provide a set of providers which should be available everywhere out-of-the-box
// (e.g., helpers, database connections, etc.), make the module global with the @Global() decorator.
//@Global()
@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService], // If we want to use our service in another module
  imports: [],
})
export class UserModule {}
