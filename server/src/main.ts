import { HttpAdapterHost, NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { PrismaClientExceptionFilter } from './exceptionFilters/prisma-client-exception.filter'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const port = process.env.PORT

    const { httpAdapter } = app.get(HttpAdapterHost)

    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

    await app.listen(port)
}
bootstrap()
