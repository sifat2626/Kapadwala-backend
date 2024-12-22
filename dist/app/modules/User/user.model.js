"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../../config"));
const userSchema = new mongoose_1.Schema({
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
        default: false, // Indicates if the user currently has an active subscription
    },
    subscriptionDate: {
        type: Date,
        default: null, // Tracks the start date of the subscription
    },
    expiresAt: {
        type: Date,
        default: null, // Tracks when the subscription access should expire
    },
    favorites: [
        {
            type: mongoose_1.Types.ObjectId,
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
            enum: ['pending', 'succeeded', 'failed'],
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
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});
// Middleware to hash password before saving
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        }
        next();
    });
});
// Middleware to remove password from the saved document
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
// Static method to check if a user exists by email
userSchema.statics.isUserExistsByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.User.findOne({ email }).select('+password');
    });
};
// Static method to verify if the password matches
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
// Instance method to generate and hash an OTP
userSchema.methods.generateOtp = function () {
    const otp = crypto_1.default.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    this.otp = crypto_1.default.createHash('sha256').update(otp).digest('hex'); // Hash the OTP for security
    this.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    return otp; // Return the plain OTP for sending
};
exports.User = (0, mongoose_1.model)('User', userSchema);
