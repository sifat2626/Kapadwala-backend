import httpStatus from 'http-status'
import config from '../../config'
import AppError from '../../errors/AppError'
import { User } from '../User/user.model'
import { TLoginUser } from './auth.interface'
import { createToken, verifyToken } from './auth.utils'
import { EmailService } from '../../utils/email.service'
import crypto from 'crypto';

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

const requestOtp = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Generate OTP and save it
  const otp = user.generateOtp();
  await user.save({ validateBeforeSave: false });

  // Send OTP via email
  const subject = 'Your OTP for Password Reset';
  const text = `Your OTP is: ${otp}`;
  const html = `<p>Your OTP is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`;

  await EmailService.sendEmail(user.email, subject, text, html);
};

const validateOtpAndResetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<void> => {
  // Hash the provided OTP to compare with the stored hashed OTP
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  // Find the user by email, hashed OTP, and ensure the OTP is not expired
  const user = await User.findOne({
    email,
    otp: hashedOtp,
    otpExpires: { $gt: Date.now() }, // Check if the OTP is still valid
  });

  if (!user) {
    throw new Error('Invalid or expired OTP');
  }

  // Update password and clear OTP fields
  user.password = newPassword; // The password will be hashed by the pre-save hook in the schema
  user.otp = undefined; // Invalidate the OTP
  user.otpExpires = undefined; // Clear OTP expiration time

  await user.save(); // Save the updated user document
};

export const AuthServices = {
  loginUser,
  refreshToken,
  requestOtp,
  validateOtpAndResetPassword
}
