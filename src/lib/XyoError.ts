import { StatusCodes } from 'http-status-codes'

class XyoError extends Error {
  status?: StatusCodes
  internalError?: Error
  constructor(name: string, ex?: Error, status?: StatusCodes) {
    super(ex?.message ?? ex?.toString() ?? 'Unknown Error')
    this.name = name
    this.status = status
    this.internalError = ex
  }
  toString(): string {
    return `${this.status ?? this.name}: ${this.message}`
  }
}

export default XyoError
