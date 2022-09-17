import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaClientExceptionFilter } from './exceptionFilters/prisma-client-exception.filter'

async function bootstrap() {
  console.log('hlelo')
  const app = await NestFactory.create(AppModule)

  const { httpAdapter } = app.get(HttpAdapterHost)

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  await app.listen(3000)
}
bootstrap()
