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
/* eslint-disable @typescript-eslint/no-this-alias */
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
// Mongoose schema for User
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
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});
// Middleware to hash password before saving
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified('password')) {
            user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        }
        next();
    });
});
// Middleware to clear the password field after saving
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
// Static method to check if a user exists by email
userSchema.statics.isUserExistsByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email }).select('+password');
    });
};
// Static method to check if a plain text password matches a hashed password
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
// Export the User model
exports.User = (0, mongoose_1.model)('User', userSchema);
