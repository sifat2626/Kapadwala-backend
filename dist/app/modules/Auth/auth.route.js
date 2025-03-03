"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthControllers.loginUser);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenValidationSchema), auth_controller_1.AuthControllers.refreshToken);
// Request email verification for password reset
router.post('/request-email-verification', auth_controller_1.AuthControllers.requestEmailVerification);
// Verify email and reset password
router.post('/verify-email-and-reset-password', auth_controller_1.AuthControllers.validateEmailVerificationAndResetPassword);
// Request password reset
router.post('/request-password-reset', auth_controller_1.AuthControllers.requestPasswordReset);
// Reset password
router.post('/reset-password', auth_controller_1.AuthControllers.resetPassword);
exports.AuthRoutes = router;
