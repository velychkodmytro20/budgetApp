import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { PrismaService } from './prisma/prisma.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('qigqei')
    const c: Array<number> = [10, 11, 12]
    const b = (qwe, tryr) => {
      console.log(c)
    }
    function qwertt(...c: Array<number>): void {
      console.log(c)
    }

    const a = qwertt()
    console.log(a)

    return this.appService.getHello()
  }
}
