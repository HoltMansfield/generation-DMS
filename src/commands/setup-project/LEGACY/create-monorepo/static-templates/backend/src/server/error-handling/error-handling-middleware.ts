import { Response, Request, NextFunction } from 'express'
import { IHoltCliErrorResponse } from './holt-cli-error-response.interface'
import { HttpStatus } from './http-status.enum'
import { serializeError } from 'serialize-error'

export interface ErrorAwareRequest extends Request {
  statusCode: HttpStatus
  message: string
  error: Error
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleApiError = <T>(error: Error, req: ErrorAwareRequest, res: Response, next: NextFunction): void => {
  const httpStatusCode = req.statusCode || HttpStatus.UnprocessableEntity

  const response: IHoltCliErrorResponse = {
    httpStatusCode,
    message: req.message || 'An error has occurred please try again',
    error: JSON.stringify(serializeError(error))
  }

  res.status(httpStatusCode)
  res.send(JSON.stringify(response))

  console.log(JSON.stringify(serializeError(error)))
}
