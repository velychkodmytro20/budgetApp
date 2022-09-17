import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Prisma } from '@prisma/client'
import { Response } from 'express'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    switch (exception.code) {
      case 'P2001':
        this.makeCustomException(exception, host, HttpStatus.NOT_FOUND)

        break

      case 'P2002':
        this.makeCustomException(exception, host, HttpStatus.CONFLICT)

        break

      case 'P1000':
        this.makeCustomException(exception, host, HttpStatus.FORBIDDEN)

        break

      case 'P1008':
        this.makeCustomException(exception, host, HttpStatus.REQUEST_TIMEOUT)

        break

      default:
        // default 500 error code
        super.catch(exception, host)
        break
    }
  }

  public makeCustomException(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
    httpStatus: HttpStatus,
  ): Record<string, any> {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse<Response>()
    const logger = new Logger()

    const prismaCode = exception.code
    const status = httpStatus
    const message = exception.message.replace(/\n/g, '')

    const devErrorResponse = {
      statusCode: status,
      message,
      path: request.url,
      method: request.method,
      errorName: exception?.name,
      prismaCode,
      timestamp: new Date().toISOString(),
    }

    logger.log(
      `request method: ${request.method} request url${request.url}`,
      JSON.stringify(devErrorResponse),
    )
    return response.status(status).json(devErrorResponse)
  }
}
