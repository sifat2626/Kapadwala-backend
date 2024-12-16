import { ZodError, ZodIssue } from 'zod'
import { TErrorDetails, TGenericErrorResponse } from '../interface/error'

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorDetails: TErrorDetails = err.issues.map((issue: ZodIssue) => {
    return {
      field: issue?.path[issue.path.length - 1],
      message: issue.message,
    }
  })

  const statusCode = 400

  return {
    statusCode,
    message: 'Validation error occurred',
    errorDetails,
  }
}

export default handleZodError
