import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth.service'

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body)
  const { accessToken } = result

  res.cookie('accessToken', accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: {
      accessToken,
    },
  })
})

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies
  const result = await AuthServices.refreshToken(refreshToken)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  })
})

// Request OTP for password reset
const requestEmailVerification = catchAsync(async (req, res) => {
  const { email } = req.body;

  await AuthServices.requestEmailVerification(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Verification email sent successfully!',
    data: '',
  });
});

// Reset password using OTP
const validateEmailVerificationAndResetPassword = catchAsync(
  async (req, res) => {
    const { token, password } = req.body;

    await AuthServices.validateEmailVerificationAndResetPassword(token, password);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password reset successfully!',
      data: '',
    });
  },
);

const requestPasswordReset = catchAsync(async (req, res) => {
  const { email } = req.body;

  await AuthServices.requestPasswordReset(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset email sent successfully!',
    data: '',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;

  await AuthServices.resetPassword(token, newPassword);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: '',
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  requestEmailVerification,
  validateEmailVerificationAndResetPassword,
  requestPasswordReset,
  resetPassword
}
