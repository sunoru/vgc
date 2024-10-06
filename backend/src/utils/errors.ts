import { HTTPException } from 'hono/http-exception'
import { StatusCode } from 'hono/utils/http-status'

type HTTPExceptionOptions = ConstructorParameters<typeof HTTPException>[1]

export class HttpError extends HTTPException {
  constructor(status: StatusCode, messageOrOptions?: string | HTTPExceptionOptions) {
    const options = typeof messageOrOptions === 'string' ? { message: messageOrOptions } : messageOrOptions
    super(status, options)
  }
}

const _createError = (status: StatusCode, defaultMessage: string) =>
  class extends HttpError {
    constructor(messageOrOptions: string | HTTPExceptionOptions = defaultMessage) {
      super(status, messageOrOptions)
    }
  }

export const NotFound = _createError(404, 'Not found')
export const BadRequest = _createError(400, 'Bad request')
export const Unauthorized = _createError(401, 'Unauthorized')
