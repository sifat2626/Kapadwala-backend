import httpStatus from 'http-status'
import config from '../../config'
import AppError from '../../errors/AppError'
import { User } from '../User/user.model'
import { TLoginUser } from './auth.interface'
import { createToken, verifyToken } from './auth.utils'
import { EmailService } from '../../utils/email.service'
import jwt from 'jsonwebtoken'

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not matched')

  //create token and sent to the  client
  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  )

  return {
    accessToken,
    refreshToken,
  }
}

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string)

  const { email } = decoded

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  return {
    accessToken,
  }
}

const requestEmailVerification = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, 'User not found!');
  }

  console.log('creating token',config.jwt_email_verification_secret)

  // Generate a verification token (JWT)
  const verificationToken = jwt.sign(
    { email: user.email },
    config.jwt_email_verification_secret as string,
    { expiresIn: '10m' }, // Valid for 10 minutes
  );

  console.log('verification token', verificationToken)

  // Send the email with verification token
  const verificationLink = `${config.client_url}/verify-email?token=${verificationToken}`;
  const subject = 'Verify Your Email for Password Reset';
  const text = `Please click the following link to verify your email for password reset: ${verificationLink}`;
  const html = `<p>Please click the following link to verify your email for password reset:</p><a href="${verificationLink}">${verificationLink}</a>`;

  await EmailService.sendEmail(user.email, subject, text, html);
};

const validateEmailVerificationAndResetPassword = async (
  token: string,
  newPassword: string,
): Promise<void> => {
  try {
    // Verify the token
    const decoded = jwt.verify(
      token,
      config.jwt_email_verification_secret as string,
    ) as { email: string };

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw new AppError(404, 'User not found!');
    }

    // Update the user's password
    user.password = newPassword; // The password will be hashed by the pre-save hook in the schema
    await user.save();

  } catch (err) {
    throw new AppError(400, 'Invalid or expired token!');
  }
};

const requestPasswordReset = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, 'User not found!');
  }

  // Generate a password reset token
  const resetToken = jwt.sign(
    { email: user.email },
    config.jwt_password_reset_secret as string,
    { expiresIn: '15m' }, // Token expires in 15 minutes
  );

  // Send the reset token via email
  const resetLink = `${config.client_url}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const text = `Please click the link below to reset your password: ${resetLink}`;
  const html = `<p>Please click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`;

  await EmailService.sendEmail(user.email, subject, text, html);
};

const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    // Verify the token
    const decoded = jwt.verify(
      token,
      config.jwt_password_reset_secret as string,
    ) as { email: string };

    // Find the user
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw new AppError(404, 'User not found!');
    }

    // Update the user's password
    user.password = newPassword; // The password will be hashed by the pre-save hook
    await user.save();
  } catch (err) {
    throw new AppError(400, 'Invalid or expired token!');
  }
};

export const AuthServices = {
  loginUser,
  refreshToken,
  requestEmailVerification,
  validateEmailVerificationAndResetPassword,
  requestPasswordReset,
  resetPassword
}
