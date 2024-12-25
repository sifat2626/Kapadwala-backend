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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
const requestEmailVerification = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(404, 'User not found!');
    }
    console.log('creating token', config_1.default.jwt_email_verification_secret);
    // Generate a verification token (JWT)
    const verificationToken = jsonwebtoken_1.default.sign({ email: user.email }, config_1.default.jwt_email_verification_secret, { expiresIn: '10m' });
    console.log('verification token', verificationToken);
    // Send the email with verification token
    const verificationLink = `${config_1.default.client_url}/verify-email?token=${verificationToken}`;
    const subject = 'Verify Your Email for Password Reset';
    const text = `Please click the following link to verify your email for password reset: ${verificationLink}`;
    const html = `<p>Please click the following link to verify your email for password reset:</p><a href="${verificationLink}">${verificationLink}</a>`;
    yield email_service_1.EmailService.sendEmail(user.email, subject, text, html);
});
const validateEmailVerificationAndResetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_email_verification_secret);
        const user = yield user_model_1.User.findOne({ email: decoded.email });
        if (!user) {
            throw new AppError_1.default(404, 'User not found!');
        }
        // Update the user's password
        user.password = newPassword; // The password will be hashed by the pre-save hook in the schema
        yield user.save();
    }
    catch (err) {
        throw new AppError_1.default(400, 'Invalid or expired token!');
    }
});
const requestPasswordReset = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(404, 'User not found!');
    }
    // Generate a password reset token
    const resetToken = jsonwebtoken_1.default.sign({ email: user.email }, config_1.default.jwt_password_reset_secret, { expiresIn: '15m' });
    // Send the reset token via email
    const resetLink = `${config_1.default.client_url}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const text = `Please click the link below to reset your password: ${resetLink}`;
    const html = `<p>Please click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`;
    yield email_service_1.EmailService.sendEmail(user.email, subject, text, html);
});
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_password_reset_secret);
        // Find the user
        const user = yield user_model_1.User.findOne({ email: decoded.email });
        if (!user) {
            throw new AppError_1.default(404, 'User not found!');
        }
        // Update the user's password
        user.password = newPassword; // The password will be hashed by the pre-save hook
        yield user.save();
    }
    catch (err) {
        throw new AppError_1.default(400, 'Invalid or expired token!');
    }
});
exports.AuthServices = {
    loginUser,
    refreshToken,
    requestEmailVerification,
    validateEmailVerificationAndResetPassword,
    requestPasswordReset,
    resetPassword
};
