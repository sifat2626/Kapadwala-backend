/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { TUser, UserModel } from './user.interface';

// Mongoose schema for User
const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Exclude password by default
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['superAdmin', 'admin', 'user'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
    isSubscribed: {
      type: Boolean,
      default: false, // Default to non-subscribed
    },
    subscriptionDate: {
      type: Date,
      default: null, // Only populated if subscribed
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  },
);

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  next();
});

// Middleware to clear the password field after saving
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Static method to check if a user exists by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

// Static method to check if a plain text password matches a hashed password
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Export the User model
export const User = model<TUser, UserModel>('User', userSchema);
