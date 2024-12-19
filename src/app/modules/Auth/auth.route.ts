import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthControllers } from './auth.controller'
import { AuthValidation } from './auth.validation'

const router = express.Router()

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
)

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
)

// Request OTP
router.post('/request-otp', AuthControllers.requestOtp);

// Reset password using OTP
router.post('/reset-password-with-otp', AuthControllers.resetPasswordWithOtp);

export const AuthRoutes = router
