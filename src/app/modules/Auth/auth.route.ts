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

// Request email verification for password reset
router.post('/request-email-verification', AuthControllers.requestEmailVerification);

// Verify email and reset password
router.post(
  '/verify-email-and-reset-password',
  AuthControllers.validateEmailVerificationAndResetPassword,
);

export const AuthRoutes = router
