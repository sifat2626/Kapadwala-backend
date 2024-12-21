import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import config from '../../config';
import { TUser, UserModel } from './user.interface';

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
      select: false, // Exclude by default for security
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['superAdmin', 'admin', 'user'],
      default: 'user',
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    subscriptionDate: {
      type: Date,
      default: null,
    },
    favorites: [
      {
        type: Types.ObjectId,
        ref: 'Company', // References the Company model
      },
    ],
    lastPayment: {
      amount: {
        type: Number, // Store payment amount
      },
      currency: {
        type: String,
        default: 'usd', // Default to USD
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: null, // Status of the last payment
      },
      transactionId: {
        type: String, // Unique ID for Stripe or other payment gateway
        default: null,
      },
      paymentDate: {
        type: Date, // Date of the last successful payment
        default: null,
      },
    },
    stripeCustomerId: {
      type: String,
      default: null, // Stores Stripe Customer ID
    },
    stripeSubscriptionId: {
      type: String,
      default: null, // Stores Stripe Subscription ID
    },
    otp: {
      type: String, // Store the OTP securely (e.g., hashed)
      select: false,
    },
    otpExpires: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  next();
});

// Middleware to remove password from the saved document
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Static method to check if a user exists by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return User.findOne({ email }).select('+password');
};

// Static method to verify if the password matches
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Instance method to generate and hash an OTP
userSchema.methods.generateOtp = function () {
  const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
  this.otp = crypto.createHash('sha256').update(otp).digest('hex'); // Hash the OTP for security
  this.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  return otp; // Return the plain OTP for sending
};

export const User = model<TUser, UserModel>('User', userSchema);
