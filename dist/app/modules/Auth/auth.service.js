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
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../User/user.model");
const auth_utils_1 = require("./auth.utils");
const email_service_1 = require("../../utils/email.service");
const crypto_1 = __importDefault(require("crypto"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByEmail(payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    //checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password)))
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password does not matched');
    //create token and sent to the  client
    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByEmail(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
const requestOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    // Generate OTP and save it
    const otp = user.generateOtp();
    yield user.save({ validateBeforeSave: false });
    // Send OTP via email
    const subject = 'Your OTP for Password Reset';
    const text = `Your OTP is: ${otp}`;
    const html = `<p>Your OTP is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`;
    yield email_service_1.EmailService.sendEmail(user.email, subject, text, html);
});
const validateOtpAndResetPassword = (email, otp, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // Hash the provided OTP to compare with the stored hashed OTP
    const hashedOtp = crypto_1.default.createHash('sha256').update(otp).digest('hex');
    // Find the user by email, hashed OTP, and ensure the OTP is not expired
    const user = yield user_model_1.User.findOne({
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
    yield user.save(); // Save the updated user document
});
exports.AuthServices = {
    loginUser,
    refreshToken,
    requestOtp,
    validateOtpAndResetPassword
};
