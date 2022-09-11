/* eslint-disable no-case-declarations */
//src/prisma-client-exception.filter.ts
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
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

  makeCustomException(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
    httpStatus: HttpStatus,
  ): Record<string, any> {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status = httpStatus
    const message = exception.message.replace(/\n/g, '')

    return response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    })
  }
}
