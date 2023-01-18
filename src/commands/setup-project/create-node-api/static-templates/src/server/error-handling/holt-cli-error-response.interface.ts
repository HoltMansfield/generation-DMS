import { HttpStatus } from './http-status.enum'

export interface IHoltCliErrorResponse {
  error: string
  httpStatusCode: HttpStatus
  message: string | object
}
