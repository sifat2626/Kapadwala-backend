import { z } from 'zod'

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required.' })
      .email({ message: 'Invalid Email format' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
})

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
})

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
})

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    phone: z.string({
      required_error: 'User phone is required!',
    }),
  }),
})

const resetPasswordValidationSchema = z.object({
  body: z.object({
    phone: z.string({
      required_error: 'User phone is required!',
    }),
    newPassword: z.string({
      required_error: 'User password is required!',
    }),
  }),
})

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
}
