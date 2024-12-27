/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose'
import { USER_ROLE } from './user.constant'

// User type definition
export interface TUser {
  _id: string
  name: string
  email: string
  password: string
  role: 'superAdmin' | 'admin' | 'user' // Define user roles
  isSubscribed: boolean // Tracks if the user is currently subscribed
  subscriptionDate: Date | null // Date when the subscription started
  expiresAt: Date | null // Date when the subscription access should expire
  stripeCustomerId?: string // Stripe Customer ID
  stripeSubscriptionId?: string | null // Stripe Subscription ID
  favorites: Types.ObjectId[] // Array of references to Company IDs
  favoriteCreditCardVendors: Types.ObjectId[] // Array of references
  lastPayment?: {
    amount: number // Payment amount
    currency: string // Payment currency (e.g., 'usd')
    status: 'pending' | 'succeeded' | 'failed' // Payment status
    transactionId: string | null // Unique transaction ID
    paymentDate: Date | null // Date of the last successful payment
  }
  otp?: string // Hashed OTP for password reset
  otpExpires?: Date // Expiry time for OTP

  // Instance method for generating OTP
  generateOtp(): string
}

// Mongoose Model extension for custom static methods
export interface UserModel extends Model<TUser> {
  /**
   * Check if a user exists by email
   * @param email - The email of the user
   * @returns A promise resolving to the user or null
   */
  isUserExistsByEmail(email: string): Promise<TUser | null>

  /**
   * Check if the given password matches the hashed password
   * @param plainTextPassword - The plain text password to compare
   * @param hashedPassword - The hashed password stored in the database
   * @returns A promise resolving to true or false
   */
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>
}

// User roles
export type TUserRole = keyof typeof USER_ROLE
