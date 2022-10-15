import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'

@Module({
    imports: [AuthModule, UserModule, ConfigModule.forRoot({ isGlobal: true })],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
