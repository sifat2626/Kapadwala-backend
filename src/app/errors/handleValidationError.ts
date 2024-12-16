import mongoose from 'mongoose'
import { TErrorDetails, TGenericErrorResponse } from '../interface/error'

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorDetails: TErrorDetails = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        field: val?.path,
        message: val?.message,
      }
    },
  )

  const statusCode = 400

  return {
    statusCode,
    message: 'Validation error occurred',
    errorDetails,
  }
}

export default handleValidationError
