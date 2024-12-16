export type TErrorDetails = {
  field: string | number
  message: string
}[]

export type TGenericErrorResponse = {
  statusCode: number
  message: string
  errorDetails: TErrorDetails
}
