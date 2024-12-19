import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import AppError from '../errors/AppError'
import { User } from '../modules/User/user.model'
import catchAsync from '../utils/catchAsync'

const protect = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload

    const { email } = decoded

    // checking if the user is exist
    const user = await User.isUserExistsByEmail(email)

    if (!user) {
      req.user.isAuthenticated = false
    }

    next()
  })
}

export default protect
