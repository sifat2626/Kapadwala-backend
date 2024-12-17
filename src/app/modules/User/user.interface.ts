/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

// User type definition
export interface TUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'superAdmin' | 'admin' | 'user';
  isSubscribed: boolean;
  subscriptionDate: Date | null;
  favorites: Types.ObjectId[]; // Array of references to Company IDs
}

// Mongoose Model extension for custom static methods
export interface UserModel extends Model<TUser> {
  // Static method for checking if a user exists by email
  isUserExistsByEmail(email: string): Promise<TUser | null>;

  // Static method for checking if passwords match
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

// User roles
export type TUserRole = keyof typeof USER_ROLE;
